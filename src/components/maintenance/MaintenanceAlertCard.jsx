import React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Calendar, DollarSign, User } from "lucide-react";

export default function MaintenanceAlertCard({ alert, priorityColors, statusColors }) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: employees } = useQuery({
    queryKey: ['employees', user?.email],
    queryFn: () => base44.entities.Employee.filter({ created_by: user.email }),
    initialData: [],
    enabled: !!user,
  });

  const updateAlertMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MaintenanceAlert.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceAlerts'] });
    },
  });

  const handleStatusChange = (newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === "Resolvido") {
      updateData.resolution_date = new Date().toISOString().split('T')[0];
    }
    updateAlertMutation.mutate({ id: alert.id, data: updateData });
  };

  const handleAssign = (employeeId) => {
    updateAlertMutation.mutate({
      id: alert.id,
      data: { assigned_to: employeeId, status: "Em Andamento" }
    });
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.full_name || "Não atribuído";
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">{alert.equipment}</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.property_name}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className={`${priorityColors[alert.priority]} border`}>
              {alert.priority}
            </Badge>
            <Badge variant="outline" className={`${statusColors[alert.status]} border`}>
              {alert.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Tipo de Alerta</p>
          <Badge variant="outline">{alert.alert_type}</Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Descrição</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{alert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          {alert.predicted_failure_date && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-xs">Previsão de Falha</p>
                <p className="font-medium">{new Date(alert.predicted_failure_date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}

          {alert.cost_estimate && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <DollarSign className="w-4 h-4" />
              <div>
                <p className="text-xs">Custo Estimado</p>
                <p className="font-medium">R$ {alert.cost_estimate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}
        </div>

        {alert.ai_confidence && (
          <div className="pt-3 border-t">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Confiança da Previsão IA</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full"
                  style={{ width: `${alert.ai_confidence}%` }}
                />
              </div>
              <span className="text-sm font-bold text-orange-600">{alert.ai_confidence}%</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Atribuir a</p>
            <Select value={alert.assigned_to || ""} onValueChange={handleAssign}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.full_name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {alert.assigned_to && (
              <p className="text-xs text-slate-500 mt-1">
                <User className="w-3 h-3 inline mr-1" />
                {getEmployeeName(alert.assigned_to)}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Alterar Status</p>
            <Select value={alert.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Adiado">Adiado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {alert.resolution_date && (
          <p className="text-xs text-green-600 pt-3 border-t">
            ✓ Resolvido em {new Date(alert.resolution_date).toLocaleDateString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}