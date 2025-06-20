import React, { useState } from 'react';
import './AppSettings.css';

function AppSettings() {
  const [settings, setSettings] = useState({
    appName: '',
    shortName: '',
    description: '',
    primaryColor: '#000000',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    displayMode: 'standalone'
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderInput = (label, field, type, placeholder) => (
    <div className="setting-field">
      <label>{label}</label>
      <input
        type={type}
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, field, options) => (
    <div className="setting-field">
      <label>{label}</label>
      <select
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleSave = () => {
    // Implement the save logic here
    console.log('Saving settings:', settings);
  };

  const renderSetting = (label, type, value, options) => (
    <div className="setting-field">
      <label>{label}</label>
      {type === 'text' && (
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(label.toLowerCase(), e.target.value)}
        />
      )}
      {type === 'select' && (
        <select
          value={value}
          onChange={(e) => handleChange(label.toLowerCase(), e.target.value)}
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {type === 'color' && (
        <div className="color-input">
          <input
            type="color"
            value={value}
            onChange={(e) => handleChange(label.toLowerCase(), e.target.value)}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(label.toLowerCase(), e.target.value)}
            placeholder="#000000"
          />
        </div>
      )}
      {type === 'toggle' && (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handleChange(label.toLowerCase(), e.target.checked)}
        />
      )}
    </div>
  );

  return (
    <div className="dashboard" style={{ padding: 0 }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', margin: '16px' }}>
          <div>
            <h1 className="dashboard-header">⚙️ App Settings</h1>
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: '1.1rem',
              maxWidth: '600px',
              lineHeight: '1.5',
              marginTop: '8px'
            }}>
              Customize your app's appearance and behavior to create the perfect experience for your users
            </p>
          </div>
          <button
            onClick={handleSave}
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
            Save Changes
          </button>
        </div>

        <div style={{ padding: '0 16px 16px 16px' }}>
          <div className="settings-grid">
            <div className="dashboard-card settings-section dashboard-card--no-hover">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>General Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderSetting('App Name', 'text', settings.appName)}
                {renderSetting('Currency', 'select', settings.currency, [
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' }
                ])}
                {renderSetting('Language', 'select', settings.language, [
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' }
                ])}
              </div>
            </div>

            <div className="dashboard-card settings-section dashboard-card--no-hover">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Theme Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderSetting('Theme Mode', 'select', settings.theme, [
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' }
                ])}
                {renderSetting('Primary Color', 'color', settings.primaryColor)}
                {renderSetting('Font Size', 'select', settings.fontSize, [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ])}
              </div>
            </div>

            <div className="dashboard-card settings-section dashboard-card--no-hover">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Notification Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderSetting('Email Notifications', 'toggle', settings.emailNotifications)}
                {renderSetting('Push Notifications', 'toggle', settings.pushNotifications)}
                {renderSetting('Order Updates', 'toggle', settings.orderUpdates)}
              </div>
            </div>

            <div className="dashboard-card settings-section dashboard-card--no-hover">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Advanced Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderSetting('Cache Mode', 'select', settings.cacheMode, [
                  { value: 'memory', label: 'Memory' },
                  { value: 'disk', label: 'Disk' },
                  { value: 'hybrid', label: 'Hybrid' }
                ])}
                {renderSetting('Analytics', 'toggle', settings.analytics)}
                {renderSetting('Debug Mode', 'toggle', settings.debugMode)}
                {renderSetting('API Environment', 'select', settings.apiEnv, [
                  { value: 'production', label: 'Production' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'development', label: 'Development' }
                ])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSettings;