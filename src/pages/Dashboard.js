import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const chartData = [32000, 37000, 29000, 41000, 42890, 39000];
const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const Dashboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('24h');

  const handleRefresh = () => {
    // Implement refresh logic here
    console.log('Refreshing dashboard...');
  };

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

  return (
    <div className="dashboard" style={{ padding: 0 }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px' }}>
          <h1 className="dashboard-header">Dashboard</h1>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              padding: '0.75rem 2.5rem 0.75rem 1rem',
              borderRadius: 12,
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.2em',
              minWidth: 110,
              boxShadow: 'none',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <option value="24h">24 hours</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div style={{ padding: '0 16px 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="dashboard-card dashboard-card--dashboard stat-purple">
              <div className="card-icon">📦</div>
              <h3>Total Products</h3>
              <p className="card-value">2,614</p>
            </div>
            <div className="dashboard-card dashboard-card--dashboard stat-blue">
              <div className="card-icon">🚚</div>
              <h3>Deliveries Today</h3>
              <p className="card-value">126</p>
            </div>
            <div className="dashboard-card dashboard-card--dashboard stat-green">
              <div className="card-icon">💰</div>
              <h3>Monthly Revenue</h3>
              <p className="card-value">$42,890</p>
            </div>
            <div className="dashboard-card dashboard-card--dashboard stat-pink">
              <div className="card-icon">👤</div>
              <h3>New Users</h3>
              <p className="card-value">749</p>
            </div>
          </div>

          <div className="dashboard-card" style={{ marginTop: 24 }}>
            <div className="chart-header">
              <h2 className="chart-title">Revenue – Last 6 Months</h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  background: 'var(--color-accent)',
                  borderRadius: '50%' 
                }}></div>
                <span style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem'
                }}>Monthly Revenue</span>
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
                {/* Grid lines */}
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
                        stroke="var(--color-border)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                </g>
                {/* Area fill */}
                <path d={areaPath} fill="url(#chartGradient)" stroke="none" />
                {/* Line */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="var(--color-accent)" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots */}
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
                {/* X axis labels */}
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
                {/* Y axis min/max */}
                <text 
                  x={padding - 10} 
                  y={height - padding} 
                  textAnchor="end" 
                  fontSize="12" 
                  fill="var(--color-text-secondary)"
                  style={{ userSelect: 'none' }}
                >
                  ${minY.toLocaleString()}
                </text>
                <text 
                  x={padding - 10} 
                  y={padding + 5} 
                  textAnchor="end" 
                  fontSize="12" 
                  fill="var(--color-text-secondary)"
                  style={{ userSelect: 'none' }}
                >
                  ${maxY.toLocaleString()}
                </text>
                {/* Gradient */}
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
    </div>
  );
};

export default Dashboard; 