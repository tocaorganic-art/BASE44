import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Trash2, RefreshCw, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

export default function CacheManager() {
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    itemCount: 0,
  });

  const calculateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setCacheStats({
        size: ((estimate.usage || 0) / 1024 / 1024).toFixed(2),
        itemCount: Object.keys(localStorage).length,
      });
    }
  };

  React.useEffect(() => {
    calculateCacheSize();
  }, []);

  const clearCache = async () => {
    try {
      // Clear localStorage (except essential items)
      const essentialKeys = ['auth_token', 'user_preferences'];
      Object.keys(localStorage).forEach(key => {
        if (!essentialKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      await calculateCacheSize();
      toast.success('Cache limpo com sucesso!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Erro ao limpar cache');
    }
  };

  const optimizeCache = () => {
    try {
      // Remove old items from localStorage
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      Object.keys(localStorage).forEach(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item && item.timestamp && (now - item.timestamp > maxAge)) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Not a timestamped item, skip
        }
      });

      calculateCacheSize();
      toast.success('Cache otimizado!');
    } catch (error) {
      console.error('Error optimizing cache:', error);
      toast.error('Erro ao otimizar cache');
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="w-5 h-5 text-blue-600" />
          Gerenciador de Cache
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <HardDrive className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <p className="text-2xl font-bold">{cacheStats.size} MB</p>
              <p className="text-xs text-slate-500">Espaço Usado</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <p className="text-2xl font-bold">{cacheStats.itemCount}</p>
              <p className="text-xs text-slate-500">Itens em Cache</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={optimizeCache}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Otimizar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={clearCache}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Cache
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            ℹ️ Limpar o cache pode melhorar o desempenho, mas você precisará recarregar alguns dados.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}