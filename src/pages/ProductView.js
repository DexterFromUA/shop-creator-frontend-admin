import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Ideally import products data from a shared source; for demo, reuse static list
import { initialProducts as allProducts } from './Products'; // we'll export it

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-text)' }}>Product not found</h2>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '0.7rem 1.2rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 0' }}>
        <div style={{ display:'flex',alignItems:'center',gap:18,marginBottom:32 }}>
          <button onClick={() => navigate(-1)} className="order-back-btn" style={{ fontSize:18 }}><span style={{fontSize:20}}>&larr;</span> Back</button>
          <span style={{ fontWeight:800,fontSize:32,color:'var(--color-text)' }}>{product.name}</span>
        </div>
        <div className="dashboard-card" style={{ background:'var(--color-bg)', borderRadius:28, padding:0, boxShadow:'0 2px 16px 0 rgba(80,80,120,0.08)', width:'100%', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex',flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', padding:'32px 32px 0 32px', gap:32 }}>
            <div style={{ minWidth:220 }}>
              <div style={{ fontWeight:600,fontSize:18, marginBottom:8 }}>{product.category}</div>
              <div style={{ color:'var(--color-text-secondary)', fontSize:15, marginBottom:8 }}>Stock: {product.stock}</div>
            </div>
            <div style={{ textAlign:'right', minWidth:120 }}>
              <div style={{ color:'var(--color-text-secondary)', fontSize:15, marginBottom:8 }}>Price</div>
              <div style={{ fontWeight:700,color:'var(--color-accent)', fontSize:24 }}>{product.price}</div>
            </div>
          </div>
          <div style={{ padding:'0 32px 32px 32px', marginTop:24 }}>
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