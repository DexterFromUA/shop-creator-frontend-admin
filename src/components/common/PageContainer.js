import React from 'react';

const PageContainer = ({ 
  title,
  description,
  isStretch = false,
  withPadding = true,
  isCenteredContent = false,
  HeaderCard = null,
  RightContent = null,
  withHeader = false,
  minHeight = '80vh',
  children
}) => {
  // Определяем высоту карточки
  const getCardHeight = () => {
    if (isStretch) {
      return minHeight;
    }
    let baseHeight = withHeader ? '70vh' : '80vh';
    if (HeaderCard) {
      baseHeight = withHeader ? '50vh' : '60vh';
    }
    return baseHeight;
  };

  // Стили для контента внутри карточки
  const getContentStyles = () => {
    const baseStyles = {
      width: '100%'
    };

    if (withPadding) {
      baseStyles.padding = 15;
    }

    if (isCenteredContent && !isStretch) {
      baseStyles.textAlign = 'center';
    }

    return baseStyles;
  };

  // Стили для карточки
  const getCardStyles = () => {
    const cardStyles = {
      background: 'var(--color-bg)',
      borderRadius: 28,
      boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
      boxSizing: 'border-box'
    };

    if (isStretch) {
      cardStyles.minHeight = getCardHeight();
      if (withPadding) {
        cardStyles.padding = 15;
      }
    } else {
      cardStyles.height = getCardHeight();
      cardStyles.overflowY = 'auto';
      
      if (isCenteredContent) {
        cardStyles.display = 'flex';
        cardStyles.alignItems = 'center';
        cardStyles.overflowY = 'visible';
      }
    }

    return cardStyles;
  };

  return (
    <div style={{ 
      background: 'var(--color-bg-secondary)', 
      minHeight: '100vh', 
      padding: '48px 16px'
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        
        {/* Page Header */}
        {(title || description || RightContent) && (
          <div style={{ 
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              {title && (
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
                  {title}
                </h1>
              )}
              {description && (
                <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
                  {description}
                </p>
              )}
            </div>
            {RightContent && (
              <div>
                {RightContent}
              </div>
            )}
          </div>
        )}

        {/* Header Card (если есть) */}
        {HeaderCard && (
          <div style={{ marginBottom: 24 }}>
            {HeaderCard}
          </div>
        )}

        {/* Main Content Card */}
        <div style={getCardStyles()}>
          {!isStretch && !isCenteredContent ? (
            // Для фиксированной карточки с паддингом внутри
            <div style={getContentStyles()}>
              {children}
            </div>
          ) : (
            // Для растягивающейся карточки или центрированного контента
            <div style={getContentStyles()}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContainer; 