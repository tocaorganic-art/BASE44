import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, DollarSign, Calendar, Phone } from "lucide-react";

export default function SupplierManagement({ eventId }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: "",
    category: "Catering",
    contact: "",
    estimated_cost: 0,
    payment_due_date: "",
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['eventSuppliers', eventId, user?.email],
    queryFn: () => base44.entities.EventSupplier.filter({ event_id: eventId, created_by: user.email }),
    initialData: [],
    enabled: !!eventId && !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EventSupplier.create({ ...data, event_id: eventId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventSuppliers'] });
      setShowForm(false);
      setFormData({
        supplier_name: "",
        category: "Catering",
        contact: "",
        estimated_cost: 0,
        payment_due_date: "",
        notes: ""
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EventSupplier.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventSuppliers'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.EventSupplier.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventSuppliers'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const statusColors = {
    "Orçamento Solicitado": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Confirmado": "bg-blue-100 text-blue-800 border-blue-200",
    "Pago": "bg-green-100 text-green-800 border-green-200",
    "Cancelado": "bg-red-100 text-red-800 border-red-200",
  };

  const totalEstimated = suppliers.reduce((sum, s) => sum + (Number(s.estimated_cost) || 0), 0);
  const totalActual = suppliers.reduce((sum, s) => sum + (Number(s.actual_cost) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header com Resumo */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Gestão de Fornecedores
            </CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Fornecedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Fornecedores</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{suppliers.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Custo Estimado</p>
              <p className="text-2xl font-bold text-blue-600">R$ {totalEstimated.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Custo Real</p>
              <p className="text-2xl font-bold text-purple-600">R$ {totalActual.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Confirmados</p>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.filter(s => s.status === "Confirmado" || s.status === "Pago").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="text-lg">Novo Fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier_name">Nome do Fornecedor *</Label>
                  <Input
                    id="supplier_name"
                    required
                    value={formData.supplier_name}
                    onChange={(e) => setFormData({...formData, supplier_name: e.target.value})}
                    placeholder="Ex: Buffet Trancoso"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Catering">Catering</SelectItem>
                      <SelectItem value="Decoração">Decoração</SelectItem>
                      <SelectItem value="Fotografia">Fotografia</SelectItem>
                      <SelectItem value="Música/DJ">Música/DJ</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Floricultura">Floricultura</SelectItem>
                      <SelectItem value="Iluminação">Iluminação</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact">Contato</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="Telefone ou email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_cost">Custo Estimado (R$)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({...formData, estimated_cost: parseFloat(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="payment_due_date">Data de Vencimento</Label>
                  <Input
                    id="payment_due_date"
                    type="date"
                    value={formData.payment_due_date}
                    onChange={(e) => setFormData({...formData, payment_due_date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Detalhes do serviço, horários, etc."
                  className="mt-1 h-20"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {createMutation.isPending ? "Salvando..." : "Adicionar Fornecedor"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Fornecedores */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Carregando fornecedores...</div>
      ) : suppliers.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhum fornecedor cadastrado</p>
            <p className="text-slate-400 text-sm">Adicione fornecedores para este evento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{supplier.supplier_name}</CardTitle>
                    <Badge variant="outline">{supplier.category}</Badge>
                  </div>
                  <Badge variant="outline" className={`${statusColors[supplier.status]} border`}>
                    {supplier.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {supplier.contact && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.contact}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Custo Estimado</p>
                    <p className="text-lg font-bold text-blue-600">
                      R$ {(supplier.estimated_cost || 0).toFixed(2)}
                    </p>
                  </div>
                  {supplier.actual_cost > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Custo Real</p>
                      <p className="text-lg font-bold text-purple-600">
                        R$ {supplier.actual_cost.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {supplier.payment_due_date && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-2 border-t">
                    <Calendar className="w-4 h-4" />
                    <span>Vencimento: {new Date(supplier.payment_due_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {supplier.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t">{supplier.notes}</p>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Select
                    value={supplier.status}
                    onValueChange={(value) => updateStatusMutation.mutate({ id: supplier.id, status: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Orçamento Solicitado">Orçamento Solicitado</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(`Remover ${supplier.supplier_name}?`)) {
                        deleteMutation.mutate(supplier.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}