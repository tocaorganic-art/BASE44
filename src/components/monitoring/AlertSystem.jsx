import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Monitor for critical errors
    const errorHandler = (event) => {
      if (event.error) {
        toast.error('Erro crítico detectado', {
          description: event.error.message,
          icon: <XCircle className="w-5 h-5" />,
        });
        
        setAlerts(prev => [...prev, {
          type: 'error',
          message: event.error.message,
          timestamp: new Date().toISOString(),
        }]);
      }
    };

    // Monitor performance issues
    const checkPerformance = () => {
      if (performance.memory) {
        const memoryUsage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
        
        if (memoryUsage > 90) {
          toast.warning('Alto uso de memória detectado', {
            description: `${memoryUsage.toFixed(1)}% da memória em uso`,
            icon: <AlertTriangle className="w-5 h-5" />,
          });
        }
      }
    };

    window.addEventListener('error', errorHandler);
    const perfInterval = setInterval(checkPerformance, 30000);

    // Initial success notification
    toast.success('Sistema de alertas ativo', {
      description: 'Monitorando erros e performance em tempo real',
      icon: <CheckCircle2 className="w-5 h-5" />,
    });

    return () => {
      window.removeEventListener('error', errorHandler);
      clearInterval(perfInterval);
    };
  }, []);

  return null; // Componente invisível
}