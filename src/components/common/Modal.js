import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ title = '', children, show, onClose = () => {} }) => {
  return (
    <AnimatePresence>
      {show && (
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
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{
              background: 'var(--color-bg)',
              padding: '24px 32px',
              borderRadius: 24,
              // width: '100%',
              minWidth: 580,
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{title}</h2>
              <button
                onClick={() => onClose()}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
