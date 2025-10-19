import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const deployHistory = [
  {
    id: 1,
    version: 'v2.1.0',
    date: '2025-01-15 14:30',
    status: 'success',
    duration: '2m 45s',
    deployer: 'Tony Stark',
    commit: 'abc123f',
  },
  {
    id: 2,
    version: 'v2.0.9',
    date: '2025-01-14 09:15',
    status: 'success',
    duration: '3m 12s',
    deployer: 'Tony Stark',
    commit: 'def456a',
  },
  {
    id: 3,
    version: 'v2.0.8',
    date: '2025-01-13 16:45',
    status: 'failed',
    duration: '1m 30s',
    deployer: 'Tony Stark',
    commit: 'ghi789b',
    error: 'Build failed: ESLint errors',
  },
];

export default function DeployHistory() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Deploys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deployHistory.map(deploy => (
            <div key={deploy.id} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{deploy.version}</p>
                  <p className="text-xs text-slate-500">{deploy.date}</p>
                </div>
                <Badge className={deploy.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                  {deploy.status === 'success' ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Sucesso</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Falhou</>
                  )}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-500">Duração:</span> {deploy.duration}
                </div>
                <div>
                  <span className="text-slate-500">Por:</span> {deploy.deployer}
                </div>
                <div>
                  <span className="text-slate-500">Commit:</span> {deploy.commit}
                </div>
              </div>
              {deploy.error && (
                <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                  {deploy.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}