import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { productService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';
import { uploadFilesToStore } from '../utils/fileHelper';

const DEFAULT_OPTION = {
  name: '',
  description: '',
  price: 0,
  isPreOrder: false,
  isDiscount: false,
  discountPercent: 0,
  isLimited: false,
  quantity: 0,
};
const DEFAULT_PRODUCT = {
  name: '',
  description: '',
  imgUrls: [],
  category: '',
  productOptions: [DEFAULT_OPTION],
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { storeId, id: productId } = useParams();
  const { addToast } = useToast();
  const IS_EDIT_MODE = !!productId;
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(IS_EDIT_MODE);

  useEffect(() => {
    let isMounted = true;

    if (IS_EDIT_MODE && productId) {
      const loadProduct = async () => {
        try {
          if (!isMounted) return;
          setInitialLoading(true);

          const productData = await productService.getProduct(productId);
          setProduct({ ...productData, productOptions: [...productData.productOptions] });

          const existingImages = productData.imgUrls.map((url, index) => ({
            id: `existing-${index}`,
            previewUrl: `${process.env.REACT_APP_STORAGE_BACKEND_URL}${url}`,
            file: null,
            isExisting: true,
            originalKey: url,
          }));
          setImagePreviews([...existingImages]);
        } catch (error) {
          console.error('Error loading product for edit:', error);
          if (isMounted) {
            navigate(`/store/${storeId}/products`);
          }
        } finally {
          if (isMounted) {
            setInitialLoading(false);
          }
        }
      };

      loadProduct();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IS_EDIT_MODE, productId, storeId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;
    if (product.imgUrls.length + files.length > 10) {
      addToast('Maximum 10 images allowed', 'error');
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select only image files', 'error');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        addToast('File size must be less than 15MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImgObject = {
          id: `new-${Date.now()}-${Math.random()}`,
          previewUrl: event.target.result,
          file: file,
          isExisting: false,
        };
        setImagePreviews((prev) => [...prev, { ...newImgObject }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((item) => item.id !== index));
  };

  const handleOptionChange = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      productOptions: prev.productOptions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'discountPercent') {
      setProduct((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOption = () => {
    setProduct((prev) => ({
      ...prev,
      productOptions: [...prev.productOptions, { ...DEFAULT_OPTION }],
    }));
  };

  const handleRemoveOption = (index) => {
    setProduct((prev) => ({
      ...prev,
      productOptions: [...prev.productOptions.filter((_, i) => i !== index)],
    }));
  };

  const priceParser = (price) => parseFloat(price.replace(/[^0-9.]/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      addToast('Please enter product name', 'error');
      return;
    }

    if (!product.productOptions || product.productOptions.length === 0) {
      addToast('Please add at least one product option', 'error');
      return;
    }

    if (product.productOptions.length === 1) {
      if (!product.productOptions[0].price) {
        addToast('Provide price for the product', 'error');
        return;
      }
    }

    if (product.productOptions.length > 1) {
      const checkOptions = !!product.productOptions.filter((el) => !el.name || !el.price).length;
      if (checkOptions) {
        addToast('Provide titles and prices for all options', 'error');
        return;
      }
    }

    setLoading(true);

    try {
      let imageUrls = [];
      const keepExistingKeys = imagePreviews
        .filter((img) => img.isExisting)
        .map((img) => img.originalKey);
      const newImageToUpload = imagePreviews
        .filter((img) => !img.isExisting)
        .map((img) => img.file);
      if (newImageToUpload.length > 0) {
        imageUrls = await uploadFilesToStore(newImageToUpload, storeId);
      }
      const finalImgUrls = [...keepExistingKeys, ...imageUrls];

      const productData = {
        name: product.name.trim(),
        description: product.description.trim(),
        category: product.category.trim(),
        imgUrls: finalImgUrls,
        productOptions: [
          ...product.productOptions.map((el) => ({
            name: el.name,
            description: el.description,
            isPreOrder: el.isPreOrder,
            isDiscount: el.isDiscount,
            isLimited: el.isLimited,
            price: priceParser(String(el.price)),
            quantity: Number(el.quantity),
            discountPercent: Number(el.discountPercent),
          })),
        ],
      };

      if (IS_EDIT_MODE) {
        // For update, don't include storeId
        await productService.updateProduct(productId, productData);
      } else {
        await productService.createProduct({
          ...productData,
          storeId: storeId,
        });
      }

      navigate(`/store/${storeId}/products`);
    } catch (error) {
      console.error(`Error ${IS_EDIT_MODE ? 'updating' : 'creating'} product:`, error);
      addToast(
        `Failed to ${IS_EDIT_MODE ? 'update' : 'create'} product. Please try again.`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/store/${storeId}/products`);
  };

  return (
    <PageContainer
      title={IS_EDIT_MODE ? 'Edit Product' : 'Add New Product'}
      description={
        IS_EDIT_MODE
          ? 'Update your product information, images, descriptions, and inventory.'
          : 'Create a new product for your store with images, descriptions, and inventory management.'
      }
      RightContent={
        <Button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          Cancel
        </Button>
      }
      loading={initialLoading}
      loadingText={'Loading product data...'}
    >
      <form onSubmit={handleSubmit}>
        {/* Product Images */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Product Images
          </h3>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {imagePreviews.map((preview) => {
                  return (
                    <div key={preview.id} style={{ position: 'relative' }}>
                      <img
                        src={preview.previewUrl}
                        alt={`Preview ${preview.id}`}
                        style={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '2px solid var(--color-border)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(preview.id)}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: 'none',
                          background: '#ef4444',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload area */}
            {/* {product.images.length < 5 && ( */}
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="product-images-upload"
              />
              <label
                htmlFor="product-images-upload"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 16px',
                  border: '2px dashed var(--color-border)',
                  borderRadius: 12,
                  background: 'var(--color-bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  minHeight: 120,
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#111827';
                  e.target.style.background = 'var(--color-bg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.background = 'var(--color-bg-secondary)';
                }}
              >
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  📷 Click to upload product images ({product.imgUrls.length}/5)
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    PNG, JPG, WebP up to 5MB each (optional)
                  </div>
                </div>
              </label>
            </div>
            {/* )} */}
          </div>
        </div>

        {/* Basic Information */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Basic Information
          </h3>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
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
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter detailed product description"
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
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                placeholder="Enter product category"
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
                }}
              />
            </div>
          </div>
        </div>

        {/* Sizes & Stock */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Product Options
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}></div>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
            {product.productOptions.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: '16px',
                  border: '2px solid var(--color-border)',
                  borderRadius: 12,
                  background: 'var(--color-bg-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  {product.productOptions.length > 1 && (
                    <>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 8,
                          background: 'var(--color-bg)',
                          color: 'var(--color-text)',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box',
                          marginBottom: 15,
                        }}
                      />

                      <label
                        style={{
                          display: 'block',
                          marginBottom: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        minLength={0}
                        value={item.description}
                        onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                        placeholder={'Description for this option'}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 8,
                          background: 'var(--color-bg)',
                          color: 'var(--color-text)',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box',
                          marginBottom: 15,
                        }}
                      />
                    </>
                  )}

                  <label
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 8,
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      marginBottom: 15,
                    }}
                  />

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 12,
                      background: 'var(--color-bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginBottom: 15,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isPreOrder"
                      checked={item.isPreOrder}
                      onChange={(e) => handleOptionChange(index, 'isPreOrder', e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                      Available for preorder only
                    </span>
                  </label>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: item.isDiscount ? 12 : 0,
                      transition: 'gap 0.3s ease-in-out',
                    }}
                  >
                    <div
                      style={{
                        flex: item.isDiscount ? 0.5 : 1,
                        transition: 'flex 0.3s ease-in-out',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '12px 16px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <input
                          type="checkbox"
                          name="isDiscount"
                          checked={item.isDiscount}
                          onChange={(e) =>
                            handleOptionChange(index, 'isDiscount', e.target.checked)
                          }
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                          Discount
                        </span>
                      </label>
                    </div>

                    <div
                      style={{
                        overflow: 'hidden',
                        flex: item.isDiscount ? 0.5 : 0,
                        opacity: item.isDiscount ? 1 : 0,
                        transition: 'all 0.3s ease-in-out',
                        transform: item.isDiscount ? 'translateX(0)' : 'translateX(-20px)',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        <input
                          type="number"
                          name="discountPercent"
                          value={item.discountPercent}
                          onChange={(e) =>
                            handleOptionChange(index, 'discountPercent', e.target.value)
                          }
                          placeholder="0"
                          min="0"
                          max="100"
                          style={{
                            width: '100%',
                            padding: '12px 8px',
                            border: '2px solid var(--color-border)',
                            borderRadius: 12,
                            background: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            fontSize: 14,
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                          }}
                        />
                        <small
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 11,
                            display: 'block',
                            textAlign: 'center',
                            marginTop: 4,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          % off
                        </small>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: item.isLimited ? 12 : 0,
                      transition: 'gap 0.3s ease-in-out',
                    }}
                  >
                    <div
                      style={{
                        flex: item.isLimited ? 0.5 : 1,
                        transition: 'flex 0.3s ease-in-out',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '12px 16px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <input
                          type="checkbox"
                          name="isDiscount"
                          checked={item.isLimited}
                          onChange={(e) => handleOptionChange(index, 'isLimited', e.target.checked)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                          Limited
                        </span>
                      </label>
                    </div>

                    <div
                      style={{
                        overflow: 'hidden',
                        flex: item.isLimited ? 0.5 : 0,
                        opacity: item.isLimited ? 1 : 0,
                        transition: 'all 0.3s ease-in-out',
                        transform: item.isLimited ? 'translateX(0)' : 'translateX(-20px)',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        <input
                          type="number"
                          name="discountPercent"
                          value={item.quantity}
                          onChange={(e) => handleOptionChange(index, 'quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                          style={{
                            width: '100%',
                            padding: '12px 8px',
                            border: '2px solid var(--color-border)',
                            borderRadius: 12,
                            background: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            fontSize: 14,
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {product.productOptions.length > 1 && (
                  <Button
                    style={{ minWidth: '30%', alignSelf: 'flex-end' }}
                    color="red"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveOption(index);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <div
              onClick={() => handleAddOption()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '420px',
                padding: '16px',
                border: '2px dashed var(--color-border)',
                borderRadius: 12,
                background: 'var(--color-bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                outline: 'none',
                boxSizing: 'border-box',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'black';
                e.currentTarget.style.background = 'var(--color-bg)';
                const plusCircle = e.currentTarget.querySelector('.plus-circle');
                plusCircle.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
                const plusCircle = e.currentTarget.querySelector('.plus-circle');
                plusCircle.style.transform = 'scale(1)';
              }}
            >
              <div
                className="plus-circle"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  background: '#ffffff',
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'flex-end',
            paddingTop: 24,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Button
            filled
            type="submit"
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: 14, fontWeight: 600 }}
          >
            {loading
              ? IS_EDIT_MODE
                ? 'Updating Product...'
                : 'Creating Product...'
              : IS_EDIT_MODE
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default AddProduct;
