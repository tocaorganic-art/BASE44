import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2, AlertCircle, Mic, MicOff } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { toast } from 'sonner';

export default function ChatInterface({ conversationId, onConversationUpdate }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (conversationId) {
      const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
        setMessages(data.messages || []);
        if (onConversationUpdate) {
          onConversationUpdate(data);
        }
      });
      return () => unsubscribe();
    }
  }, [conversationId, onConversationUpdate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Erro ao reconhecer voz. Tente novamente.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent) => {
      if (!conversationId) {
        throw new Error('Nenhuma conversa ativa');
      }

      const conversation = await base44.agents.getConversation(conversationId);
      
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageContent,
      });
      
      return conversation;
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversation', conversationId]);
    },
  });

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    const messageToSend = inputMessage.trim();
    setInputMessage('');
    
    try {
      await sendMessageMutation.mutateAsync(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast.error('Reconhecimento de voz não disponível neste navegador.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Escutando... Fale agora.');
    }
  };

  if (!conversationId) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-600">Nenhuma conversa ativa. Inicie uma nova conversa.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-8">
            <p>Olá! Como posso ajudá-lo hoje?</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />
          {recognition && (
            <Button
              type="button"
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
              disabled={sendMessageMutation.isPending}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          <Button
            type="submit"
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}