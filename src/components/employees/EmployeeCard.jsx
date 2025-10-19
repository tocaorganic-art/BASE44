import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const availabilityColors = {
  "Disponível": "bg-green-100 text-green-800 border-green-200",
  "Ocupado": "bg-amber-100 text-amber-800 border-amber-200",
  "Férias": "bg-blue-100 text-blue-800 border-blue-200",
  "Licença": "bg-slate-100 text-slate-800 border-slate-200",
};

const roleColors = {
  "Gerente": "bg-purple-100 text-purple-800",
  "Coordenador": "bg-blue-100 text-blue-800",
  "Operacional": "bg-green-100 text-green-800",
  "Concierge": "bg-pink-100 text-pink-800",
  "Suporte": "bg-slate-100 text-slate-800",
};

export default function EmployeeCard({ employee }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Employee.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja remover ${employee.full_name}?`)) {
      deleteMutation.mutate(employee.id);
    }
  };

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-2">{employee.full_name}</CardTitle>
            <Badge className={roleColors[employee.role]}>
              {employee.role}
            </Badge>
          </div>
          <Badge variant="outline" className={`${availabilityColors[employee.availability]} border`}>
            {employee.availability}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {employee.email && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{employee.email}</span>
          </div>
        )}

        {employee.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>{employee.phone}</span>
          </div>
        )}

        {employee.hire_date && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Contratado em {format(new Date(employee.hire_date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        )}

        {employee.skills && employee.skills.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-slate-500 mb-2">Habilidades:</p>
            <div className="flex flex-wrap gap-1">
              {employee.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}