import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '../utils/graphql';
import { useToast } from './ToastContext';

const StoreContext = createContext(null);

const fetchStoreById = async (storeId) => {
  return await storeService.getStore(storeId);
};

export const StoreProvider = ({ children }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshStore = async () => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const store = await fetchStoreById(storeId);
      
      if (!store.isActive) {
        addToast('This store is currently inactive and unavailable', 'error');
        navigate('/stores');
        return;
      }
      
      setCurrentStore(store);
    } catch (err) {
      setError(err.message);
      setCurrentStore(null);
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
    <StoreContext.Provider value={{ 
      currentStore, 
      loading, 
      error,
      storeId,
      refreshStore
    }}>
      {children}
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