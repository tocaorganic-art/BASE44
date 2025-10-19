
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/ui/LazyImage";
import BannerCategorias from "@/components/BannerCategorias";
import PromotionalBanner from "@/components/PromotionalBanner";
import Testimonials from "@/components/home/Testimonials";
import {
  Search, Sparkles, UtensilsCrossed, Hammer, Leaf,
  Baby, Zap, Star, MapPin, Phone, Grid3x3, AlertCircle, Loader2, Shirt, Car, Compass, PartyPopper, BookOpen, Home, Wrench, BrainCircuit, ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryImageMap = {
  'Limpeza': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Jardinagem': 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Eletricista': 'https://images.unsplash.com/photo-1621905251189-08b45249c6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Construção': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Beleza': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Turismo': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Gastronomia': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Festas': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Aulas': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Transporte': 'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Automóveis': 'https://images.unsplash.com/photo-1553440569-b506745199de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

const categoryIconMap = {
    'Limpeza': Home,
    'Construção': Hammer,
    'Beleza': Shirt,
    'Transporte': Car,
    'Turismo': Compass,
    'Gastronomia': UtensilsCrossed,
    'Festas': PartyPopper,
    'Aulas': BookOpen,
    'Automóveis': Wrench,
    'default': Hammer
};

const ServiceSkeletonCard = () => (
  <Card className="border-none shadow-lg">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
    </CardContent>
  </Card>
);

const ProviderSkeletonCard = () => (
    <Card className="border-none shadow-lg">
        <CardContent className="p-4 text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
            <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-3 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/4 mx-auto" />
        </CardContent>
    </Card>
);

const ServiceCard = ({ service, provider }) => {
    const imageSrc = service.images?.[0] || categoryImageMap[service.category] || categoryImageMap.default;
    const Icon = categoryIconMap[service.category] || categoryIconMap.default;

    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
            <div className="aspect-video w-full overflow-hidden bg-slate-200">
                {imageSrc ? (
                    <LazyImage
                        src={imageSrc}
                        alt={`Imagem do serviço: ${service.title}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Icon className="w-10 h-10 text-slate-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-5 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                    <Badge className="bg-cyan-100 text-cyan-800 shrink-0 ml-2">{service.category}</Badge>
                </div>

                {provider && (
                    <p className="text-sm text-slate-600 mb-3">{provider.full_name}</p>
                )}

                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{service.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold">
                            {provider?.rating ? provider.rating.toFixed(1) : 'Novo'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-cyan-600">
                            R$ {service.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">por {service.price_unit || 'serviço'}</p>
                        {provider?.total_reviews > 0 && (
                            <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>
                        )}
                    </div>
                </div>

                <Link to={createPageUrl("ServicoDetalhes", `?id=${service.id}`)} data-testid={`service-card-link-${service.id}`} className="mt-4" aria-label={`Ver detalhes do serviço ${service.title}`}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        Ver Detalhes
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Trancoso Experience - Encontre os Melhores Serviços Locais";
  }, []);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: providers, isLoading: isLoadingProviders, isError: isErrorProviders } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-rating', 50),
  });
  
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
    queryKey: ['serviceListings'],
    queryFn: () => base44.entities.ServiceListing.filter({ active: true, featured: true }, '-created_date', 6),
  });

  const { data: recommendedServices, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['recommendedServices', user?.id],
    queryFn: () => base44.functions.invoke('getRecommendations', { userId: user.id }),
    enabled: !!user,
  });

  const topProviders = providers
    ?.filter(p => p.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6) || [];
    
  const popularServices = ["Faxina", "Eletricista", "Passeio Turístico", "Transporte", "Massagem"];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white">
        <section className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-12 md:py-20 px-4">
          <div className="hero-content text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Encontre serviços em Trancoso
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Conectamos você aos melhores serviços da região.
            </p>
            
            <div className="search-container flex w-full max-w-lg mx-auto lg:mx-0 mb-6">
              <Input
                type="text"
                placeholder="O que você precisa?"
                className="search-input flex-1 rounded-r-none focus:ring-0 focus:ring-offset-0 border-r-0 text-base py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar serviços"
              />
              <Link to={createPageUrl("ServicosCategoria", `?q=${searchQuery}`)} className="search-button">
                <Button className="rounded-l-none h-full bg-[var(--primary)]" aria-label="Buscar">
                    <Search className="w-5 h-5 mr-1" />
                    Buscar
                </Button>
              </Link>
            </div>
            
            <div className="popular-services mt-6 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <span className="popular-label text-sm font-medium text-slate-700">Popular:</span>
              <div className="popular-tags flex gap-2 flex-wrap">
                {popularServices.map(service => (
                    <Link key={service} to={createPageUrl("ServicosCategoria", `?cat=${service}`)}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-[var(--secondary)] hover:border-[var(--secondary)] bg-white border-slate-200 rounded-full text-sm py-1.5 px-3">{service}</Badge>
                    </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="promotional-banner-column hidden lg:block">
            <PromotionalBanner />
          </div>
        </section>
      </div>

      <div className="container mx-auto max-w-7xl px-4 lg:hidden">
        <PromotionalBanner />
      </div>

      <BannerCategorias />

      {/* CTA Destacado */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 py-16 my-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para encontrar o profissional ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Milhares de prestadores verificados esperando para ajudar você.
          </p>
          <Link to={createPageUrl("ServicosCategoria")}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-8 py-6">
              Buscar Serviços Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-16">

        {/* Recomendações com IA */}
        {user && (isLoadingRecommendations || (recommendedServices?.data && recommendedServices.data.length > 0)) && (
            <section className="mb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-purple-600" /> Para Você</h2>
                    <Link to={createPageUrl("ServicosLista", "?filter=recommended")}>
                        <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700">Ver todos</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingRecommendations ? (
                        Array.from({ length: 3 }).map((_, i) => <ServiceSkeletonCard key={i} />)
                    ) : (
                        recommendedServices.data.map((service) => {
                            const provider = providers?.find(p => p.id === service.provider_id);
                            return <ServiceCard key={service.id} service={service} provider={provider} />;
                        })
                    )}
                </div>
            </section>
        )}

        {/* Featured Services */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Serviços em Destaque</h2>
            <Link to={createPageUrl("ServicosLista")} data-testid="home-ver-todos-servicos-link">
              <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700" aria-label="Ver todos os serviços">
                Ver todos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingServices ? (
              Array.from({ length: 3 }).map((_, i) => <ServiceSkeletonCard key={i} />)
            ) : isErrorServices ? (
              <div className="col-span-full text-center py-10 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                <p className="text-red-700">Não foi possível carregar os serviços em destaque.</p>
              </div>
            ) : (
              services.map((service) => {
                const provider = providers?.find(p => p.id === service.provider_id);
                return <ServiceCard key={service.id} service={service} provider={provider} />;
              })
            )}
          </div>
        </section>

        {/* Top Rated Providers */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Profissionais Bem Avaliados</h2>
            <p className="text-slate-600 mt-2">Os favoritos da comunidade, com qualidade comprovada.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {isLoadingProviders ? (
                Array.from({ length: 6 }).map((_, i) => <ProviderSkeletonCard key={i} />)
            ) : isErrorProviders ? (
              <div className="col-span-full text-center py-10 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                <p className="text-red-700">Não foi possível carregar os profissionais.</p>
              </div>
            ) : (
                topProviders.map((provider) => (
                  <Link key={provider.id} to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all text-center cursor-pointer">
                      <CardContent className="p-4">
                        <div className="relative mb-3">
                          <LazyImage
                            src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                            alt={`Foto de perfil de ${provider.full_name}`}
                            className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md"
                          />
                          {provider.verified && (
                            <div className="absolute bottom-0 right-1/2 translate-x-1/2 bg-cyan-500 rounded-full p-1">
                              <Star className="w-3 h-3 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-slate-900 mb-1">{provider.full_name}</p>
                        <p className="text-xs text-slate-600 mb-2">{provider.occupation}</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Quick Help CTA */}
        <Card className="border-none bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-2xl mt-20">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Preciso de Ajuda Urgente!</h3>
            <p className="text-orange-50 mb-6">
              Precisa de um serviço com urgência? Entre em contato e encontraremos alguém disponível agora.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50" data-testid="home-ajuda-urgente-button">
              <Phone className="w-5 h-5 mr-2" />
              Solicitar Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
