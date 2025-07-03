import React from 'react';

/**
 * Reusable Button component.
 *
 * Props:
 *  - filled: boolean (default: false)
 *  - disabled: boolean
 *  - style: custom inline style overrides
 *  - onClick: click handler
 *  - color: string (default: '#111827')
 *  - children: button label / content
 */
const Button = ({
  children,
  filled = false,
  disabled = false,
  color = '#111827',
  style = {},
  ...rest
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    userSelect: 'none',
    textDecoration: 'none',
    transition: 'transform 0.15s ease',
  };

  const variants = {
    primary: {
      background: color,
      color: '#fff',
      padding: '0.7rem 1.2rem',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
    },
    secondary: {
      background: '#fff',
      color: color,
      border: '2px solid #111827',
      padding: '0.7rem 1.2rem',
    },
  };

  const combinedStyle = { ...baseStyles, ...(filled ? variants.primary : variants.secondary), ...style };

  // Interaction state
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);

  let extraStyle = {};
  extraStyle.transform = active ? 'scale(0.96)' : hovered ? 'scale(1.04)' : 'scale(1)';

  if (!filled) {
    extraStyle.background = hovered ? color : '#fff';
    extraStyle.color = hovered ? '#fff' : color;
  }

  return (
    <button
      disabled={disabled}
      style={{ ...combinedStyle, ...extraStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 