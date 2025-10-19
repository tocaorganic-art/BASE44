
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancialReports({ transactions }) {
  const generatePDFReport = () => {
    alert("Funcionalidade de exportação PDF será implementada em breve!");
  };

  const generateExcelReport = () => {
    alert("Funcionalidade de exportação Excel será implementada em breve!");
  };

  // Cálculos - incluir Validado E Pendente
  const totalReceita = transactions
    .filter(t => t.type === "Receita" && (t.status === "Validado" || t.status === "Pendente"))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesa = transactions
    .filter(t => t.type === "Despesa" && (t.status === "Validado" || t.status === "Pendente"))
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalReceita - totalDespesa;

  const byCategory = transactions
    .filter(t => t.status === "Validado" || t.status === "Pendente")
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { receita: 0, despesa: 0 };
      }
      if (t.type === "Receita") {
        acc[t.category].receita += t.amount;
      } else {
        acc[t.category].despesa += t.amount;
      }
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <Card className="glass-card border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Exportar Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={generatePDFReport}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button 
              onClick={generateExcelReport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Report */}
      <Card className="glass-card border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200">
              <p className="text-sm text-slate-600 mb-2">Total de Receitas</p>
              <p className="text-3xl font-bold text-green-600">
                R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-red-50 p-5 rounded-xl border-2 border-red-200">
              <p className="text-sm text-slate-600 mb-2">Total de Despesas</p>
              <p className="text-3xl font-bold text-red-600">
                R$ {totalDespesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`${saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} p-5 rounded-xl border-2`}>
              <p className="text-sm text-slate-600 mb-2">Saldo</p>
              <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Por Categoria</h3>
            {Object.entries(byCategory).map(([category, values]) => (
              <div key={category} className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900">{category}</span>
                  <span className="text-sm text-slate-600">
                    Saldo: R$ {(values.receita - values.despesa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Receitas:</span>
                    <span className="font-medium text-green-600">
                      R$ {values.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Despesas:</span>
                    <span className="font-medium text-red-600">
                      R$ {values.despesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Period Info */}
      <Card className="glass-card border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Calendar className="w-5 h-5" />
            <span>
              Relatório gerado em: {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Transações com status "Validado" ou "Pendente" • Total de {transactions.filter(t => t.status === "Validado" || t.status === "Pendente").length} transações
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
