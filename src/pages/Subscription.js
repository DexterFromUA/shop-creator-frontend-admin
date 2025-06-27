import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storeService } from '../utils/graphql';
import './Dashboard.css';

const Subscription = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionType || 'BASIC');
  
  // Payment Methods state
  const [cards, setCards] = useState([
    { id: 1, brand: 'Visa', last4: '4242', exp: '09/26' },
    { id: 2, brand: 'Mastercard', last4: '4444', exp: '12/25' }
  ]);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  
  // Invoices state
  const [invoices] = useState([
    { id: 'INV-001', date: '2024-01-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-002', date: '2024-02-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-003', date: '2024-03-15', amount: '$29.99', status: 'due' },
    { id: 'INV-004', date: '2024-04-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-005', date: '2024-05-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-006', date: '2024-06-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-007', date: '2024-07-15', amount: '$99.99', status: 'due' },
    { id: 'INV-008', date: '2024-08-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-009', date: '2024-09-15', amount: '$29.99', status: 'paid' },
    { id: 'INV-010', date: '2024-10-15', amount: '$99.99', status: 'paid' },
    { id: 'INV-011', date: '2024-11-15', amount: '$29.99', status: 'due' },
    { id: 'INV-012', date: '2024-12-15', amount: '$29.99', status: 'paid' }
  ]);

  const plans = [
    {
      id: 'BASIC',
      name: 'Basic Plan',
      price: '$9',
      features: ['Up to 100 products', 'Basic analytics', 'Email support', 'Standard themes']
    },
    {
      id: 'ADVANCED', 
      name: 'Advanced Plan',
      price: '$29',
      popular: true,
      features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Custom themes', 'API access']
    },
    {
      id: 'UNLIMITED',
      name: 'PRO Plan', 
      price: '$99',
      features: ['Everything in Advanced', 'White-label solution', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee']
    }
  ];

  const handlePlanChange = async () => {
    if (selectedPlan === user?.subscriptionType) {
      addToast('You are already on this plan', 'info');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await storeService.updateSubscription(selectedPlan);
      updateUser(updatedUser);
      addToast(`Successfully switched to ${plans.find(p => p.id === selectedPlan)?.name}!`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(parseInt(dateString)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statusStyles = {
    paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    due: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    processing: { bg: 'rgba(250, 204, 21, 0.15)', color: '#f59e0b' }
  };

  useEffect(() => {
    // Переопределяем overflow: hidden из Auth.css чтобы разрешить скролл
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      // Восстанавливаем оригинальные стили при размонтировании
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const planVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={containerVariants}
      style={{ 
        width: '100%',
        minHeight: '100vh',
        background: 'var(--color-bg-secondary)',
        padding: '48px 16px',
        boxSizing: 'border-box'
      }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              Subscription Management
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
              Manage your subscription plan and billing information.
            </p>
          </div>
          <button
            onClick={() => navigate('/stores')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Stores
          </button>
        </div>

        {/* Current Subscription Card */}
        <motion.div 
          variants={cardVariants}
          className="dashboard-card" 
          style={{ 
            background: 'var(--color-bg)', 
            borderRadius: 28, 
            boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
            padding: 32,
            marginBottom: 32,
            boxSizing: 'border-box'
          }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: 18, 
            fontWeight: 600, 
            color: 'var(--color-text)' 
          }}>
            Current Subscription
          </h3>
          
          <div style={{ 
            padding: 24,
            border: '2px solid #22c55e',
            borderRadius: 16,
            background: 'rgba(34, 197, 94, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                {plans.find(p => p.id === user?.subscriptionType)?.name || 'Unknown Plan'}
              </h4>
              <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                <span>Status: {user?.subscriptionActive ? 'Active' : 'Inactive'}</span>
                <span>Started: {formatDate(user?.subscriptionStartDate)}</span>
                <span>Next billing: {formatDate(user?.subscriptionEndDate)}</span>
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>
              {plans.find(p => p.id === user?.subscriptionType)?.price || '$0'}<span style={{ fontSize: 14, fontWeight: 400 }}>/month</span>
            </div>
          </div>
        </motion.div>

        {/* Plans Selection */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 32,
          marginBottom: 32,
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 24px 0', 
            fontSize: 18, 
            fontWeight: 600, 
            color: 'var(--color-text)' 
          }}>
            Choose Your Plan
          </h3>
          
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={planVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                whileTap="whileTap"
                custom={index}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  padding: 24,
                  border: selectedPlan === plan.id ? '2px solid #111827' : '2px solid var(--color-border)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#111827',
                    color: '#fff',
                    fontSize: 12,
                    padding: '4px 12px',
                    borderRadius: 12
                  }}>
                    Popular
                  </div>
                )}
                
                <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>
                  {plan.name}
                </h4>
                
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                  {plan.price}<span style={{ fontSize: 14 }}>/month</span>
                </div>
                
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ marginBottom: 8, fontSize: 14 }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Update Button */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button
              onClick={handlePlanChange}
              disabled={loading}
              style={{
                padding: '12px 32px',
                borderRadius: 12,
                border: 'none',
                background: loading ? '#9ca3af' : '#111827',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {loading ? 'Updating...' : 'Update Subscription'}
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 32,
          marginBottom: 32,
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--color-text)' }}>Payment Methods</h3>
            <button 
              onClick={() => setCardModalOpen(true)} 
              style={{ 
                padding: '8px 16px', 
                borderRadius: 8, 
                background: '#111827', 
                color: '#fff', 
                border: 'none', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer' 
              }}
            >
              + Add Card
            </button>
          </div>
          {cards.length === 0 ? (
            <div style={{ padding: '16px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>No cards added.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cards.map(card => (
                <div key={card.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: 16, 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 12, 
                  background: 'var(--color-bg-secondary)' 
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{card.brand} ending in {card.last4}</div>
                    <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Exp {card.exp}</div>
                  </div>
                  <button 
                    onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: 8, 
                      background: 'var(--color-bg)', 
                      border: '1px solid var(--color-border)', 
                      cursor: 'pointer', 
                      fontSize: 14 
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="dashboard-card" style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
          padding: 0,
          marginBottom: 32,
          boxSizing: 'border-box'
        }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--color-text)' }}>Invoices</h3>
          </div>
          <div style={{ 
            maxHeight: 400, 
            overflowY: 'scroll',
            overflowX: 'hidden',
            border: 'none',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--color-bg)', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}>ID</th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}>Date</th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}>Amount</th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}>Status</th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 16, fontSize: 14, color: 'var(--color-text)' }}>{inv.id}</td>
                    <td style={{ padding: 16, fontSize: 14, color: 'var(--color-text)' }}>{inv.date}</td>
                    <td style={{ padding: 16, fontSize: 14, color: 'var(--color-text)' }}>{inv.amount}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 6, 
                        fontSize: 13, 
                        fontWeight: 600, 
                        background: statusStyles[inv.status].bg, 
                        color: statusStyles[inv.status].color, 
                        textTransform: 'capitalize' 
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>
                      <button style={{ 
                        padding: '6px 12px', 
                        borderRadius: 8, 
                        background: 'var(--color-bg-secondary)', 
                        border: '1px solid var(--color-border)', 
                        cursor: 'pointer', 
                        fontSize: 14 
                      }}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {cardModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000 
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ 
                background: 'var(--color-bg)', 
                padding: '24px 32px', 
                borderRadius: 24, 
                width: '100%', 
                maxWidth: 480 
              }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 22, fontWeight: 700 }}>Add Card</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Card Number</label>
                <input 
                  placeholder="1234 5678 9012 3456" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    border: '1px solid var(--color-border)', 
                    background: 'var(--color-bg-secondary)', 
                    color: 'var(--color-text)', 
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Expiry</label>
                  <input 
                    placeholder="MM/YY" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: 10, 
                      border: '1px solid var(--color-border)', 
                      background: 'var(--color-bg-secondary)', 
                      color: 'var(--color-text)', 
                      fontSize: 15,
                      boxSizing: 'border-box'
                    }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>CVV</label>
                  <input 
                    placeholder="123" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: 10, 
                      border: '1px solid var(--color-border)', 
                      background: 'var(--color-bg-secondary)', 
                      color: 'var(--color-text)', 
                      fontSize: 15,
                      boxSizing: 'border-box'
                    }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button 
                  onClick={() => setCardModalOpen(false)} 
                  style={{ 
                    padding: '12px 20px', 
                    borderRadius: 10, 
                    background: 'var(--color-bg-secondary)', 
                    border: '1px solid var(--color-border)', 
                    color: 'var(--color-text)', 
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const newCard = { id: Date.now(), brand: 'Visa', last4: '1234', exp: '12/26' };
                    setCards([...cards, newCard]);
                    setCardModalOpen(false);
                    addToast('Card added successfully!', 'success');
                  }}
                  style={{ 
                    padding: '12px 20px', 
                    borderRadius: 10, 
                    background: '#111827', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Add Card
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subscription; 