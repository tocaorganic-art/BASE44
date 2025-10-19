
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, AlertCircle, Inbox, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestDetailsModal from "@/components/agenda/RequestDetailsModal";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import PermissionChecker from "../components/auth/PermissionChecker";

const RequestCard = ({ request, service, onClick }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: request.status === 'Pendente' ? '#f59e0b' : '#3b82f6' }}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="flex flex-col items-center justify-center bg-slate-100 rounded-md p-2 w-16">
              <span className="text-sm font-bold text-slate-700">{format(new Date(request.date), 'MMM', { locale: ptBR })}</span>
              <span className="text-2xl font-bold text-slate-900">{format(new Date(request.date), 'dd')}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{service?.title || 'Serviço não encontrado'}</h3>
            <p className="text-sm text-slate-600">Cliente: {request.client_name}</p>
            <p className="text-xs text-slate-500 sm:hidden">{format(new Date(request.date), "dd/MM/yyyy")}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-green-600">
            R$ {service?.price.toFixed(2) || '0.00'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

function MinhaAgendaContent() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: serviceRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['serviceRequests', user?.id],
    queryFn: () => user?.id ? base44.entities.ServiceRequest.filter({ provider_id: user.id }, '-date') : [],
    enabled: !!user,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['allProviderServices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const providerServices = await base44.entities.ServiceListing.filter({ provider_id: user.id });
      const serviceMap = {};
      providerServices.forEach(s => {
        serviceMap[s.id] = s;
      });
      return serviceMap;
    },
    enabled: !!user,
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ServiceRequest.update(id, data),
    onSuccess: (updatedRequest) => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      toast.success(`Solicitação ${updatedRequest.status.toLowerCase()} com sucesso!`);
      setIsModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar solicitação.", { description: error.message });
    }
  });

  const handleConfirm = (id) => {
    updateRequestMutation.mutate({ id, data: { status: 'Confirmado' } });
  };

  const handleReject = (id, reason) => {
    updateRequestMutation.mutate({ id, data: { status: 'Rejeitado', provider_response: reason } });
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay closing to allow for animation
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const requestsByStatus = useMemo(() => {
    const statuses = {
      Pendente: [],
      Confirmado: [],
      Concluído: [],
      Rejeitado: [],
      Cancelado: []
    };
    (serviceRequests || []).forEach(req => {
      if (statuses[req.status]) {
        statuses[req.status].push(req);
      }
    });
    return statuses;
  }, [serviceRequests]);

  const isLoading = isUserLoading || isLoadingRequests || isLoadingServices;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  const renderRequestList = (requests) => {
    if (requests.length === 0) {
      return (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <Inbox className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-600">Nenhuma solicitação aqui</h3>
          <p className="text-sm text-slate-500">Quando você receber uma nova solicitação, ela aparecerá nesta seção.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {requests.map(req => (
          <RequestCard
            key={req.id}
            request={req}
            service={services?.[req.service_id]}
            onClick={() => openModal(req)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><Calendar /> Minha Agenda</h1>
        <p className="text-slate-600">Gerencie suas solicitações de serviço.</p>
      </div>

      <Tabs defaultValue="Pendente">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="Pendente" className="gap-1.5"><Clock className="w-4 h-4"/>Pendentes <Badge className="ml-1">{requestsByStatus.Pendente.length}</Badge></TabsTrigger>
          <TabsTrigger value="Confirmado" className="gap-1.5"><CheckCircle className="w-4 h-4"/>Confirmados</TabsTrigger>
          <TabsTrigger value="Concluído" className="gap-1.5"><Calendar className="w-4 h-4"/>Concluídos</TabsTrigger>
          <TabsTrigger value="Rejeitado" className="gap-1.5"><XCircle className="w-4 h-4"/>Rejeitados</TabsTrigger>
          <TabsTrigger value="Cancelado" className="gap-1.5"><AlertTriangle className="w-4 h-4"/>Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value="Pendente">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>Novas solicitações que aguardam sua confirmação ou rejeição.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Pendente)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Confirmado">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Confirmados</CardTitle>
              <CardDescription>Seus próximos serviços agendados.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Confirmado)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Concluído">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Serviços</CardTitle>
              <CardDescription>Serviços que você já concluiu.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Concluído)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Rejeitado">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Rejeitadas</CardTitle>
              <CardDescription>Solicitações que você não pôde aceitar.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Rejeitado)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Cancelado">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Canceladas</CardTitle>
              <CardDescription>Solicitações canceladas pelo cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderRequestList(requestsByStatus.Cancelado)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedRequest && services && (
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          request={selectedRequest}
          service={services[selectedRequest.service_id]}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default function MinhaAgendaPage() {
  return (
    <PermissionChecker requiredUserType="prestador">
      <MinhaAgendaContent />
    </PermissionChecker>
  );
}
