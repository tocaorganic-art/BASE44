import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * Analisador de bundle em tempo real
 * Mostra tamanho dos chunks e performance
 */
export default function BundleAnalyzer() {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    chunks: [],
    loadTime: 0,
    cacheHitRate: 0,
  });

  useEffect(() => {
    // Analisa recursos carregados
    const resources = performance.getEntriesByType('resource');
    
    const jsResources = resources.filter(r => r.name.endsWith('.js'));
    const cssResources = resources.filter(r => r.name.endsWith('.css'));
    const imageResources = resources.filter(r => 
      r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/)
    );

    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const avgLoadTime = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;

    // Calcula cache hit rate
    const cachedResources = resources.filter(r => r.transferSize === 0).length;
    const cacheRate = ((cachedResources / resources.length) * 100).toFixed(1);

    setBundleInfo({
      totalSize: (totalSize / 1024 / 1024).toFixed(2), // MB
      chunks: [
        { name: 'JavaScript', count: jsResources.length, size: (jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024).toFixed(2) },
        { name: 'CSS', count: cssResources.length, size: (cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024).toFixed(2) },
        { name: 'Imagens', count: imageResources.length, size: (imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024).toFixed(2) },
      ],
      loadTime: avgLoadTime.toFixed(0),
      cacheHitRate: cacheRate,
    });
  }, []);

  const getBundleSizeStatus = (size) => {
    if (size < 1) return 'success';
    if (size < 3) return 'warning';
    return 'error';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          Bundle Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tamanho Total:</span>
          <Badge variant={getBundleSizeStatus(bundleInfo.totalSize) === 'success' ? 'default' : 'destructive'}>
            {bundleInfo.totalSize} MB
          </Badge>
        </div>

        <div className="space-y-2">
          {bundleInfo.chunks.map(chunk => (
            <div key={chunk.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{chunk.name} ({chunk.count} arquivos)</span>
                <span className="font-mono">{chunk.size} KB</span>
              </div>
              <Progress value={(chunk.size / 500) * 100} className="h-1" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bundleInfo.loadTime}ms</div>
            <div className="text-xs text-slate-600">Tempo Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{bundleInfo.cacheHitRate}%</div>
            <div className="text-xs text-slate-600">Cache Hit Rate</div>
          </div>
        </div>

        {parseFloat(bundleInfo.totalSize) > 2 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-800">
              Bundle acima do recomendado. Considere code-splitting adicional.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}