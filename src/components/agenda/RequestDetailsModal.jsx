import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Clock, MapPin, DollarSign, MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ServiceLocationMap from '@/components/map/ServiceLocationMap';

export default function RequestDetailsModal({ request, service, isOpen, onClose, onConfirm, onReject }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!request || !service) return null;

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Por favor, forneça um motivo para a rejeição.');
      return;
    }
    onReject(request.id, rejectionReason);
  };

  const handleConfirm = () => {
    onConfirm(request.id);
  };

  const renderContent = () => {
    if (showRejectionForm) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação</DialogTitle>
            <DialogDescription>Por favor, informe ao cliente o motivo da rejeição. Isso ajuda a manter uma boa comunicação na plataforma.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Infelizmente não tenho disponibilidade nesta data."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionForm(false)}>Voltar</Button>
            <Button variant="destructive" onClick={handleReject}>Confirmar Rejeição</Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação</DialogTitle>
          <div className="flex items-center justify-between">
            <DialogDescription>#{request.id.slice(0, 8)}</DialogDescription>
            <Badge className={request.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
              {request.status}
            </Badge>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {/* Client Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full"><User className="w-5 h-5 text-slate-600" /></div>
                <div>
                  <p className="font-semibold text-slate-900">{request.client_name}</p>
                  <p className="text-sm text-slate-500">{request.client_phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Service Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-slate-800">Serviço Solicitado</h4>
              <div className="flex items-center justify-between">
                <p className="font-medium">{service.title}</p>
                <Badge variant="secondary">{service.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Valor:</span>
                <span className="font-bold text-green-600">R$ {service.price.toFixed(2)} / {service.price_unit}</span>
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                        <p className="text-sm text-slate-500">Data</p>
                        <p className="font-semibold">{format(new Date(request.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <div>
                        <p className="text-sm text-slate-500">Horário</p>
                        <p className="font-semibold">{request.time || 'A combinar'}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message */}
          {request.message && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Mensagem do Cliente:</p>
                        <p className="text-slate-700 italic">"{request.message}"</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          {request.location?.lat && request.location?.lng && (
            <Card>
                <CardContent className="p-4">
                     <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Localização do Serviço</h4>
                     <div className="h-48 w-full rounded-md overflow-hidden mb-3">
                        <ServiceLocationMap locations={[{ position: [request.location.lat, request.location.lng]}]} />
                     </div>
                     <p className="text-sm text-slate-600">
                        {request.location.address}, {request.location.number}
                        {request.location.complement && `, ${request.location.complement}`}
                     </p>
                     {request.location.reference && <p className="text-xs text-slate-500 mt-1">Ref: {request.location.reference}</p>}
                </CardContent>
            </Card>
          )}
        </div>
        {request.status === 'Pendente' && (
            <DialogFooter className="pt-4 border-t">
                <Button variant="destructive" onClick={() => setShowRejectionForm(true)}>Rejeitar</Button>
                <Button onClick={handleConfirm}>Confirmar Agendamento</Button>
            </DialogFooter>
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}