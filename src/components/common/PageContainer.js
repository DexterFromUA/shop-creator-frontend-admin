import React from 'react';

const fadeInStyle = {
  animation: 'pageFadeIn 0.5s cubic-bezier(0.4,0,0.2,1)',
};

const PageContainer = ({
  title,
  description,
  isCenteredContent,
  RightContent = null,
  LeftComponent = null,
  minHeight = 'auto',
  removeBottomSpace,
  removeBorderSpace,
  loading,
  loadingText,
  fixedSize,
  children,
  error,
  errorDescription,
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
      marginBottom: 24,
      padding: 32,
      ...fadeInStyle,
    };

    if (!fixedSize) {
      cardStyles.minHeight = minHeight;
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

    if (removeBottomSpace) {
      cardStyles.marginBottom = 0;
    }

    if (removeBorderSpace) {
      cardStyles.padding = 0;
    }

    return cardStyles;
  };

  return (
    <>
      {/* Page Header */}
      {(title || description || LeftComponent || RightContent || error) && (
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            marginLeft: 16,
          }}
        >
          <div>
            {(LeftComponent || title) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginBottom: description ? 8 : 0,
                }}
              >
                {LeftComponent && <div>{LeftComponent}</div>}
                {(error || title) && (
                  <h1
                    style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}
                  >
                    {(error && 'Error') || title}
                  </h1>
                )}
              </div>
            )}
            {(errorDescription || description) && (
              <p style={{ margin: '0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
                {errorDescription || description}
              </p>
            )}
          </div>
          {RightContent && (
            <div style={{ marginRight: 16, alignSelf: 'flex-end' }}>{RightContent}</div>
          )}
        </div>
      )}

      {/* Main Content Card */}
      <div style={getCardStyles()}>
        {error && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
                {'There is no item. Check the link and try again'}
              </p>
            </div>
          </div>
        )}
        {loading && !error && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #111827',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }}
              ></div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
                {loadingText || 'Loading your data...'}
              </p>
            </div>
          </div>
        )}
        {!loading && !error && children}
      </div>
    </>
  );
};

export default PageContainer;
