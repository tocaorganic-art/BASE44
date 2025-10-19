import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to monitoring service (if available)
    if (window.logErrorToService) {
      window.logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-red-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Ops! Algo deu errado</h1>
              <p className="text-slate-600 mb-6">
                Encontramos um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver.
              </p>
              
              {isDevelopment && this.state.error && (
                <details className="text-left mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
                  <summary className="cursor-pointer font-medium text-red-900 mb-2">
                    Detalhes do erro (apenas em desenvolvimento)
                  </summary>
                  <pre className="text-xs text-red-800 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Recarregar Página
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="gap-2">
                  <Home className="w-4 h-4" />
                  Ir para Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;