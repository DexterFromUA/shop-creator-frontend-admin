import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StoreContext = createContext(null);

// Mock function - в реальном приложении это будет GraphQL запрос
const fetchStoreById = async (storeId) => {
  // Симулируем задержку API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockStores = [
    {
      id: '1',
      name: 'Tech Store',
      description: 'Electronics and gadgets store',
      role: 'OWNER',
      productsCount: 45,
      ordersCount: 123,
      revenue: '$12,540'
    },
    {
      id: '2', 
      name: 'Fashion Boutique',
      description: 'Clothing and accessories',
      role: 'MANAGER',
      productsCount: 89,
      ordersCount: 67,
      revenue: '$8,320'
    },
    {
      id: '3',
      name: 'Home & Garden',
      description: 'Furniture and home decor',
      role: 'OWNER',
      productsCount: 156,
      ordersCount: 234,
      revenue: '$24,870'
    },
    {
      id: '4',
      name: 'Sports World',
      description: 'Athletic gear and equipment',
      role: 'MANAGER',
      productsCount: 78,
      ordersCount: 145,
      revenue: '$15,720'
    },
    {
      id: '5',
      name: 'Book Corner',
      description: 'Books and educational materials',
      role: 'OWNER',
      productsCount: 234,
      ordersCount: 89,
      revenue: '$6,450'
    },
    {
      id: '6',
      name: 'Beauty Shop',
      description: 'Cosmetics and skincare products',
      role: 'COURIER',
      productsCount: 112,
      ordersCount: 298,
      revenue: '$18,960'
    },
    {
      id: '7',
      name: 'Pet Paradise',
      description: 'Pet supplies and accessories',
      role: 'MANAGER',
      productsCount: 67,
      ordersCount: 156,
      revenue: '$9,830'
    },
    {
      id: '8',
      name: 'Kitchen Pro',
      description: 'Kitchen appliances and cookware',
      role: 'OWNER',
      productsCount: 143,
      ordersCount: 187,
      revenue: '$21,340'
    }
  ];
  
  const store = mockStores.find(s => s.id === storeId);
  if (!store) {
    throw new Error('Store not found');
  }
  
  return store;
};

export const StoreProvider = ({ children }) => {
  const { storeId } = useParams();
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) {
      setCurrentStore(null);
      return;
    }

    const loadStore = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const store = await fetchStoreById(storeId);
        setCurrentStore(store);
      } catch (err) {
        setError(err.message);
        setCurrentStore(null);
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ 
      currentStore, 
      loading, 
      error,
      storeId
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