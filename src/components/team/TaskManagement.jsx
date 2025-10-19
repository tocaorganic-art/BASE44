import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function TaskManagement() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "Média",
    due_date: "",
    related_type: "Outro"
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', user?.email],
    queryFn: () => base44.entities.TaskAssignment.filter({ created_by: user.email }, '-due_date'),
    initialData: [],
    enabled: !!user,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees', user?.email],
    queryFn: () => base44.entities.Employee.filter({ created_by: user.email }),
    initialData: [],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TaskAssignment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        assigned_to: "",
        priority: "Média",
        due_date: "",
        related_type: "Outro"
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      const updateData = { status };
      if (status === "Concluída") {
        updateData.completed_date = new Date().toISOString().split('T')[0];
      }
      return base44.entities.TaskAssignment.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.full_name || "Não atribuído";
  };

  const priorityColors = {
    "Baixa": "bg-blue-100 text-blue-800 border-blue-200",
    "Média": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Alta": "bg-orange-100 text-orange-800 border-orange-200",
    "Urgente": "bg-red-100 text-red-800 border-red-200",
  };

  const statusColors = {
    "Pendente": "bg-slate-100 text-slate-800 border-slate-200",
    "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
    "Concluída": "bg-green-100 text-green-800 border-green-200",
    "Cancelada": "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    "Pendente": <Clock className="w-4 h-4" />,
    "Em Andamento": <AlertCircle className="w-4 h-4" />,
    "Concluída": <CheckCircle className="w-4 h-4" />,
    "Cancelada": <AlertCircle className="w-4 h-4" />,
  };

  const pendingTasks = tasks.filter(t => t.status === "Pendente" || t.status === "Em Andamento").length;
  const completedTasks = tasks.filter(t => t.status === "Concluída").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-600" />
              Gestão de Tarefas em Tempo Real
            </CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Tarefa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total de Tarefas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
            <CardTitle className="text-lg">Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título da Tarefa *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Preparar check-in da Villa Horizonte"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalhes da tarefa..."
                    className="mt-1 h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="assigned_to">Atribuir a *</Label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) => setFormData({...formData, assigned_to: value})}
                  >
                    <SelectTrigger className="mt-1">
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
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="due_date">Data de Vencimento *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="related_type">Relacionado a</Label>
                  <Select
                    value={formData.related_type}
                    onValueChange={(value) => setFormData({...formData, related_type: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.assigned_to}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Tarefa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Tarefas */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Carregando tarefas...</div>
      ) : tasks.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Nenhuma tarefa criada</p>
            <p className="text-slate-400 text-sm">Crie tarefas para organizar o trabalho da equipe</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <Badge variant="outline" className={`${priorityColors[task.priority]} border`}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcons[task.status]}
                  <Badge variant="outline" className={`${statusColors[task.status]} border text-xs`}>
                    {task.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {task.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                )}

                <div className="pt-2 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Responsável:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {getEmployeeName(task.assigned_to)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Vencimento:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {task.related_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Tipo:</span>
                      <Badge variant="outline" className="text-xs">{task.related_type}</Badge>
                    </div>
                  )}
                </div>

                {task.location?.address && (
                  <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{task.location.address}</span>
                  </div>
                )}

                {task.completed_date && (
                  <p className="text-xs text-green-600 pt-2 border-t">
                    ✓ Concluída em {new Date(task.completed_date).toLocaleDateString('pt-BR')}
                  </p>
                )}

                {task.status !== "Concluída" && task.status !== "Cancelada" && (
                  <div className="pt-3 border-t">
                    <Select
                      value={task.status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: task.id, status: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Concluída">Concluída</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}