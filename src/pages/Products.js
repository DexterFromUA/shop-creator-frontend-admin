import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const initialProducts = [
  { id: 1, name: 'Wireless Earbuds', price: '$129.99', stock: 45, category: 'Electronics' },
  { id: 2, name: 'Smart Watch', price: '$199.99', stock: 28, category: 'Electronics' },
  { id: 3, name: 'Leather Wallet', price: '$49.99', stock: 120, category: 'Accessories' },
  { id: 4, name: 'Sunglasses', price: '$89.99', stock: 75, category: 'Accessories' },
  { id: 5, name: 'Backpack', price: '$79.99', stock: 35, category: 'Bags' },
  { id: 6, name: 'Running Shoes', price: '$159.99', stock: 62, category: 'Footwear' },
  { id: 7, name: 'Bluetooth Speaker', price: '$89.99', stock: 38, category: 'Electronics' },
  { id: 8, name: 'Phone Case', price: '$24.99', stock: 95, category: 'Accessories' },
  { id: 9, name: 'Laptop Stand', price: '$39.99', stock: 52, category: 'Electronics' },
  { id: 10, name: 'Water Bottle', price: '$19.99', stock: 150, category: 'Accessories' },
  { id: 11, name: 'Gym Bag', price: '$69.99', stock: 41, category: 'Bags' },
  { id: 12, name: 'Hiking Boots', price: '$189.99', stock: 23, category: 'Footwear' },
  { id: 13, name: 'Wireless Mouse', price: '$34.99', stock: 67, category: 'Electronics' },
  { id: 14, name: 'Belt', price: '$29.99', stock: 88, category: 'Accessories' },
  { id: 15, name: 'Crossbody Bag', price: '$54.99', stock: 29, category: 'Bags' },
  { id: 16, name: 'Sneakers', price: '$119.99', stock: 73, category: 'Footwear' },
  { id: 17, name: 'Tablet Stand', price: '$44.99', stock: 31, category: 'Electronics' },
  { id: 18, name: 'Watch Band', price: '$19.99', stock: 112, category: 'Accessories' },
  { id: 19, name: 'Tote Bag', price: '$39.99', stock: 47, category: 'Bags' },
  { id: 20, name: 'Sandals', price: '$79.99', stock: 58, category: 'Footwear' },
  { id: 21, name: 'USB Cable', price: '$12.99', stock: 200, category: 'Electronics' },
  { id: 22, name: 'Keychain', price: '$9.99', stock: 180, category: 'Accessories' },
  { id: 23, name: 'Duffel Bag', price: '$89.99', stock: 25, category: 'Bags' },
  { id: 24, name: 'Formal Shoes', price: '$149.99', stock: 34, category: 'Footwear' },
  { id: 25, name: 'Power Bank', price: '$59.99', stock: 42, category: 'Electronics' },
  { id: 26, name: 'Scarf', price: '$34.99', stock: 66, category: 'Accessories' },
  { id: 27, name: 'Messenger Bag', price: '$99.99', stock: 19, category: 'Bags' },
  { id: 28, name: 'Boots', price: '$169.99', stock: 27, category: 'Footwear' },
  { id: 29, name: 'Headphones', price: '$149.99', stock: 33, category: 'Electronics' },
  { id: 30, name: 'Gloves', price: '$24.99', stock: 89, category: 'Accessories' },
  { id: 31, name: 'Travel Bag', price: '$129.99', stock: 16, category: 'Bags' },
  { id: 32, name: 'Slides', price: '$49.99', stock: 71, category: 'Footwear' },
  { id: 33, name: 'Keyboard', price: '$79.99', stock: 38, category: 'Electronics' },
  { id: 34, name: 'Hat', price: '$29.99', stock: 94, category: 'Accessories' },
  { id: 35, name: 'Clutch Bag', price: '$64.99', stock: 22, category: 'Bags' },
  { id: 36, name: 'Loafers', price: '$139.99', stock: 31, category: 'Footwear' },
  { id: 37, name: 'Webcam', price: '$89.99', stock: 28, category: 'Electronics' },
  { id: 38, name: 'Socks', price: '$14.99', stock: 156, category: 'Accessories' },
  { id: 39, name: 'Mini Backpack', price: '$44.99', stock: 53, category: 'Bags' },
  { id: 40, name: 'Flip Flops', price: '$19.99', stock: 128, category: 'Footwear' },
];

const categories = ['All', 'Electronics', 'Accessories', 'Bags', 'Footwear'];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productsViewMode') || 'grid';
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Electronics'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...newProduct, id }]);
    setNewProduct({ name: '', price: '', stock: '', category: 'Electronics' });
    setShowModal(false);
  };

  const filtered = products.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('productsViewMode', viewMode);
  }, [viewMode]);

  return (
    <div className="dashboard" style={{ padding: 0 }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px' }}>
          <h1 className="dashboard-header">Products</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'var(--color-accent-gradient)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgb(91 33 182 / 0.10)'
            }}
          >
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', margin: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'inline-block', minWidth: 180 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 15,
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  minWidth: 180
                }}
              />
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                fontSize: '1.1rem',
                pointerEvents: 'none'
              }}>
                🔍
              </span>
            </div>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              style={{ 
                padding: '0.7rem 1rem',
                paddingRight: '40px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                minWidth: '120px'
              }}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.7rem',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                background: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-bg)',
                color: viewMode === 'grid' ? 'white' : 'var(--color-text)',
                cursor: 'pointer',
                minWidth: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              📱
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.7rem',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                background: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-bg)',
                color: viewMode === 'list' ? 'white' : 'var(--color-text)',
                cursor: 'pointer',
                minWidth: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              📋
            </button>
          </div>
        </div>
        {viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 24,
            padding: '0 16px 16px 16px'
          }}>
            {filtered.map(product => (
              <div key={product.id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{product.name}</h3>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-secondary)', fontSize: 14 }}>{product.category}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-accent)' }}>{product.price}</span>
                    <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Stock: {product.stock}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '0.7rem', border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer' }}>Edit</button>
                  <button style={{ flex: 1, padding: '0.7rem', border: '1px solid var(--color-error)', borderRadius: 8, background: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="dashboard-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer' }}>Edit</button>
                          <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-error)', borderRadius: 6, background: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            padding: 32,
            borderRadius: 12,
            width: '100%',
            maxWidth: 480,
            position: 'relative'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: 'var(--color-text-secondary)'
              }}
            >
              ×
            </button>
            <h2 style={{ margin: '0 0 24px 0' }}>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
                <input
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    background: 'var(--color-bg)'
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Price</label>
                <input
                  required
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    background: 'var(--color-bg)'
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Stock</label>
                <input
                  required
                  type="number"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    background: 'var(--color-bg)'
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Category</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    background: 'var(--color-bg)'
                  }}
                >
                  {categories.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 