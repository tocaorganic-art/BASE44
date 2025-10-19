import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Shield, Zap } from 'lucide-react';
import ContinuousMonitor from '../components/monitoring/ContinuousMonitor';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import SystemHealthCheck from '../components/maintenance/SystemHealthCheck';
import PermissionChecker from '../components/auth/PermissionChecker';

function MonitoringDashboardContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          Dashboard de Monitoramento
        </h1>
        <p className="text-slate-600">
          Visão unificada de todos os sistemas e métricas da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Uptime</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">99.9%</p>
            <p className="text-xs text-slate-500 mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Performance</span>
            </div>
            <p className="text-3xl font-bold text-green-700">92</p>
            <p className="text-xs text-slate-500 mt-1">Score médio</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Segurança</span>
            </div>
            <p className="text-3xl font-bold text-purple-700">100</p>
            <p className="text-xs text-slate-500 mt-1">Sem vulnerabilidades</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">API</span>
            </div>
            <p className="text-3xl font-bold text-orange-700">145ms</p>
            <p className="text-xs text-slate-500 mt-1">Latência média</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <SystemHealthCheck />
        <ContinuousMonitor />
        <AnalyticsDashboard />
      </div>
    </div>
  );
}

export default function MonitoringDashboardPage() {
  return (
    <PermissionChecker requiredRole="admin">
      <MonitoringDashboardContent />
    </PermissionChecker>
  );
}