import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';
import { formatPrice } from '../utils/helpers';
import Modal from '../components/common/Modal';

const ProductOption = ({ item }) => {
  return (
    <div
      key={item.id}
      style={{
        padding: '12px',
        border: '2px solid var(--color-border)',
        borderRadius: 8,
        background: item.quantity > 0 ? 'var(--color-bg-secondary)' : 'var(--color-error-bg)',
      }}
    >
      {item.name && <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>}
      {item.quantity > 0 ? (
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {item.quantity} in stock
        </div>
      ) : (
        <div
          style={{
            fontSize: 14,
            color: 'red',
          }}
        >
          Out of stock
        </div>
      )}
      <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        {formatPrice(item.price)}
      </div>
      {item.discountPercent > 0 && (
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {item.discountPercent}% in stock
        </div>
      )}
      {item.isPreOrder && (
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Preorder only</div>
      )}
    </div>
  );
};

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shortLinkModal, setShortLinkModal] = useState({
    isOpened: false,
    description: '',
    isLoading: false,
  });

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

  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);
      await productService.deleteProduct(id);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting product:', error);
      addToast('Failed to delete product. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    setShortLinkModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const data = await productService.createShortLink(product.id, shortLinkModal.description);

      if (data.id) {
        setProduct((prev) => ({ ...prev, shortLinks: [{ ...data }, ...prev.shortLinks] }));
        addToast('New link is generated', 'success');
      }
    } catch (error) {
      addToast(error, 'error');
      throw new Error(error || 'Failed while generating');
    } finally {
      setShortLinkModal((prev) => ({ ...prev, isLoading: false, description: '' }));
    }
  };

  const handleRevokeLink = async (id) => {
    try {
      const res = await productService.revokeShortLink(id, product.id, product.storeId);

      if (res) {
        setProduct((prev) => ({
          ...prev,
          shortLinks: [...prev.shortLinks.filter((el) => el.id !== res)],
        }));
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  if (error || !product) {
    return (
      <div
        className="dashboard"
        style={{
          background: 'var(--color-bg-secondary)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-text)' }}>Product not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            {error || 'The product you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: 16,
              padding: '0.7rem 1.2rem',
              borderRadius: 10,
              background: '#111827',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .icon-button:hover {
            background: #111827 !important;
            color: #fff !important;
            border-color: #111827 !important;
          }
          .delete-button:hover {
            background: #ef4444 !important;
            color: #fff !important;
          }
        `}
      </style>
      <>
        <>
          <PageContainer
            LeftComponent={
              <Button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.2rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </Button>
            }
            title={product.name}
            loading={loading}
            RightContent={
              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  filled
                  onClick={() => setShortLinkModal((prev) => ({ ...prev, isOpened: true }))}
                >
                  Quick Buy
                </Button>

                <Button
                  onClick={() => navigate(`/store/${product.storeId}/products/${product.id}/edit`)}
                  style={{ width: 40, padding: '0.5rem' }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

                <Button
                  color="#ef4444"
                  onClick={() => setShowDeleteModal(true)}
                  style={{ width: 40, padding: '0.5rem' }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H5H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            }
            minHeight="65vh"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 32,
                alignItems: 'start',
              }}
            >
              {/* Left Side - Product Images Carousel */}
              <div>
                {(() => {
                  const images =
                    product.imgUrls && product.imgUrls.length > 0
                      ? product.imgUrls
                      : [
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDI0MFYyNDBIMTYwVjE2MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE4MCAyMDBMMjAwIDE4MEwyMjAgMjAwTDIyMCAyMjBIMTgwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
                        ];

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
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          borderRadius: 16,
                          overflow: 'hidden',
                          border: '2px solid var(--color-border)',
                        }}
                      >
                        <img
                          src={
                            process.env.REACT_APP_STORAGE_BACKEND_URL + images[currentImageIndex]
                          }
                          alt={
                            product.imgUrls && product.imgUrls.length > 0
                              ? `${product.name} ${currentImageIndex + 1}`
                              : 'No image available'
                          }
                          style={{
                            width: '100%',
                            height: 500,
                            objectFit: 'cover',
                            display: 'block',
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
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => (e.target.style.background = 'rgba(0,0,0,0.7)')}
                              onMouseLeave={(e) => (e.target.style.background = 'rgba(0,0,0,0.5)')}
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
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => (e.target.style.background = 'rgba(0,0,0,0.7)')}
                              onMouseLeave={(e) => (e.target.style.background = 'rgba(0,0,0,0.5)')}
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </div>

                      {/* Thumbnail Navigation */}
                      {images.length > 1 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 16,
                            flexWrap: 'wrap',
                          }}
                        >
                          {images.map((imgUrl, index) => {
                            return (
                              <button
                                key={index}
                                onClick={() => goToImage(index)}
                                style={{
                                  border:
                                    currentImageIndex === index
                                      ? '3px solid var(--color-accent)'
                                      : '2px solid var(--color-border)',
                                  borderRadius: 8,
                                  padding: 0,
                                  cursor: 'pointer',
                                  background: 'none',
                                  opacity: currentImageIndex === index ? 1 : 0.6,
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                                onMouseLeave={(e) =>
                                  (e.target.style.opacity = currentImageIndex === index ? 1 : 0.6)
                                }
                              >
                                <img
                                  src={process.env.REACT_APP_STORAGE_BACKEND_URL + imgUrl}
                                  alt={`Thumbnail ${index + 1}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    display: 'block',
                                  }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* No Images Message */}
                      {(!product.imgUrls || product.imgUrls.length === 0) && (
                        <div
                          style={{
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                            fontSize: 14,
                            marginTop: 12,
                          }}
                        >
                          No product images available
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Side - Product Information */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 24,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ minWidth: 220, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                      {product.category || 'Uncategorized'}
                    </div>
                    <div
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      Total Stock: {product.amount}
                    </div>
                    {product.description && (
                      <div
                        style={{
                          color: 'var(--color-text)',
                          fontSize: 15,
                          marginBottom: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description}
                      </div>
                    )}

                    {/* Preorder and Discount info */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      {product.isPreOrder && (
                        <span
                          style={{
                            background: 'var(--color-accent)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          PREORDER
                        </span>
                      )}
                      {product.isDiscount && (
                        <span
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      Price
                    </div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: 22 }}>
                      {product.priceRange.max - product.priceRange.min > 0
                        ? `from ${formatPrice(product.priceRange.min)} to ${formatPrice(product.priceRange.max)}`
                        : formatPrice(product.priceRange.min)}
                    </div>
                  </div>
                </div>

                {/* Size Inventory */}
                {product.productOptions && product.productOptions.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>
                      Options:
                    </h4>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
                    >
                      {product.productOptions.map((item, index) => (
                        <ProductOption item={item} key={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PageContainer>
        </>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: 'var(--color-bg)',
                borderRadius: 16,
                padding: 32,
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H5H21"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 11V17"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 11V17"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: 8,
                  }}
                >
                  Delete Product
                </h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                  Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be
                  undone.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  style={{ flex: 1 }}
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  filled
                  color="#ef4444"
                  style={{ flex: 1 }}
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>

      <Modal
        show={shortLinkModal.isOpened}
        onClose={() => setShortLinkModal((prev) => ({ ...prev, isOpened: !prev.isOpened }))}
        title={`Quick Buy (${product.shortLinks.length})`}
      >
        <div
          className="custom-scrollbar"
          style={{
            maxHeight: '520px',
            overflowY: 'auto',
            paddingRight: '8px',
            marginBottom: 10,
          }}
        >
          {product.shortLinks.length > 0 && (
            <>
              <div>
                {product.shortLinks.map((link) => {
                  const fullShortLink = `${window.location.host}/s/${link.code}`;
                  return (
                    <div
                      key={link.id}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: '2px solid var(--color-border)',
                        borderRadius: 12,
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text)',
                        fontSize: 14,
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                        marginBottom: 16,
                        boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                        }}
                      >
                        <a
                          href={`https://${fullShortLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#a78bfa',
                            fontWeight: 600,
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                            fontSize: 16,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                          onMouseLeave={(e) => (e.target.style.opacity = '1')}
                        >
                          {fullShortLink}
                        </a>

                        <button
                          onClick={(e) => {
                            navigator.clipboard.writeText(`http://${fullShortLink}`);

                            const btn = e.currentTarget;
                            const origContent = btn.innerHTML;
                            btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        `;
                            btn.style.color = '#10b981';
                            btn.style.background = 'rgba(16, 185, 129, 0.1)';
                            btn.style.borderColor = 'rgba(16, 185, 129, 0.2)';

                            setTimeout(() => {
                              btn.innerHTML = origContent;
                              btn.style.color = 'var(--color-text-muted)';
                              btn.style.background = 'rgba(255, 255, 255, 0.03)';
                              btn.style.borderColor = 'transparent';
                            }, 2000);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid transparent',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.innerText.includes('Copied!')) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.color = 'var(--color-text)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.currentTarget.innerText.includes('Copied!')) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                              e.currentTarget.style.color = 'var(--color-text-muted)';
                            }
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to revoke this link?')) {
                              handleRevokeLink(link.id);
                            }
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.target.style.color = '#ef4444';
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                          Revoke
                        </button>
                      </div>

                      {link.description && (
                        <div
                          style={{
                            color: 'var(--color-text)',
                            marginBottom: 16,
                            lineHeight: 1.5,
                            padding: '10px 12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            borderRadius: 8,
                          }}
                        >
                          {link.description}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                          borderTop: '1px solid var(--color-border)',
                          paddingTop: 12,
                          color: 'var(--color-text-muted)',
                          fontSize: 12,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                              {link.clicks || 0}
                            </span>
                            <span>clicks</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Created:</span>
                            <span style={{ color: 'var(--color-text)' }}>
                              {new Date(link.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {link.expirationDate && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 8px',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#ef4444',
                              borderRadius: 6,
                              fontWeight: 500,
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Expires:</span>
                            <span>{new Date(link.expirationDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  borderTop: '1px solid var(--color-border)',
                  marginBottom: 20,
                  width: '90%',
                  alignSelf: 'center',
                }}
              />
            </>
          )}

          <div style={{ width: '99%' }}>
            <form onSubmit={handleGenerateLink}>
              <textarea
                name="description"
                value={shortLinkModal.description}
                onChange={(e) =>
                  setShortLinkModal((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter description for new Instant Link"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid var(--color-border)',
                  borderRadius: 12,
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: 100,
                }}
              />
              <div style={{ textAlign: 'end', marginTop: 20, marginRight: 5, marginBottom: 5 }}>
                <Button
                  style={{ marginRight: 20 }}
                  color="red"
                  onClick={() =>
                    setShortLinkModal((prev) => ({ ...prev, isOpened: false, description: '' }))
                  }
                  disabled={shortLinkModal.isLoading}
                  type="button"
                >
                  Cancel
                </Button>
                <Button filled type="submit" disabled={shortLinkModal.isLoading}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductView;
