import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, FileJson, FileText, Book } from 'lucide-react';
import { toast } from 'sonner';

const COMMAND_TEMPLATE = `{
  "command_id": "BASE44_Command_Name_V1",
  "version": "1.0",
  "environment": "production",
  "project": "NomeDoProjeto / DescriçãoCurta",
  "objective": "Descreva aqui o objetivo geral (ex.: Executar build, QA e monitoramento).",
  "operations": [
    {
      "id": "section_1_identifier",
      "actions": [
        "descrição_da_ação_1",
        "descrição_da_ação_2",
        "descrição_da_ação_3"
      ]
    },
    {
      "id": "section_2_identifier",
      "actions": [
        "descrição_da_ação_1",
        "descrição_da_ação_2"
      ]
    }
  ],
  "validation": {
    "qa_score_min": 85,
    "security_issues": 0
  },
  "reporting": {
    "outputs": [
      "arquivo1.json",
      "arquivo2.html",
      "arquivo3.csv"
    ],
    "delivery_channel": "Base44.Dashboard > Logs > Latest"
  },
  "status_after_completion": "✅ Descreva aqui o estado final esperado (ex.: Todos os critérios validados, sistema pronto para produção)."
}`;

const REPORT_TEMPLATE = `# 📊 RELATÓRIO EXECUTIVO – {{command_id}}

**Projeto:** {{project}}  
**Ambiente:** {{environment}}  
**Data:** {{data_execucao}}  
**Versão:** {{version}}  
**Status:** {{status_execucao}}

---

## 🎯 OBJETIVO

{{objective}}

---

## ⚙️ OPERAÇÕES EXECUTADAS

{{#each operations}}
### {{this.id}}

**Ações:**
{{#each this.actions}}
- ✅ {{this}}
{{/each}}

{{/each}}

---

## ✅ RESULTADOS

| Área | Score | Status |
|------|-------|--------|
| **Build** | {{resultado_build}} | {{build_status}} |
| **QA** | {{qa_score}} / 100 | {{qa_status}} |
| **Segurança** | {{security_score}} / 100 | {{security_status}} |
| **Acessibilidade** | {{a11y_score}} / 100 | {{a11y_status}} |
| **SEO** | {{seo_score}} / 100 | {{seo_status}} |
| **Monitoramento** | {{monitoring_status}} | {{monitoring_icon}} |

---

## 📈 MÉTRICAS-CHAVE

| Métrica | Valor | Limite | Status |
|---------|-------|--------|--------|
| **LCP** | {{lcp_value}} ms | < 2500 ms | {{lcp_status}} |
| **FID** | {{fid_value}} ms | < 100 ms | {{fid_status}} |
| **CLS** | {{cls_value}} | < 0.1 | {{cls_status}} |
| **Uptime** | {{uptime_value}}% | ≥ 99% | {{uptime_status}} |
| **SEO** | {{seo_score}} | ≥ 85 pts | {{seo_status}} |

---

## 🔐 VALIDAÇÃO DOS CRITÉRIOS

\`\`\`json
{
  "qa_score_min": 85,
  "security_issues": 0,
  "actual_qa_score": {{qa_score}},
  "actual_security_issues": {{security_issues_total}}
}
\`\`\`

**Resultado:** {{validation_result}}

---

## 🧾 RELATÓRIOS GERADOS

{{#each reporting.outputs}}
- 📄 {{this}}
{{/each}}

**Canal de entrega:** {{reporting.delivery_channel}}

---

## 🟢 STATUS FINAL

{{status_after_completion}}

---

## ✍️ OBSERVAÇÕES

{{observacoes}}

---

*Gerado automaticamente pelo sistema Base 44 AI Codificado – Política de Comando Único Versão 1.0 (Responsável: Tony).*`;

