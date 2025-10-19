import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Conexão restaurada!', {
        icon: <Wifi className="w-4 h-4" />,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Você está offline', {
        icon: <WifiOff className="w-4 h-4" />,
        description: 'Algumas funcionalidades podem não funcionar.',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
      <WifiOff className="w-5 h-5" />
      <span className="text-sm font-medium">Sem conexão</span>
    </div>
  );
}