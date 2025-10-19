import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, X } from "lucide-react";

export default function MaintenanceForm({ onClose }) {
  const [formData, setFormData] = useState({
    property_name: "",
    equipment: "",
    alert_type: "Preventiva",
    priority: "Média",
    predicted_failure_date: "",
    description: "",
    cost_estimate: "",
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MaintenanceAlert.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceAlerts'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      cost_estimate: formData.cost_estimate ? parseFloat(formData.cost_estimate) : undefined,
      status: "Aberto"
    };
    createMutation.mutate(submitData);
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <CardTitle>Novo Alerta de Manutenção</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_name">Propriedade/Villa *</Label>
              <Input
                id="property_name"
                required
                value={formData.property_name}
                onChange={(e) => setFormData({...formData, property_name: e.target.value})}
                placeholder="Ex: Villa Harmonia"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="equipment">Equipamento/Área *</Label>
              <Input
                id="equipment"
                required
                value={formData.equipment}
                onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                placeholder="Ex: Ar-condicionado, Piscina"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="alert_type">Tipo de Alerta</Label>
              <Select 
                value={formData.alert_type} 
                onValueChange={(value) => setFormData({...formData, alert_type: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preditiva">Preditiva</SelectItem>
                  <SelectItem value="Preventiva">Preventiva</SelectItem>
                  <SelectItem value="Corretiva">Corretiva</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="predicted_failure_date">Data Prevista de Falha</Label>
              <Input
                id="predicted_failure_date"
                type="date"
                value={formData.predicted_failure_date}
                onChange={(e) => setFormData({...formData, predicted_failure_date: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cost_estimate">Custo Estimado (R$)</Label>
              <Input
                id="cost_estimate"
                type="number"
                step="0.01"
                value={formData.cost_estimate}
                onChange={(e) => setFormData({...formData, cost_estimate: e.target.value})}
                placeholder="1500.00"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o problema ou necessidade de manutenção"
              className="mt-1 h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {createMutation.isPending ? "Salvando..." : "Criar Alerta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}