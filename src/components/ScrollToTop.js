import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Сбрасываем скролл немедленно
    window.scrollTo(0, 0);
    
    // Дополнительный сброс после рендера с небольшой задержкой
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      
      // Также сбрасываем скролл для всех элементов с overflow
      const scrollableElements = document.querySelectorAll('.layout, .main-content, .dashboard > div, [class*="scrollable"]');
      scrollableElements.forEach(element => {
        if (element.scrollTo) {
          element.scrollTo(0, 0);
        }
        element.scrollTop = 0;
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 