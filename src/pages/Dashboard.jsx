import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, TrendingUp, Loader2 } from "lucide-react";
import FinancialDashboard from "../components/financial/FinancialDashboard";
import AssistenteFinanceiro from "../components/financial/AssistenteFinanceiro";
import GettingStartedGuide from "../components/dashboard/GettingStartedGuide";
import PermissionChecker from "../components/auth/PermissionChecker";

export default function DashboardPage() {
  return (
    <PermissionChecker requiredUserType="prestador">
      <DashboardContent />
    </PermissionChecker>
  );
}

function DashboardContent() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: serviceRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['serviceRequests', user?.id],
    queryFn: () => base44.entities.ServiceRequest.filter({ provider_id: user?.id }, '-created_date'),
    enabled: !!user,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', user?.email],
    queryFn: () => base44.entities.Transaction.filter({ created_by: user.email }),
    enabled: !!user,
  });

  const isLoading = isUserLoading || isLoadingRequests || isLoadingTransactions;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const pendingRequests = serviceRequests?.filter(req => req.status === 'Pendente').length || 0;
  const confirmedServices = serviceRequests?.filter(req => req.status === 'Confirmado').length || 0;

  const totalReceita = (transactions || [])
    .filter(t => t.type === "Receita" && t.status === "Validado")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Painel do Prestador</h1>
        <p className="text-slate-600">Bem-vindo(a) de volta, {user?.full_name || 'Prestador'}!</p>
      </div>
      
      {serviceRequests?.length === 0 && (
        <GettingStartedGuide />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
            <Clock className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-slate-500">Aguardando sua confirmação</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Serviços Confirmados</CardTitle>
            <CalendarCheck className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedServices}</div>
            <p className="text-xs text-slate-500">Agendados para os próximos dias</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Receita Total (Validada)</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-green-600">Total recebido dos serviços concluídos</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Visão Geral Financeira</h2>
        {(transactions && transactions.length > 0) ? (
            <>
                <AssistenteFinanceiro transacoes={transactions} />
                <FinancialDashboard transactions={transactions} />
            </>
        ) : (
            <div className="text-center py-12 bg-slate-100 rounded-lg">
                <p className="text-slate-500">Seus dados financeiros aparecerão aqui assim que você registrar sua primeira transação.</p>
                <Link to={createPageUrl("Financeiro")}>
                    <Button variant="secondary" className="mt-4">Ir para Financeiro</Button>
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}