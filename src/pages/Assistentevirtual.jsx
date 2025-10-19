import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ChatInterface from '@/components/chat/ChatInterface';
import { Loader2, PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AssistentevirtualPage() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: conversations, isLoading: isConversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => base44.entities.Conversation.filter({ userId: user.id }, '-created_date'),
    enabled: !!user,
    initialData: [],
  });

  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    if (!activeConversationId && conversations && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);
  
  const createConversationMutation = useMutation({
    mutationFn: () => base44.entities.Conversation.create({ 
      userId: user.id, 
      userName: user.full_name || user.email,
      lastMessage: "Nova conversa iniciada..."
    }),
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      setActiveConversationId(newConversation.id);
    },
  });

  const isLoading = isUserLoading || isConversationsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
            <MessageSquare className="w-20 h-20 text-blue-600 mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Assistente Virtual Toca</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md">Faça login para conversar com o Toca e receber ajuda personalizada sobre serviços em Trancoso.</p>
            <Button onClick={() => base44.auth.redirectToLogin()} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Fazer Login
            </Button>
        </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Sidebar de Conversas - Melhorado com contraste */}
      <div className="w-full md:w-1/3 max-w-sm bg-white border-r border-slate-300 flex flex-col shadow-lg">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-xl font-bold text-white">Minhas Conversas</h2>
          <Button size="icon" variant="ghost" onClick={() => createConversationMutation.mutate()} disabled={createConversationMutation.isPending} aria-label="Iniciar nova conversa" className="hover:bg-white/20 text-white">
            {createConversationMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.length > 0 ? (
            <ul>
              {conversations.map(convo => (
                <li key={convo.id}
                    className={`p-5 cursor-pointer border-l-4 transition-all hover:bg-slate-50 ${activeConversationId === convo.id ? 'bg-blue-50 border-blue-600 shadow-inner' : 'border-transparent'}`}
                    onClick={() => setActiveConversationId(convo.id)}>
                    <p className="font-semibold text-slate-900 truncate mb-1">
                        Conversa de {format(new Date(convo.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-slate-600 truncate">{convo.lastMessage || 'Nenhuma mensagem ainda'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
               <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-400" />
               <p className="font-semibold text-slate-700 mb-2">Nenhuma conversa encontrada.</p>
               <p className="text-sm text-slate-500">Clique no <PlusCircle className="inline w-4 h-4" /> para começar a conversar com o assistente.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Área do Chat - Expandida */}
      <main className="flex-1 flex flex-col">
        {activeConversationId ? (
          <ChatInterface conversationId={activeConversationId} key={activeConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center bg-gradient-to-br from-white to-slate-50">
            <div>
              <MessageSquare className="w-20 h-20 mx-auto mb-6 text-blue-600 opacity-50" />
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Selecione ou crie uma conversa</h3>
              <p className="text-slate-600 max-w-md mx-auto">Suas interações com o assistente Toca ficarão salvas aqui. Use o botão <PlusCircle className="inline w-4 h-4" /> para começar.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}