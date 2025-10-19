
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  "Pendente": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Confirmado": "bg-blue-100 text-blue-800 border-blue-200",
  "Check-in Realizado": "bg-green-100 text-green-800 border-green-200",
  "Finalizado": "bg-gray-100 text-gray-800 border-gray-200",
  "Cancelado": "bg-red-100 text-red-800 border-red-200",
};

export default function StayList() {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000, // User data can be considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep user data in cache for 10 minutes
  });

  const { data: stays, isLoading: isStaysLoading } = useQuery({
    queryKey: ['stays', user?.email], // Add user email to query key to filter by user
    queryFn: () => {
      if (!user?.email) {
        // This should theoretically not be called if `enabled` is false, but good for type safety
        throw new Error("User email is not available to fetch stays.");
      }
      return base44.entities.Stay.filter({ created_by: user.email }, '-check_in');
    },
    initialData: [],
    enabled: !!user && !isUserLoading, // Only enable this query if user data is available and not currently loading
  });

  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients', user?.email], // Add user email to query key to filter by user
    queryFn: () => {
      if (!user?.email) {
        // This should theoretically not be called if `enabled` is false
        throw new Error("User email is not available to fetch clients.");
      }
      return base44.entities.Client.filter({ created_by: user.email });
    },
    initialData: [],
    enabled: !!user && !isUserLoading, // Only enable this query if user data is available and not currently loading
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Stay.delete(id),
    onSuccess: () => {
      // Invalidate stays for the specific user to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['stays', user?.email] });
    },
  });

  const getClientName = (clientId) => {
    // If clients data is still loading or not available, return a placeholder
    if (isClientsLoading || !clients) {
      return "Carregando cliente...";
    }
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || "Cliente não encontrado";
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja remover esta hospedagem?")) {
      deleteMutation.mutate(id);
    }
  };

  // Unified loading state: show "Carregando..." if user data is fetching,
  // or if user is present and stays/clients are fetching.
  if (isUserLoading || (user && (isStaysLoading || isClientsLoading))) {
    return <div>Carregando...</div>;
  }

  // If after loading, there's no user, display a message to log in
  if (!user) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle>Lista de Hospedagens</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-gray-600">
          Por favor, faça login para ver suas hospedagens.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle>Lista de Hospedagens ({stays.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Cliente</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Nenhuma hospedagem cadastrada ainda
                  </TableCell>
                </TableRow>
              ) : (
                stays.map((stay) => (
                  <TableRow key={stay.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {getClientName(stay.client_id)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {format(new Date(stay.check_in), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {format(new Date(stay.check_out), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stay.place}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[stay.status]} border`}
                      >
                        {stay.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(stay.id)}
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
  );
}
