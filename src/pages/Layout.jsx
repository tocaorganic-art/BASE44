

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, Users, Calendar, Briefcase, UserCog, Compass,
  Sparkles, TrendingUp, CreditCard, Wrench, Menu, X, Hammer, FileText, User, MessageCircle, Image, Rocket
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import RoutePreloader from "./components/optimization/RoutePreloader";
import ImagePreloader from "./components/optimization/ImagePreloader"; // Added import
import PerformanceMonitor from "./components/optimization/PerformanceMonitor"; // Added import
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import ConnectionStatus from "./components/ConnectionStatus";
import CookieConsent from "./components/CookieConsent";
import OfflineIndicator from "./components/OfflineIndicator";
import SkipToContent from "./components/ui/SkipToContent";
import ErrorBoundary from "./components/ErrorBoundary";
import PageViewTracker from "./components/analytics/PageViewTracker";
import ContinuousMonitor from "./components/monitoring/ContinuousMonitor";
import AlertSystem from "./components/monitoring/AlertSystem";
import AccessLogger from "./components/auth/AccessLogger";
import PushOptIn from "./components/notifications/PushOptIn";
import SupportChat from "./components/support/SupportChat";
import FeedbackCollector from "./components/feedback/FeedbackCollector";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  useEffect(() => {
    document.documentElement.lang = 'pt-BR';
    
    // Meta tags dinâmicas baseadas na página
    const pageTitles = {
      '/': 'Trancoso Experience - Encontre os Melhores Serviços em Trancoso',
      '/Home': 'Trancoso Experience - Encontre os Melhores Serviços em Trancoso',
      '/ServicosCategoria': 'Buscar Serviços - Trancoso Experience',
      '/PrestadorPerfil': 'Perfil do Prestador - Trancoso Experience',
      '/ServicoDetalhes': 'Detalhes do Serviço - Trancoso Experience',
      '/Planos': 'Planos e Preços - Trancoso Experience',
      '/Manual': 'Manual e FAQ - Trancoso Experience',
      '/SejaPrestador': 'Seja um Prestador - Trancoso Experience',
      '/ComoFunciona': 'Como Funciona - Trancoso Experience',
      '/Seguranca': 'Segurança e Privacidade - Trancoso Experience',
      '/MeusPedidos': 'Meus Pedidos - Trancoso Experience',
      '/Dashboard': 'Dashboard - Trancoso Experience',
      '/Financeiro': 'Portal Financeiro - Trancoso Experience',
      '/Assistentevirtual': 'Assistente Virtual Toca - Trancoso Experience',
      '/GeradorDeImagem': 'Gerador de Imagens IA - Trancoso Experience',
      '/PoliticaPrivacidade': 'Política de Privacidade - Trancoso Experience',
      '/MinhaAgenda': 'Minha Agenda - Trancoso Experience',
      '/MeuPerfilPrestador': 'Meu Perfil de Prestador - Trancoso Experience',
      '/MeusServicos': 'Meus Serviços - Trancoso Experience',
      '/DeployDashboard': 'Deploy Dashboard - Trancoso Experience',
    };
    
    const pageDescriptions = {
      '/': 'Encontre os melhores prestadores de serviço em Trancoso. Conectamos você a profissionais de limpeza, construção, beleza, turismo e muito mais.',
      '/Home': 'Encontre os melhores prestadores de serviço em Trancoso. Conectamos você a profissionais de limpeza, construção, beleza, turismo e muito mais.',
      '/ServicosCategoria': 'Navegue por categorias e encontre o profissional ideal para suas necessidades em Trancoso.',
      '/PrestadorPerfil': 'Veja o perfil detalhado dos prestadores de serviço, avaliações e serviços oferecidos em Trancoso.',
      '/ServicoDetalhes': 'Conheça os detalhes de cada serviço e contrate com confiança em Trancoso.',
      '/Planos': 'Conheça nossos planos para prestadores de serviço e escolha o melhor para impulsionar seu negócio em Trancoso.',
      '/Manual': 'Tire suas dúvidas sobre como usar a plataforma Trancoso Experience com nosso guia completo.',
      '/SejaPrestador': 'Cadastre-se como prestador de serviço e alcance novos clientes em Trancoso.',
      '/ComoFunciona': 'Entenda o processo de contratação e prestação de serviços na plataforma Trancoso Experience.',
      '/Seguranca': 'Saiba mais sobre as medidas de segurança e proteção de dados que garantimos na Trancoso Experience.',
      '/MeusPedidos': 'Acompanhe seus pedidos de serviço, status e histórico na Trancoso Experience.',
      '/Dashboard': 'Gerencie seus serviços, agenda e finanças como prestador na Trancoso Experience.',
      '/Financeiro': 'Acesse seus extratos financeiros, pagamentos e recebimentos na Trancoso Experience.',
      '/Assistentevirtual': 'Use nosso assistente virtual inteligente para encontrar informações e suporte.',
      '/GeradorDeImagem': 'Crie imagens incríveis com inteligência artificial para seus projetos.',
      '/PoliticaPrivacidade': 'Leia nossa política de privacidade para entender como seus dados são coletados e utilizados.',
      '/MinhaAgenda': 'Organize seus compromissos e disponibilidades com a agenda integrada.',
      '/MeuPerfilPrestador': 'Atualize suas informações pessoais e de serviço para atrair mais clientes.',
      '/MeusServicos': 'Gerencie seus serviços, adicione novos ou edite os existentes para sua oferta em Trancoso.',
      '/DeployDashboard': 'Monitore e gerencie os deploys da sua aplicação.',
    };
    
    // Normalize path to handle /Home as / for SEO purposes if needed, otherwise use full path
    const currentPath = location.pathname === '/Home' ? '/' : location.pathname;

    const currentTitle = pageTitles[currentPath] || 'Trancoso Experience';
    const currentDescription = pageDescriptions[currentPath] || 'A forma mais fácil de encontrar e contratar serviços de confiança em Trancoso, Bahia.';
    
    document.title = currentTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentDescription;
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = currentTitle;
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = currentDescription;

    // The og:image and og:type defaults are now managed externally or by specific components
    // and removed from this useEffect to keep it focused on title/description.
    
  }, [location.pathname]);

  const adminNavItems = [
    { name: "Dashboard", path: createPageUrl("Dashboard"), icon: Home },
    { name: "Minha Agenda", path: createPageUrl("MinhaAgenda"), icon: Calendar },
    { name: "Meus Serviços", path: createPageUrl("MeusServicos"), icon: Briefcase },
    { name: "Meu Perfil", path: createPageUrl("MeuPerfilPrestador"), icon: UserCog },
    { name: "Financeiro", path: createPageUrl("Financeiro"), icon: TrendingUp },
    { name: "Planos", path: createPageUrl("Planos"), icon: CreditCard },
    { name: "Manual", path: createPageUrl("Manual"), icon: FileText },
    { name: "Deploy", path: createPageUrl("DeployDashboard"), icon: Rocket },
  ];
  
  const publicPages = ['/', '/Home', '/ServicosCategoria', '/PrestadorPerfil', '/ServicoDetalhes', '/MeusPedidos', '/PoliticaPrivacidade', '/Manual', '/SejaPrestador', '/ComoFunciona', '/Seguranca', '/Assistentevirtual', '/GeradorDeImagem'];
  const isPublicPage = publicPages.some(page => {
    const pagePath = page.replace('/Home', '/'); // This line treats '/Home' as '/'
    const currentLocationPath = location.pathname === '/Home' ? '/' : location.pathname; // Normalize current location too
    return currentLocationPath === pagePath || currentLocationPath === `${pagePath}/`;
  });

  const isActive = (path) => location.pathname === path;

  // Layout público (MeAjudaToca)
  if (isPublicPage) {
    return (
      <ErrorBoundary>
        <SkipToContent />
        <RoutePreloader />
        <ImagePreloader />
        <PerformanceMonitor />
        <PageViewTracker />
        <AlertSystem />
        <AccessLogger />
        <PushOptIn />
        
        <div className="min-h-screen bg-[var(--background)]">
          <style>{`
            :root {
              --primary: #0A81D1;
              --secondary: #F4D35E;
              --accent: #0D8A6F;
              --text-dark: #333333;
              --text-light: #FFFFFF;
              --background: #F8F9FA;
            }
            :focus-visible {
              outline: 3px solid #38bdf8 !important;
              outline-offset: 2px !important;
              box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.4) !important;
              border-radius: 4px;
              transition: outline 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
            }
          `}</style>
          
          {/* Content Security Policy meta tag removed from here, should be handled via HTTP headers or index.html for better security/performance. */}
          
          <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-8 py-4 flex items-center justify-between">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2" data-testid="nav-logo-link">
                 <img src="https://base44.com/img/logo-symbol-blue.png" alt="Trancoso Experience Logo" className="h-10" />
                 <span className="font-bold text-xl text-slate-800">Trancoso Experience</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link to={createPageUrl("GeradorDeImagem")} className="flex items-center gap-1 text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">
                  <Image className="w-4 h-4" /> Criar Imagem
                </Link>
                <Link to={createPageUrl("Assistentevirtual")} className="flex items-center gap-1 text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">
                  <MessageCircle className="w-4 h-4" /> Assistente
                </Link>
                <Link to={createPageUrl("SejaPrestador")} className="text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">Seja um prestador</Link>
                <Link to={createPageUrl("ComoFunciona")} className="text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">Como funciona?</Link>
                <Link to={createPageUrl("Seguranca")} className="text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">Segurança</Link>
                <Link to={createPageUrl("Manual")} className="text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] transition-colors">Manual</Link>
              </div>

              <div className="flex items-center gap-2">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-[var(--text-dark)]" data-testid="user-menu-trigger">
                        <User className="w-5 h-5" />
                        <span>{user.full_name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.user_type === 'prestador' && (
                         <Link to={createPageUrl("Dashboard")}>
                          <DropdownMenuItem data-testid="user-menu-dashboard" className="cursor-pointer">Dashboard</DropdownMenuItem>
                         </Link>
                      )}
                      <Link to={createPageUrl("MeusPedidos")}>
                        <DropdownMenuItem className="cursor-pointer" data-testid="user-menu-meus-pedidos">
                          <FileText className="w-4 h-4 mr-2" />
                          Meus Pedidos
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => base44.auth.logout()} className="cursor-pointer" data-testid="user-menu-logout">
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => base44.auth.redirectToLogin()} className="bg-[var(--primary)] text-[var(--text-light)] hover:bg-blue-700" size="sm" data-testid="login-button">
                    Entrar
                  </Button>
                )}
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Abrir menu de navegação">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
             {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-2 pb-4 space-y-2 px-4" data-testid="mobile-menu-content-public">
                 <Link to={createPageUrl("GeradorDeImagem")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Criar Imagem</span>
                 </Link>
                 <Link to={createPageUrl("Assistentevirtual")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Assistente</span>
                 </Link>
                 <Link to={createPageUrl("SejaPrestador")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>Seja um prestador</Link>
                <Link to={createPageUrl("ComoFunciona")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>Como funciona?</Link>
                <Link to={createPageUrl("Seguranca")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>Segurança</Link>
                <Link to={createPageUrl("Manual")} className="block text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary)] py-2" onClick={() => setMobileMenuOpen(false)}>Manual</Link>
              </div>
            )}
          </nav>
          <main id="main-content">{children}</main>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center gap-4 mb-4">
                 <Link to={createPageUrl("PoliticaPrivacidade")} className="text-sm text-slate-400 hover:text-white" data-testid="footer-privacy-link">
                      Política de Privacidade
                 </Link>
              </div>
              <p className="text-slate-400 text-sm">
                © 2025 Trancoso Experience • Por TOCA Experience • Todos os direitos reservados
              </p>
            </div>
          </footer>
          <Toaster />
          <ConnectionStatus />
          <OfflineIndicator />
          <CookieConsent />
        </div>
        <SupportChat />
        <FeedbackCollector />
      </ErrorBoundary>
    );
  }

  // Layout administrativo (dashboard Trancoso Experience)
  return (
    <ErrorBoundary>
      <SkipToContent />
      <RoutePreloader />
      <ImagePreloader />
      <PerformanceMonitor />
      <PageViewTracker />
      <AlertSystem />
      <AccessLogger />
      <PushOptIn />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
         {/* Content Security Policy meta tag removed from here, should be handled via HTTP headers or index.html for better security/performance. */}
         {/* Global Focus Style for Accessibility */}
         <style>{`
            :focus-visible {
              outline: 38px solid #38bdf8 !important;
              outline-offset: 2px !important;
              box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.4) !important;
              border-radius: 4px;
              transition: outline 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
            }
          `}</style>
        <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2" data-testid="admin-nav-logo-link">
                <img src="https://base44.com/img/logo-symbol-blue.png" alt="Trancoso Experience Logo" className="h-10" />
                <span className="font-bold text-xl text-slate-800 dark:text-slate-200">
                  Trancoso Experience
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      data-testid={`admin-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="mobile-menu-button"
                  aria-label="Abrir menu de navegação"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 space-y-2" data-testid="mobile-menu-content">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      data-testid={`admin-mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <main id="main-content" className="pb-12">
          {children}
        </main>
        <Toaster />
        <ConnectionStatus />
        <OfflineIndicator />
        <CookieConsent />
      </div>
      <SupportChat />
      <FeedbackCollector />
    </ErrorBoundary>
  );
}

