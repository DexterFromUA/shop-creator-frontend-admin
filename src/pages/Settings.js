import React, { useState } from 'react';
import './Settings.css';

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

function Settings() {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'America/New_York',
    emailUpdates: true,
    pushUpdates: true,
    darkMode: 'system',
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving user settings:', settings);
    // Typically make API call here
  };

  return (
    <div className="settings-page-wrapper">
      <div className="settings-container">
        {/* Page Header */}
        <div className="settings-page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your personal preferences and account settings</p>
          </div>
          <button onClick={handleSave} className="save-button">Save Changes</button>
        </div>

        <div className="settings-grid">
          {/* Appearance Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Appearance</h2>
            <div className="settings-card-content">
              <SettingRow label="Theme" description="Choose a light, dark, or system default theme.">
                <select value={settings.darkMode} onChange={e => handleChange('darkMode', e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </SettingRow>
            </div>
          </div>

          {/* Localization Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Localization</h2>
            <div className="settings-card-content">
              <SettingRow label="Language" description="Select your preferred language.">
                <select value={settings.language} onChange={e => handleChange('language', e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </SettingRow>
              <SettingRow label="Timezone" description="Choose your timezone.">
                <select value={settings.timezone} onChange={e => handleChange('timezone', e.target.value)}>
                  <option value="America/New_York">ET (UTC-5)</option>
                  <option value="America/Chicago">CT (UTC-6)</option>
                  <option value="America/Denver">MT (UTC-7)</option>
                  <option value="America/Los_Angeles">PT (UTC-8)</option>
                </select>
              </SettingRow>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="settings-card">
            <h2 className="settings-card-header">Notifications</h2>
            <div className="settings-card-content">
              <SettingRow label="Email Updates" description="Receive updates and alerts via email.">
                <label className="switch">
                  <input type="checkbox" checked={settings.emailUpdates} onChange={e => handleChange('emailUpdates', e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </SettingRow>
              <SettingRow label="Push Notifications" description="Get instant push notifications in your browser.">
                <label className="switch">
                  <input type="checkbox" checked={settings.pushUpdates} onChange={e => handleChange('pushUpdates', e.target.checked)} />
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

export default Settings; 