import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

import { productService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productsViewMode') || 'list';
  });
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef([]);
  const containerRef = useRef(null);
  const loadingRef = useRef(false);
  const navigate = useNavigate();
  const { storeId } = useParams();

  useEffect(() => {
    const loadProducts = async () => {
      if (loadingRef.current) {
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);
        const data = await productService.getStoreProducts(storeId);
        setProducts([...data]);
      } catch (error) {
        console.error('Error loading products:', error);
        addToast('Failed to load products', 'error');
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    if (storeId && !loadingRef.current) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    const calculateIndicator = () => {
      const activeButton = buttonsRef.current.find((btn) => btn && btn.dataset.view === viewMode);
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

  const filtered = products.filter((product) => {
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.category && product.category.toLowerCase().includes(term))
    );
  });

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

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
    <>
      {/* Search and Controls Card */}
      <PageContainer
        title="Products"
        description="Manage your product catalog, inventory, and pricing"
        RightContent={
          <Button onClick={() => navigate(`/store/${storeId}/products/add`)} filled>
            + Add Product
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flexShrink: 1 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1.1rem',
                  pointerEvents: 'none',
                }}
              >
                🔍
              </span>
            </div>
          </div>
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              display: 'flex',
              background: 'var(--color-bg-secondary)',
              padding: 4,
              borderRadius: 8,
            }}
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
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            />
            <button
              ref={(el) => (buttonsRef.current[0] = el)}
              data-view="grid"
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.3s',
              }}
            >
              Grid
            </button>
            <button
              ref={(el) => (buttonsRef.current[1] = el)}
              data-view="list"
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.3s',
              }}
            >
              List
            </button>
          </div>
        </div>
      </PageContainer>

      <PageContainer
        minHeight="65vh"
        loading={loading}
        loadingText={'Loading items...'}
        fixedSize
        removeBorderSpace
        removeBottomSpace
      >
        {loading ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 64 }}
          >
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
              Loading products...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 64,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>📦</div>
            <div
              style={{ color: 'var(--color-text)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}
            >
              No products yet
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
              Create your first product to get started
            </div>
            <Button filled onClick={() => navigate(`/store/${storeId}/products/add`)}>
              + Add Product
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                variants={gridContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 24,
                  padding: 32,
                }}
              >
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={gridItemVariants}
                    onClick={() => navigate(`/store/${storeId}/products/${product.id}`)}
                    style={{
                      cursor: 'pointer',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 18,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{product.name}</h3>
                        <p
                          style={{
                            margin: '8px 0 0 0',
                            color: 'var(--color-text-secondary)',
                            fontSize: 14,
                          }}
                        >
                          {product.category || 'Uncategorized'}
                        </p>
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                      >
                        <span
                          style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-accent)' }}
                        >
                          from {formatPrice(product.priceRange.min)} to{' '}
                          {formatPrice(product.priceRange.max)}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            color: 'var(--color-text-secondary)',
                            marginTop: 4,
                          }}
                        >
                          Stock: {product.amount}
                        </span>
                      </div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        variants={listVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/store/${storeId}/products/${product.id}`)}
                      >
                        <td style={{ padding: '20px 32px' }}>{product.name}</td>
                        <td style={{ padding: '20px 32px' }}>
                          {product.category || 'Uncategorized'}
                        </td>
                        <td
                          style={{
                            padding: '20px 32px',
                            color: 'var(--color-accent)',
                            fontWeight: 600,
                          }}
                        >
                          from {formatPrice(product.priceRange.min)} to{' '}
                          {formatPrice(product.priceRange.max)}
                        </td>
                        <td style={{ padding: '20px 32px' }}>{product.amount}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </PageContainer>
    </>
  );
};

export default Products;
