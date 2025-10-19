import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Eye, Clock, MousePointerClick } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    trafficSources: [],
    hourlyData: [],
  });

  useEffect(() => {
    // Simulated analytics data (in production, this would come from a real analytics service)
    const simulatedData = {
      pageViews: 15234,
      uniqueVisitors: 8456,
      avgSessionDuration: 245, // seconds
      bounceRate: 42.5,
      topPages: [
        { page: '/Home', views: 4523, avgTime: 180 },
        { page: '/ServicosCategoria', views: 3201, avgTime: 240 },
        { page: '/PrestadorPerfil', views: 2145, avgTime: 320 },
        { page: '/ServicoDetalhes', views: 1987, avgTime: 290 },
        { page: '/Dashboard', views: 1234, avgTime: 420 },
      ],
      trafficSources: [
        { source: 'Direto', percentage: 35, color: '#3b82f6' },
        { source: 'Google', percentage: 28, color: '#10b981' },
        { source: 'Instagram', percentage: 20, color: '#f59e0b' },
        { source: 'Facebook', percentage: 12, color: '#6366f1' },
        { source: 'Outros', percentage: 5, color: '#64748b' },
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}h`,
        views: Math.floor(Math.random() * 500) + 100,
        users: Math.floor(Math.random() * 200) + 50,
      })),
    };

    setAnalytics(simulatedData);

    // Track real page views
    const accessLogs = JSON.parse(localStorage.getItem('access_logs') || '[]');
    console.log('📊 Access logs loaded:', accessLogs.length);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard de Analytics</h2>
        <p className="text-slate-600">Visão completa do comportamento dos usuários na plataforma</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.pageViews.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">Visualizações de Página</p>
            <Badge className="bg-green-100 text-green-700 mt-2">+12% vs. semana passada</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">Visitantes Únicos</p>
            <Badge className="bg-green-100 text-green-700 mt-2">+8% vs. semana passada</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatDuration(analytics.avgSessionDuration)}</p>
            <p className="text-sm text-slate-500 mt-1">Duração Média de Sessão</p>
            <Badge className="bg-green-100 text-green-700 mt-2">+15% vs. semana passada</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointerClick className="w-5 h-5 text-red-600" />
              <TrendingUp className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.bounceRate}%</p>
            <p className="text-sm text-slate-500 mt-1">Taxa de Rejeição</p>
            <Badge className="bg-red-100 text-red-700 mt-2">+3% vs. semana passada</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Traffic */}
      <Card>
        <CardHeader>
          <CardTitle>Tráfego por Hora (Últimas 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{page.page}</p>
                      <p className="text-xs text-slate-500">Tempo médio: {formatDuration(page.avgTime)}</p>
                    </div>
                  </div>
                  <Badge>{page.views.toLocaleString()} views</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.trafficSources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="source" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}