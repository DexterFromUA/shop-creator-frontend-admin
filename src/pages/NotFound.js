import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  // Проверяем, находимся ли внутри стора (с Layout и хедером)
  const isInsideStore = location.pathname.startsWith('/store/');
  const cardHeight = isInsideStore ? '65vh' : '80vh';

  return (
    <div
      style={{
        background: 'var(--color-bg-secondary)',
        minHeight: '100vh',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Title - outside card */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Страница не найдена 🔍
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            К сожалению, запрашиваемая страница не существует или была перемещена
          </p>
        </div>

        {/* Content card */}
        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 28,
            boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
            height: cardHeight,
            overflowY: 'auto',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* 404 Icon */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(91, 33, 182, 0.1)',
                color: '#5b21b6',
                fontSize: 48,
                fontWeight: 700,
                margin: '0 auto 24px auto',
              }}
            >
              404
            </div>

            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              Что-то пошло не так
            </h2>

            <p
              style={{
                margin: '0 0 32px 0',
                fontSize: 16,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              Эта страница была перемещена, удалена или возможно вы ввели неправильный адрес
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={goBack}
                style={{
                  padding: '14px 28px',
                  borderRadius: 16,
                  border: 'none',
                  background: '#111827',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#374151';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#111827';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ← Назад
              </button>

              <Link
                to="/stores"
                style={{
                  padding: '14px 28px',
                  borderRadius: 16,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--color-bg-secondary)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-bg)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🏠 На главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
