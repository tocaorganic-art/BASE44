
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Mail, Phone } from "lucide-react";

export default function ClientList() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', user?.email], // Add user?.email to queryKey to refetch when user changes
    queryFn: () => base44.entities.Client.filter({ created_by: user.email }, '-created_date'), // Filter by the current user's email
    initialData: [],
    enabled: !!user, // Only run this query if user data is available
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja remover ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // If user data is still loading, or clients are loading, show loading state
  if (!user || isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle>Lista de Clientes ({clients.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    Nenhum cliente cadastrado ainda
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{client.full_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id, client.full_name)}
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
