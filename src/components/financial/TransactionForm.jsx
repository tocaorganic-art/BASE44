import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { isValidURL } from "@/components/utils/validators";

export default function TransactionForm({ transaction, onClose }) {
  const [formData, setFormData] = useState(transaction || {
    type: "Receita",
    category: "Serviço",
    amount: "",
    description: "",
    date: new Date(),
    status: "Pendente",
    receipt_url: "",
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const processedData = {
        ...data,
        amount: parseFloat(data.amount),
        date: format(data.date, 'yyyy-MM-dd'),
      };

      if (transaction?.id) {
        return base44.entities.Transaction.update(transaction.id, processedData);
      } else {
        return base44.entities.Transaction.create(processedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success(transaction ? 'Transação atualizada!' : 'Transação criada!');
      onClose();
    },
    onError: (error) => {
      console.error('Error saving transaction:', error);
      toast.error('Erro ao salvar transação');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    if (formData.receipt_url && !isValidURL(formData.receipt_url)) {
      toast.error('URL do comprovante inválida');
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.type === "Receita" ? (
                    <>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                      <SelectItem value="Produto">Produto</SelectItem>
                      <SelectItem value="Consultoria">Consultoria</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'PPP', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({...formData, date})}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalhes da transação..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="receipt_url">URL do Comprovante (opcional)</Label>
            <Input
              id="receipt_url"
              type="url"
              value={formData.receipt_url}
              onChange={(e) => setFormData({...formData, receipt_url: e.target.value})}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {transaction ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}