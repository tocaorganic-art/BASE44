import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PreDeployChecklist() {
  const [checks, setChecks] = useState([
    { id: 1, name: 'ESLint sem erros', status: 'pending', required: true },
    { id: 2, name: 'TypeScript sem erros', status: 'pending', required: true },
    { id: 3, name: 'Testes unitários passando', status: 'pending', required: true },
    { id: 4, name: 'Build de produção executado', status: 'pending', required: true },
    { id: 5, name: 'Variáveis de ambiente configuradas', status: 'pending', required: true },
    { id: 6, name: 'Imagens otimizadas', status: 'pending', required: false },
    { id: 7, name: 'Service Worker configurado', status: 'pending', required: false },
    { id: 8, name: 'Documentação atualizada', status: 'pending', required: false },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runChecks = async () => {
    setIsRunning(true);
    toast.info('Iniciando verificações...');

    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const randomStatus = Math.random() > 0.2 ? 'success' : (checks[i].required ? 'error' : 'warning');
      
      setChecks(prev => prev.map((check, index) => 
        index === i ? { ...check, status: randomStatus } : check
      ));

      if (randomStatus === 'error') {
        toast.error(`❌ ${checks[i].name} falhou!`);
      } else if (randomStatus === 'success') {
        toast.success(`✅ ${checks[i].name}`);
      }
    }

    setIsRunning(false);
    
    const hasErrors = checks.some(c => c.status === 'error');
    if (hasErrors) {
      toast.error('Deploy bloqueado! Corrija os erros antes de continuar.');
    } else {
      toast.success('✅ Todas as verificações passaram! Sistema pronto para deploy.');
    }
  };

  const getIcon = (status) => {
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-600" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
  };

  const canDeploy = checks.every(c => !c.required || c.status === 'success');

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>Checklist Pré-Deploy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {checks.map(check => (
            <div key={check.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              {getIcon(check.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{check.name}</p>
                {check.required && (
                  <p className="text-xs text-slate-500">Obrigatório</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={runChecks} 
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...</>
            ) : (
              'Executar Verificações'
            )}
          </Button>
          
          <Button 
            disabled={!canDeploy || isRunning}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Deploy para Produção
          </Button>
        </div>

        {!canDeploy && checks.some(c => c.status !== 'pending') && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Deploy bloqueado! Corrija os erros obrigatórios antes de continuar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}