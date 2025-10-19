import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User, Briefcase, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Estrutura JSON para o FAQ, permitindo fácil manutenção e uso pela IA.
const faqContent = {
  geral: {
    title: <><BookOpen className="w-5 h-5" /> Guia Geral</>,
    items: [
      { question: "O que é o MeAjudaToca?", answer: "Somos uma plataforma que conecta clientes a prestadores de serviço locais de confiança em Trancoso, facilitando a busca, agendamento e avaliação de serviços." },
      { question: "Como criar uma conta?", answer: "Clique em 'Entrar' no canto superior direito. Você pode se cadastrar rapidamente usando sua conta do Google, ou com seu e-mail e uma senha. Após o cadastro, escolha se você é 'cliente' ou 'prestador'." },
      { question: "É seguro usar a plataforma?", answer: "Sim. Verificamos nossos prestadores e usamos um sistema de avaliação transparente para garantir a qualidade. Seus dados são protegidos seguindo as diretrizes da LGPD. Visite nossa página de Segurança para mais detalhes." },
      { question: "Como funciona o pagamento?", answer: "Atualmente, a negociação e o pagamento são feitos diretamente entre o cliente e o prestador. A plataforma facilita o contato inicial e o agendamento." },
      { question: "A plataforma cobra alguma taxa dos clientes?", answer: "Não. Para clientes, o uso da plataforma para buscar e contratar serviços é totalmente gratuito." },
    ]
  },
  clientes: {
    title: <><User className="w-5 h-5" /> Para Clientes</>,
    items: [
      { question: "Como contratar um serviço?", answer: "Use a barra de busca ou navegue pelas categorias. No perfil do prestador, escolha o serviço, a data e envie a solicitação. O prestador irá confirmar o agendamento." },
      { question: "Como posso confiar em um prestador?", answer: "Procure por prestadores com o selo 'Verificado'. Leia as avaliações e comentários de outros clientes para tomar sua decisão." },
      { question: "O que significa o selo 'Verificado'?", answer: "Significa que o prestador enviou um documento de identificação que foi validado por nossa equipe, confirmando sua identidade." },
      { question: "Como avaliar um prestador?", answer: "Após a conclusão do serviço, acesse 'Meus Pedidos' no menu do seu perfil e clique em 'Avaliar'. Sua opinião é muito importante para a comunidade." },
      { question: "Posso cancelar um serviço agendado?", answer: "Sim, você pode cancelar uma solicitação em 'Meus Pedidos'. Fique atento às políticas de cancelamento que podem variar entre os prestadores." },
    ]
  },
  prestadores: {
    title: <><Briefcase className="w-5 h-5" /> Para Prestadores</>,
    items: [
      { question: "Como me cadastrar como prestador?", answer: "Clique em 'Seja um prestador' na página inicial, crie sua conta e, em seguida, preencha o formulário em 'Meu Perfil de Prestador' com suas informações, serviços e fotos." },
      { question: "Quais são os custos para ser um prestador?", answer: "Oferecemos diferentes planos, incluindo opções gratuitas e pagas com mais benefícios. Visite a página 'Planos' para ver os detalhes e escolher o melhor para você." },
      { question: "Como recebo mais solicitações?", answer: "Um perfil completo e bem avaliado tem mais chances de ser contratado. Peça para seus clientes o avaliarem após o serviço e mantenha suas informações e agenda atualizadas." },
      { question: "Como gerenciar minha agenda?", answer: "Acesse a 'Minha Agenda' no seu painel para ver todas as solicitações, confirmar, rejeitar e marcar serviços como concluídos. Manter a agenda atualizada é fundamental." },
      { question: "Como ser um prestador 'Verificado'?", answer: "Na página 'Meu Perfil de Prestador', envie um documento de identificação na seção de verificação. Nossa equipe analisará e aplicará o selo ao seu perfil." },
    ]
  },
  tecnico: {
    title: <><Wrench className="w-5 h-5" /> Técnico</>,
    items: [
      { question: "Qual tecnologia a plataforma usa?", answer: "O aplicativo é construído sobre a plataforma Base44, usando React para o frontend, Deno para funções de backend e um banco de dados NoSQL gerenciado." },
      { question: "Como o app funciona com internet instável?", answer: "Estamos trabalhando para otimizar o aplicativo para conexões lentas, comuns em Trancoso. Recursos essenciais são projetados para serem leves e rápidos. Imagens são otimizadas e carregadas de forma preguiçosa (lazy-loading)." },
      { question: "Como a segurança dos dados é garantida?", answer: "Seguimos as melhores práticas de segurança, com autenticação, autorização e políticas de acesso restrito. A infraestrutura da Base44 gerencia a segurança em nível de nuvem, incluindo proteção contra ataques comuns." },
      { question: "O Assistente de IA aprende com minhas conversas?", answer: "Não. Para proteger sua privacidade, cada conversa é tratada de forma isolada. O modelo de IA não é treinado com seus dados e não retém informações entre as sessões." },
    ]
  },
};


const ManualContent = ({ title, items }) => (
  <Card className="h-full border-none shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4 text-slate-700">
        {items.map((item, index) => (
          <li key={index} className="pb-2 border-b border-slate-100 last:border-b-0">
             <h4 className="font-semibold text-slate-800">{item.question}</h4>
             <p className="text-sm">{item.answer}</p>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function ManualPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documentação e Manuais</h1>
          <p className="text-slate-600">Encontre respostas para as perguntas mais comuns e guias sobre como usar a plataforma.</p>
        </div>
      </div>
      
      <Tabs defaultValue="geral" className="w-full">
        {/* Corrigido: Adicionada classe 'h-auto' para melhor ajuste em telas menores */}
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          {/* Corrigido: `focus-visible` para acessibilidade em abas */}
          <TabsTrigger value="geral" className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Geral</TabsTrigger>
          <TabsTrigger value="clientes" className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Clientes</TabsTrigger>
          <TabsTrigger value="prestadores" className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Prestadores</TabsTrigger>
          <TabsTrigger value="tecnico" className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Técnico</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="geral">
            <ManualContent title={faqContent.geral.title} items={faqContent.geral.items} />
          </TabsContent>
          <TabsContent value="clientes">
            <ManualContent title={faqContent.clientes.title} items={faqContent.clientes.items} />
          </TabsContent>
          <TabsContent value="prestadores">
            <ManualContent title={faqContent.prestadores.title} items={faqContent.prestadores.items} />
          </TabsContent>
          <TabsContent value="tecnico">
            <ManualContent title={faqContent.tecnico.title} items={faqContent.tecnico.items} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}