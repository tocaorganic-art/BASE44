import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, UserCheck, Star, Lock } from 'lucide-react';

const SecurityFeature = ({ icon, title, description }) => (
  <Card className="border-none shadow-lg text-center">
    <CardContent className="p-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </CardContent>
  </Card>
);

export default function SegurancaPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <ShieldCheck className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Sua Segurança é Nossa Prioridade</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Construímos uma comunidade de confiança em Trancoso. Veja as medidas que tomamos para garantir uma experiência segura para todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SecurityFeature
            icon={<UserCheck className="w-8 h-8" />}
            title="Perfis Verificados"
            description="Prestadores com o selo 'Verificado' passaram por uma análise de documentos, garantindo que são quem dizem ser. Priorize sempre profissionais com este selo para mais tranquilidade."
          />
          <SecurityFeature
            icon={<Star className="w-8 h-8" />}
            title="Sistema de Avaliações"
            description="Após cada serviço, clientes avaliam os prestadores. Esse sistema transparente ajuda você a escolher os profissionais mais bem qualificados e confiáveis da nossa comunidade."
          />
          <SecurityFeature
            icon={<Lock className="w-8 h-8" />}
            title="Proteção de Dados (LGPD)"
            description="Levamos sua privacidade a sério. Seus dados pessoais são protegidos e utilizados apenas para o funcionamento da plataforma, seguindo todas as diretrizes da Lei Geral de Proteção de Dados (LGPD)."
          />
        </div>
        
        <Card className="mt-16 bg-white border-none shadow-xl">
           <CardHeader>
             <CardTitle className="text-2xl text-center">Nossas Diretrizes de Confiança</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6 text-slate-700">
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Pagamentos Seguros</h4>
                  <p>Atualmente, os pagamentos são diretos entre cliente e prestador. Recomendamos o uso de métodos rastreáveis como PIX ou transferência. Futuramente, integraremos um sistema de pagamento interno para centralizar e proteger ainda mais suas transações.</p>
               </div>
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Resolução de Disputas</h4>
                  <p>Incentivamos a comunicação aberta para resolver qualquer problema. Caso não seja possível um acordo, nossa equipe de suporte está disponível para mediar a situação. O histórico de conversas e avaliações são ferramentas importantes nesse processo.</p>
               </div>
               <div>
                  <h4 className="font-semibold text-lg text-slate-800">Dicas para uma Boa Experiência</h4>
                  <p><strong>Para Clientes:</strong> Seja claro sobre suas necessidades ao solicitar um serviço. Comunique-se abertamente e não hesite em perguntar.<br/>
                  <strong>Para Prestadores:</strong> Mantenha seu perfil e agenda atualizados. Seja pontual e profissional para garantir boas avaliações.</p>
               </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}