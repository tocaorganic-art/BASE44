import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let initialToastShown = false;

    function updateOnlineStatus() {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (initialToastShown) {
        if (online) {
          toast.success("Conexão reestabelecida!", {
            icon: <Wifi className="w-4 h-4" />,
          });
        } else {
          toast.warning("Você está offline.", {
            icon: <WifiOff className="w-4 h-4" />,
            description: "Algumas funcionalidades podem estar limitadas.",
            duration: 10000,
          });
        }
      }
      initialToastShown = true;
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) {
    return null; // Não renderiza nada quando online
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900",
      "py-2 px-4 flex items-center justify-center text-sm font-semibold",
      "animate-in slide-in-from-bottom-full duration-500"
    )}>
      <WifiOff className="w-4 h-4 mr-2" />
      <span>Você está offline. Algumas funcionalidades podem estar limitadas.</span>
    </div>
  );
}