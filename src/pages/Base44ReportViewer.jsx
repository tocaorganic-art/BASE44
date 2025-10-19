import React, { useState } from 'react';
import Base44ReportPreview from '../components/base44/Base44ReportPreview';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileJson, Eye } from 'lucide-react';

// Example report data
const exampleReport = {
  command_id: 'BASE44_Total_Example_V1',
  version: '1.0',
  project: 'Trancoso Experience / MeAjudaToca',
  environment: 'production',
  objective: 'Executar build, QA e monitoramento de toda a Base44.',
  data_execucao: new Date().toISOString(),
  operations: [
    {
      id: 'build_pipeline',
      actions: ['install_deps', 'run_build']
    },
    {
      id: 'qa_checks',
      actions: ['lint', 'test', 'a11y', 'seo']
    },
    {
      id: 'monitoring',
      actions: ['activate_dashboard', 'generate_report', 'configure_alerts']
    }
  ],
  results: {
    build: 'Sucesso',
    build_status: 'success',
    qa_score: 92,
    qa_status: 'success',
    security_score: 95,
    security_status: 'success',
    a11y_score: 88,
    a11y_status: 'success',
    seo_score: 90,
    seo_status: 'success',
    monitoring_status: 'Ativo'
  },
  metrics: {
    lcp: { value: 2200, unit: 'ms', threshold: '< 2500ms', status: 'success' },
    fid: { value: 45, unit: 'ms', threshold: '< 100ms', status: 'success' },
    cls: { value: 0.08, unit: '', threshold: '< 0.1', status: 'success' },
    uptime: { value: 99.8, unit: '%', threshold: '≥ 99%', status: 'success' },
    seo: { value: 90, unit: 'pts', threshold: '≥ 85pts', status: 'success' }
  },
  validation: {
    qa_score_min: 85,
    security_issues: 0,
    actual_qa_score: 92,
    actual_security_issues: 0,
    passed: true
  },
  reporting: {
    outputs: [
      'build_log.json',
      'qa_report.json',
      'monitoring_report.html'
    ],
    delivery_channel: 'Base44.Dashboard > Diagnostics'
  },
  status_after_completion: '✅ Todos os critérios validados; sistema pronto para produção.',
  observacoes: 'Build executado com sucesso. Todos os testes passaram. Sistema operando em condições ideais.'
};

export default function Base44ReportViewer() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(exampleReport, null, 2));
  const [reportData, setReportData] = useState(exampleReport);
  const [error, setError] = useState(null);

  const handleLoadReport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setReportData(parsed);
      setError(null);
    } catch (err) {
      setError('JSON inválido: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Base44 Report Viewer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              JSON do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-xs h-96"
              placeholder="Cole aqui o JSON do relatório..."
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button onClick={handleLoadReport} className="mt-4 w-full">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>1. Cole o JSON de um relatório Base44 no campo ao lado</p>
            <p>2. Clique em "Visualizar Relatório"</p>
            <p>3. O relatório será renderizado abaixo de forma visual</p>
            <p>4. Você pode baixar o relatório em formato Markdown</p>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="font-semibold text-blue-900">Exemplo carregado:</p>
              <p className="text-blue-700">BASE44_Total_Example_V1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Base44ReportPreview reportData={reportData} />
    </div>
  );
}