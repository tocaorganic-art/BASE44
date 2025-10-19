import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, XCircle, AlertTriangle, Download, 
  TrendingUp, Shield, Eye, Zap, Activity, Moon, Sun 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Base44ReportPreview({ reportData }) {
  const [theme, setTheme] = useState('light');

  const {
    command_id,
    project,
    environment,
    version,
    objective,
    operations,
    results,
    metrics,
    validation,
    reporting,
    status_after_completion,
    observacoes,
    data_execucao = new Date().toISOString(),
  } = reportData;

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: 'bg-green-500', icon: CheckCircle2, label: 'Sucesso' },
      warning: { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Atenção' },
      error: { color: 'bg-red-500', icon: XCircle, label: 'Erro' },
      running: { color: 'bg-blue-500', icon: Activity, label: 'Executando' },
    };

    const config = statusConfig[status] || statusConfig.success;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getMetricStatus = (value, threshold, inverse = false) => {
    const passed = inverse ? value <= threshold : value >= threshold;
    return passed ? 'success' : value >= threshold * 0.8 ? 'warning' : 'error';
  };

  const downloadReport = () => {
    const markdown = generateMarkdownReport(reportData);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${command_id}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Relatório baixado com sucesso!');
  };

  const generateMarkdownReport = (data) => {
    // Generate markdown from template
    let template = `# 📊 RELATÓRIO EXECUTIVO – ${data.command_id}\n\n`;
    template += `**Projeto:** ${data.project}\n`;
    template += `**Ambiente:** ${data.environment}\n`;
    template += `**Data:** ${new Date(data.data_execucao).toLocaleString('pt-BR')}\n`;
    template += `**Versão:** ${data.version}\n\n`;
    template += `## 🎯 OBJETIVO\n\n${data.objective}\n\n`;
    
    template += `## ⚙️ OPERAÇÕES EXECUTADAS\n\n`;
    data.operations.forEach(op => {
      template += `### ${op.id}\n\n`;
      op.actions.forEach(action => {
        template += `- ✅ ${action}\n`;
      });
      template += `\n`;
    });

    template += `## ✅ RESULTADOS\n\n`;
    Object.entries(data.results || {}).forEach(([key, value]) => {
      template += `- **${key}:** ${value}\n`;
    });

    template += `\n## 🟢 STATUS FINAL\n\n${data.status_after_completion}\n`;
    
    return template;
  };

  const isDark = theme === 'dark';

  return (
    <div className={`space-y-6 ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <Card className={`border-none shadow-xl ${isDark ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                📊 {command_id}
              </CardTitle>
              <div className={`flex flex-wrap gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <span>🏢 {project}</span>
                <span>•</span>
                <span>🌍 {environment}</span>
                <span>•</span>
                <span>📅 {new Date(data_execucao).toLocaleString('pt-BR')}</span>
                <span>•</span>
                <span>v{version}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setTheme(isDark ? 'light' : 'dark')} 
                variant="outline" 
                size="sm"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button onClick={downloadReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Baixar MD
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Objective */}
      <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>🎯 Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{objective}</p>
        </CardContent>
      </Card>

      {/* Operations */}
      <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>⚙️ Operações Executadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {operations.map((op, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{op.id}</h4>
              <ul className="space-y-1">
                {op.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>✅ Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ResultCard 
                icon={Activity}
                label="Build"
                value={results.build}
                status={results.build_status}
                isDark={isDark}
              />
              <ResultCard 
                icon={Zap}
                label="QA"
                value={`${results.qa_score}/100`}
                status={results.qa_status}
                isDark={isDark}
              />
              <ResultCard 
                icon={Shield}
                label="Segurança"
                value={`${results.security_score}/100`}
                status={results.security_status}
                isDark={isDark}
              />
              <ResultCard 
                icon={Eye}
                label="Acessibilidade"
                value={`${results.a11y_score}/100`}
                status={results.a11y_status}
                isDark={isDark}
              />
              <ResultCard 
                icon={TrendingUp}
                label="SEO"
                value={`${results.seo_score}/100`}
                status={results.seo_status}
                isDark={isDark}
              />
              <ResultCard 
                icon={Activity}
                label="Monitoramento"
                value={results.monitoring_status}
                status={results.monitoring_status === 'Ativo' ? 'success' : 'warning'}
                isDark={isDark}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      {metrics && (
        <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>📈 Métricas-Chave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Métrica</th>
                    <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Valor</th>
                    <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Limite</th>
                    <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics).map(([key, data]) => (
                    <tr key={key} className={`border-b ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <td className={`py-3 px-4 font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{key.toUpperCase()}</td>
                      <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{data.value}{data.unit}</td>
                      <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{data.threshold}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(data.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation */}
      {validation && (
        <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>🔐 Validação dos Critérios</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className={`${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-900 text-slate-100'} p-4 rounded-lg overflow-x-auto text-sm`}>
              {JSON.stringify(validation, null, 2)}
            </pre>
            <div className="mt-4">
              <Badge className={validation.passed ? 'bg-green-500' : 'bg-red-500'}>
                {validation.passed ? '✅ APROVADO' : '❌ REPROVADO'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Reports */}
      {reporting && (
        <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>🧾 Relatórios Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reporting.outputs.map((file, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{file}</span>
                </li>
              ))}
            </ul>
            <p className={`text-sm mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Canal de entrega:</strong> {reporting.delivery_channel}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Final Status */}
      <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-green-900'}`}>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Status Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{status_after_completion}</p>
        </CardContent>
      </Card>

      {/* Observações */}
      {observacoes && (
        <Card className={`border-none shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>✍️ Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className={`text-center text-xs py-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        Gerado automaticamente pelo sistema Base 44 AI Codificado – Política de Comando Único Versão 1.0 (Responsável: Tony).
      </div>
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, status, isDark }) {
  const statusColors = {
    success: isDark ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200',
    warning: isDark ? 'bg-yellow-900/50 border-yellow-700' : 'bg-yellow-50 border-yellow-200',
    error: isDark ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status] || (isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200')}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
        <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</span>
      </div>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}