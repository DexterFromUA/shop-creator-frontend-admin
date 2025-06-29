import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { appService } from '../utils/graphql';
import './Dashboard.css';

const CreateApp = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { addToast } = useToast();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    iconUrl: '',
    splashScreenUrl: '',
    primaryColor: '#111827',
    secondaryColor: '#6b7280',
    targetPlatforms: ['ANDROID', 'IOS'],
    defaultLanguage: 'en',
    currency: 'USD',
    keywords: '',
    screenshots: ''
  });

  // eslint-disable-next-line no-unused-vars
  const [_, setFiles] = useState({
    icon: null,
    splashScreen: null
  });

  const [filePreviews, setFilePreviews] = useState({
    icon: null,
    splashScreen: null
  });



  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'targetPlatforms') {
      setFormData(prev => {
        const platforms = [...prev.targetPlatforms];
        if (checked) {
          platforms.push(value);
        } else {
          const index = platforms.indexOf(value);
          if (index > -1) {
            platforms.splice(index, 1);
          }
        }
        return { ...prev, targetPlatforms: platforms };
      });
    } else if (name === 'slug') {
      // Автоматически генерируем slug из названия приложения
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, [name]: slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    const slug = value.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: slug
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        addToast('Please select an image file', 'error');
        return;
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size must be less than 5MB', 'error');
        return;
      }

      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));

      // Создаем превью
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreviews(prev => ({
          ...prev,
          [fileType]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
    setFilePreviews(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!storeId) {
      addToast('Store ID is required', 'error');
      navigate('/stores');
      return;
    }
    
    if (!formData.name.trim()) {
      addToast('Please enter an app name', 'error');
      return;
    }

    if (!formData.slug.trim()) {
      addToast('Please enter a unique identifier (slug)', 'error');
      return;
    }

    if (formData.targetPlatforms.length === 0) {
      addToast('Please select at least one target platform', 'error');
      return;
    }

    setLoading(true);

    try {
      // Подготавливаем данные для отправки
      const appData = {
        name: formData.name,
        description: formData.description || null,
        slug: formData.slug,
        // iconUrl: files.icon ? filePreviews.icon : (formData.iconUrl || null),
        // splashScreenUrl: files.splashScreen ? filePreviews.splashScreen : (formData.splashScreenUrl || null),
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        targetPlatforms: formData.targetPlatforms,
        defaultLanguage: formData.defaultLanguage,
        currency: formData.currency,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        screenshots: formData.screenshots ? formData.screenshots.split(',').map(s => s.trim()).filter(s => s) : [],
        storeId: storeId
      };
      
      const newApp = await appService.createApp(appData);
      
      addToast(`App "${newApp.name}" created successfully!`, 'success');
      navigate(`/store/${storeId}/dashboard`, { state: { fromAppPage: true } });
      
    } catch (error) {
      console.error('Error creating app:', error);
      addToast(error.message || 'Failed to create app. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (storeId) {
      navigate(`/store/${storeId}/dashboard`);
    } else {
      navigate('/stores');
    }
  };

  useEffect(() => {
    // Проверяем авторизацию
    if (!isAuthenticated || !currentUser) {
      navigate('/auth');
      return;
    }

    // Проверяем наличие storeId
    if (!storeId) {
      addToast('Please select a store first', 'error');
      navigate('/stores');
    }
  }, [isAuthenticated, currentUser, navigate, storeId, addToast]);

  const platformOptions = [
    { value: 'ANDROID', label: 'Android' },
    { value: 'IOS', label: 'iOS' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Русский' },
    { value: 'uk', label: 'Українська' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'UAH', label: 'Ukrainian Hryvnia (UAH)' },
    { value: 'RUB', label: 'Russian Ruble (RUB)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      padding: '48px 16px',
      boxSizing: 'border-box',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Create Mobile App
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Set up your mobile application with all the necessary configurations and branding.
          </p>
        </div>

        {/* App Creation Form Card */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 32,
          boxSizing: 'border-box'
        }}>
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
                      App Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="Enter your app name"
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
                      Unique Identifier (Slug) *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="unique-app-identifier"
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
                    <small style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                      Auto-generated from app name. Used for app store URLs and identification.
                    </small>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what your app does"
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

              {/* Visual Design */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Visual Design
                </h3>
                
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      App Icon
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'icon')}
                        style={{ display: 'none' }}
                        id="icon-upload"
                      />
                      <label
                        htmlFor="icon-upload"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          border: '2px dashed var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'center',
                          minHeight: 80
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
                        {filePreviews.icon ? (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <img 
                              src={filePreviews.icon} 
                              alt="App icon preview" 
                              style={{ 
                                maxWidth: '80px', 
                                maxHeight: '80px', 
                                borderRadius: 8,
                                objectFit: 'cover'
                              }} 
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile('icon');
                              }}
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
                        ) : (
                          <div style={{ color: 'var(--color-text-secondary)' }}>
                            📱 Click to upload app icon
                            <div style={{ fontSize: 12, marginTop: 4 }}>
                              PNG, JPG up to 5MB
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Splash Screen
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'splashScreen')}
                        style={{ display: 'none' }}
                        id="splash-upload"
                      />
                      <label
                        htmlFor="splash-upload"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          border: '2px dashed var(--color-border)',
                          borderRadius: 12,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'center',
                          minHeight: 80
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
                        {filePreviews.splashScreen ? (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <img 
                              src={filePreviews.splashScreen} 
                              alt="Splash screen preview" 
                              style={{ 
                                maxWidth: '120px', 
                                maxHeight: '80px', 
                                borderRadius: 8,
                                objectFit: 'cover'
                              }} 
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile('splashScreen');
                              }}
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
                        ) : (
                          <div style={{ color: 'var(--color-text-secondary)' }}>
                            🖼️ Click to upload splash screen
                            <div style={{ fontSize: 12, marginTop: 4 }}>
                              PNG, JPG up to 5MB
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Primary Color
                    </label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        style={{
                          width: 48,
                          height: 44,
                          border: '2px solid var(--color-border)',
                          borderRadius: 8,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        placeholder="#111827"
                        style={{
                          flex: 1,
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

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Secondary Color
                    </label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="color"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        style={{
                          width: 48,
                          height: 44,
                          border: '2px solid var(--color-border)',
                          borderRadius: 8,
                          background: 'var(--color-bg-secondary)',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        placeholder="#6b7280"
                        style={{
                          flex: 1,
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
                </div>
              </div>

              {/* Platform & Localization */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Platform & Localization
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
                      Target Platforms *
                    </label>
                    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      {platformOptions.map(platform => (
                        <label key={platform.value} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8,
                          padding: '8px 12px',
                          border: '2px solid var(--color-border)',
                          borderRadius: 8,
                          background: formData.targetPlatforms.includes(platform.value) 
                            ? 'var(--color-bg-secondary)' 
                            : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <input
                            type="checkbox"
                            name="targetPlatforms"
                            value={platform.value}
                            checked={formData.targetPlatforms.includes(platform.value)}
                            onChange={handleInputChange}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: 14, color: 'var(--color-text)' }}>
                            {platform.label}
                          </span>
                        </label>
                      ))}
                    </div>
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
                        Default Language
                      </label>
                      <select
                        name="defaultLanguage"
                        value={formData.defaultLanguage}
                        onChange={handleInputChange}
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
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.value} value={lang.value}>{lang.label}</option>
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
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
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
                      >
                        {currencyOptions.map(currency => (
                          <option key={currency.value} value={currency.value}>{currency.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing & Media */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--color-text)' 
                }}>
                  Marketing & Media
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
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="shopping, ecommerce, mobile, app (separated by commas)"
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
                    <small style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                      Separate keywords with commas. Used for app store optimization.
                    </small>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 8, 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: 'var(--color-text)' 
                    }}>
                      Screenshots URLs
                    </label>
                    <textarea
                      name="screenshots"
                      value={formData.screenshots}
                      onChange={handleInputChange}
                      placeholder="https://example.com/screenshot1.png, https://example.com/screenshot2.png"
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
                    <small style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                      Separate URLs with commas. Used for app store listing.
                    </small>
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
                  {loading ? 'Creating App...' : 'Create App'}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateApp; 