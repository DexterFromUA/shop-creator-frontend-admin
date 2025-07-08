import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useStore } from '../context/StoreContext';
import { storeService } from '../utils/graphql';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const EditStore = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { addToast } = useToast();
  const { currentStore, refreshStore } = useStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
  });

  useEffect(() => {
    if (currentStore) {
      setFormData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        address: currentStore.contactAddress || '',
        city: currentStore.contactCity || '',
        phone: currentStore.contactPhone || '',
        email: currentStore.contactEmail || '',
        website: currentStore.website || '',
      });
    }
  }, [currentStore]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeId) return;
    if (!formData.name.trim()) {
      addToast('Please enter a store name', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Please enter a store description', 'error');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        contactEmail: formData.email || null,
        contactPhone: formData.phone || null,
        contactAddress: formData.address || null,
        contactCity: formData.city || null,
      };
      const updated = await storeService.updateStore(storeId, updateData);
      await refreshStore();
      addToast(`Store "${updated.name}" updated successfully!`, 'success');
      navigate(`/store/${storeId}/dashboard`);
    } catch (error) {
      console.error('Error updating store:', error);
      addToast(error.message || 'Failed to update store. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault()
    navigate(`/store/${storeId}`);
  };

  return (
    <PageContainer
      withPadding
      isStretch
      minHeight="auto"
      title="Edit Store"
      description="Update your store details."
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information (reuse same inputs as CreateStore) */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: 'var(--color-text)' }}>
            Basic Information
          </h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your store name"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your store sells"
                rows={3}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 }}
              />
            </div>
          </div>
        </div>
        {/* Contact Information */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Contact Information
          </h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="store@example.com"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.yourstore.com"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Location
          </h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 2fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Suite 100"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
          <Button onClick={handleCancel} disabled={loading}>Cancel</Button>
          <Button filled type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Store'}</Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default EditStore; 