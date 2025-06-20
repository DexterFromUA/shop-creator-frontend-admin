import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef([]);
  const containerRef = useRef(null);

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
    const calculateIndicator = () => {
      const activeButton = buttonsRef.current.find(btn => btn && btn.dataset.view === viewMode);
      if (activeButton && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        setIndicatorStyle({
          width: buttonRect.width,
          left: buttonRect.left - containerRect.left,
        });
      }
    };
    calculateIndicator();
    window.addEventListener('resize', calculateIndicator);
    return () => window.removeEventListener('resize', calculateIndicator);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('productsViewMode', viewMode);
  }, [viewMode]);

  const listVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  
  const gridContainerVariants = {
    animate: { transition: { staggerChildren: 0.05 } },
  };
  
  const gridItemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 0' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Products
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Manage your product catalog, inventory, and pricing
          </p>
        </div>

        {/* Controls Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: '24px 32px', marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flexShrink: 1 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontSize: 15,
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  width: '100%',
                }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontSize: '1.1rem', pointerEvents: 'none' }}>🔍</span>
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                padding: '0.7rem 2.5rem 0.7rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                minWidth: 140,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '18px'
              }}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              ref={containerRef}
              style={{ position: 'relative', display: 'flex', background: 'var(--color-bg-secondary)', padding: 4, borderRadius: 8 }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  ...indicatorStyle,
                  background: 'var(--color-bg)',
                  borderRadius: 6,
                  transition: 'left 0.3s ease, width 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
              />
              <button
                ref={el => buttonsRef.current[0] = el}
                data-view="grid"
                onClick={() => setViewMode('grid')}
                style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', position: 'relative', zIndex: 1, transition: 'color 0.3s' }}
              >
                Grid
              </button>
              <button
                ref={el => buttonsRef.current[1] = el}
                data-view="list"
                onClick={() => setViewMode('list')}
                style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', position: 'relative', zIndex: 1, transition: 'color 0.3s' }}
              >
                List
              </button>
            </div>
            <button onClick={() => setShowModal(true)} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}>
              + Add Product
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, width: '100%', maxHeight: '60vh', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                variants={gridContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, padding: 32 }}
              >
                {filtered.map(product => (
                  <motion.div
                    key={product.id}
                    variants={gridItemVariants}
                    style={{ background: 'var(--color-bg-secondary)', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--color-border)' }}
                  >
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
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <button style={{ flex: 1, padding: '0.7rem', border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer' }}>Edit</button>
                      <button style={{ flex: 1, padding: '0.7rem', border: '1px solid var(--color-error-bg)', borderRadius: 8, background: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={listVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ padding: 0 }}
              >
                <table className="dashboard-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '20px 32px' }}>Name</th>
                      <th style={{ padding: '20px 32px' }}>Category</th>
                      <th style={{ padding: '20px 32px' }}>Price</th>
                      <th style={{ padding: '20px 32px' }}>Stock</th>
                      <th style={{ padding: '20px 32px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product, i) => (
                      <tr key={product.id} style={{ borderTop: i > 0 ? '1px solid var(--color-bg-secondary)' : 'none' }}>
                        <td style={{ padding: '20px 32px' }}>{product.name}</td>
                        <td style={{ padding: '20px 32px' }}>{product.category}</td>
                        <td style={{ padding: '20px 32px', color: 'var(--color-accent)', fontWeight: 600 }}>{product.price}</td>
                        <td style={{ padding: '20px 32px' }}>{product.stock}</td>
                        <td style={{ padding: '20px 32px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', cursor: 'pointer' }}>Edit</button>
                            <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-error-bg)', borderRadius: 6, background: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {showModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              style={{ background: 'var(--color-bg)', padding: '24px 32px', borderRadius: 24, width: '100%', maxWidth: 480, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Add New Product</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0 }}>×</button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Name</label>
                  <input 
                    required 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
                    style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Price</label>
                  <input 
                    required 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
                    style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Stock</label>
                  <input 
                    required 
                    type="number" 
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} 
                    style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Category</label>
                  <select 
                    value={newProduct.category} 
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} 
                    style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '18px' }}
                  >
                    {categories.slice(1).map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add Product</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Products; 