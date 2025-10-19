import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou o assistente de suporte da Trancoso Experience. Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call a support API)
    setTimeout(() => {
      const responses = [
        'Entendi sua solicitação. Deixe-me verificar isso para você...',
        'Vou encaminhar sua dúvida para nossa equipe de suporte. Eles retornarão em breve.',
        'Essa é uma ótima pergunta! Vou buscar as informações para você.',
        'Obrigado por entrar em contato. Estou processando sua solicitação.',
      ];

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    'Como funciona a plataforma?',
    'Preciso de ajuda com pagamento',
    'Como cancelar um serviço?',
    'Falar com um atendente',
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
        aria-label="Abrir chat de suporte"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80' : 'w-96'}`}>
      <Card className="shadow-2xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Suporte ao Vivo</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs">Online agora</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/20 text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="p-4 bg-white border-t space-y-2">
                <p className="text-xs text-slate-500 font-medium mb-2">Ações Rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessage(action);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs h-auto py-2 px-3"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!message.trim()} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}