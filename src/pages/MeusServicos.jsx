
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import LazyImage from "@/components/ui/LazyImage";
import PermissionChecker from "@/components/auth/PermissionChecker"; // Updated path for consistency with other imports if needed, assuming it's in the components folder. Original outline was "../components/auth/PermissionChecker".

export default function MeusServicosPage() {
  return (
    <PermissionChecker requiredUserType="prestador">
      <MeusServicosContent />
    </PermissionChecker>
  );
}

function MeusServicosContent() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: provider, isLoading: isProviderLoading } = useQuery({
    queryKey: ['myServiceProvider', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.ServiceProvider.filter({ created_by: user.email });
      return results[0] || null;
    },
    enabled: !!user,
  });

  const { data: services, isLoading: isServicesLoading, refetch } = useQuery({
    queryKey: ['myServiceListings', provider?.id],
    queryFn: () => base44.entities.ServiceListing.filter({ provider_id: provider.id }),
    enabled: !!provider,
    initialData: [],
  });

  const queryClient = useQueryClient();

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.ServiceListing.update(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myServiceListings']);
      toast.success('Status do serviço atualizado!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ServiceListing.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['myServiceListings']);
      toast.success('Serviço removido com sucesso!');
    },
  });

  const isLoading = isUserLoading || isProviderLoading || isServicesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // The check for user.user_type !== 'prestador' is now handled by PermissionChecker.
  // MeusServicosContent will only render if the user is a 'prestador'.

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Complete seu Perfil</h2>
            <p className="text-slate-600 mb-4">Primeiro você precisa completar seu perfil de prestador para cadastrar serviços.</p>
            <Link to={createPageUrl("MeuPerfilPrestador")}>
              <Button>Completar Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meus Serviços</h1>
          <p className="text-slate-600 mt-1">Gerencie os serviços que você oferece na plataforma</p>
        </div>
        <Link to={createPageUrl("Dashboard")}> {/* Assuming Dashboard is the page to create new service */}
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Novo Serviço
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-slate-600 mb-6">Comece cadastrando seu primeiro serviço para atrair clientes.</p>
              <Link to={createPageUrl("Dashboard")}> {/* Assuming Dashboard is the page to create new service */}
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Cadastrar Primeiro Serviço
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              {service.images?.[0] && (
                <LazyImage
                  src={service.images[0]}
                  alt={service.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-cyan-600">R$ {service.price.toFixed(2)}</span>
                  <span className="text-sm text-slate-500">por {service.price_unit}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleActiveMutation.mutate({ id: service.id, active: !service.active })}
                  >
                    {service.active ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {service.active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Link to={createPageUrl("Dashboard")} className="flex-1"> {/* Assuming Dashboard is the page to edit service */}
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este serviço?')) {
                        deleteMutation.mutate(service.id);
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
