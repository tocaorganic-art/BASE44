import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Info, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReviewModal from '@/components/reviews/ReviewModal';

const statusConfig = {
  Pendente: { color: "bg-yellow-500", text: "Pendente" },
  Confirmado: { color: "bg-blue-500", text: "Confirmado" },
  "Em Andamento": { color: "bg-teal-500", text: "Em Andamento" },
  Concluído: { color: "bg-green-500", text: "Concluído" },
  Rejeitado: { color: "bg-red-500", text: "Rejeitado" },
  Cancelado: { color: "bg-slate-500", text: "Cancelado" },
};

function RequestCard({ request, provider, onReviewClick, hasReview }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Prestador:</p>
            <CardTitle className="text-lg">{provider?.full_name || "Carregando..."}</CardTitle>
          </div>
          <Badge className={`${statusConfig[request.status]?.color} text-white`}>
            {statusConfig[request.status]?.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{format(new Date(request.date), "PPP", { locale: ptBR })}</span>
          </div>
          <p className="text-slate-600 bg-slate-50 p-3 rounded-md border">{request.message || "Nenhuma observação enviada."}</p>
        </div>
      </CardContent>
      {(request.status === 'Concluído' || hasReview) && (
        <div className="p-4 pt-0">
          <Button 
            className="w-full border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300" 
            variant={hasReview ? "secondary" : "outline"}
            onClick={() => !hasReview && onReviewClick(request, provider)}
            disabled={hasReview}
          >
            <Star className="w-4 h-4 mr-2" />
            {hasReview ? "Serviço Avaliado" : "Avaliar Serviço"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function MeusPedidosPage() {
  const [reviewingRequest, setReviewingRequest] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['myServiceRequests', user?.id],
    queryFn: () => base44.entities.ServiceRequest.filter({ client_id: user.id }, '-date'),
    enabled: !!user,
    initialData: [],
  });
  
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['myReviews', user?.id],
    queryFn: () => base44.entities.ServiceReview.filter({ created_by: user.email }),
    enabled: !!user,
    initialData: [],
  });

  const { data: providers, isLoading: isLoadingProviders } = useQuery({
    queryKey: ['allProviders'],
    queryFn: () => base44.entities.ServiceProvider.list(),
    initialData: [],
  });

  if (isLoadingRequests || isLoadingProviders || isLoadingReviews) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const reviewedRequestIds = new Set(reviews.map(r => r.request_id));

  return (
    <div className="min-h-screen bg-slate-50">
      {reviewingRequest && (
        <ReviewModal
          request={reviewingRequest.request}
          provider={reviewingRequest.provider}
          user={user}
          onClose={() => setReviewingRequest(null)}
        />
      )}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Meus Pedidos</h1>
          <p className="text-slate-600">Acompanhe e avalie suas solicitações de serviço.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {requests && requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(req => {
              const provider = providers.find(p => p.id === req.provider_id);
              const hasReview = reviewedRequestIds.has(req.id);
              return (
                <RequestCard 
                  key={req.id} 
                  request={req} 
                  provider={provider} 
                  hasReview={hasReview}
                  onReviewClick={(request, provider) => setReviewingRequest({ request, provider })} 
                />
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-16">
            <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">Nenhum pedido encontrado</h3>
            <p className="text-slate-500 mt-2 mb-6">Você ainda não fez nenhuma solicitação de serviço.</p>
            <Link to={createPageUrl("Home")}>
              <Button>Encontrar Serviços</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}