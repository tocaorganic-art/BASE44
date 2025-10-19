import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PushOptIn() {
  const [notificationSettings, setNotificationSettings] = useState({
    orders: true,
    agenda: true,
    support: false,
    marketing: false,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load saved preferences
    const saved = localStorage.getItem('notification_preferences');
    if (saved) {
      setNotificationSettings(JSON.parse(saved));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notificações não são suportadas neste navegador.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('Notificações ativadas com sucesso!', {
          description: 'Você receberá alertas importantes sobre seus pedidos e agenda.',
        });
        
        // Register service worker for push notifications (Firebase integration would go here)
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado:', registration);
        }
      } else {
        toast.error('Permissão negada', {
          description: 'Você pode ativar notificações nas configurações do navegador.',
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast.error('Erro ao ativar notificações.');
    }
  };

  const handleToggle = (channel) => {
    const newSettings = {
      ...notificationSettings,
      [channel]: !notificationSettings[channel],
    };
    setNotificationSettings(newSettings);
    localStorage.setItem('notification_preferences', JSON.stringify(newSettings));
    
    toast.success('Preferências atualizadas!');
  };

  const channelLabels = {
    orders: {
      title: 'Novos Pedidos',
      description: 'Receba alertas quando um cliente solicitar seus serviços',
    },
    agenda: {
      title: 'Lembretes de Agenda',
      description: 'Notificações sobre compromissos próximos',
    },
    support: {
      title: 'Suporte',
      description: 'Atualizações sobre seus tickets de suporte',
    },
    marketing: {
      title: 'Novidades e Promoções',
      description: 'Dicas, novidades da plataforma e ofertas especiais',
    },
  };

  if (!isSupported) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <BellOff className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-sm text-yellow-800">
            Seu navegador não suporta notificações push.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notificações Push
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === 'default' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-3">
              Ative as notificações para receber alertas importantes em tempo real, mesmo quando não estiver usando o app.
            </p>
            <Button onClick={requestPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Ativar Notificações
            </Button>
          </div>
        )}

        {permission === 'granted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-900">Notificações ativadas com sucesso!</p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900 mb-2">
              Notificações bloqueadas. Para ativar:
            </p>
            <ol className="text-xs text-red-800 list-decimal list-inside space-y-1">
              <li>Clique no ícone de cadeado ao lado da URL</li>
              <li>Encontre "Notificações" nas permissões</li>
              <li>Selecione "Permitir"</li>
              <li>Recarregue a página</li>
            </ol>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-700">Personalize suas notificações:</h3>
            {Object.entries(channelLabels).map(([channel, { title, description }]) => (
              <div key={channel} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={channel} className="text-sm font-medium cursor-pointer">
                    {title}
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">{description}</p>
                </div>
                <Switch
                  id={channel}
                  checked={notificationSettings[channel]}
                  onCheckedChange={() => handleToggle(channel)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}