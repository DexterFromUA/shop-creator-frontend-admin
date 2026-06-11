import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);

      const scrollableElements = document.querySelectorAll(
        '.layout, .main-content, .dashboard > div, [class*="scrollable"]'
      );
      scrollableElements.forEach((element) => {
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
