import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { storeId, id: productId } = useParams();
  const { addToast } = useToast();
  const isEditMode = !!productId;

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    isPreorder: false,
    isDiscount: false,
    discountPercent: 0,
    category: '',
    sizes: {
      XS: { selected: false, quantity: 0 },
      S: { selected: false, quantity: 0 },
      M: { selected: false, quantity: 0 },
      L: { selected: false, quantity: 0 },
      XL: { selected: false, quantity: 0 },
      XXL: { selected: false, quantity: 0 },
    },
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // Load product data for edit mode
  useEffect(() => {
    let isMounted = true;

    if (isEditMode && productId) {
      const loadProduct = async () => {
        try {
          if (!isMounted) return;
          setInitialLoading(true);

          const product = await productService.getProduct(productId);

          if (!isMounted) return;

          // Convert product data to form format
          const sizes = {
            XS: { selected: false, quantity: 0 },
            S: { selected: false, quantity: 0 },
            M: { selected: false, quantity: 0 },
            L: { selected: false, quantity: 0 },
            XL: { selected: false, quantity: 0 },
            XXL: { selected: false, quantity: 0 },
          };

          // Populate sizes with existing data
          if (product.sizeInventory) {
            product.sizeInventory.forEach((sizeItem) => {
              if (sizes[sizeItem.size]) {
                sizes[sizeItem.size] = {
                  selected: true,
                  quantity: sizeItem.quantity,
                };
              }
            });
          }

          setNewProduct({
            name: product.name || '',
            description: product.description || '',
            price: product.price ? `$${product.price.toFixed(2)}` : '',
            images: [], // Will be set separately
            isPreorder: product.isPreOrder || false,
            isDiscount: product.isDiscount || false,
            discountPercent: product.discountPercent || 0,
            category: product.category || '',
            sizes: sizes,
          });

          // Set image previews if product has images
          if (product.imgUrls && product.imgUrls.length > 0) {
            setImagePreviews(product.imgUrls);
          }
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
  }, [isEditMode, productId, storeId]); // Removed navigate from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear form state on unmount to prevent state leaks
      setNewProduct({
        name: '',
        description: '',
        price: '',
        images: [],
        isPreorder: false,
        isDiscount: false,
        discountPercent: 0,
        category: '',
        sizes: {
          XS: { selected: false, quantity: 0 },
          S: { selected: false, quantity: 0 },
          M: { selected: false, quantity: 0 },
          L: { selected: false, quantity: 0 },
          XL: { selected: false, quantity: 0 },
          XXL: { selected: false, quantity: 0 },
        },
      });
      setImagePreviews([]);
    };
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check image count (maximum 5)
    if (newProduct.images.length + files.length > 5) {
      addToast('Maximum 5 images allowed', 'error');
      return;
    }

    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        addToast('Please select only image files', 'error');
        return;
      }

      // Check file size (maximum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size must be less than 5MB', 'error');
        return;
      }

      // Add file
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, file],
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (size, field, value) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: field === 'selected' ? value : parseInt(value) || 0,
        },
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setNewProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'discountPercent') {
      setNewProduct((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newProduct.name.trim()) {
      addToast('Please enter product name', 'error');
      return;
    }

    if (!newProduct.description.trim()) {
      addToast('Please enter product description', 'error');
      return;
    }

    if (!newProduct.price.trim()) {
      addToast('Please enter product price', 'error');
      return;
    }

    // Check that at least one size is selected
    const selectedSizes = Object.entries(newProduct.sizes).filter(
      ([_, sizeData]) => sizeData.selected
    );
    if (selectedSizes.length === 0) {
      addToast('Please select at least one size', 'error');
      return;
    }

    // Check that all selected sizes have quantity specified
    const invalidSizes = selectedSizes.filter(([_, sizeData]) => sizeData.quantity <= 0);
    if (invalidSizes.length > 0) {
      addToast('Please specify quantity for all selected sizes', 'error');
      return;
    }

    setLoading(true);

    try {
      // Prepare size inventory data
      const sizeInventory = selectedSizes.map(([size, sizeData]) => ({
        size: size,
        quantity: sizeData.quantity,
      }));

      // Handle images differently for edit vs create
      let imgUrls = [];

      if (isEditMode) {
        // For edit mode, use existing image previews if no new images uploaded
        if (newProduct.images.length > 0) {
          // Convert new uploaded images to base64
          for (const image of newProduct.images) {
            const reader = new FileReader();
            const imageUrl = await new Promise((resolve) => {
              reader.onload = (e) => resolve(e.target.result);
              reader.readAsDataURL(image);
            });
            imgUrls.push(imageUrl);
          }
        } else {
          // Use existing previews (URLs from database)
          imgUrls = imagePreviews;
        }
      } else {
        // For create mode, convert all images to base64
        for (const image of newProduct.images) {
          const reader = new FileReader();
          const imageUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(image);
          });
          imgUrls.push(imageUrl);
        }
      }

      // Parse price to number
      const price = parseFloat(newProduct.price.replace(/[^0-9.]/g, ''));

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: price,
        category: newProduct.category.trim() || null,
        isPreOrder: newProduct.isPreorder,
        isDiscount: newProduct.isDiscount,
        discountPercent: newProduct.discountPercent || 0,
        imgUrls: imgUrls,
        sizeInventory: sizeInventory,
      };

      if (isEditMode) {
        // For update, don't include storeId
        await productService.updateProduct(productId, productData);
      } else {
        // For create, include storeId
        await productService.createProduct({
          ...productData,
          storeId: storeId,
        });
      }

      // Navigate back to products page
      navigate(`/store/${storeId}/products`);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
      addToast(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/store/${storeId}/products`);
  };

  // Show loading state while fetching product data for edit
  if (initialLoading) {
    return (
      <PageContainer
        isCenteredContent
        title="Loading"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--color-text)', fontSize: 18 }}>Loading product data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      minHeight="auto"
      title={isEditMode ? 'Edit Product' : 'Add New Product'}
      description={
        isEditMode
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
            Product Images (Optional)
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
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
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
                      onClick={() => removeImage(index)}
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
                ))}
              </div>
            )}

            {/* Upload area */}
            {newProduct.images.length < 5 && (
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
                    📷 Click to upload product images ({newProduct.images.length}/5)
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      PNG, JPG, WebP up to 5MB each (optional)
                    </div>
                  </div>
                </label>
              </div>
            )}
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
                value={newProduct.name}
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
                Description *
              </label>
              <textarea
                name="description"
                value={newProduct.description}
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

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
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
                  Price *
                </label>
                <input
                  type="text"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="e.g. $29.99"
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
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
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

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
              <div>
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
                  }}
                >
                  <input
                    type="checkbox"
                    name="isPreorder"
                    checked={newProduct.isPreorder}
                    onChange={handleInputChange}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                    Available for preorder only
                  </span>
                </label>
                <small style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                  Enable this if the product is not yet available for immediate shipping.
                </small>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: newProduct.isDiscount ? 12 : 0,
                  transition: 'gap 0.3s ease-in-out',
                }}
              >
                <div
                  style={{
                    flex: newProduct.isDiscount ? 0.5 : 1,
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
                      checked={newProduct.isDiscount}
                      onChange={handleInputChange}
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
                    flex: newProduct.isDiscount ? 0.5 : 0,
                    opacity: newProduct.isDiscount ? 1 : 0,
                    transition: 'all 0.3s ease-in-out',
                    transform: newProduct.isDiscount ? 'translateX(0)' : 'translateX(-20px)',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <input
                      type="number"
                      name="discountPercent"
                      value={newProduct.discountPercent}
                      onChange={handleInputChange}
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
            Sizes & Stock
          </h3>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
            {Object.entries(newProduct.sizes).map(([size, sizeData]) => (
              <div
                key={size}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: '16px',
                  border: '2px solid var(--color-border)',
                  borderRadius: 12,
                  background: sizeData.selected ? 'var(--color-bg-secondary)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sizeData.selected}
                    onChange={(e) => handleSizeChange(size, 'selected', e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                    Size {size}
                  </span>
                </label>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sizeData.quantity}
                    onChange={(e) => handleSizeChange(size, 'quantity', e.target.value)}
                    placeholder="0"
                    disabled={!sizeData.selected}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 8,
                      background: sizeData.selected
                        ? 'var(--color-bg)'
                        : 'var(--color-bg-secondary)',
                      color: sizeData.selected
                        ? 'var(--color-text)'
                        : 'var(--color-text-secondary)',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      opacity: sizeData.selected ? 1 : 0.6,
                      cursor: sizeData.selected ? 'text' : 'not-allowed',
                    }}
                  />
                </div>
              </div>
            ))}
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
          {/* <Button
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
          </Button> */}
          <Button
            filled
            type="submit"
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: 14, fontWeight: 600 }}
          >
            {loading
              ? isEditMode
                ? 'Updating Product...'
                : 'Creating Product...'
              : isEditMode
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default AddProduct;
