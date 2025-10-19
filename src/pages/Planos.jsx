import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";

const PlanCard = ({ plan, isCurrentPlan }) => {
  const isFeatured = plan.is_featured;

  return (
    <Card 
        className={cn(
            "flex flex-col shadow-lg transition-all hover:shadow-xl hover:-translate-y-2",
            isFeatured && "scale-105 ring-2",
            isCurrentPlan ? "bg-slate-50" : "bg-white"
        )}
        style={{ borderColor: isFeatured ? plan.color_theme : undefined }}
    >
        <CardHeader className="relative text-center p-6" style={{ backgroundColor: isFeatured ? plan.color_theme : (isCurrentPlan ? '#e2e8f0' : '#f8fafc')}}>
            {isFeatured && <Badge className="absolute -top-3 right-5 bg-yellow-400 text-black">Mais Popular</Badge>}
            <h2 className={cn("text-2xl font-bold", isFeatured ? 'text-white' : 'text-slate-900')}>{plan.name}</h2>
            
            {plan.monthly_price > 0 ? (
                <div className={cn("font-bold", isFeatured ? 'text-white' : 'text-slate-900')}>
                    <span className="text-4xl">R${plan.monthly_price.toFixed(2).split('.')[0]}</span>
                    <span className="text-2xl">,{plan.monthly_price.toFixed(2).split('.')[1]}</span>
                    <span className="text-base font-normal">/mês</span>
                </div>
            ) : (
                <span className="text-4xl font-extrabold text-green-600">Grátis</span>
            )}
        </CardHeader>

        <CardContent className="flex-grow p-6 space-y-4">
            <p className="text-slate-600 text-sm h-12">{plan.description}</p>
            
            <ul className="space-y-3 text-slate-700">
                {(plan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>

        <CardFooter className="p-6">
             <Button asChild className="w-full" variant={isFeatured ? 'default' : 'outline'} style={{backgroundColor: isFeatured ? plan.color_theme : undefined}}>
                <Link to={createPageUrl('CadastroTipo')}>
                    {isCurrentPlan ? "Seu Plano Atual" : "Escolher Plano"}
                </Link>
             </Button>
        </CardFooter>
    </Card>
  );
};

export default function PlanosPage() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const allPlans = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para começar e ter sua presença na plataforma.',
      monthly_price: 29.90,
      commission_rate: 0,
      features: ["Listagem de serviços básica", "Até 3 categorias", "Suporte por e-mail", "Perfil verificado", "Estatísticas básicas"],
      is_featured: false,
      color_theme: "#6c757d",
    },
    {
      id: 'pro',
      name: 'Profissional',
      description: "Recursos avançados para prestadores que buscam crescimento.",
      monthly_price: 69.90,
      features: [
        'Listagem de serviços destacada',
        'Até 8 categorias',
        'Suporte prioritário',
        'Perfil verificado',
        'Estatísticas avançadas',
        'Sem taxa por agendamento',
        'Destaque nos resultados de busca'
      ],
      is_featured: true,
      color_theme: "#0A81D1",
      commission_rate: 0,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: "O pacote completo para dominar o mercado local.",
      monthly_price: 119.90,
      features: [
        'Listagem de serviços premium',
        'Categorias ilimitadas',
        'Suporte 24/7',
        'Perfil verificado e destacado',
        'Estatísticas completas e insights de IA',
        'Acesso ao assistente de IA',
        'Ferramentas de marketing'
      ],
      is_featured: false,
      color_theme: "#6366f1",
      commission_rate: 0,
    },
  ];

  if (isUserLoading) {
    return (
      <div className="container mx-auto py-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4"/> 
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Escolha o Plano Ideal para Você</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Impulsione seu negócio em Trancoso com nossos planos personalizados para prestadores de serviço.
          </p>
        </div>
        
        <Alert className="mb-8 max-w-4xl mx-auto bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 !text-blue-700" />
            <AlertTitle className="text-blue-800">Funcionalidade de Compra</AlertTitle>
            <AlertDescription className="text-blue-700">
                A integração de pagamento será implementada em breve. No momento, a seleção de um plano direciona para a página de cadastro.
            </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start justify-center">
          {allPlans.map(plan => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isCurrentPlan={user?.plan_id === plan.id}
            />
          ))}
        </div>

        <div className="text-center mt-16 pt-12 border-t">
          <h3 className="text-2xl font-semibold text-slate-800">Ainda com dúvidas?</h3>
          <p className="text-slate-600 mt-2 mb-6">Nossa equipe está pronta para ajudar a encontrar a melhor solução para você.</p>
          <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700">
            Falar com um Consultor
          </Button>
        </div>
      </div>
    </div>
  );
}