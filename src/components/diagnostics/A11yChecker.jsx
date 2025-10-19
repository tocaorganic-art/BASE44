import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function A11yChecker() {
  const [issues, setIssues] = useState([]);
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const runAccessibilityCheck = () => {
    setIsChecking(true);
    const foundIssues = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Check 1: Images without alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      totalChecks++;
      if (!img.alt || img.alt.trim() === '') {
        foundIssues.push({
          level: 'error',
          message: `Imagem ${index + 1} sem texto alternativo`,
          element: img.src.substring(0, 50) + '...',
          recommendation: 'Adicione um atributo alt descritivo à imagem.',
        });
      } else {
        passedChecks++;
      }
    });

    // Check 2: Buttons without aria-label
    const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not(:has(*))');
    buttonsWithoutLabel.forEach((btn, index) => {
      totalChecks++;
      if (!btn.textContent.trim()) {
        foundIssues.push({
          level: 'warning',
          message: `Botão ${index + 1} sem aria-label ou texto`,
          element: btn.outerHTML.substring(0, 50) + '...',
          recommendation: 'Adicione aria-label ou texto ao botão.',
        });
      } else {
        passedChecks++;
      }
    });

    // Check 3: Form inputs without labels
    const inputs = document.querySelectorAll('input:not([type="hidden"])');
    inputs.forEach((input, index) => {
      totalChecks++;
      const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel && !input.getAttribute('aria-label')) {
        foundIssues.push({
          level: 'error',
          message: `Input ${index + 1} sem label associado`,
          element: input.outerHTML.substring(0, 50) + '...',
          recommendation: 'Associe um <label> ou adicione aria-label.',
        });
      } else {
        passedChecks++;
      }
    });

    // Check 4: Heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length > 0) {
      totalChecks++;
      const h1Count = headings.filter(h => h.tagName === 'H1').length;
      if (h1Count === 0) {
        foundIssues.push({
          level: 'error',
          message: 'Página sem H1',
          element: 'Estrutura de cabeçalhos',
          recommendation: 'Adicione um H1 principal à página.',
        });
      } else if (h1Count > 1) {
        foundIssues.push({
          level: 'warning',
          message: `${h1Count} H1s encontrados (recomendado apenas 1)`,
          element: 'Estrutura de cabeçalhos',
          recommendation: 'Use apenas um H1 por página.',
        });
      } else {
        passedChecks++;
      }
    }

    // Check 5: Color contrast (simplified)
    totalChecks++;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const bodyColor = window.getComputedStyle(document.body).color;
    if (bodyBg === bodyColor) {
      foundIssues.push({
        level: 'error',
        message: 'Contraste de cor insuficiente detectado',
        element: 'body element',
        recommendation: 'Garanta contraste mínimo de 4.5:1 para texto normal.',
      });
    } else {
      passedChecks++;
    }

    // Check 6: Language attribute
    totalChecks++;
    if (!document.documentElement.lang) {
      foundIssues.push({
        level: 'error',
        message: 'Atributo lang ausente no HTML',
        element: '<html>',
        recommendation: 'Adicione lang="pt-BR" ao elemento HTML.',
      });
    } else {
      passedChecks++;
    }

    // Calculate score
    const calculatedScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
    setScore(calculatedScore);
    setIssues(foundIssues);
    setIsChecking(false);

    // Log to console
    console.log('♿ Accessibility Check:', {
      Score: `${calculatedScore}/100`,
      Passed: passedChecks,
      Total: totalChecks,
      Issues: foundIssues.length,
    });

    if (foundIssues.length === 0) {
      toast.success('Nenhum problema de acessibilidade encontrado!');
    } else {
      toast.warning(`${foundIssues.length} problemas de acessibilidade detectados.`);
    }
  };

  useEffect(() => {
    // Run check on mount
    setTimeout(() => runAccessibilityCheck(), 1000);
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
            <Eye className="w-5 h-5 text-purple-600" />
            Accessibility Checker
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <p className="text-xs text-slate-500">A11y Score</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={runAccessibilityCheck}
              disabled={isChecking}
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <p className="font-semibold text-slate-900">Excelente!</p>
            <p className="text-sm text-slate-600">Nenhum problema de acessibilidade detectado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                issue.level === 'error' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    issue.level === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{issue.message}</span>
                      <Badge className={issue.level === 'error' ? 'bg-red-500' : 'bg-yellow-500'}>
                        {issue.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{issue.element}</p>
                    <p className="text-xs text-slate-700">
                      💡 <strong>Solução:</strong> {issue.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}