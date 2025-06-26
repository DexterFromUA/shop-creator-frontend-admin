import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

const CreateStore = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Please enter a store name', 'error');
      return;
    }

    if (!formData.description.trim()) {
      showToast('Please enter a store description', 'error');
      return;
    }

    setLoading(true);

    try {
      // Simulate store creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(`Store "${formData.name}" created successfully!`, 'success');
      navigate('/stores');
      
    } catch (error) {
      console.error('Error creating store:', error);
      showToast('Failed to create store. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/stores');
  };

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Create New Store
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Set up your new store and start selling your products to customers.
          </p>
        </div>

        {/* Form Card */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 0, 
          boxSizing: 'border-box',
          height: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ padding: 32 }}>
            <form onSubmit={handleSubmit}>
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
                      Store Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your store name"
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
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what your store sells"
                      rows={3}
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
                        minHeight: 80
                      }}
                    />
                  </div>


                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Contact Information
                </h3>
                
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
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
                      onFocus={(e) => e.target.style.borderColor = '#111827'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="store@example.com"
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
                      onFocus={(e) => e.target.style.borderColor = '#111827'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
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
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.yourstore.com"
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
                      onFocus={(e) => e.target.style.borderColor = '#111827'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Location
                </h3>
                
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 2fr' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
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
                      onFocus={(e) => e.target.style.borderColor = '#111827'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
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
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Suite 100"
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
                      onFocus={(e) => e.target.style.borderColor = '#111827'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
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
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  {loading && (
                    <div style={{
                      width: 16,
                      height: 16,
                      border: '2px solid #fff3',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  {loading ? 'Creating Store...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStore; 