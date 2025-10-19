import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, X, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';

export default function FeedbackCollector() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData) => {
      // In production, this would save to a Feedback entity
      console.log('Feedback submitted:', feedbackData);
      return feedbackData;
    },
    onSuccess: () => {
      toast.success('Feedback enviado!', {
        description: 'Obrigado por nos ajudar a melhorar a plataforma.',
      });
      setIsOpen(false);
      setRating('');
      setCategory('');
      setMessage('');
    },
  });

  const handleSubmit = () => {
    if (!rating || !category || !message.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }

    submitFeedbackMutation.mutate({
      rating,
      category,
      message,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-24 right-6 shadow-lg z-40"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Dar Feedback
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 z-50">
      <Card className="shadow-2xl border-2">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Envie seu Feedback</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Como foi sua experiência?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={rating === 'positive' ? 'default' : 'outline'}
                onClick={() => setRating('positive')}
                className="flex flex-col gap-2 h-auto py-3"
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="text-xs">Ótima</span>
              </Button>
              <Button
                variant={rating === 'neutral' ? 'default' : 'outline'}
                onClick={() => setRating('neutral')}
                className="flex flex-col gap-2 h-auto py-3"
              >
                <Meh className="w-5 h-5" />
                <span className="text-xs">Ok</span>
              </Button>
              <Button
                variant={rating === 'negative' ? 'default' : 'outline'}
                onClick={() => setRating('negative')}
                className="flex flex-col gap-2 h-auto py-3"
              >
                <ThumbsDown className="w-5 h-5" />
                <span className="text-xs">Ruim</span>
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Categoria
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Reportar Bug</SelectItem>
                <SelectItem value="feature">Sugerir Funcionalidade</SelectItem>
                <SelectItem value="ux">Experiência do Usuário</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Conte-nos mais
            </label>
            <Textarea
              placeholder="Descreva sua experiência, sugestão ou problema..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={submitFeedbackMutation.isPending}
          >
            {submitFeedbackMutation.isPending ? (
              'Enviando...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}