const DOCUMENTATION = `# 📚 Templates Base44 - Guia de Uso

## Visão Geral

Sistema **Base44 Comando Único Codificado** - Templates padronizados para criar comandos e relatórios.

## Workflow Completo

\`\`\`
1. Tony preenche template de comando JSON
   ↓
2. Envia comando para a IA
   ↓
3. IA executa via <action_group>
   ↓
4. IA gera relatório padronizado
   ↓
5. Visualização em Base44ReportViewer
\`\`\`

## Como Usar

### 1. Criar Comando

Copie o template JSON, preencha os campos e envie para a IA:

**Campos principais:**
- \`command_id\`: Identificador único (ex: BASE44_Deploy_V1)
- \`objective\`: O que o comando faz
- \`operations\`: Lista de operações
- \`validation\`: Critérios de validação
- \`reporting\`: Configuração de relatórios

### 2. Executar

Envie o JSON completo. A IA vai:
- Validar o comando
- Executar todas as operações
- Gerar relatório automático

### 3. Visualizar

Acesse \`/Base44ReportViewer\` para ver relatórios de forma visual.

## Exemplos

### Comando Simples

\`\`\`json
{
  "command_id": "BASE44_Deploy_V1",
  "version": "1.0",
  "environment": "production",
  "project": "MeuApp",
  "objective": "Deploy em produção",
  "operations": [
    {
      "id": "build",
      "actions": ["npm install", "npm run build"]
    }
  ],
  "validation": {
    "qa_score_min": 90
  }
}
\`\`\`

### Comando Completo

Use o template completo da aba "Comando Template" com todas as seções.

## Convenções

- **IDs**: \`BASE44_<Nome>_V<Versão>\`
- **Versões**: Semântico (1.0, 1.1, 2.0)
- **Status**: success, warning, error, running
- **Ambientes**: production, staging, development

## Componentes Disponíveis

### Base44ReportPreview
Componente React para visualizar relatórios.

\`\`\`jsx
import Base44ReportPreview from '@/components/base44/Base44ReportPreview';

<Base44ReportPreview reportData={reportData} />
\`\`\`

### Base44ReportViewer
Página completa: \`/Base44ReportViewer\`

## Suporte

**Responsável:** Tony  
**Email:** tony@base44.io  
**Versão:** 1.0`;

export default function Base44Templates() {
  const [activeTab, setActiveTab] = useState('command');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(\`\${label} copiado!\`, {
      description: 'Cole onde precisar usar.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            📚 Templates Base44
          </h1>
          <p className="text-slate-600">
            Sistema de Comando Único Codificado - Templates e Documentação
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="command" className="flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              Comando Template
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatório Template
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Documentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Template de Comando JSON</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(COMMAND_TEMPLATE, 'Template de comando')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={COMMAND_TEMPLATE}
                  readOnly
                  className="font-mono text-xs h-[600px]"
                />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Como usar:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Copie este template</li>
                    <li>2. Preencha os campos conforme sua necessidade</li>
                    <li>3. Envie o JSON completo para a IA executar</li>
                    <li>4. Receba o relatório automático de execução</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Template de Relatório Markdown</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(REPORT_TEMPLATE, 'Template de relatório')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={REPORT_TEMPLATE}
                  readOnly
                  className="font-mono text-xs h-[600px]"
                />
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Sobre este template:</h4>
                  <p className="text-sm text-green-800">
                    Este é o template Markdown usado pela IA para gerar relatórios de execução.
                    Você não precisa preenchê-lo manualmente - ele é gerado automaticamente após
                    a execução de um comando Base44.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documentação Completa</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(DOCUMENTATION, 'Documentação')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={DOCUMENTATION}
                  readOnly
                  className="font-mono text-xs h-[600px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Próximos Passos</h3>
              <p className="text-sm text-blue-800 mb-4">
                Acesse o visualizador de relatórios para testar o sistema completo.
              </p>
              <Button
                onClick={() => window.location.href = '/Base44ReportViewer'}
                className="w-full"
              >
                Abrir Base44ReportViewer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-900 mb-2">📊 Exemplo Prático</h3>
              <p className="text-sm text-green-800 mb-4">
                Veja um relatório de exemplo já renderizado e funcional.
              </p>
              <Button
                onClick={() => window.location.href = '/Base44ReportViewer'}
                variant="outline"
                className="w-full"
              >
                Ver Exemplo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}