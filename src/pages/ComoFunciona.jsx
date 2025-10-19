import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, Smile, UserCheck, Briefcase, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const ProcessStep = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default function ComoFuncionaPage() {
  const faqs = [
    {
      q: "Como o pagamento é feito?",
      a: "O pagamento é combinado e realizado diretamente entre o cliente e o prestador. A plataforma facilita o contato e agendamento, e em breve teremos opções de pagamento integradas."
    },
    {
      q: "O que acontece se eu tiver um problema com o serviço?",
      a: "Recomendamos que você entre em contato com o prestador para resolver. Se não for possível, nossa equipe de suporte pode mediar a situação. A avaliação após o serviço também é uma ferramenta importante."
    },
    {
      q: "Como sei que um prestador é de confiança?",
      a: "Procure por prestadores com o selo 'Verificado'. Leia também as avaliações e comentários de outros clientes, que são um ótimo termômetro da qualidade do serviço."
    },
  ];

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simples, Rápido e Confiável</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conectamos você aos melhores profissionais de Trancoso. Entenda como transformamos suas necessidades em soluções.
          </p>
        </div>

        {/* Para Clientes */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Para Clientes: Sua Solução em 3 Passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProcessStep 
              icon={<Search className="w-8 h-8" />} 
              title="1. Encontre o Serviço" 
              description="Navegue por nossas categorias ou use a busca inteligente para encontrar exatamente o que você precisa, de uma faxina a um passeio exclusivo." 
            />
            <ProcessStep 
              icon={<Calendar className="w-8 h-8" />} 
              title="2. Agende com Facilidade" 
              description="Escolha o melhor profissional com base em avaliações, veja os detalhes do serviço, escolha a data e envie sua solicitação com poucos cliques." 
            />
            <ProcessStep 
              icon={<Smile className="w-8 h-8" />} 
              title="3. Problema Resolvido" 
              description="Receba a confirmação do prestador e aguarde o serviço ser realizado. Após a conclusão, avalie a experiência e ajude nossa comunidade." 
            />
          </div>
        </section>

        {/* Para Prestadores */}
        <section className="mb-20 bg-white p-12 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Para Prestadores: Transforme seu Talento em Negócio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProcessStep 
              icon={<UserCheck className="w-8 h-8" />} 
              title="1. Crie seu Perfil" 
              description="Cadastre-se gratuitamente, adicione seus serviços, fotos e defina seus preços. Um perfil completo atrai mais clientes." 
            />
            <ProcessStep 
              icon={<Briefcase className="w-8 h-8" />} 
              title="2. Receba Propostas" 
              description="Seja notificado sobre novas solicitações de serviço. Gerencie sua agenda, confirme os trabalhos e comunique-se com os clientes." 
            />
            <ProcessStep 
              icon={<BarChart className="w-8 h-8" />} 
              title="3. Cresça seu Negócio" 
              description="Receba pagamentos diretamente dos clientes, construa uma reputação com boas avaliações e use nosso painel para acompanhar seu desempenho." 
            />
          </div>
          <div className="text-center mt-12">
             <Link to={createPageUrl("SejaPrestador")}>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">Quero ser um Prestador</Button>
            </Link>
          </div>
        </section>
        
        {/* FAQ */}
        <section>
           <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Dúvidas Frequentes</h2>
           <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
           </div>
        </section>
      </div>
    </div>
  );
}