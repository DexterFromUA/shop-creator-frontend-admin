import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../utils/graphql';
import './Dashboard.css';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--color-text)', fontSize: 18 }}>Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-text)' }}>Product not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            {error || 'The product you are looking for does not exist.'}
          </p>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '0.7rem 1.2rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        <div style={{ display:'flex',alignItems:'center',gap:18,marginBottom:32 }}>
          <button onClick={() => navigate(-1)} className="order-back-btn" style={{ fontSize:18 }}><span style={{fontSize:20}}>&larr;</span> Back</button>
          <span style={{ fontWeight:800,fontSize:32,color:'var(--color-text)' }}>{product.name}</span>
        </div>
        
        {/* Product Images */}
        {product.imgUrls && product.imgUrls.length > 0 && (
          <div className="dashboard-card" style={{ background:'var(--color-bg)', borderRadius:28, padding:32, boxShadow:'0 2px 16px 0 rgba(80,80,120,0.08)', width:'100%', marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Product Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
              {product.imgUrls.map((imgUrl, index) => (
                <img 
                  key={index}
                  src={imgUrl} 
                  alt={`${product.name} ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: 150, 
                    objectFit: 'cover', 
                    borderRadius: 12,
                    border: '2px solid var(--color-border)'
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-card" style={{ background:'var(--color-bg)', borderRadius:28, padding:0, boxShadow:'0 2px 16px 0 rgba(80,80,120,0.08)', width:'100%', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex',flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', padding:'32px 32px 0 32px', gap:32 }}>
            <div style={{ minWidth:220, flex: 1 }}>
              <div style={{ fontWeight:600,fontSize:18, marginBottom:8 }}>{product.category || 'Uncategorized'}</div>
              <div style={{ color:'var(--color-text-secondary)', fontSize:15, marginBottom:8 }}>Total Stock: {product.amount}</div>
              {product.description && (
                <div style={{ color:'var(--color-text)', fontSize:15, marginBottom:16, lineHeight: 1.5 }}>
                  {product.description}
                </div>
              )}
              
              {/* Preorder and Discount info */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {product.isPreOrder && (
                  <span style={{ 
                    background: 'var(--color-accent)', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 600 
                  }}>
                    PREORDER
                  </span>
                )}
                {product.isDiscount && (
                  <span style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 600 
                  }}>
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ textAlign:'right', minWidth:120 }}>
              <div style={{ color:'var(--color-text-secondary)', fontSize:15, marginBottom:8 }}>Price</div>
              <div style={{ fontWeight:700,color:'var(--color-accent)', fontSize:24 }}>{formatPrice(product.price)}</div>
              {product.isDiscount && product.discountPercent > 0 && (
                <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Final: {formatPrice(product.price * (1 - product.discountPercent / 100))}
                </div>
              )}
            </div>
          </div>

          {/* Size Inventory */}
          {product.sizeInventory && product.sizeInventory.length > 0 && (
            <div style={{ padding: '0 32px 24px 32px' }}>
              <h4 style={{ margin: '16px 0 12px 0', fontSize: 16, fontWeight: 600 }}>Size Inventory</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
                {product.sizeInventory.map((sizeItem) => (
                  <div 
                    key={sizeItem.id}
                    style={{ 
                      padding: '12px', 
                      border: '2px solid var(--color-border)', 
                      borderRadius: 8, 
                      textAlign: 'center',
                      background: sizeItem.quantity > 0 ? 'var(--color-bg-secondary)' : 'var(--color-error-bg)'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{sizeItem.size}</div>
                    <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                      {sizeItem.quantity} in stock
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding:'0 32px 32px 32px' }}>
            <div style={{ display:'flex', gap:12 }}>
              <button style={{ flex:1, padding:'0.8rem 1.2rem', borderRadius:10, background:'#111827', color:'#fff', border:'none', fontWeight:600, cursor:'pointer' }}>Edit Product</button>
              <button style={{ flex:1, padding:'0.8rem 1.2rem', borderRadius:10, background:'var(--color-error-bg)', color:'var(--color-error)', border:'none', fontWeight:600, cursor:'pointer' }}>Delete Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView; 