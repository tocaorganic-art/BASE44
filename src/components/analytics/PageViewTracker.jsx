import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Log page view para analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      });
    }

    // Log customizado para debug
    console.log('Page view:', location.pathname);
  }, [location]);

  return null;
}