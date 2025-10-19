import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';

export default function AccessLogger() {
  const location = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user) {
      const accessLog = {
        user_email: user.email,
        user_id: user.id,
        page: location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
      };

      console.log('📊 Access Log:', accessLog);

      // Em produção, enviaria para um serviço de analytics
      // fetch('/api/analytics/log', { method: 'POST', body: JSON.stringify(accessLog) });
    }
  }, [location.pathname, user]);

  return null;
}