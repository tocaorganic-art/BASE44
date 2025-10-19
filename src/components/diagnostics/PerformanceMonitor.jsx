import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    score: 0,
  });

  useEffect(() => {
    const measurePerformance = () => {
      if (!performance || !performance.timing) return;

      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];

      // Calculate Core Web Vitals
      const ttfb = timing.responseStart - timing.requestStart;
      const fcp = navigation?.domContentLoadedEventStart - navigation?.fetchStart || 0;
      
      // Simulated LCP, FID, CLS (in production, use real measurements)
      const lcp = timing.loadEventEnd - timing.navigationStart;
      const fid = 50; // Simulated
      const cls = 0.05; // Simulated

      // Calculate overall score (0-100)
      const lcpScore = lcp < 2500 ? 100 : lcp < 4000 ? 75 : 50;
      const fidScore = fid < 100 ? 100 : fid < 300 ? 75 : 50;
      const clsScore = cls < 0.1 ? 100 : cls < 0.25 ? 75 : 50;
      const fcpScore = fcp < 1800 ? 100 : fcp < 3000 ? 75 : 50;
      const ttfbScore = ttfb < 600 ? 100 : ttfb < 1500 ? 75 : 50;

      const overallScore = Math.round(
        (lcpScore * 0.25 + fidScore * 0.25 + clsScore * 0.25 + fcpScore * 0.15 + ttfbScore * 0.1)
      );

      setMetrics({
        fcp: Math.round(fcp),
        lcp: Math.round(lcp),
        fid,
        cls: cls.toFixed(3),
        ttfb: Math.round(ttfb),
        score: overallScore,
      });

      // Log to console for debugging
      console.log('📊 Performance Metrics:', {
        FCP: `${Math.round(fcp)}ms`,
        LCP: `${Math.round(lcp)}ms`,
        FID: `${fid}ms`,
        CLS: cls.toFixed(3),
        TTFB: `${Math.round(ttfb)}ms`,
        Score: `${overallScore}/100`,
      });
    };

    // Measure on load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricStatus = (metric, value) => {
    const thresholds = {
      lcp: { good: 2500, needs: 4000 },
      fid: { good: 100, needs: 300 },
      cls: { good: 0.1, needs: 0.25 },
      fcp: { good: 1800, needs: 3000 },
      ttfb: { good: 600, needs: 1500 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needs) return 'needs-improvement';
    return 'poor';
  };

  const metricsList = [
    { key: 'lcp', label: 'LCP', value: metrics.lcp, unit: 'ms', description: 'Largest Contentful Paint' },
    { key: 'fid', label: 'FID', value: metrics.fid, unit: 'ms', description: 'First Input Delay' },
    { key: 'cls', label: 'CLS', value: metrics.cls, unit: '', description: 'Cumulative Layout Shift' },
    { key: 'fcp', label: 'FCP', value: metrics.fcp, unit: 'ms', description: 'First Contentful Paint' },
    { key: 'ttfb', label: 'TTFB', value: metrics.ttfb, unit: 'ms', description: 'Time to First Byte' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Performance Monitor
          </CardTitle>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(metrics.score)}`}>
              {metrics.score}
            </div>
            <p className="text-xs text-slate-500">Performance Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricsList.map((metric) => {
          const status = getMetricStatus(metric.key, parseFloat(metric.value));
          return (
            <div key={metric.key}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm">{metric.label}</span>
                  <p className="text-xs text-slate-500">{metric.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {metric.value}{metric.unit}
                  </span>
                  <Badge className={
                    status === 'good' ? 'bg-green-500' :
                    status === 'needs-improvement' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {status === 'good' ? 'Bom' : status === 'needs-improvement' ? 'OK' : 'Ruim'}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={status === 'good' ? 100 : status === 'needs-improvement' ? 60 : 30} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}