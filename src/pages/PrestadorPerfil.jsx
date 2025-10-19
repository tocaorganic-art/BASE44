
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LazyImage from "@/components/ui/LazyImage";
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Award, Clock,
  DollarSign, MessageCircle, CheckCircle, Calendar as CalendarIcon, Images, PartyPopper, ChevronRight, Check
} from "lucide-react";
import { toast } from "sonner";
import StarRating from "@/components/reviews/StarRating";
import ServiceLocationMap from "@/components/map/ServiceLocationMap";

export default function PrestadorPerfilPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('id');

  const { data: user, isSuccess: isUserLoaded } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [requestData, setRequestData] = useState({
    client_name: "",
    client_phone: "",
    service_id: "",
    date: undefined,
    message: "",
    location: { address: '', number: '', complement: '', reference: '', lat: null, lng: null },
  });

  const queryClient = useQueryClient();

  const { data: provider, isLoading } = useQuery({
    queryKey: ['serviceProvider', providerId],
    queryFn: async () => {
      const providers = await base44.entities.ServiceProvider.list();
      return providers.find(p => p.id === providerId);
    },
    enabled: !!providerId,
  });

  const { data: services } = useQuery({
    queryKey: ['providerServices', providerId],
    queryFn: () => base44.entities.ServiceListing.filter({ provider_id: providerId }),
    initialData: [],
    enabled: !!providerId,
  });

  const { data: reviews } = useQuery({
    queryKey: ['providerReviews', providerId],
    queryFn: () => base44.entities.ServiceReview.filter({ provider_id: providerId }, '-created_date'),
    initialData: [],
    enabled: !!providerId,
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.ServiceRequest.create(data),
    onSuccess: () => {
      toast.success("Solicitação enviada com sucesso! O prestador entrará em contato.");
      setShowRequestForm(false);
      setBookingSuccess(true);
      setStep(1); // Reset step for next booking
      setRequestData({
        client_name: "",
        client_phone: "",
        service_id: "",
        date: undefined,
        message: "",
        location: { address: '', number: '', complement: '', reference: '', lat: null, lng: null },
      });
    },
  });

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return `(${phoneNumber}`;
    if (phoneNumberLength < 8) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };


  const handleNextStep = () => {
     // Validações da Etapa 1
    if (!requestData.client_name.trim()) {
      toast.error("O campo 'Nome' é obrigatório.");
      return;
    }
    // Regex for (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(requestData.client_phone)) {
      toast.error("Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.");
      return;
    }
    if (!requestData.service_id) {
      toast.error("Por favor, selecione um serviço.");
      return;
    }
    if (!requestData.date) {
      toast.error("Por favor, selecione uma data para o serviço.");
      return;
    }
    setStep(2);
  }

  const handleSubmitRequest = (e) => {
    e.preventDefault();

    // Validação da Etapa 2
    if (!requestData.location.lat || !requestData.location.lng) {
      toast.error("Por favor, selecione uma localização no mapa.");
      return;
    }
     if (!requestData.location.address.trim()) {
      toast.error("Por favor, preencha a rua/avenida.");
      return;
    }

    createRequestMutation.mutate({
      ...requestData,
      client_id: user?.id,
      provider_id: providerId,
      date: requestData.date ? format(requestData.date, "yyyy-MM-dd") : null,
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>;
  }

  if (!provider) {
    return <div className="container mx-auto px-4 py-8">Prestador não encontrado</div>;
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews)
    : (provider.rating || 0);
  
  const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
  }, {1:0, 2:0, 3:0, 4:0, 5:0});


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-cyan-500 to-blue-600">
        <LazyImage
          src="https://images.unsplash.com/photo-1541599360-14863869b657?q=80&w=1964&auto=format&fit=crop"
          alt="Imagem de fundo abstrata"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-24 pb-12">
        <Link to={createPageUrl("ServicosCategoria", `?cat=${provider.occupation}`)}>
          <Button variant="ghost" className="text-white hover:bg-white/20 mb-4 bg-black/20 backdrop-blur-sm" aria-label="Voltar para a categoria de serviços">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Profile Card */}
        <Card className="border-none shadow-2xl mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <LazyImage
                  src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=400`}
                  alt={`Foto de perfil de ${provider.full_name}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto md:mx-0"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-1">{provider.full_name}</h1>
                      <p className="text-lg text-cyan-600 font-medium">{provider.occupation}</p>
                    </div>
                    {provider.verified && (
                      <Badge className="bg-cyan-100 text-cyan-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <StarRating rating={averageRating} />
                      <span className="text-xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : 'Novo'}</span>
                      <span className="text-sm text-slate-500">({reviews.length} avaliações)</span>
                    </div>
                    {provider.price_range && (
                      <Badge variant="outline" className="text-base border-slate-300">{provider.price_range}</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                    {provider.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        {isUserLoaded && user ? (
                          <span>{provider.phone}</span>
                        ) : (
                          <span className="italic text-slate-500">Faça login para ver</span>
                        )}
                      </div>
                    )}
                    {provider.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                         {isUserLoaded && user ? (
                          <span>{provider.email}</span>
                        ) : (
                          <span className="italic text-slate-500">Faça login para ver</span>
                        )}
                      </div>
                    )}
                    {provider.location?.city && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location.city}</span>
                      </div>
                    )}
                    {provider.experience_years && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Award className="w-4 h-4" />
                        <span>{provider.experience_years} anos de experiência</span>
                      </div>
                    )}
                  </div>

                  <Badge className={`text-sm ${
                    provider.availability === 'Disponível' ? 'bg-green-100 text-green-800' :
                    provider.availability === 'Ocupado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {provider.availability}
                  </Badge>
                </div>
              </div>
            </div>

            {provider.bio && (
              <div className="bg-slate-50 p-8 border-y">
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Sobre {provider.full_name.split(' ')[0]}</h3>
                <p className="text-slate-700 leading-relaxed">{provider.bio}</p>
              </div>
            )}

            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={() => { setShowRequestForm(true); setBookingSuccess(false); setStep(1); }}
                  aria-label="Agendar um serviço com o prestador"
                  disabled={!isUserLoaded}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {user ? "Agendar Serviço" : "Faça login para Agendar"}
                </Button>
                {isUserLoaded && user && provider.phone ? (
                  <Button size="lg" variant="outline" asChild className="flex-1 border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                    <a href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Conversar com o prestador no WhatsApp">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Conversar no WhatsApp
                    </a>
                  </Button>
                ) : (
                   <Button size="lg" variant="outline" className="flex-1 border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300" onClick={() => base44.auth.redirectToLogin()} aria-label="Faça login para conversar com o prestador no WhatsApp">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Faça login para conversar
                    </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form with Calendar */}
        {showRequestForm && !bookingSuccess && (
          <Card className="border-none shadow-xl mb-8">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardTitle>Agendar com {provider.full_name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                {step === 1 && (
                  <>
                    <p className="text-sm text-slate-600 mb-4 font-semibold">Etapa 1 de 2: Detalhes do Serviço</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_name">Seu Nome *</Label>
                        <Input id="client_name" value={requestData.client_name} onChange={(e) => setRequestData({...requestData, client_name: e.target.value})} aria-required="true" />
                      </div>
                      <div>
                        <Label htmlFor="client_phone">Telefone *</Label>
                        <Input id="client_phone" type="tel" value={requestData.client_phone} onChange={(e) => setRequestData({...requestData, client_phone: formatPhoneNumber(e.target.value)})} placeholder="(XX) XXXXX-XXXX" maxLength={15} aria-required="true" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service_id">Serviço Desejado *</Label>
                       <Select value={requestData.service_id} onValueChange={(value) => setRequestData({ ...requestData, service_id: value })} >
                        <SelectTrigger id="service_id" aria-label="Selecione um serviço" aria-required="true">
                          <SelectValue placeholder="Selecione um serviço..." />
                        </SelectTrigger>
                        <SelectContent>
                          {services.length > 0 ? (
                            services.map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.title} - R$ {service.price.toFixed(2)} / {service.price_unit}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="disabled" disabled>Nenhum serviço cadastrado</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data Desejada *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                            aria-label={requestData.date ? `Data selecionada: ${format(requestData.date, "PPP", { locale: ptBR })}` : "Escolha uma data para o serviço"}
                            aria-required="true"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {requestData.date ? format(requestData.date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={requestData.date}
                            onSelect={(date) => setRequestData({ ...requestData, date })}
                            initialFocus
                            locale={ptBR}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            aria-label="Calendário para selecionar a data do serviço"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="message">Observações / Necessidades Especiais</Label>
                      <Textarea id="message" value={requestData.message} onChange={(e) => setRequestData({...requestData, message: e.target.value})} placeholder="Ex: Tenho um cachorro grande, mas ele é dócil." rows={3} aria-label="Observações ou necessidades especiais para o serviço" />
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)} className="flex-1" aria-label="Cancelar agendamento">
                        Cancelar
                      </Button>
                      <Button type="button" onClick={handleNextStep} disabled={services.length === 0} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600" aria-label="Continuar para a próxima etapa do agendamento">
                        Continuar <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-sm text-slate-600 mb-4 font-semibold">Etapa 2 de 2: Localização do Serviço</p>
                    <div className="mb-4">
                      <Label>Onde o serviço será realizado?</Label>
                      <ServiceLocationMap 
                        initialPosition={[-16.5925, -39.0931]} // Default Trancoso
                        onLocationSelect={(pos) => setRequestData(prev => ({...prev, location: {...prev.location, lat: pos[0], lng: pos[1]}}))} 
                      />
                       {requestData.location.lat && requestData.location.lng && (
                         <p className="text-xs text-slate-500 mt-2">Localização selecionada: {requestData.location.lat.toFixed(4)}, {requestData.location.lng.toFixed(4)}</p>
                       )}
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg text-slate-700">Detalhes do endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                           <Label htmlFor="address">Rua/Avenida *</Label>
                           <Input id="address" value={requestData.location.address} onChange={(e) => setRequestData(prev => ({...prev, location: {...prev.location, address: e.target.value}}))} placeholder="Ex: Rua das Flores" aria-required="true" />
                        </div>
                        <div>
                           <Label htmlFor="number">Número</Label>
                           <Input id="number" value={requestData.location.number} onChange={(e) => setRequestData(prev => ({...prev, location: {...prev.location, number: e.target.value}}))} placeholder="Ex: 123" aria-label="Número do endereço" />
                        </div>
                      </div>
                      <div>
                           <Label htmlFor="complement">Complemento</Label>
                           <Input id="complement" value={requestData.location.complement} onChange={(e) => setRequestData(prev => ({...prev, location: {...prev.location, complement: e.target.value}}))} placeholder="Apto, bloco, casa..." aria-label="Complemento do endereço" />
                      </div>
                       <div>
                           <Label htmlFor="reference">Ponto de Referência</Label>
                           <Input id="reference" value={requestData.location.reference} onChange={(e) => setRequestData(prev => ({...prev, location: {...prev.location, reference: e.target.value}}))} placeholder="Ex: Próximo à padaria" aria-label="Ponto de referência do endereço" />
                      </div>
                    </div>
                     <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" aria-label="Voltar para a etapa anterior">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                        </Button>
                        <Button type="submit" disabled={createRequestMutation.isPending} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600" aria-label="Confirmar agendamento do serviço">
                            {createRequestMutation.isPending ? "Enviando..." : <>Confirmar Agendamento <Check className="w-4 h-4 ml-1" /></>}
                        </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Booking Success Confirmation */}
        {bookingSuccess && (
            <Card className="border-none shadow-xl mb-8 bg-gradient-to-br from-green-50 to-cyan-50">
                <CardContent className="p-8 text-center">
                    <PartyPopper className="w-16 h-16 text-green-600 mx-auto mb-4" aria-hidden="true" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Solicitação Enviada!</h2>
                    <p className="text-slate-700 mb-6">O prestador foi notificado e entrará em contato em breve para confirmar o agendamento. Você pode acompanhar o status na página "Meus Pedidos".</p>
                    <div className="flex gap-4 justify-center">
                        <Link to={createPageUrl("MeusPedidos")}>
                            <Button aria-label="Ver meus pedidos">Ver Meus Pedidos</Button>
                        </Link>
                        <Button variant="outline" onClick={() => setBookingSuccess(false)} aria-label="Fechar mensagem de sucesso">Fechar</Button>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* Portfolio */}
        {provider.portfolio_images && provider.portfolio_images.length > 0 && (
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                Portfólio de Trabalhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {provider.portfolio_images.map((img, index) => (
                  <LazyImage key={index} src={img} alt={`Trabalho ${index + 1} do portfólio de ${provider.full_name}`} className="rounded-lg w-full h-40 object-cover" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        {services.length > 0 && (
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                Serviços Oferecidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{service.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                        {service.duration_estimate && <Badge variant="secondary">Duração: {service.duration_estimate}</Badge>}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-cyan-600">R$ {service.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">por {service.price_unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" aria-hidden="true" />
              Avaliações de Clientes ({totalReviews})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalReviews > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b">
                <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                  <p className="text-5xl font-bold text-slate-800 mb-2">{averageRating > 0 ? averageRating.toFixed(1) : 'Novo'}</p>
                  <StarRating rating={averageRating} size={20} /> {/* Ensure rating is a number */}
                  <p className="text-sm text-slate-500 mt-1">Baseado em {totalReviews} avaliações</p>
                </div>
                <div className="md:col-span-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution[star] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-10 text-slate-600">{star} {star > 1 ? 'estrelas' : 'estrela'}</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                           <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="w-8 text-right text-slate-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                         <LazyImage 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name || 'A')}&background=random`} 
                            alt={review.reviewer_name ? `Avatar de ${review.reviewer_name}` : "Avatar de cliente anônimo"}
                            className="w-10 h-10 rounded-full"
                         />
                         <div>
                            <p className="font-semibold text-slate-900">{review.reviewer_name || "Cliente Anônimo"}</p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(review.created_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </p>
                         </div>
                      </div>
                      <StarRating rating={review.rating} aria-label={`Avaliação de ${review.rating} estrelas`} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-700 italic mb-3">"{review.comment}"</p>
                    )}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {review.photos.map(photo => (
                           <LazyImage key={photo} src={photo} alt={`Foto da avaliação de ${review.reviewer_name}`} className="w-20 h-20 rounded-md object-cover"/>
                        ))}
                      </div>
                    )}
                    {review.response && (
                        <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-100 p-3 rounded-md">
                            <p className="text-sm font-semibold text-slate-800">Resposta de {provider.full_name.split(' ')[0]}:</p>
                            <p className="text-sm text-slate-600 mt-1">"{review.response}"</p>
                            {review.response_date && <p className="text-xs text-slate-500 text-right mt-2">{format(new Date(review.response_date), "dd/MM/yyyy")}</p>}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
