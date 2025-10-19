import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Calendar, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function GettingStartedGuide({ onDismiss }) {
  const steps = [
    {
      icon: <User className="w-6 h-6 text-blue-600" />,
      title: "1. Complete seu Perfil",
      description: "Um perfil completo com foto, biografia e especialidades aumenta sua credibilidade.",
      link: createPageUrl('MeuPerfilPrestador'),
      cta: "Ir para Perfil"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      title: "2. Adicione Seus Serviços",
      description: "Liste os serviços que você oferece, com descrições claras e preços, para que os clientes saibam o que esperar.",
      link: createPageUrl('MeusServicos'), // Assumindo que essa página exista ou será criada
      cta: "Adicionar Serviços"
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      title: "3. Configure sua Agenda",
      description: "Defina seus horários de trabalho para que os clientes possam solicitar agendamentos.",
      link: createPageUrl('MinhaAgenda'),
      cta: "Ver Agenda"
    }
  ];

  return (
    <Card className="mb-8 bg-blue-50 border-blue-200 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-slate-500 hover:bg-blue-100"
        onClick={onDismiss}
      >
        <X className="w-4 h-4" />
      </Button>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Bem-vindo(a) ao seu Painel!</h3>
        <p className="text-slate-600 mb-6">Siga estes passos para configurar sua conta e começar a receber solicitações de serviço.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="bg-white shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-md mb-2">{step.title}</h4>
                <p className="text-sm text-slate-500 mb-4 flex-grow">{step.description}</p>
                <Link to={step.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    {step.cta} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}