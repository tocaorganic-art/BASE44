import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EmployeeForm({ employee, onClose }) {
  const [formData, setFormData] = useState(employee || {
    full_name: "",
    email: "",
    phone: "",
    role: "Operacional",
    availability: "Disponível",
    hire_date: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Employee.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onClose();
    },
  });

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-purple-600" />
            <CardTitle>{employee ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="João Silva"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="joao@exemplo.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role">Função *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Coordenador">Coordenador</SelectItem>
                  <SelectItem value="Operacional">Operacional</SelectItem>
                  <SelectItem value="Concierge">Concierge</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availability">Disponibilidade</Label>
              <Select 
                value={formData.availability} 
                onValueChange={(value) => setFormData({...formData, availability: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Ocupado">Ocupado</SelectItem>
                  <SelectItem value="Férias">Férias</SelectItem>
                  <SelectItem value="Licença">Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hire_date">Data de Contratação</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="skills">Habilidades</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Digite uma habilidade e pressione Enter"
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {createMutation.isPending ? "Salvando..." : "Salvar Funcionário"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}