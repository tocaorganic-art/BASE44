import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function CadastroTipoPage() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const updateUserMutation = useMutation({
    mutationFn: (userType) => base44.auth.updateMe({ user_type: userType }),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      // Redireciona para a página correta após a seleção
      if (data.user_type === 'cliente') {
        window.location.replace('/Home');
      } else if (data.user_type === 'prestador') {
        window.location.replace('/Dashboard'); // Dashboard do prestador
      }
    },
  });

  const handleSelectType = (type) => {
    updateUserMutation.mutate(type);
  };

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }
  
  // Se o usuário já tiver um tipo definido, redireciona
  if (user && user.user_type !== 'indefinido') {
    const targetUrl = user.user_type === 'cliente' 
      ? '/Home' 
      : '/Dashboard';
    window.location.replace(targetUrl);
    return null; // Evita renderização enquanto redireciona
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center shadow-2xl border-none">
        <CardContent className="p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Bem-vindo(a) ao MeAjudaToca!</h1>
          <p className="text-slate-600 mb-10 text-lg">Para começar, nos diga como você gostaria de usar a plataforma.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card 
              className="border-2 border-transparent hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleSelectType('cliente')}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-cyan-700" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Sou Cliente</h2>
                <p className="text-slate-500">Quero encontrar e contratar os melhores serviços em Trancoso.</p>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-transparent hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleSelectType('prestador')}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-700" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Sou Prestador</h2>
                <p className="text-slate-500">Quero oferecer meus serviços e encontrar novos clientes.</p>
              </CardContent>
            </Card>
          </div>
          
          {updateUserMutation.isPending && (
            <p className="mt-8 text-slate-500">Salvando sua escolha...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}