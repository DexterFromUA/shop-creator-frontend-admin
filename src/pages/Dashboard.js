import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const chartData = [32000, 37000, 29000, 41000, 42890, 39000];
const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const Dashboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState(() => {
    return localStorage.getItem('dashboardPeriod') || '24h';
  });

  useEffect(() => {
    localStorage.setItem('dashboardPeriod', period);
  }, [period]);

  // SVG chart dimensions
  const width = 900; // make chart wide for 100% fill
  const height = 180;
  const padding = 40;
  const maxY = Math.max(...chartData) * 1.1;
  const minY = Math.min(...chartData) * 0.95;
  const points = chartData.map((v, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
    const y = height - padding - ((v - minY) / (maxY - minY)) * (height - 2 * padding);
    return [x, y];
  });
  const areaPath = `M${points[0][0]},${height - padding} ` +
    points.map(([x, y]) => `L${x},${y}`).join(' ') +
    ` L${points[points.length - 1][0]},${height - padding} Z`;
  const linePath = `M${points.map(([x, y]) => `${x},${y}`).join(' L')}`;

  const statCards = [
    { icon: '📦', title: 'Total Products', value: '2,614', color: 'purple' },
    { icon: '🚚', title: 'Deliveries Today', value: '126', color: 'blue' },
    { icon: '💰', title: 'Monthly Revenue', value: '$42,890', color: 'green' },
    { icon: '👤', title: 'New Users', value: '749', color: 'pink' },
  ];

  const statCardColors = {
    purple: { bg: 'rgba(91, 33, 182, 0.1)', text: '#5b21b6' },
    blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    pink: { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899' },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '👋' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const periodText = {
    '24h': 'today',
    'week': 'this week',
    'month': 'this month',
    '3mon': 'the last 3 months',
    '6mon': 'the last 6 months',
    'year': 'this year'
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              {(() => {
                const g = getGreeting();
                const name = user && user.name.split(' ')[0];
                return `${g.text}${name ? ', ' + name : ''}! ${g.emoji}`;
              })()}
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
              Here&rsquo;s what&rsquo;s happening with your shop {periodText[period]}
            </p>
          </div>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              padding: '0.7rem 2.5rem 0.7rem 1rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontSize: 15,
              fontWeight: 500,
              minWidth: 140,
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '18px'
            }}
          >
            <option value="24h">24 hours</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="3mon">3 months</option>
            <option value="6mon">6 months</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {statCards.map(card => (
            <div key={card.title} style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: statCardColors[card.color].bg,
                color: statCardColors[card.color].text,
                fontSize: 28
              }}>
                {card.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{card.title}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 32, marginTop: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Revenue</h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--color-accent)', borderRadius: '50%' }}></div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Last 6 Months</span>
            </div>
          </div>
          <div style={{
            width: '100%',
            height: 180,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
              <g>
                {Array.from({ length: 5 }).map((_, i) => {
                  const y = padding + (i * (height - 2 * padding) / 4);
                  return (
                    <line
                      key={i}
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke="var(--color-bg-secondary)"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>
              <path d={areaPath} fill="url(#chartGradient)" stroke="none" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map(([x, y], i) => (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={6}
                    fill="var(--color-bg)"
                    stroke="var(--color-accent)"
                    strokeWidth="3"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={3}
                    fill="var(--color-accent)"
                  />
                </g>
              ))}
              {points.map(([x], i) => (
                <text
                  key={i}
                  x={x}
                  y={height - 15}
                  textAnchor="middle"
                  fontSize="13"
                  fill="var(--color-text-secondary)"
                  style={{ userSelect: 'none' }}
                >
                  {chartLabels[i]}
                </text>
              ))}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 