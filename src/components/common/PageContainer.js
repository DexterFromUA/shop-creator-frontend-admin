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
  minHeight = '80vh',
  withBottomSpace = false,
  children
}) => {
  React.useEffect(() => {
    if (!document.getElementById('page-fadein-keyframes')) {
      const style = document.createElement('style');
      style.id = 'page-fadein-keyframes';
      style.innerHTML = `@keyframes pageFadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }`;
      document.head.appendChild(style);
    }
  }, []);

  const getCardStyles = () => {
    const cardStyles = {
      background: 'var(--color-bg)',
      borderRadius: 28,
      boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
      boxSizing: 'border-box',
      width: '100%',
      ...fadeInStyle
    };

    if (isStretch) {
      cardStyles.minHeight = minHeight;
      if (withPadding) {
        cardStyles.padding = 32;
      }
    } else {
      cardStyles.height = minHeight;
      cardStyles.overflowY = 'auto';
      
      if (isCenteredContent) {
        cardStyles.display = 'flex';
        cardStyles.alignItems = 'center';
        cardStyles.overflowY = 'visible';
        cardStyles.textAlign = 'center';
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
        {children}
      </div>
    </>
  );
};

export default PageContainer; 