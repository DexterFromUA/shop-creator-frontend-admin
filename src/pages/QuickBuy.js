import React from 'react';
import { useParams } from 'react-router-dom';

import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import { orderService, productService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import './Dashboard.css';

const StoreSelection = () => {
  const { code } = useParams();
  const { addToast } = useToast();

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [quantities, setQuantities] = React.useState({ [data?.product?.productOptions[0].id]: 1 });
  const [submitting, setSubmitting] = React.useState(false);
  const [completedOrder, setCompletedOrder] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    country: 'Ukraine',
    city: '',
    street: '',
    note: '',
  });

  React.useEffect(() => {
    const loadLink = async () => {
      try {
        const response = await productService.getShortLink(code);
        if (response) {
          setData({ ...response });
        }
      } catch (error) {
        setError({ error: true, message: 'Wrong short link' });
      } finally {
        setLoading(false);
      }
    };

    loadLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectOption = (option) => {
    const isSelected = selectedOptions.includes(option);

    if (!isSelected) {
      setSelectedOptions((prev) => [...prev, option]);
      setQuantities((prev) => ({ ...prev, [option]: 1 }));
    } else {
      setSelectedOptions((prev) => [...prev.filter((el) => el !== option)]);
      setQuantities((prev) => ({ ...prev, [option]: null }));
    }
  };

  const handleChangeQuantity = (option, value) => {
    setQuantities((prev) => ({ ...prev, [option]: Math.max(1, value) }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const priceWithDiscount = (index) => {
    if (data?.product?.productOptions?.length > 0) {
      const price = data.product.productOptions[index].price;
      const discount = data.product.productOptions[index].discountPercent;

      return price - price * (discount / 100);
    }

    return 0;
  };

  const calculateTotalPrice = () => {
    return getSelectedOptionIds().reduce((sum, optionId) => {
      const index = data.product.productOptions.findIndex((o) => o.id === optionId);
      const option = data.product.productOptions[index];
      if (!option) return sum;

      const actualPrice = option.isDiscount ? priceWithDiscount(index) : option.price;
      const qty = quantities[optionId] || 1;

      return sum + actualPrice * qty;
    }, 0);
  };

  const getSelectedOptionIds = () => {
    if (!data?.product?.productOptions?.length) return [];
    if (data.product.productOptions.length === 1) return [data.product.productOptions[0].id];
    return selectedOptions;
  };

  const getOrderItems = () => {
    return getSelectedOptionIds().map((optionId) => ({
      productOptionId: optionId,
      quantity: quantities[optionId] || 1,
    }));
  };

  const validateOrder = () => {
    if (!getSelectedOptionIds().length) {
      return 'Select at least one option';
    }

    for (const optionId of getSelectedOptionIds()) {
      const option = data.product.productOptions.find((item) => item.id === optionId);
      const quantity = quantities[optionId] || 1;

      if (option?.isLimited && !option?.isPreOrder && quantity > option.quantity) {
        return `${option.name || 'Selected option'} has only ${option.quantity} in stock`;
      }
    }

    if (!formData.name.trim()) return 'Full name is required';
    if (!formData.phone.trim()) return 'Phone is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.street.trim()) return 'Street address / branch is required';

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateOrder();
    if (validationError) {
      addToast(validationError, 'error');
      return;
    }

    try {
      setSubmitting(true);
      const order = await orderService.createQuickBuyOrder({
        code,
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim() || null,
        customerPhone: formData.phone.trim(),
        deliveryCountry: formData.country.trim() || null,
        deliveryCity: formData.city.trim(),
        deliveryAddress: formData.street.trim(),
        note: formData.note.trim() || null,
        items: getOrderItems(),
      });

      setCompletedOrder(order);
      addToast('Order created. Payment is mocked for now.', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-border)',
    borderRadius: 12,
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <>
      {completedOrder && (
        <PageContainer title="Order Confirmed" description="Payment is mocked for now.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
              Order #{completedOrder.id.slice(0, 8)}
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              We received your order and marked it as paid with a mock payment.
            </div>
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {completedOrder.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: 14,
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.productName}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {item.optionName || 'Default'} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatPrice(item.lineTotal)}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span>{formatPrice(completedOrder.totalPrice)}</span>
            </div>
          </div>
        </PageContainer>
      )}

      {!completedOrder && (
        <>
          <PageContainer
            title={'Quick Buy'}
            description={'Review the product details before checking out.'}
            loading={loading || !data?.product}
            error={error?.error || ''}
            errorDescription={error?.message || ''}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 18,
                  padding: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: 'var(--color-bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {data?.product?.imgUrls.length > 0 ? (
                    <img
                      src={process.env.REACT_APP_STORAGE_BACKEND_URL + data.product.imgUrls[0]}
                      alt={`Thumbnail ${data.product.imgUrls[0] + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 6,
                        display: 'block',
                      }}
                    />
                  ) : (
                    '📦'
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--color-text)',
                    }}
                  >
                    {data?.product?.name || 'No product name'}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    {data?.product?.description || ''}
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  {data?.product?.productOptions?.length === 1 ? (
                    <>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          marginBottom: 4,
                        }}
                      >
                        Price per item
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: data?.product?.productOptions[0]?.isDiscount
                            ? 'var(--color-text-secondary)'
                            : '#a78bfa',
                          textDecoration: data?.product?.productOptions[0]?.isDiscount
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {formatPrice(data.product.productOptions[0].price)}
                      </div>
                      {data?.product?.productOptions[0]?.isDiscount && (
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: '#a78bfa',
                          }}
                        >
                          {formatPrice(priceWithDiscount(0))}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 4,
                          alignItems: 'center',
                          marginTop: 20,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                          Qty:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={
                            data?.product?.productOptions[0]?.isLimited &&
                            !data?.product?.productOptions[0]?.isPreOrder
                              ? data?.product?.productOptions[0]?.quantity
                              : undefined
                          }
                          value={quantities[data?.product?.productOptions[0].id] || 1}
                          onChange={(e) =>
                            handleChangeQuantity(
                              data?.product?.productOptions[0].id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          style={{
                            ...inputStyle,
                            padding: '6px 10px',
                            borderRadius: 8,
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          marginBottom: 4,
                        }}
                      >
                        Total Price
                      </div>

                      <div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>
                        {formatPrice(calculateTotalPrice() || 0)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {data?.product?.productOptions?.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Select Options:
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(calc(33% - 13px), 1fr))',
                      gap: 16,
                      width: '100%',
                    }}
                  >
                    {data.product.productOptions.map((option, index) => {
                      const isSelected = selectedOptions.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleSelectOption(option.id)}
                          style={{
                            background: 'var(--color-bg-secondary)',
                            border: isSelected
                              ? '2px solid black'
                              : '2px dashed var(--color-border)',
                            borderRadius: 14,
                            padding: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 12,
                            cursor: 'pointer',
                            position: 'relative',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            {/* <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ cursor: 'pointer', marginTop: 3 }}
                        /> */}
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: 'var(--color-text)',
                                }}
                              >
                                {option.name}
                              </div>
                              {option.description && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: 'var(--color-text-secondary)',
                                    marginTop: 2,
                                  }}
                                >
                                  {option.description}
                                </div>
                              )}
                            </div>

                            <div style={{ flex: 1, textAlign: 'end' }}>
                              {option.isPreOrder && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#f59e0b',
                                    background: '#f59e0b20',
                                    padding: '2px 6px',
                                    borderRadius: 6,
                                    alignSelf: 'flex-end',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Pre-Order Only
                                </div>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 8,
                                  marginTop: 'auto',
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 700,
                                      color: option.isDiscount
                                        ? 'var(--color-text-secondary)'
                                        : '#a78bfa',
                                      textDecoration: option.isDiscount ? 'line-through' : 'none',
                                    }}
                                  >
                                    {formatPrice(option.price)}
                                  </span>

                                  {option.isDiscount && (
                                    <span
                                      style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: '#a78bfa',
                                        marginLeft: 8,
                                      }}
                                    >
                                      {formatPrice(priceWithDiscount(index))}
                                    </span>
                                  )}
                                </div>

                                {isSelected && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: 4,
                                      alignItems: 'center',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <label
                                      style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}
                                    >
                                      Qty:
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max={
                                        option.isLimited && !option.isPreOrder
                                          ? option.quantity
                                          : undefined
                                      }
                                      value={quantities[option.id] || 1}
                                      onChange={(e) =>
                                        handleChangeQuantity(
                                          option.id,
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      style={{
                                        ...inputStyle,
                                        padding: '6px 10px',
                                        borderRadius: 8,
                                        textAlign: 'center',
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </PageContainer>

          {!error && (
            <PageContainer description={'Ship and card details'}>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 32,
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '2px dashed var(--color-border)',
                      borderRadius: 18,
                      padding: 32,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleFormChange}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <label
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <label
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+380..."
                          value={formData.phone}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <label
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          required
                          placeholder="Ukraine"
                          value={formData.country}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <label
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          City / Town
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          placeholder="Kryvyi Rih"
                          value={formData.city}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Street Address / Branch
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        placeholder="Почтовое отделение / пр. Почтовый, 12"
                        value={formData.street}
                        onChange={handleFormChange}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Note
                      </label>
                      <input
                        type="text"
                        name="note"
                        placeholder="Optional order note"
                        value={formData.note}
                        onChange={handleFormChange}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '2px solid var(--color-border)',
                      borderRadius: 18,
                      padding: 32,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Кнопка Apple Pay / Google Pay */}
                    <button
                      type="button"
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'opacity 0.2s',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      Pay with Apple Pay / Google Pay
                    </button>

                    {/* Разделитель */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'var(--color-text-secondary)',
                        fontSize: 12,
                      }}
                    >
                      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                      <span>OR PAY WITH CARD</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                    </div>

                    {/* Поля карты */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          maxLength="19"
                          placeholder="4444 4444 4444 4444"
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            maxLength="5"
                            placeholder="MM/YY"
                            style={{ ...inputStyle, textAlign: 'center' }}
                          />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="•••"
                            style={{ ...inputStyle, textAlign: 'center' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Итоговая сумма */}
                    <div
                      style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: 16,
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                        Total Amount:
                      </span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>
                        {formatPrice(calculateTotalPrice() || 0)}
                      </span>
                    </div>

                    {/* Главная кнопка сабмита */}
                    <Button
                      filled
                      type="submit"
                      disabled={submitting}
                      style={{ width: '100%', marginTop: 8 }}
                    >
                      {submitting
                        ? 'Processing...'
                        : `Mock Pay ${formatPrice(calculateTotalPrice() || 0)}`}
                    </Button>
                  </div>
                </div>
              </form>
            </PageContainer>
          )}
        </>
      )}
    </>
  );
};

export default StoreSelection;
