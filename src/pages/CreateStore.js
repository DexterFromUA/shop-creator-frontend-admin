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
    website: '',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    subscription: 'Basic'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      const formatted = numbersOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }
    
    // Only allow numbers for CVV
    if (name === 'cvv') {
      const numbersOnly = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      return;
    }
    
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

    const cardNumberDigits = formData.cardNumber.replace(/\D/g, '');
    if (!cardNumberDigits || cardNumberDigits.length !== 16) {
      showToast('Please enter a valid 16-digit card number', 'error');
      return;
    }

    if (!formData.cardHolder.trim()) {
      showToast('Please enter card holder name', 'error');
      return;
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      showToast('Please enter card expiry date', 'error');
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const selectedYear = parseInt(formData.expiryYear);
    const selectedMonth = parseInt(formData.expiryMonth);
    
    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
      showToast('Card expiry date cannot be in the past', 'error');
      return;
    }

    if (!formData.cvv.trim() || formData.cvv.length < 3 || formData.cvv.length > 4) {
      showToast('Please enter a valid CVV code (3-4 digits)', 'error');
      return;
    }

    setLoading(true);

    try {
      // Simulate store creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast(`Store "${formData.name}" created successfully with ${formData.subscription} plan!`, 'success');
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

              {/* Payment Information */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Payment Information
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
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
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
                      Card Holder Name *
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
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

                  <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: 'var(--color-text)' 
                      }}>
                        Expiry Month *
                      </label>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 2.5rem 12px 16px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text)',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '18px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#111827'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: 'var(--color-text)' 
                      }}>
                        Expiry Year *
                      </label>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 2.5rem 12px 16px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text)',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          boxSizing: 'border-box',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '18px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#111827'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 20 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: 'var(--color-text)' 
                      }}>
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
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
              </div>

              {/* Subscription Plan */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Choose Your Plan
                </h3>
                
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  {/* Basic Plan */}
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, subscription: 'Basic' }))}
                    style={{
                      padding: 24,
                      border: formData.subscription === 'Basic' ? '2px solid #111827' : '2px solid var(--color-border)',
                      borderRadius: 16,
                      background: formData.subscription === 'Basic' ? 'rgba(17, 24, 39, 0.02)' : 'var(--color-bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>
                        Basic Plan
                      </h4>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '2px solid ' + (formData.subscription === 'Basic' ? '#111827' : 'var(--color-border)'),
                        background: formData.subscription === 'Basic' ? '#111827' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.subscription === 'Basic' && (
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#fff'
                          }} />
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>$9</span>
                      <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 4 }}>/month</span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Up to 100 products
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Basic analytics
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Email support
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Standard themes
                      </li>
                    </ul>
                  </div>

                  {/* Advanced Plan */}
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, subscription: 'Advanced' }))}
                    style={{
                      padding: 24,
                      border: formData.subscription === 'Advanced' ? '2px solid #111827' : '2px solid var(--color-border)',
                      borderRadius: 16,
                      background: formData.subscription === 'Advanced' ? 'rgba(17, 24, 39, 0.02)' : 'var(--color-bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>
                          Advanced Plan
                        </h4>
                        <span style={{
                          background: '#111827',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 4,
                          textTransform: 'uppercase'
                        }}>
                          Popular
                        </span>
                      </div>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '2px solid ' + (formData.subscription === 'Advanced' ? '#111827' : 'var(--color-border)'),
                        background: formData.subscription === 'Advanced' ? '#111827' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.subscription === 'Advanced' && (
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#fff'
                          }} />
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>$29</span>
                      <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 4 }}>/month</span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Unlimited products
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Advanced analytics
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Priority support
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8, 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        Custom themes
                      </li>
                      <li style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: 14, 
                        color: 'var(--color-text-secondary)' 
                      }}>
                        <span style={{ marginRight: 8, color: '#22c55e' }}>✓</span>
                        API access
                      </li>
                    </ul>
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