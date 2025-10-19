import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VirtualAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! 👋 Sou o assistente virtual do TOCA Experience. Estou aqui para ajudá-lo a usar todas as ferramentas da plataforma. Pode me perguntar qualquer coisa sobre:\n\n• Como cadastrar clientes\n• Gerenciar hospedagens\n• Criar eventos\n• Alocar equipes\n• Usar o concierge virtual\n• Controlar finanças\n• E muito mais!\n\nComo posso ajudar você hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const prompt = `
Você é o assistente virtual do TOCA Experience, uma plataforma inteligente para gestão de eventos, hospitalidade e serviços de concierge.

O usuário perguntou: "${userMessage}"

Contexto da plataforma:
- CRM Inteligente: Gestão de clientes com análise preditiva
- Hospedagens: Controle de reservas, check-in/out, otimização de ocupação
- Eventos: Planejamento de casamentos, conferências, workshops, etc.
- Equipe: Alocação inteligente de funcionários por habilidades
- Concierge Virtual: Recomendações de restaurantes, passeios, praias com IA
- Financeiro: Controle de receitas/despesas, importação de documentos com IA, relatórios

Forneça uma resposta clara, prática e passo-a-passo de como usar a funcionalidade perguntada.
Se a pergunta for sobre como fazer algo, dê instruções detalhadas.
Use emojis para tornar a resposta mais amigável.
Seja conciso mas completo.
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Como cadastro um novo cliente?",
    "Como criar uma hospedagem?",
    "Como usar o concierge virtual?",
    "Como importar documentos financeiros?",
    "Como alocar equipe para um evento?",
  ];

  return (
    <Card className="glass-card border-none shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span>Assistente Virtual</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-sm font-normal text-slate-600">Tire suas dúvidas sobre a plataforma</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages Area */}
        <ScrollArea className="h-[500px] p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-xl ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100' 
                      : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-5 h-5 text-purple-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                      message.role === 'assistant'
                        ? 'bg-white shadow-md border border-slate-200'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div className="bg-white shadow-md border border-slate-200 p-4 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t bg-slate-50">
            <p className="text-sm font-medium text-slate-700 mb-3">Perguntas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Digite sua pergunta sobre como usar a plataforma..."
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </CardContent>
    </Card>
  );
}