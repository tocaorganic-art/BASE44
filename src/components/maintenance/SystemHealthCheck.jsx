import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Activity, RefreshCw } from 'lucide-react';

export default function SystemHealthCheck() {
  const [health, setHealth] = useState({
    routes: { status: 'checking', issues: [] },
    api: { status: 'checking', issues: [] },
    performance: { status: 'checking', issues: [] },
    security: { status: 'checking', issues: [] },
    lastCheck: null,
  });

  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = async () => {
    setIsChecking(true);
    const results = {
      routes: { status: 'healthy', issues: [] },
      api: { status: 'healthy', issues: [] },
      performance: { status: 'healthy', issues: [] },
      security: { status: 'healthy', issues: [] },
      lastCheck: new Date().toISOString(),
    };

    // Check Routes
    const requiredRoutes = [
      'Home', 'ServicosCategoria', 'PrestadorPerfil', 'ServicoDetalhes',
      'Dashboard', 'MeusServicos', 'MinhaAgenda', 'Financeiro', 'Planos',
      'MeuPerfilPrestador', 'MeusPedidos', 'Manual', 'SejaPrestador',
      'ComoFunciona', 'Seguranca', 'Assistentevirtual', 'GeradorDeImagem'
    ];

    requiredRoutes.forEach(route => {
      try {
        // Simular verificação de rota
        const routeExists = document.querySelector(`[href*="${route}"]`);
        if (!routeExists) {
          results.routes.issues.push(`Rota ${route} pode estar inacessível`);
          results.routes.status = 'warning';
        }
      } catch (error) {
        results.routes.issues.push(`Erro ao verificar rota ${route}`);
        results.routes.status = 'error';
      }
    });

    // Check Performance
    if (performance.memory) {
      const memoryUsage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
      if (memoryUsage > 85) {
        results.performance.issues.push(`Uso de memória alto: ${memoryUsage.toFixed(1)}%`);
        results.performance.status = 'warning';
      }
    }

    // Check for console errors
    const hasConsoleErrors = localStorage.getItem('console_errors_count');
    if (hasConsoleErrors && parseInt(hasConsoleErrors) > 10) {
      results.api.issues.push(`${hasConsoleErrors} erros detectados no console`);
      results.api.status = 'warning';
    }

    // Check Security
    const hasHTTPS = window.location.protocol === 'https:';
    if (!hasHTTPS && window.location.hostname !== 'localhost') {
      results.security.issues.push('Conexão não segura (HTTP)');
      results.security.status = 'warning';
    }

    setHealth(results);
    setIsChecking(false);
  };

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'healthy') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    const colors = {
      healthy: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      checking: 'bg-gray-500',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const overallStatus = Object.values(health).slice(0, 4).every(s => s.status === 'healthy') ? 'healthy' :
    Object.values(health).slice(0, 4).some(s => s.status === 'error') ? 'error' : 'warning';

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            Diagnóstico do Sistema
            {getStatusBadge(overallStatus)}
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={runHealthCheck}
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
        {health.lastCheck && (
          <p className="text-xs text-slate-500 mt-2">
            Última verificação: {new Date(health.lastCheck).toLocaleString('pt-BR')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {['routes', 'api', 'performance', 'security'].map(key => (
            <div key={key} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(health[key].status)}
                  <span className="font-medium capitalize">{key === 'api' ? 'API' : key}</span>
                </div>
                {getStatusBadge(health[key].status)}
              </div>
              {health[key].issues.length > 0 && (
                <ul className="text-sm text-slate-600 ml-7 space-y-1">
                  {health[key].issues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}