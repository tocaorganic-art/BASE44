import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SEOMonitor() {
  const [checks, setChecks] = useState([]);
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const runSEOCheck = () => {
    setIsChecking(true);
    const seoChecks = [];
    let passed = 0;
    const total = 10;

    // Check 1: Title
    const title = document.querySelector('title');
    const titleCheck = {
      name: 'Título da Página',
      status: title && title.textContent.length >= 30 && title.textContent.length <= 60,
      value: title?.textContent || 'Não encontrado',
      recommendation: 'Título deve ter entre 30-60 caracteres.',
    };
    seoChecks.push(titleCheck);
    if (titleCheck.status) passed++;

    // Check 2: Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    const descCheck = {
      name: 'Meta Description',
      status: metaDesc && metaDesc.content.length >= 120 && metaDesc.content.length <= 160,
      value: metaDesc?.content || 'Não encontrada',
      recommendation: 'Meta description deve ter entre 120-160 caracteres.',
    };
    seoChecks.push(descCheck);
    if (descCheck.status) passed++;

    // Check 3: H1
    const h1 = document.querySelector('h1');
    const h1Check = {
      name: 'Heading H1',
      status: !!h1,
      value: h1?.textContent || 'Não encontrado',
      recommendation: 'Cada página deve ter exatamente um H1.',
    };
    seoChecks.push(h1Check);
    if (h1Check.status) passed++;

    // Check 4: Meta Viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    const viewportCheck = {
      name: 'Meta Viewport',
      status: !!viewport,
      value: viewport?.content || 'Não encontrado',
      recommendation: 'Necessário para mobile-first.',
    };
    seoChecks.push(viewportCheck);
    if (viewportCheck.status) passed++;

    // Check 5: Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalCheck = {
      name: 'Canonical URL',
      status: !!canonical,
      value: canonical?.href || 'Não encontrado',
      recommendation: 'Define a URL principal para evitar duplicação.',
    };
    seoChecks.push(canonicalCheck);
    if (canonicalCheck.status) passed++;

    // Check 6: Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogCheck = {
      name: 'Open Graph Tags',
      status: !!ogTitle,
      value: ogTitle?.content || 'Não encontrado',
      recommendation: 'Importante para compartilhamento em redes sociais.',
    };
    seoChecks.push(ogCheck);
    if (ogCheck.status) passed++;

    // Check 7: Robots meta
    const robots = document.querySelector('meta[name="robots"]');
    const robotsCheck = {
      name: 'Robots Meta Tag',
      status: !robots || !robots.content.includes('noindex'),
      value: robots?.content || 'Padrão (index, follow)',
      recommendation: 'Certifique-se de que a página pode ser indexada.',
    };
    seoChecks.push(robotsCheck);
    if (robotsCheck.status) passed++;

    // Check 8: Images with alt
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim() !== '');
    const imageCheck = {
      name: 'Imagens com ALT',
      status: images.length === 0 || imagesWithAlt.length === images.length,
      value: `${imagesWithAlt.length}/${images.length}`,
      recommendation: 'Todas as imagens devem ter texto alternativo.',
    };
    seoChecks.push(imageCheck);
    if (imageCheck.status) passed++;

    // Check 9: HTTPS
    const httpsCheck = {
      name: 'Conexão HTTPS',
      status: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      value: window.location.protocol,
      recommendation: 'Use HTTPS para segurança e ranking.',
    };
    seoChecks.push(httpsCheck);
    if (httpsCheck.status) passed++;

    // Check 10: Language
    const lang = document.documentElement.lang;
    const langCheck = {
      name: 'Atributo Language',
      status: !!lang,
      value: lang || 'Não definido',
      recommendation: 'Define o idioma da página para SEO internacional.',
    };
    seoChecks.push(langCheck);
    if (langCheck.status) passed++;

    const calculatedScore = Math.round((passed / total) * 100);
    setScore(calculatedScore);
    setChecks(seoChecks);
    setIsChecking(false);

    console.log('🔍 SEO Check:', {
      Score: `${calculatedScore}/100`,
      Passed: `${passed}/${total}`,
      Issues: total - passed,
    });
  };

  useEffect(() => {
    setTimeout(() => runSEOCheck(), 1000);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            SEO Monitor
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <p className="text-xs text-slate-500">SEO Score</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={runSEOCheck}
              disabled={isChecking}
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                {check.status ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{check.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{check.value}</p>
                  {!check.status && (
                    <p className="text-xs text-slate-500 mt-1">
                      💡 {check.recommendation}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={check.status ? 'bg-green-500' : 'bg-red-500'}>
                {check.status ? 'OK' : 'Falha'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}