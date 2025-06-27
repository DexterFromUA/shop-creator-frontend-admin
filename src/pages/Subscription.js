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
  const getUserCard = () => {
    if (user?.paymentCardNumber) {
      const cardNumber = user.paymentCardNumber;
      const lastFour = cardNumber.slice(-4);
      const brand = cardNumber.startsWith('4') ? 'Visa' : 
                   cardNumber.startsWith('5') ? 'Mastercard' : 'Card';
      const exp = `${String(user.paymentCardExpiryMonth).padStart(2, '0')}/${String(user.paymentCardExpiryYear).slice(-2)}`;
      
      return { 
        id: 1, 
        brand, 
        last4: lastFour, 
        exp 
      };
    }
    return null;
  };
  
  const [cards, setCards] = useState(() => {
    const userCard = getUserCard();
    return userCard ? [userCard] : [];
  });
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    paymentCardNumber: '',
    paymentCardHolder: '',
    paymentCardExpiryMonth: '',
    paymentCardExpiryYear: '',
    paymentCardCvv: ''
  });
  const [cardLoading, setCardLoading] = useState(false);
  
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
      price: 'Free',
      features: ['Work in existing stores', 'Manager & courier access', 'Basic analytics', 'Email support', 'Standard themes']
    },
    {
      id: 'ADVANCED', 
      name: 'Advanced Plan',
      price: '$29',
      popular: true,
      features: ['Own 1 store', 'Unlimited products', 'Advanced analytics', 'Priority support', 'Custom themes', 'API access']
    },
    {
      id: 'PRO',
      name: 'PRO Plan', 
      price: '$99',
      features: ['Own up to 3 stores', 'Everything in Advanced', 'White-label solution', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee']
    }
  ];

  // UNLIMITED план скрыт - только для админов, поэтому не включен в plans массив
  const allPlans = [
    ...plans,
    {
      id: 'UNLIMITED',
      name: 'Unlimited Plan',
      price: '$999',
      features: ['Unlimited stores', 'Everything in PRO', 'Admin access', 'Custom development', 'White-glove support']
    }
  ];

  const handlePlanChange = async () => {
    if (selectedPlan === user?.subscriptionType) {
      addToast('You are already on this plan', 'info');
      return;
    }

    // Проверяем наличие карты для платных планов
    if (selectedPlan !== 'BASIC' && cards.length === 0) {
      addToast('Please add a payment card before upgrading to a paid plan', 'error');
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

  // Валидация номера карты (Luhn algorithm)
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    
    // Проверяем, что только цифры и правильная длина
    if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    let sum = 0;
    let alternate = false;
    
    // Проходим справа налево
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let n = parseInt(cleaned.charAt(i), 10);
      
      if (alternate) {
        n *= 2;
        // Если больше 9, вычитаем 9 (это то же самое что складывать цифры)
        if (n > 9) {
          n -= 9;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const handleCardSubmit = async () => {
    // Валидация полей
    if (!cardForm.paymentCardNumber || !cardForm.paymentCardHolder || 
        !cardForm.paymentCardExpiryMonth || !cardForm.paymentCardExpiryYear || 
        !cardForm.paymentCardCvv) {
      addToast('Please fill in all card details', 'error');
      return;
    }

    // Валидация номера карты
    const cleanedNumber = cardForm.paymentCardNumber.replace(/\s/g, '');
    console.log('Validating card number:', cleanedNumber);
    const isValid = validateCardNumber(cleanedNumber);
    console.log('Card validation result:', isValid);
    
    if (!isValid) {
      addToast('Please enter a valid card number', 'error');
      return;
    }

    // Валидация CVV
    if (!/^\d{3,4}$/.test(cardForm.paymentCardCvv)) {
      addToast('CVV must be 3 or 4 digits', 'error');
      return;
    }

    setCardLoading(true);
    try {
      const updatedUser = await storeService.updatePaymentCard({
        paymentCardNumber: cleanedNumber,
        paymentCardHolder: cardForm.paymentCardHolder,
        paymentCardExpiryMonth: parseInt(cardForm.paymentCardExpiryMonth),
        paymentCardExpiryYear: parseInt(cardForm.paymentCardExpiryYear),
        paymentCardCvv: cardForm.paymentCardCvv
      });
      
      updateUser(updatedUser);
      setCardModalOpen(false);
      setCardForm({
        paymentCardNumber: '',
        paymentCardHolder: '',
        paymentCardExpiryMonth: '',
        paymentCardExpiryYear: '',
        paymentCardCvv: ''
      });
      addToast('Card added successfully!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to add card', 'error');
    } finally {
      setCardLoading(false);
    }
  };

  const handleRemoveCard = async () => {
    setCardLoading(true);
    try {
      const updatedUser = await storeService.removePaymentCard();
      updateUser(updatedUser);
      addToast('Card removed successfully!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to remove card', 'error');
    } finally {
      setCardLoading(false);
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

  useEffect(() => {
    // Обновляем карты когда изменяется пользователь
    const userCard = getUserCard();
    setCards(userCard ? [userCard] : []);
  }, [user]);

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
                {allPlans.find(p => p.id === user?.subscriptionType)?.name || 'Unknown Plan'}
              </h4>
              <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                <span>Status: {user?.subscriptionActive ? 'Active' : 'Inactive'}</span>
                <span>Started: {formatDate(user?.subscriptionStartDate)}</span>
                <span>Next billing: {formatDate(user?.subscriptionEndDate)}</span>
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>
              {allPlans.find(p => p.id === user?.subscriptionType)?.price || 'Free'}
              {user?.subscriptionType !== 'BASIC' && <span style={{ fontSize: 14, fontWeight: 400 }}>/month</span>}
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
                  {plan.price}{plan.id !== 'BASIC' && <span style={{ fontSize: 14 }}>/month</span>}
                </div>
                
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ marginBottom: 8, fontSize: 14 }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.id !== 'BASIC' && cards.length === 0 && (
                  <div style={{ 
                    marginTop: 12, 
                    padding: '8px 12px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: 6, 
                    fontSize: 12, 
                    color: '#dc2626',
                    fontWeight: 500
                  }}>
                    💳 Card required
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Update Button */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            {selectedPlan !== 'BASIC' && cards.length === 0 && (
              <div style={{ 
                marginBottom: 16, 
                padding: '12px 16px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8, 
                color: '#dc2626', 
                fontSize: 14,
                fontWeight: 500
              }}>
                ⚠️ Add a payment card first to upgrade to a paid plan
              </div>
            )}
            <button
              onClick={handlePlanChange}
              disabled={loading || (selectedPlan !== 'BASIC' && cards.length === 0)}
              style={{
                padding: '12px 32px',
                borderRadius: 12,
                border: 'none',
                background: loading || (selectedPlan !== 'BASIC' && cards.length === 0) ? '#9ca3af' : '#111827',
                color: '#fff',
                cursor: loading || (selectedPlan !== 'BASIC' && cards.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: 16,
                fontWeight: 600,
                opacity: loading || (selectedPlan !== 'BASIC' && cards.length === 0) ? 0.6 : 1
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
            {cards.length === 0 && (
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
            )}
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
                    onClick={handleRemoveCard}
                    disabled={cardLoading}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: 8, 
                      background: 'var(--color-bg)', 
                      border: '1px solid var(--color-border)', 
                      cursor: cardLoading ? 'not-allowed' : 'pointer', 
                      fontSize: 14,
                      opacity: cardLoading ? 0.6 : 1
                    }}
                  >
                    {cardLoading ? 'Removing...' : 'Remove'}
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
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Card Holder Name</label>
                  <input 
                    type="text"
                    value={cardForm.paymentCardHolder}
                    onChange={(e) => {
                      // Разрешаем только буквы, пробелы и дефисы
                      const value = e.target.value.replace(/[^a-zA-Z\s-]/g, '');
                      setCardForm(prev => ({ ...prev, paymentCardHolder: value }));
                    }}
                    placeholder="John Doe" 
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
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Card Number</label>
                <input 
                  type="text"
                  value={cardForm.paymentCardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, '').length <= 19) {
                      setCardForm(prev => ({ ...prev, paymentCardNumber: formatted }));
                    }
                  }}
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
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Expiry Month</label>
                  <select 
                    value={cardForm.paymentCardExpiryMonth}
                    onChange={(e) => setCardForm(prev => ({ ...prev, paymentCardExpiryMonth: e.target.value }))}
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
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {String(i + 1).padStart(2, '0')} - {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Expiry Year</label>
                  <select 
                    value={cardForm.paymentCardExpiryYear}
                    onChange={(e) => setCardForm(prev => ({ ...prev, paymentCardExpiryYear: e.target.value }))}
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
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 11 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>CVV</label>
                  <input 
                    type="text"
                    maxLength="4"
                    value={cardForm.paymentCardCvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Только цифры
                      setCardForm(prev => ({ ...prev, paymentCardCvv: value }));
                    }}
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
                  disabled={cardLoading}
                  style={{ 
                    padding: '12px 20px', 
                    borderRadius: 10, 
                    background: 'var(--color-bg-secondary)', 
                    border: '1px solid var(--color-border)', 
                    color: 'var(--color-text)', 
                    fontWeight: 600,
                    cursor: cardLoading ? 'not-allowed' : 'pointer',
                    opacity: cardLoading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCardSubmit}
                  disabled={cardLoading}
                  style={{ 
                    padding: '12px 20px', 
                    borderRadius: 10, 
                    background: cardLoading ? '#9ca3af' : '#111827', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: 600,
                    cursor: cardLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  {cardLoading && (
                    <div style={{
                      width: 16,
                      height: 16,
                      border: '2px solid #fff3',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  {cardLoading ? 'Adding...' : 'Add Card'}
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