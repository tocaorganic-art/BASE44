import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PermissionChecker({ children, requiredRole = null, requiredUserType = null }) {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [errorDetails, setErrorDetails] = useState(null);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        return userData;
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (isLoading) {
      setPermissionStatus('checking');
      return;
    }

    if (error) {
      setPermissionStatus('error');
      setErrorDetails({
        code: 'AUTH_ERROR',
        message: 'Falha na autenticação',
        details: error.message,
      });
      return;
    }

    if (!user) {
      setPermissionStatus('unauthorized');
      setErrorDetails({
        code: 'NO_USER',
        message: 'Usuário não autenticado',
        details: 'Sessão inválida ou expirada',
      });
      return;
    }

    // Verificar role se necessário
    if (requiredRole && user.role !== requiredRole) {
      setPermissionStatus('forbidden');
      setErrorDetails({
        code: 'INSUFFICIENT_ROLE',
        message: 'Acesso negado',
        details: `Esta página requer perfil "${requiredRole}". Seu perfil: "${user.role || 'indefinido'}"`,
      });
      return;
    }

    // Verificar user_type se necessário
    if (requiredUserType && user.user_type !== requiredUserType) {
      setPermissionStatus('forbidden');
      setErrorDetails({
        code: 'INSUFFICIENT_USER_TYPE',
        message: 'Acesso negado',
        details: `Esta página requer tipo de usuário "${requiredUserType}". Seu tipo: "${user.user_type || 'indefinido'}"`,
      });
      return;
    }

    // Verificar se user_type está indefinido (novo usuário)
    if (user.user_type === 'indefinido' && window.location.pathname !== '/CadastroTipo') {
      setPermissionStatus('needs_setup');
      setErrorDetails({
        code: 'USER_SETUP_REQUIRED',
        message: 'Configure sua conta',
        details: 'Você precisa selecionar como deseja usar a plataforma',
      });
      return;
    }

    setPermissionStatus('authorized');
  }, [user, isLoading, error, requiredRole, requiredUserType]);

  // Loading
  if (permissionStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Verificando acesso...</h2>
            <p className="text-slate-600">Aguarde enquanto validamos suas credenciais.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Needs Setup (user_type indefinido)
  if (permissionStatus === 'needs_setup') {
    window.location.href = '/CadastroTipo';
    return null;
  }

  // Unauthorized (não logado)
  if (permissionStatus === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Negado</h2>
            <p className="text-slate-600 mb-4">{errorDetails?.details}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-red-800 font-mono">
                Código: {errorDetails?.code}
              </p>
            </div>
            <Button onClick={() => base44.auth.redirectToLogin(window.location.pathname)} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Forbidden (logado mas sem permissão)
  if (permissionStatus === 'forbidden') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <Card className="w-full max-w-md border-yellow-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sem Permissão</h2>
            <p className="text-slate-600 mb-4">{errorDetails?.details}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-yellow-800 font-mono">
                Código: {errorDetails?.code}
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Se você acredita que deveria ter acesso, entre em contato com o suporte.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                Ir para Início
              </Button>
              <Button onClick={() => base44.auth.logout()} variant="destructive" className="flex-1">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error
  if (permissionStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Erro de Autenticação</h2>
            <p className="text-slate-600 mb-4">{errorDetails?.details}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-red-800 font-mono">
                Código: {errorDetails?.code}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => refetch()} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => base44.auth.logout()} variant="destructive" className="flex-1">
                <LogOut className="w-4 h-4 mr-2" />
                Sair e Relogar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}