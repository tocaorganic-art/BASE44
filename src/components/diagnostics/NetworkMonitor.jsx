import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, Download, Upload, Globe } from 'lucide-react';

export default function NetworkMonitor() {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
    online: true,
  });

  const [resources, setResources] = useState({
    total: 0,
    scripts: 0,
    stylesheets: 0,
    images: 0,
    fonts: 0,
    other: 0,
    totalSize: 0,
  });

  useEffect(() => {
    // Get network information
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      setNetworkInfo({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
        online: navigator.onLine,
      });

      connection.addEventListener('change', () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
          online: navigator.onLine,
        });
      });
    }

    // Get resource information
    const resourceEntries = performance.getEntriesByType('resource');
    let totalSize = 0;
    const resourceCount = {
      total: resourceEntries.length,
      scripts: 0,
      stylesheets: 0,
      images: 0,
      fonts: 0,
      other: 0,
      totalSize: 0,
    };

    resourceEntries.forEach((entry) => {
      const size = entry.transferSize || 0;
      totalSize += size;

      if (entry.initiatorType === 'script') resourceCount.scripts++;
      else if (entry.initiatorType === 'link' && entry.name.includes('.css')) resourceCount.stylesheets++;
      else if (entry.initiatorType === 'img') resourceCount.images++;
      else if (entry.name.includes('.woff') || entry.name.includes('.ttf')) resourceCount.fonts++;
      else resourceCount.other++;
    });

    resourceCount.totalSize = totalSize;
    setResources(resourceCount);

    console.log('🌐 Network Info:', {
      Type: networkInfo.effectiveType,
      Downlink: `${networkInfo.downlink} Mbps`,
      RTT: `${networkInfo.rtt}ms`,
      Resources: resourceCount.total,
      'Total Size': `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
    });
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getConnectionQuality = (type) => {
    const quality = {
      '4g': { label: 'Excelente', color: 'bg-green-500' },
      '3g': { label: 'Boa', color: 'bg-yellow-500' },
      '2g': { label: 'Lenta', color: 'bg-orange-500' },
      'slow-2g': { label: 'Muito Lenta', color: 'bg-red-500' },
    };
    return quality[type] || { label: 'Desconhecida', color: 'bg-slate-500' };
  };

  const connectionQuality = getConnectionQuality(networkInfo.effectiveType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          Network Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Status da Conexão</span>
            <Badge className={networkInfo.online ? 'bg-green-500' : 'bg-red-500'}>
              {networkInfo.online ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tipo de Conexão</span>
            <Badge className={connectionQuality.color}>
              {networkInfo.effectiveType.toUpperCase()} - {connectionQuality.label}
            </Badge>
          </div>
        </div>

        {/* Network Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">Downlink</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{networkInfo.downlink} Mbps</p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-900">RTT</span>
            </div>
            <p className="text-lg font-bold text-purple-700">{networkInfo.rtt} ms</p>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Recursos Carregados</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Scripts JS</span>
              <span className="font-mono font-semibold">{resources.scripts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Stylesheets CSS</span>
              <span className="font-mono font-semibold">{resources.stylesheets}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Imagens</span>
              <span className="font-mono font-semibold">{resources.images}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Fontes</span>
              <span className="font-mono font-semibold">{resources.fonts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Outros</span>
              <span className="font-mono font-semibold">{resources.other}</span>
            </div>
            <div className="pt-2 mt-2 border-t flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <div className="text-right">
                <p className="font-mono font-bold text-lg">{resources.total}</p>
                <p className="text-xs text-slate-500">{formatBytes(resources.totalSize)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Saver */}
        {networkInfo.saveData && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-900 font-medium">
              ⚠️ Modo Economia de Dados Ativo
            </p>
            <p className="text-xs text-orange-700 mt-1">
              O usuário solicitou economia de dados. Considere reduzir o uso de recursos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}