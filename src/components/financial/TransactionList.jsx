
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Calendar, DollarSign, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionList({ transactions }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Transaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.email] });
    },
  });

  const handleDelete = (id, description) => {
    if (window.confirm(`Tem certeza que deseja excluir "${description}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesStatus && matchesSearch;
  });

  const statusColors = {
    "Validado": "bg-green-100 text-green-800 border-green-200",
    "Pendente": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Divergente": "bg-red-100 text-red-800 border-red-200",
    "Cancelado": "bg-slate-100 text-slate-800 border-slate-200",
  };

  const categories = ["all", "Transporte", "Hospedagem", "Serviços", "Caixa", "Compras", "Eventos", "Fornecedores", "Salários", "Marketing", "Manutenção", "Outros"];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Buscar</label>
              <Input
                placeholder="Descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Categoria</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "Todas" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Validado">Validado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Divergente">Divergente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="glass-card border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle>
            Transações ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{transaction.description}</p>
                          {transaction.notes && (
                            <p className="text-xs text-slate-500 mt-1">{transaction.notes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-bold ${
                            transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'Receita' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-slate-500">{transaction.payment_method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColors[transaction.status]} border`}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id, transaction.description)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
