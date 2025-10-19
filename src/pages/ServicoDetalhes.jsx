import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/ui/LazyImage";
import { ArrowLeft, Star, MapPin, DollarSign, Clock, Phone, MessageCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ServicoDetalhesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['serviceListing', serviceId],
    queryFn: async () => {
      const services = await base44.entities.ServiceListing.list();
      return services.find(s => s.id === serviceId);
    },
    enabled: !!serviceId,
  });

  const { data: provider } = useQuery({
    queryKey: ['serviceProvider', service?.provider_id],
    queryFn: async () => {
      const providers = await base44.entities.ServiceProvider.list();
      return providers.find(p => p.id === service.provider_id);
    },
    enabled: !!service?.provider_id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600">Carregando detalhes do serviço...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Serviço Não Encontrado</h2>
            <p className="text-red-700 mb-6">O serviço que você está procurando não existe ou foi removido.</p>
            <Link to={createPageUrl("Home")}>
              <Button>Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageSrc = service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-cyan-500 to-blue-600">
        <LazyImage
          src={imageSrc}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-32 pb-12">
        <Link to={createPageUrl("ServicosCategoria", `?cat=${service.category}`)}>
          <Button variant="ghost" className="text-white hover:bg-white/20 mb-4 bg-black/30 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card className="border-none shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{service.title}</h1>
                <Badge className="bg-cyan-100 text-cyan-800 mb-4">{service.category}</Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-600">R$ {service.price.toFixed(2)}</p>
                <p className="text-sm text-slate-500">por {service.price_unit || 'serviço'}</p>
              </div>
            </div>

            {service.duration_estimate && (
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <Clock className="w-5 h-5" />
                <span>Duração estimada: {service.duration_estimate}</span>
              </div>
            )}

            <div className="prose prose-slate max-w-none mb-8">
              <h3 className="text-xl font-semibold mb-3">O que está incluso:</h3>
              <p className="text-slate-700 whitespace-pre-line">{service.description}</p>

              {service.not_included && (
                <>
                  <h3 className="text-xl font-semibold mb-3 mt-6">O que NÃO está incluso:</h3>
                  <p className="text-slate-700 whitespace-pre-line">{service.not_included}</p>
                </>
              )}
            </div>

            {service.images && service.images.length > 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Galeria</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.map((img, idx) => (
                    <LazyImage key={idx} src={img} alt={`${service.title} - imagem ${idx + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  ))}
                </div>
              </div>
            )}

            {provider && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Prestador</h3>
                <div className="flex items-center gap-4 mb-4">
                  <LazyImage
                    src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                    alt={provider.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{provider.full_name}</p>
                    <p className="text-sm text-slate-600">{provider.occupation}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                      {provider.total_reviews > 0 && <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>}
                    </div>
                  </div>
                  <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                    <Button variant="outline">Ver Perfil</Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {user && provider ? (
                <>
                  <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)} className="flex-1">
                    <Button size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      Agendar Serviço
                    </Button>
                  </Link>
                  {provider.phone && (
                    <Button size="lg" variant="outline" className="flex-1" asChild>
                      <a href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </>
              ) : (
                <Button size="lg" className="w-full" onClick={() => base44.auth.redirectToLogin()}>
                  Faça login para agendar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}