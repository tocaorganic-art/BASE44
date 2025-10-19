import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Smartphone, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import QRCode from 'react-qr-code';

export default function TwoFactorSetup({ onComplete }) {
  const [method, setMethod] = useState('email');
  const [step, setStep] = useState('choose'); // choose, setup, verify
  const [totpSecret, setTotpSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTOTPSecret = async () => {
    // Simulate TOTP secret generation (in production, this would be backend)
    const secret = Array.from({length: 32}, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
    setTotpSecret(secret);
    setStep('setup');
  };

  const handleEmailSetup = async () => {
    try {
      // Send verification email
      await base44.functions.invoke('send2FACode', { method: 'email' });
      toast.success('Código enviado para seu email!');
      setStep('verify');
    } catch (error) {
      toast.error('Erro ao enviar código.', { description: error.message });
    }
  };

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos.');
      return;
    }

    setIsVerifying(true);
    try {
      // Verify code (backend call)
      await base44.functions.invoke('verify2FACode', { 
        code: verificationCode,
        method 
      });
      
      // Update user settings
      await base44.auth.updateMe({ 
        two_factor_enabled: true,
        two_factor_method: method 
      });

      toast.success('Autenticação de dois fatores ativada!', {
        description: 'Sua conta agora está mais segura.',
      });

      if (onComplete) onComplete();
    } catch (error) {
      toast.error('Código inválido.', { description: 'Tente novamente.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const totpURL = `otpauth://totp/TrancosoExperience:user@example.com?secret=${totpSecret}&issuer=TrancosoExperience`;

  if (step === 'choose') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Configurar Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={method} onValueChange={setMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="totp">
                <Smartphone className="w-4 h-4 mr-2" />
                App Autenticador
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Autenticação por Email</h4>
                <p className="text-sm text-blue-800">
                  Receba códigos de verificação por email sempre que realizar ações sensíveis.
                </p>
              </div>
              <Button onClick={handleEmailSetup} className="w-full">
                Configurar com Email
              </Button>
            </TabsContent>

            <TabsContent value="totp" className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">App Autenticador</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Use apps como Google Authenticator ou Microsoft Authenticator para gerar códigos.
                </p>
                <p className="text-xs text-purple-700">
                  ✓ Mais seguro que email<br/>
                  ✓ Funciona offline<br/>
                  ✓ Códigos renovados a cada 30 segundos
                </p>
              </div>
              <Button onClick={generateTOTPSecret} className="w-full">
                Configurar com App Autenticador
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  if (step === 'setup' && method === 'totp') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Escaneie o QR Code</CardTitle>
          <CardDescription>Use seu app autenticador para escanear o código abaixo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-6 bg-white border-2 border-slate-200 rounded-lg">
            <QRCode value={totpURL} size={200} />
          </div>

          <div>
            <Label htmlFor="secret">Ou digite manualmente:</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                id="secret"
                value={totpSecret} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copySecret}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={() => setStep('verify')} className="w-full">
            Continuar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Digite o Código de Verificação</CardTitle>
          <CardDescription>
            {method === 'email' 
              ? 'Enviamos um código de 6 dígitos para seu email.'
              : 'Digite o código gerado pelo seu app autenticador.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="code">Código de 6 dígitos</Label>
            <Input
              id="code"
              placeholder="000000"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl font-mono tracking-widest"
            />
          </div>

          <Button 
            onClick={handleVerification} 
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full"
          >
            {isVerifying ? 'Verificando...' : 'Verificar e Ativar'}
          </Button>

          {method === 'email' && (
            <Button variant="ghost" onClick={handleEmailSetup} className="w-full">
              Reenviar Código
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}