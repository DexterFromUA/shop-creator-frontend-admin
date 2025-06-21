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
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, padding: '0.6rem 1.1rem', borderRadius: 10, background: 'var(--color-bg)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>← Back</button>
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>{product.name}</h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0 }}>Category: {product.category}</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-accent)', margin: '4px 0' }}>{product.price}</p>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0 }}>Stock: {product.stock}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Edit Product</button>
            <button style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: 10, background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Delete Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView; 