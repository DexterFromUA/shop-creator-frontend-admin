import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  
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
      XXL: { selected: false, quantity: 0 }
    }
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check image count (maximum 5)
    if (newProduct.images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }
      
      // Check file size (maximum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Add file
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, file]
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (size, field, value) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: field === 'selected' ? value : parseInt(value) || 0
        }
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (type === 'checkbox') {
      setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'discountPercent') {
      setNewProduct(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newProduct.name.trim()) {
      alert('Please enter product name');
      return;
    }
    
    if (!newProduct.description.trim()) {
      alert('Please enter product description');
      return;
    }
    
    if (!newProduct.price.trim()) {
      alert('Please enter product price');
      return;
    }
    
    if (newProduct.images.length === 0) {
      alert('Please add at least one image');
      return;
    }
    
    // Check that at least one size is selected
    const selectedSizes = Object.entries(newProduct.sizes).filter(([_, sizeData]) => sizeData.selected);
    if (selectedSizes.length === 0) {
      alert('Please select at least one size');
      return;
    }
    
    // Check that all selected sizes have quantity specified
    const invalidSizes = selectedSizes.filter(([_, sizeData]) => sizeData.quantity <= 0);
    if (invalidSizes.length > 0) {
      alert('Please specify quantity for all selected sizes');
      return;
    }
    
    setLoading(true);
    
    try {
      // Here you would typically make an API call to save the product
      // For now, we'll just simulate success and navigate back
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to products page
      navigate(`/store/${storeId}/products`);
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/store/${storeId}/products`);
  };

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      padding: '48px 16px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Add New Product
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Create a new product for your store with images, descriptions, and inventory management.
          </p>
        </div>

        {/* Product Creation Form Card */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 32,
          boxSizing: 'border-box'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Product Images */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: 18, 
                fontWeight: 600, 
                color: 'var(--color-text)' 
              }}>
                Product Images
              </h3>
              
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16, marginBottom: 16 }}>
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
                            border: '2px solid var(--color-border)'
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
                            fontWeight: 'bold'
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
                        minHeight: 120
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
                          PNG, JPG, WebP up to 5MB each
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: 18, 
                fontWeight: 600, 
                color: 'var(--color-text)' 
              }}>
                Basic Information
              </h3>
              
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 8, 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: 'var(--color-text)' 
                  }}>
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
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 8, 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: 'var(--color-text)' 
                  }}>
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
                      minHeight: 100
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
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
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
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
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      padding: '12px 16px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 12,
                      background: 'var(--color-bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
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

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: newProduct.isDiscount ? 12 : 0, transition: 'gap 0.3s ease-in-out' }}>
                    <div style={{ flex: newProduct.isDiscount ? 0.5 : 1, transition: 'flex 0.3s ease-in-out' }}>
                      <label style={{ 
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
                        boxSizing: 'border-box'
                      }}>
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
                    
                    <div style={{ 
                      overflow: 'hidden',
                      flex: newProduct.isDiscount ? 0.5 : 0,
                      opacity: newProduct.isDiscount ? 1 : 0,
                      transition: 'all 0.3s ease-in-out',
                      transform: newProduct.isDiscount ? 'translateX(0)' : 'translateX(-20px)'
                    }}>
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
                            textAlign: 'center'
                          }}
                        />
                        <small style={{ 
                          color: 'var(--color-text-secondary)', 
                          fontSize: 11,
                          display: 'block',
                          textAlign: 'center',
                          marginTop: 4,
                          whiteSpace: 'nowrap'
                        }}>
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
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: 18, 
                fontWeight: 600, 
                color: 'var(--color-text)' 
              }}>
                Sizes & Stock
              </h3>
              
                             <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
                 {Object.entries(newProduct.sizes).map(([size, sizeData]) => (
                   <div key={size} style={{ 
                     display: 'flex', 
                     flexDirection: 'column',
                     gap: 12,
                     padding: '16px',
                     border: '2px solid var(--color-border)',
                     borderRadius: 12,
                     background: sizeData.selected 
                       ? 'var(--color-bg-secondary)' 
                       : 'transparent',
                     transition: 'all 0.2s'
                   }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                       <input
                         type="checkbox"
                         checked={sizeData.selected}
                         onChange={e => handleSizeChange(size, 'selected', e.target.checked)}
                         style={{ margin: 0 }}
                       />
                       <span style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>
                         Size {size}
                       </span>
                     </label>
                     <div>
                       <label style={{ 
                         display: 'block', 
                         marginBottom: 4, 
                         fontSize: 12, 
                         fontWeight: 600, 
                         color: 'var(--color-text-secondary)' 
                       }}>
                         Stock Quantity
                       </label>
                       <input
                         type="number"
                         min="0"
                         value={sizeData.quantity}
                         onChange={e => handleSizeChange(size, 'quantity', e.target.value)}
                         placeholder="0"
                         disabled={!sizeData.selected}
                         style={{
                           width: '100%',
                           padding: '8px 12px',
                           border: '2px solid var(--color-border)',
                           borderRadius: 8,
                           background: sizeData.selected ? 'var(--color-bg)' : 'var(--color-bg-secondary)',
                           color: sizeData.selected ? 'var(--color-text)' : 'var(--color-text-secondary)',
                           fontSize: 14,
                           outline: 'none',
                           transition: 'border-color 0.2s',
                           boxSizing: 'border-box',
                           opacity: sizeData.selected ? 1 : 0.6,
                           cursor: sizeData.selected ? 'text' : 'not-allowed'
                         }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Form Actions */}
            <div style={{ 
              display: 'flex', 
              gap: 16, 
              justifyContent: 'flex-end',
              paddingTop: 24,
              borderTop: '1px solid var(--color-border)'
            }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading ? '#6b7280' : '#111827',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 