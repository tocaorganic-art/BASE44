import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart2, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Testimonials from '@/components/home/Testimonials';

export default function SejaPrestadorPage() {
  const beneficios = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Alcance Mais Clientes",
      description: "Tenha seu perfil e serviços divulgados para turistas e moradores de Trancoso que buscam por profissionais qualificados."
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-green-600" />,
      title: "Gerenciamento Simplificado",
      description: "Utilize nosso painel para gerenciar sua agenda, confirmar serviços, e acompanhar seu desempenho financeiro de forma fácil e intuitiva."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Construa sua Reputação",
      description: "Receba avaliações de seus clientes e construa uma reputação online sólida que atrai cada vez mais oportunidades de negócio."
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Transforme seu Talento em Negócio em Trancoso</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 mb-8">
            Junte-se à nossa plataforma e conecte-se a uma rede exclusiva de clientes que buscam serviços de alta qualidade.
          </p>
          <Link to={createPageUrl('CadastroTipo')}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold text-lg px-8 py-6">
              Quero ser um prestador
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Benefícios Section */}
      <div className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Vantagens de ser um Parceiro MeAjudaToca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beneficios.map((item, index) => (
            <Card key={index} className="text-center border-none shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Como Funciona Section */}
      <div className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Como Funciona</h2>
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-lg">Crie seu Perfil</h3>
                <p className="text-slate-600">Cadastre-se gratuitamente, adicione seus serviços, fotos de trabalhos anteriores e defina seus preços.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-lg">Receba Solicitações</h3>
                <p className="text-slate-600">Seja notificado quando um cliente solicitar seu serviço. Analise os detalhes e confirme a disponibilidade em sua agenda.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-lg">Realize o Serviço e Receba</h3>
                <p className="text-slate-600">Execute o trabalho com excelência. O pagamento é combinado diretamente com o cliente. Após a conclusão, incentive-o a deixar uma avaliação.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* CTA Final */}
      <div className="bg-white py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Pronto para começar?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">Faça parte da comunidade de profissionais que está prosperando em Trancoso.</p>
          <Link to={createPageUrl('CadastroTipo')}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold text-lg px-8 py-6">
              Cadastre-se Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}