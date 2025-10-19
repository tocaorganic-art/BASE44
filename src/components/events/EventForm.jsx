
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, X } from "lucide-react";

export default function EventForm({ event, onClose }) {
  const [formData, setFormData] = useState(event || {
    name: "",
    client_id: "",
    type: "Casamento",
    date: "",
    location: "",
    attendees: "",
    status: "Planejamento",
    budget: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: clients } = useQuery({
    queryKey: ['clients', user?.email],
    queryFn: () => base44.entities.Client.filter({ created_by: user.email }),
    initialData: [],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      attendees: formData.attendees ? parseInt(formData.attendees) : undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
    };
    createMutation.mutate(submitData);
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <CardTitle>{event ? "Editar Evento" : "Novo Evento"}</CardTitle>
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
              <Label htmlFor="name">Nome do Evento *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Casamento João & Maria"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client">Cliente</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={(value) => setFormData({...formData, client_id: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Evento</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casamento">Casamento</SelectItem>
                  <SelectItem value="Conferência">Conferência</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Festa Corporativa">Festa Corporativa</SelectItem>
                  <SelectItem value="Jantar Exclusivo">Jantar Exclusivo</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Local *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ex: Villa Harmonia"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="attendees">Participantes</Label>
              <Input
                id="attendees"
                type="number"
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                placeholder="150"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="50000.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejamento">Planejamento</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Requisitos especiais, preferências, etc."
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
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {createMutation.isPending ? "Salvando..." : "Salvar Evento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
