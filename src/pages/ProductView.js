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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [stockUpdating, setStockUpdating] = useState(false);
  const [updatedSizes, setUpdatedSizes] = useState({});

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

  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);
      await productService.deleteProduct(id);
      navigate(-1); // Go back to products list
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateStock = async () => {
    try {
      setStockUpdating(true);
      const sizeInventory = Object.entries(updatedSizes).map(([size, quantity]) => ({
        size,
        quantity: parseInt(quantity) || 0
      }));
      
      await productService.updateProductStock(id, sizeInventory);
      
      // Reload product data
      const updatedProduct = await productService.getProduct(id);
      setProduct(updatedProduct);
      
      setShowUpdateStockModal(false);
      setUpdatedSizes({});
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    } finally {
      setStockUpdating(false);
    }
  };

  const openUpdateStockModal = () => {
    if (product.sizeInventory) {
      const currentSizes = {};
      product.sizeInventory.forEach(sizeItem => {
        currentSizes[sizeItem.size] = sizeItem.quantity;
      });
      setUpdatedSizes(currentSizes);
    }
    setShowUpdateStockModal(true);
  };

  const handleSizeQuantityChange = (size, quantity) => {
    setUpdatedSizes(prev => ({
      ...prev,
      [size]: quantity
    }));
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
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      padding: '48px 16px',
      boxSizing: 'border-box',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 }}>
          <div style={{ display:'flex',alignItems:'center',gap:18 }}>
            <button onClick={() => navigate(-1)} className="order-back-btn" style={{ fontSize:18 }}><span style={{fontSize:20}}>&larr;</span> Back</button>
            <span style={{ fontWeight:800,fontSize:32,color:'var(--color-text)' }}>{product.name}</span>
          </div>
          
          {/* Action Buttons - Moved to top right */}
          <div style={{ display:'flex', gap:12 }}>
            <button 
              onClick={openUpdateStockModal}
              style={{ 
                padding:'0.8rem 1.2rem', 
                borderRadius:10, 
                background:'#059669', 
                color:'#fff', 
                border:'none', 
                fontWeight:600, 
                cursor:'pointer',
                fontSize: 14
              }}
            >
              Update Stock
            </button>
            <button 
              style={{ 
                padding:'0.8rem', 
                borderRadius:10, 
                background:'#111827', 
                color:'#fff', 
                border:'none', 
                fontWeight:600, 
                cursor:'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              style={{ 
                padding:'0.8rem', 
                borderRadius:10, 
                background:'#ef4444', 
                color:'#fff', 
                border:'none', 
                fontWeight:600, 
                cursor:'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="dashboard-card" style={{ 
          background:'var(--color-bg)', 
          borderRadius:28, 
          padding:32, 
          boxShadow:'0 2px 16px 0 rgba(80,80,120,0.08)',
          boxSizing: 'border-box'
        }}>
                     <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
             gap: 32, 
             alignItems: 'start' 
           }}>
            
            {/* Left Side - Product Images Carousel */}
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Product Images</h3>
              
              {(() => {
                const images = product.imgUrls && product.imgUrls.length > 0 
                  ? product.imgUrls 
                  : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDI0MFYyNDBIMTYwVjE2MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE4MCAyMDBMMjAwIDE4MEwyMjAgMjAwTDIyMCAyMjBIMTgwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'];
                
                const nextImage = () => {
                  setCurrentImageIndex((prev) => (prev + 1) % images.length);
                };
                
                const prevImage = () => {
                  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                };
                
                const goToImage = (index) => {
                  setCurrentImageIndex(index);
                };
                
                return (
                  <div style={{ position: 'relative' }}>
                    {/* Main Image */}
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: '2px solid var(--color-border)'
                    }}>
                      <img 
                        src={images[currentImageIndex]} 
                        alt={product.imgUrls && product.imgUrls.length > 0 ? `${product.name} ${currentImageIndex + 1}` : 'No image available'}
                        style={{ 
                          width: '100%', 
                          height: 500, 
                          objectFit: 'cover',
                          display: 'block'
                        }} 
                      />
                      
                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            style={{
                              position: 'absolute',
                              left: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              fontWeight: 'bold',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
                          >
                            ‹
                          </button>
                          
                          <button
                            onClick={nextImage}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              fontWeight: 'bold',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
                          >
                            ›
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {images.length > 1 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 8, 
                        marginTop: 16,
                        flexWrap: 'wrap'
                      }}>
                        {images.map((imgUrl, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            style={{
                              border: currentImageIndex === index ? '3px solid var(--color-accent)' : '2px solid var(--color-border)',
                              borderRadius: 8,
                              padding: 0,
                              cursor: 'pointer',
                              background: 'none',
                              opacity: currentImageIndex === index ? 1 : 0.6,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = currentImageIndex === index ? 1 : 0.6}
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Thumbnail ${index + 1}`}
                              style={{ 
                                width: 50, 
                                height: 50, 
                                objectFit: 'cover',
                                borderRadius: 6,
                                display: 'block'
                              }} 
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* No Images Message */}
                    {(!product.imgUrls || product.imgUrls.length === 0) && (
                      <div style={{
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        fontSize: 14,
                        marginTop: 12
                      }}>
                        No product images available
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

                        {/* Right Side - Product Information */}
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Product Details</h3>
              
              <div style={{ display:'flex',flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:24, marginBottom: 24 }}>
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
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Size Inventory</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
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


            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
                         <div style={{ textAlign: 'center', marginBottom: 24 }}>
               <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M3 6H5H21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M10 11V17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M14 11V17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
                Delete Product
              </h3>
                             <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                 Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
               </p>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                                 {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
             )}
      
      {/* Update Stock Modal */}
      {showUpdateStockModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
                Update Stock
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                Update the quantity for each size of &quot;{product.name}&quot;
              </p>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                      {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={updatedSizes[size] || 0}
                      onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                      style={{
                        padding: '8px 12px',
                        border: '2px solid var(--color-border)',
                        borderRadius: 8,
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text)',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowUpdateStockModal(false)}
                disabled={stockUpdating}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: stockUpdating ? 'not-allowed' : 'pointer',
                  opacity: stockUpdating ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                disabled={stockUpdating}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#059669',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: stockUpdating ? 'not-allowed' : 'pointer',
                  opacity: stockUpdating ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {stockUpdating ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView; 