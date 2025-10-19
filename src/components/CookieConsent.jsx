import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function initializeAnalytics() {
  console.log('Cookies de Analytics autorizados. Serviço pode ser inicializado aqui.');
}

function initializeMarketingTools() {
  console.log('Cookies de Marketing autorizados. Serviço pode ser inicializado aqui.');
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        if (savedPreferences.analytics) initializeAnalytics();
        if (savedPreferences.marketing) initializeMarketingTools();
      } catch (e) {
        console.error('Erro ao carregar preferências de cookies:', e);
        setVisible(true);
      }
    }
  }, []);

  const handleSavePreferences = (newPreferences) => {
    const finalPreferences = {
      ...newPreferences,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(finalPreferences));
    setPreferences(finalPreferences);
    setVisible(false);
    
    if (finalPreferences.analytics) {
      initializeAnalytics();
    }
    
    if (finalPreferences.marketing) {
      initializeMarketingTools();
    }
  };

  const handleAcceptAll = () => {
    handleSavePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleAcceptSelected = () => {
    handleSavePreferences(preferences);
  };
  
  const handleEssentialOnly = () => {
    handleSavePreferences({ essential: true, analytics: false, marketing: false });
  };

  const togglePreference = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
      <Card className="max-w-3xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-cyan-600"/>
            Nós Usamos Cookies
          </CardTitle>
          <CardDescription>
            Sua privacidade é importante para nós. Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. Você pode gerenciar suas preferências abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expanded && (
            <div className="mb-6 space-y-4 pt-4 border-t">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <Label htmlFor="cookie-essential" className="font-semibold">Cookies Essenciais</Label>
                  <p className="text-sm text-slate-500">Necessários para o funcionamento básico do site. Não podem ser desativados.</p>
                </div>
                <Switch id="cookie-essential" checked={preferences.essential} disabled />
              </div>
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <Label htmlFor="cookie-analytics" className="font-semibold">Cookies Analíticos</Label>
                  <p className="text-sm text-slate-500">Nos ajudam a entender como os visitantes interagem com o site.</p>
                </div>
                <Switch id="cookie-analytics" checked={preferences.analytics} onCheckedChange={() => togglePreference('analytics')} />
              </div>
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <Label htmlFor="cookie-marketing" className="font-semibold">Cookies de Marketing</Label>
                  <p className="text-sm text-slate-500">Usados para rastrear visitantes e exibir anúncios relevantes.</p>
                </div>
                <Switch id="cookie-marketing" checked={preferences.marketing} onCheckedChange={() => togglePreference('marketing')} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAcceptAll} className="flex-1">Aceitar Todos</Button>
            <Button onClick={handleEssentialOnly} variant="secondary" className="flex-1">Apenas Essenciais</Button>
             <Button 
                variant="outline" 
                onClick={() => expanded ? handleAcceptSelected() : setExpanded(true)}
                className="flex-1"
             >
                {expanded ? 'Salvar Preferências' : 'Personalizar'}
             </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Para saber mais, consulte nossa <Link to={createPageUrl("PoliticaPrivacidade")} className="underline">Política de Privacidade</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}