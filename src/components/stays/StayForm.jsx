
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";

export default function StayForm() {
  const [clientId, setClientId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState("Pendente");
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
    mutationFn: (data) => base44.entities.Stay.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      setClientId(""); // Clear client ID after successful submission
      setCheckIn("");
      setCheckOut("");
      setPlace("");
      setStatus("Pendente");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      client_id: clientId,
      check_in: checkIn,
      check_out: checkOut,
      place,
      status,
    });
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-emerald-600" />
          Nova Hospedagem
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client">Cliente *</Label>
            <Select value={clientId} onValueChange={setClientId} required>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in *</Label>
              <Input
                id="checkIn"
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="checkOut">Check-out *</Label>
              <Input
                id="checkOut"
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="place">Local / Villa *</Label>
            <Input
              id="place"
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Ex: Villa Harmonia, Pousada Estrela, etc."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Check-in Realizado">Check-in Realizado</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            {createMutation.isPending ? "Salvando..." : "Salvar Hospedagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
