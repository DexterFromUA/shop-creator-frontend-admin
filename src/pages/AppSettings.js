import React, { useState } from 'react';
import './AppSettings.css';

const SettingRow = ({ label, description, children }) => (
  <div className="setting-row">
    <div className="setting-label">
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{label}</h3>
      {description && <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 14 }}>{description}</p>}
    </div>
    <div className="setting-control">
      {children}
    </div>
  </div>
);

function AppSettings() {
  const [settings, setSettings] = useState({
    theme: 'system',
    primaryColor: '#8b5cf6',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    debugMode: false,
    twoFactor: false,
    loginAlerts: true,
    apiAccess: false,
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically make an API call to save the settings
  };

  return (
    <div className="app-settings-page-wrapper">
      <div className="app-settings-container">
        <div className="app-settings-header">
          <div>
            <h1 className="dashboard-header">App Settings</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '600px', lineHeight: '1.5', marginTop: '8px' }}>
              Manage your application's appearance, notifications, and other settings.
            </p>
          </div>
          <button onClick={handleSave} className="save-button">Save Changes</button>
        </div>

        <div className="settings-grid">
          {/* Appearance Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Appearance</h2>
            <div className="settings-card-content">
              <SettingRow label="Theme" description="Choose a light, dark, or system default theme.">
                <select value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </SettingRow>
              <SettingRow label="Primary Color" description="Set the main accent color for the app.">
                <div className="color-input-wrapper">
                  <input type="color" value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="color-picker-input" />
                  <span>{settings.primaryColor}</span>
                </div>
              </SettingRow>
            </div>
          </div>

          {/* Localization Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Localization</h2>
            <div className="settings-card-content">
              <SettingRow label="Language" description="Select the display language for the interface.">
                <select value={settings.language} onChange={e => handleChange('language', e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </SettingRow>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Notifications</h2>
            <div className="settings-card-content">
              <SettingRow label="Email Notifications" description="Receive updates and alerts via email.">
                <label className="switch">
                  <input type="checkbox" checked={settings.emailNotifications} onChange={e => handleChange('emailNotifications', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
              <SettingRow label="Push Notifications" description="Get real-time notifications on your device.">
                <label className="switch">
                  <input type="checkbox" checked={settings.pushNotifications} onChange={e => handleChange('pushNotifications', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
            </div>
          </div>

          {/* Developer Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Developer</h2>
            <div className="settings-card-content">
              <SettingRow label="Debug Mode" description="Enables detailed logging and developer tools.">
                <label className="switch">
                  <input type="checkbox" checked={settings.debugMode} onChange={e => handleChange('debugMode', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
            </div>
          </div>
          
          {/* Security Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Security</h2>
            <div className="settings-card-content">
              <SettingRow label="Two-Factor Authentication" description="Require a second step to log in.">
                <label className="switch">
                  <input type="checkbox" checked={settings.twoFactor} onChange={e => handleChange('twoFactor', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
              <SettingRow label="Login Alerts" description="Get an email when a new device logs in.">
                <label className="switch">
                  <input type="checkbox" checked={settings.loginAlerts} onChange={e => handleChange('loginAlerts', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
            </div>
          </div>

          {/* API Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">API & Integrations</h2>
            <div className="settings-card-content">
              <SettingRow label="API Access" description="Allow access via the public API.">
                <label className="switch">
                  <input type="checkbox" checked={settings.apiAccess} onChange={e => handleChange('apiAccess', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSettings;