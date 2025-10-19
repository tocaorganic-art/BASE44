import Layout from "./Layout.jsx";

import Home from "./Home";

import Financeiro from "./Financeiro";

import Manual from "./Manual";

import Planos from "./Planos";

import AdminAssinaturas from "./AdminAssinaturas";

import ServicosCategoria from "./ServicosCategoria";

import PrestadorPerfil from "./PrestadorPerfil";

import CadastroTipo from "./CadastroTipo";

import MeuPerfilPrestador from "./MeuPerfilPrestador";

import MinhaAgenda from "./MinhaAgenda";

import MeusPedidos from "./MeusPedidos";

import Dashboard from "./Dashboard";

import PoliticaPrivacidade from "./PoliticaPrivacidade";

import SejaPrestador from "./SejaPrestador";

import ComoFunciona from "./ComoFunciona";

import Seguranca from "./Seguranca";

import Assistentevirtual from "./Assistentevirtual";

import GeradorDeImagem from "./GeradorDeImagem";

import ServicoDetalhes from "./ServicoDetalhes";

import MeusServicos from "./MeusServicos";

import DiagnosticosCompletos from "./DiagnosticosCompletos";

import ManutencaoSistema from "./ManutencaoSistema";

import MonitoringDashboard from "./MonitoringDashboard";

import AdminControleFinanceiro from "./AdminControleFinanceiro";

import AdminUserManagement from "./AdminUserManagement";

import Base44ReportViewer from "./Base44ReportViewer";

import Base44Templates from "./Base44Templates";

import DeployDashboard from "./DeployDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Financeiro: Financeiro,
    
    Manual: Manual,
    
    Planos: Planos,
    
    AdminAssinaturas: AdminAssinaturas,
    
    ServicosCategoria: ServicosCategoria,
    
    PrestadorPerfil: PrestadorPerfil,
    
    CadastroTipo: CadastroTipo,
    
    MeuPerfilPrestador: MeuPerfilPrestador,
    
    MinhaAgenda: MinhaAgenda,
    
    MeusPedidos: MeusPedidos,
    
    Dashboard: Dashboard,
    
    PoliticaPrivacidade: PoliticaPrivacidade,
    
    SejaPrestador: SejaPrestador,
    
    ComoFunciona: ComoFunciona,
    
    Seguranca: Seguranca,
    
    Assistentevirtual: Assistentevirtual,
    
    GeradorDeImagem: GeradorDeImagem,
    
    ServicoDetalhes: ServicoDetalhes,
    
    MeusServicos: MeusServicos,
    
    DiagnosticosCompletos: DiagnosticosCompletos,
    
    ManutencaoSistema: ManutencaoSistema,
    
    MonitoringDashboard: MonitoringDashboard,
    
    AdminControleFinanceiro: AdminControleFinanceiro,
    
    AdminUserManagement: AdminUserManagement,
    
    Base44ReportViewer: Base44ReportViewer,
    
    Base44Templates: Base44Templates,
    
    DeployDashboard: DeployDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Financeiro" element={<Financeiro />} />
                
                <Route path="/Manual" element={<Manual />} />
                
                <Route path="/Planos" element={<Planos />} />
                
                <Route path="/AdminAssinaturas" element={<AdminAssinaturas />} />
                
                <Route path="/ServicosCategoria" element={<ServicosCategoria />} />
                
                <Route path="/PrestadorPerfil" element={<PrestadorPerfil />} />
                
                <Route path="/CadastroTipo" element={<CadastroTipo />} />
                
                <Route path="/MeuPerfilPrestador" element={<MeuPerfilPrestador />} />
                
                <Route path="/MinhaAgenda" element={<MinhaAgenda />} />
                
                <Route path="/MeusPedidos" element={<MeusPedidos />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/PoliticaPrivacidade" element={<PoliticaPrivacidade />} />
                
                <Route path="/SejaPrestador" element={<SejaPrestador />} />
                
                <Route path="/ComoFunciona" element={<ComoFunciona />} />
                
                <Route path="/Seguranca" element={<Seguranca />} />
                
                <Route path="/Assistentevirtual" element={<Assistentevirtual />} />
                
                <Route path="/GeradorDeImagem" element={<GeradorDeImagem />} />
                
                <Route path="/ServicoDetalhes" element={<ServicoDetalhes />} />
                
                <Route path="/MeusServicos" element={<MeusServicos />} />
                
                <Route path="/DiagnosticosCompletos" element={<DiagnosticosCompletos />} />
                
                <Route path="/ManutencaoSistema" element={<ManutencaoSistema />} />
                
                <Route path="/MonitoringDashboard" element={<MonitoringDashboard />} />
                
                <Route path="/AdminControleFinanceiro" element={<AdminControleFinanceiro />} />
                
                <Route path="/AdminUserManagement" element={<AdminUserManagement />} />
                
                <Route path="/Base44ReportViewer" element={<Base44ReportViewer />} />
                
                <Route path="/Base44Templates" element={<Base44Templates />} />
                
                <Route path="/DeployDashboard" element={<DeployDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}