
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function ClientForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setFullName("");
      setEmail("");
      setPhone("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      full_name: fullName,
      email: email || undefined,
      phone: phone || undefined,
    });
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Novo Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome completo do cliente"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {createMutation.isPending ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
