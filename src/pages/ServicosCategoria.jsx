import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LazyImage from "@/components/ui/LazyImage";
import ServiceLocationMap from "@/components/map/ServiceLocationMap";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Star, MapPin, ArrowLeft, Filter, Loader2, AlertCircle, List, Map } from "lucide-react";

const ProviderCard = ({ provider }) => (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
        <CardContent className="p-6 flex flex-col flex-grow">
            <div className="flex items-start gap-4 mb-4">
                <LazyImage
                    src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                    alt={`Foto de perfil de ${provider.full_name}`}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{provider.full_name}</h3>
                            <p className="text-sm text-slate-600">{provider.occupation}</p>
                        </div>
                        {provider.verified && (
                            <Badge className="bg-cyan-100 text-cyan-800">✓ Verificado</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                        </div>
                        {provider.total_reviews > 0 && <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>}
                    </div>
                </div>
            </div>

            {provider.bio && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{provider.bio}</p>
            )}

            <div className="flex items-center justify-between mb-4 mt-auto">
                {provider.location?.city && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location.city}</span>
                    </div>
                )}
                {provider.price_range && (
                    <Badge variant="outline">{provider.price_range}</Badge>
                )}
            </div>

            {provider.availability && (
                 <Badge className={`mb-4 self-start ${
                    provider.availability === 'Disponível' ? 'bg-green-100 text-green-800' :
                    provider.availability === 'Ocupado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {provider.availability}
                </Badge>
            )}

            <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Ver Perfil Completo
                </Button>
            </Link>
        </CardContent>
    </Card>
);

export default function ServicosCategoriaPage() {
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get('cat') || 'Todos');
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [aiFilteredProviderIds, setAiFilteredProviderIds] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const { data: providers, isLoading: isLoadingProviders, isError: isErrorProviders } = useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => base44.entities.ServiceProvider.list('-rating'),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setAiFilteredProviderIds(null);
        return;
      }
      
      if (!providers || providers.length === 0) {
        setAiFilteredProviderIds([]);
        return;
      }

      const performSearch = async () => {
        setIsSearching(true);
        try {
          const providerContext = providers.map(p => ({
            id: p.id,
            name: p.full_name,
            occupation: p.occupation,
            bio: p.bio,
            specialties: p.specialties,
          }));

          const result = await base44.integrations.Core.InvokeLLM({
            prompt: `Baseado na busca do usuário "${searchQuery}", analise a lista de prestadores e retorne os IDs dos mais relevantes. Entenda a intenção, não apenas palavras-chave. Exemplo: se a busca for "consertar vazamento", priorize "Encanador". Contexto: ${JSON.stringify(providerContext)}`,
            response_json_schema: {
              type: "object",
              properties: {
                relevant_provider_ids: {
                  type: "array",
                  items: { type: "string" },
                }
              },
              required: ["relevant_provider_ids"]
            }
          });
          
          setAiFilteredProviderIds(result?.relevant_provider_ids || []);
        } catch (error) {
          console.error("AI search failed:", error);
          setAiFilteredProviderIds([]);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, providers]);


  const filteredProviders = useMemo(() => providers?.filter(provider => {
    const matchesCategory = selectedCategory === 'Todos' || provider.occupation === selectedCategory;
    
    let matchesSearch = true;
    if (searchQuery.trim() !== '') {
        matchesSearch = aiFilteredProviderIds ? aiFilteredProviderIds.includes(provider.id) : false;
    }

    const matchesPrice = priceFilter === "all" || provider.price_range === priceFilter;
    const matchesRating = ratingFilter === "all" || (provider.rating && provider.rating >= parseFloat(ratingFilter));
    
    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  }) || [], [providers, selectedCategory, searchQuery, aiFilteredProviderIds, priceFilter, ratingFilter]);
  
  const locations = useMemo(() => filteredProviders
    .filter(p => p.location?.lat && p.location?.lng)
    .map(p => ({
        position: [p.location.lat, p.location.lng],
        popupContent: `
            <div class="font-sans">
                <h4 class="font-bold text-sm mb-1">${p.full_name}</h4>
                <p class="text-xs text-slate-600">${p.occupation}</p>
                <a href="${createPageUrl("PrestadorPerfil", `?id=${p.id}`)}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 mt-1 block">Ver perfil</a>
            </div>
        `
    })), [filteredProviders]);

  const renderContent = () => {
    if (isLoadingProviders) {
        return (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 text-lg">Carregando profissionais...</p>
          </div>
        );
    }

    if (isErrorProviders) {
        return (
            <div className="text-center py-16 bg-red-50 rounded-lg">
                <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-800">Erro ao Carregar</h3>
                <p className="text-red-600 mt-2">Não foi possível buscar os profissionais. Por favor, tente novamente mais tarde.</p>
            </div>
        );
    }
    
    if (searchQuery.trim() !== '' && isSearching) {
        return (
            <div className="text-center py-16">
                <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 text-lg">Buscando profissionais com IA...</p>
            </div>
        );
    }
    
    if (filteredProviders.length === 0) {
        return (
          <div className="col-span-full text-center py-16 bg-slate-100 rounded-lg">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">Nenhum Profissional Encontrado</h3>
            <p className="text-slate-500 mt-2">Tente ajustar seus filtros ou alterar os termos da sua busca.</p>
          </div>
        );
    }

    if (viewMode === 'map') {
        return (
            <div className="col-span-full h-[600px] md:h-[700px] w-full rounded-lg overflow-hidden shadow-lg">
                <ServiceLocationMap locations={locations} />
            </div>
        );
    }
    
    return filteredProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === 'Todos' ? 'Todos os Serviços' : selectedCategory}
          </h1>
          <p className="text-blue-100">
            {isLoadingProviders ? "Carregando..." :
             (isSearching ? "Buscando com IA..." :
             `${filteredProviders.length} profissionais encontrados`)}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Filtros</h3>
            </div>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="hidden md:flex">
              <ToggleGroupItem value="list" aria-label="Ver em lista">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Ver no mapa">
                <Map className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Busca inteligente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Busca inteligente de profissionais"
              />
              {isSearching && (
                 <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
              )}
            </div>
            
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger aria-label="Filtrar por faixa de preço">
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Preços</SelectItem>
                <SelectItem value="$">$</SelectItem>
                <SelectItem value="$$">$$</SelectItem>
                <SelectItem value="$$$">$$$</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger aria-label="Filtrar por avaliação">
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Avaliações</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.0">4.0+</SelectItem>
                <SelectItem value="3.5">3.5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Providers Grid / Map */}
        <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
}