import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, Upload, FileText, TrendingUp, DollarSign, 
  Calendar, Filter, Search, CheckSquare, Loader2 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import PermissionChecker from '../components/auth/PermissionChecker';

function AdminControleFinanceiroContent() {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['allTransactions', filters],
    queryFn: async () => {
      let query = {};
      
      if (filters.type !== 'all') query.type = filters.type;
      if (filters.status !== 'all') query.status = filters.status;
      
      const results = await base44.asServiceRole.entities.Transaction.filter(query, '-date');
      
      return results.filter(t => {
        const matchesSearch = !filters.search || 
          t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.reference_id?.toLowerCase().includes(filters.search.toLowerCase());
          
        const matchesDateFrom = !filters.dateFrom || new Date(t.date) >= new Date(filters.dateFrom);
        const matchesDateTo = !filters.dateTo || new Date(t.date) <= new Date(filters.dateTo);
        
        return matchesSearch && matchesDateFrom && matchesDateTo;
      });
    },
    initialData: [],
  });

  const handleBatchStatusUpdate = async (newStatus) => {
    if (selectedTransactions.length === 0) {
      toast.error('Selecione ao menos uma transação.');
      return;
    }

    try {
      await Promise.all(
        selectedTransactions.map(id =>
          base44.asServiceRole.entities.Transaction.update(id, { status: newStatus })
        )
      );
      
      toast.success(`${selectedTransactions.length} transações atualizadas para "${newStatus}"!`);
      setSelectedTransactions([]);
    } catch (error) {
      toast.error('Erro ao atualizar transações.', { description: error.message });
    }
  };

  const handleExport = () => {
    const csv = [
      ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor', 'Status', 'Referência'],
      ...transactions.map(t => [
        t.date,
        t.description,
        t.type,
        t.category,
        t.amount,
        t.status,
        t.reference_id || '',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

    toast.success('Relatório exportado!');
  };

  const totalReceita = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.amount, 0);
  const totalDespesa = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalReceita - totalDespesa;

  const toggleTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Controle Financeiro</h1>
        <p className="text-slate-600">Gestão centralizada de todas as transações da plataforma</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-500">Receitas</Badge>
            </div>
            <p className="text-3xl font-bold text-green-700">R$ {totalReceita.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <Badge className="bg-red-500">Despesas</Badge>
            </div>
            <p className="text-3xl font-bold text-red-700">R$ {totalDespesa.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <Badge className="bg-blue-500">Saldo</Badge>
            </div>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              R$ {saldo.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg">Filtros e Ações</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Validado">Validado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Divergente">Divergente</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              placeholder="De"
            />

            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              placeholder="Até"
            />
          </div>

          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedTransactions.length} selecionada(s)
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" onClick={() => handleBatchStatusUpdate('Validado')}>
                  Validar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBatchStatusUpdate('Divergente')}>
                  Marcar Divergente
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBatchStatusUpdate('Cancelado')}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Data</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Descrição</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Tipo</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Categoria</th>
                  <th className="p-4 text-right text-sm font-semibold text-slate-700">Valor</th>
                  <th className="p-4 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={() => toggleTransaction(transaction.id)}
                      />
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-sm text-slate-900">{transaction.description}</td>
                    <td className="p-4">
                      <Badge className={transaction.type === 'Receita' ? 'bg-green-500' : 'bg-red-500'}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{transaction.category}</td>
                    <td className="p-4 text-right text-sm font-semibold">
                      R$ {transaction.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className={
                        transaction.status === 'Validado' ? 'border-green-500 text-green-700' :
                        transaction.status === 'Pendente' ? 'border-yellow-500 text-yellow-700' :
                        transaction.status === 'Divergente' ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{transaction.created_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Nenhuma transação encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminControleFinanceiroPage() {
  return (
    <PermissionChecker requiredRole="admin">
      <AdminControleFinanceiroContent />
    </PermissionChecker>
  );
}