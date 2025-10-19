import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const qualityTags = ["Profissionalismo", "Pontualidade", "Qualidade", "Bom Preço", "Comunicação"];

export default function ReviewModal({ request, provider, user, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reviewData) => base44.entities.ServiceReview.create(reviewData),
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");
      queryClient.invalidateQueries({ queryKey: ['myReviews', user.id] });
      queryClient.invalidateQueries({ queryKey: ['providerReviews', provider.id] });
      queryClient.invalidateQueries({ queryKey: ['serviceProvider', provider.id] });
      onClose();
    },
    onError: (error) => {
      toast.error("Erro ao enviar avaliação.", { description: error.message });
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.warning("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    mutation.mutate({
      request_id: request.id,
      provider_id: provider.id,
      rating,
      comment,
      tags: selectedTags,
      reviewer_name: user.full_name,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Avalie o serviço de {provider.full_name}</DialogTitle>
          <DialogDescription>
            Seu feedback é muito importante para ajudar outros usuários e o próprio prestador.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="text-center">
            <Label className="text-lg">Sua nota</Label>
            <StarRating rating={rating} onRatingChange={setRating} size={32} interactive={true} className="justify-center mt-2" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Seu comentário (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva sua experiência..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
             <Label>O que você mais gostou? (opcional)</Label>
             <ToggleGroup 
                type="multiple" 
                variant="outline" 
                className="flex-wrap justify-start"
                value={selectedTags}
                onValueChange={(tags) => setSelectedTags(tags)}
              >
                {qualityTags.map(tag => (
                   <ToggleGroupItem key={tag} value={tag} aria-label={tag}>{tag}</ToggleGroupItem>
                ))}
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}