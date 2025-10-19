import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, AlertCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function FinancialDashboard({ transactions }) {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Agrupa por mês
    const monthlyData = {};
    transactions.forEach(t => {
      if (!t.date) return;
      const monthKey = format(new Date(t.date), 'MMM/yy', { locale: ptBR });
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, receita: 0, despesa: 0 };
      }
      if (t.type === 'Receita') {
        monthlyData[monthKey].receita += t.amount;
      } else {
        monthlyData[monthKey].despesa += t.amount;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.month.split('/').reverse().join('-'));
      const dateB = new Date(b.month.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categories = {};
    transactions
      .filter(t => t.type === 'Despesa' && t.status === 'Validado')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Nenhuma transação registrada ainda.</p>
          <p className="text-sm text-slate-500 mt-2">Adicione transações para visualizar os gráficos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Gráfico de Receita x Despesa */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Receitas vs Despesas
          </CardTitle>
          <CardDescription>Comparativo mensal</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="receita" fill="#10b981" name="Receita" />
              <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Categorias */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição dos gastos</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Tendência */}
      <Card className="border-none shadow-lg col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tendência Financeira</CardTitle>
          <CardDescription>Evolução ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} name="Receita" />
              <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} name="Despesa" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}