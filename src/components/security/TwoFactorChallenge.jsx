import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function TwoFactorChallenge({ action, onSuccess, onCancel }) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    // Auto-send email code if method is email
    const sendEmailCode = async () => {
      try {
        await base44.functions.invoke('send2FACode', { 
          method: 'email',
          action 
        });
      } catch (error) {
        console.error('Erro ao enviar código:', error);
      }
    };

    sendEmailCode();
  }, [action]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error('Digite o código de 6 dígitos.');
      return;
    }

    setIsVerifying(true);
    try {
      await base44.functions.invoke('verify2FACode', { 
        code,
        action 
      });

      toast.success('Verificação concluída!');
      if (onSuccess) onSuccess();
    } catch (error) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= maxAttempts - 1) {
        toast.error('Muitas tentativas falhas.', {
          description: 'Sua sessão foi bloqueada por segurança.',
        });
        setTimeout(() => {
          base44.auth.logout();
        }, 2000);
      } else {
        toast.error('Código inválido.', {
          description: `Tentativa ${attempts + 1} de ${maxAttempts}`,
        });
      }
    } finally {
      setIsVerifying(false);
      setCode('');
    }
  };

  const actionLabels = {
    profile_change: 'Alteração de Perfil',
    withdraw: 'Saque de Fundos',
    plan_upgrade: 'Upgrade de Plano',
    delete_account: 'Exclusão de Conta',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Verificação de Segurança
          </CardTitle>
          <CardDescription>
            Confirme sua identidade para: <strong>{actionLabels[action] || action}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-900">
              Enviamos um código de 6 dígitos para seu email. Digite-o abaixo para continuar.
            </p>
          </div>

          <div>
            <Label htmlFor="2fa-code">Código de Verificação</Label>
            <Input
              id="2fa-code"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl font-mono tracking-widest mt-2"
              autoFocus
            />
          </div>

          {attempts > 0 && (
            <p className="text-sm text-red-600">
              Tentativa {attempts} de {maxAttempts}
            </p>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleVerify} 
              disabled={isVerifying || code.length !== 6}
              className="flex-1"
            >
              {isVerifying ? 'Verificando...' : 'Verificar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}