import React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventCard({ event, showDetails }) {
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

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const statusColors = {
    "Planejamento": "bg-blue-100 text-blue-800 border-blue-200",
    "Confirmado": "bg-green-100 text-green-800 border-green-200",
    "Em Andamento": "bg-amber-100 text-amber-800 border-amber-200",
    "Concluído": "bg-slate-100 text-slate-800 border-slate-200",
    "Cancelado": "bg-red-100 text-red-800 border-red-200",
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || null;
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${event.name}"?`)) {
      deleteMutation.mutate(event.id);
    }
  };

  const clientName = getClientName(event.client_id);

  if (showDetails) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{event.name}</CardTitle>
              <div className="space-y-2">
                {clientName && (
                  <p className="text-slate-600 dark:text-slate-400">Cliente: <span className="font-medium">{clientName}</span></p>
                )}
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={`${statusColors[event.status]} border`}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Tipo</p>
              <p className="font-medium text-slate-900 dark:text-white">{event.type}</p>
            </div>
            {event.attendees && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Participantes</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <p className="font-medium text-slate-900 dark:text-white">{event.attendees}</p>
                </div>
              </div>
            )}
            {event.budget && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Orçamento</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-600" />
                  <p className="font-medium text-slate-900 dark:text-white">
                    R$ {event.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {event.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Observações</p>
              <p className="text-slate-700 dark:text-slate-300">{event.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
            {clientName && (
              <p className="text-sm text-slate-600 dark:text-slate-400">{clientName}</p>
            )}
          </div>
          <Badge variant="outline" className={`${statusColors[event.status]} border`}>
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        {event.attendees && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4" />
            <span>{event.attendees} participantes</span>
          </div>
        )}

        {event.budget && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>R$ {event.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        {event.notes && (
          <p className="text-sm text-slate-500 dark:text-slate-400 pt-2 border-t line-clamp-2">
            {event.notes}
          </p>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}