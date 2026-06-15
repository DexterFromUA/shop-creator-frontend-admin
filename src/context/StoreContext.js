import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '../utils/graphql';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscriptionCheck = useMemo(() => {
    if (user?.subscriptionType) {
      switch (user.subscriptionType) {
        case 'BASIC':
          return 1;
        case 'ADVANCED':
          return 2;
        case 'PRO':
          return 3;
        case 'UNLIMITED':
          return 10;
        default:
          return 0;
      }
    }

    return 0;
  }, [user]);

  const roleCheck = useCallback(
    (permission) => {
      if (currentStore && currentStore?.permissions?.length) {
        return (
          currentStore.permissions.includes('OWNER') ||
          currentStore.permissions.includes(permission)
        );
      }

      return false;
    },
    [currentStore]
  );

  const refreshStore = async () => {
    if (!storeId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await storeService.getStore(storeId);
      const store = { ...data.store, permissions: [...data.permissions] };

      if (!store.isActive) {
        addToast('This store is currently inactive and unavailable', 'error');
        navigate('/stores');
        return;
      }

      setCurrentStore(store);
    } catch (err) {
      setError(err.message);
      setCurrentStore(null);
      navigate('/stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storeId) {
      setCurrentStore(null);
      return;
    }

    refreshStore();
  }, [storeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        loading,
        error,
        storeId,
        refreshStore,
        subscriptionCheck,
        roleCheck,
      }}
    >
      {currentStore && children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
