import React from 'react';

const fadeInStyle = {
  animation: 'pageFadeIn 0.5s cubic-bezier(0.4,0,0.2,1)'
};

const PageContainer = ({ 
  title,
  description,
  isStretch = false,
  withPadding = false,
  isCenteredContent = false,
  RightContent = null,
  withHeader = false,
  minHeight = '80vh',
  withBottomSpace = false,
  children
}) => {
  React.useEffect(() => {
    // Добавляем keyframes только один раз
    if (!document.getElementById('page-fadein-keyframes')) {
      const style = document.createElement('style');
      style.id = 'page-fadein-keyframes';
      style.innerHTML = `@keyframes pageFadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }`;
      document.head.appendChild(style);
    }
  }, []);

  // Определяем высоту карточки
  const getCardHeight = () => {
    if (isStretch) {
      return minHeight;
    }
    let baseHeight = withHeader ? '70vh' : '80vh';
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
      boxSizing: 'border-box',
      ...fadeInStyle
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

    if (withBottomSpace) {
      cardStyles.marginBottom = 32;
    }

    return cardStyles;
  };

  return (
    <>
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

      {/* Main Content Card */}
      <div style={getCardStyles()}>
        {!isStretch && !isCenteredContent ? (
          <div style={getContentStyles()}>
            {children}
          </div>
        ) : (
          <div style={getContentStyles()}>
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default PageContainer; 