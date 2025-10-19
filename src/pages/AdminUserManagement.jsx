import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Search, UserCheck, UserX, Shield, 
  Mail, Calendar, Loader2, CheckSquare 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import PermissionChecker from '../components/auth/PermissionChecker';

function AdminUserManagementContent() {
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterUserType, setFilterUserType] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.asServiceRole.entities.User.list('-created_date'),
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.asServiceRole.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      toast.success('Usuário atualizado!');
    },
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesUserType = filterUserType === 'all' || user.user_type === filterUserType;
    
    return matchesSearch && matchesRole && matchesUserType;
  });

  const handleBatchRoleUpdate = async (newRole) => {
    if (selectedUsers.length === 0) {
      toast.error('Selecione ao menos um usuário.');
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(id =>
          base44.asServiceRole.entities.User.update(id, { role: newRole })
        )
      );
      
      queryClient.invalidateQueries(['allUsers']);
      toast.success(`${selectedUsers.length} usuários atualizados para "${newRole}"!`);
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Erro ao atualizar usuários.', { description: error.message });
    }
  };

  const handleBatchUserTypeUpdate = async (newUserType) => {
    if (selectedUsers.length === 0) {
      toast.error('Selecione ao menos um usuário.');
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(id =>
          base44.asServiceRole.entities.User.update(id, { user_type: newUserType })
        )
      );
      
      queryClient.invalidateQueries(['allUsers']);
      toast.success(`${selectedUsers.length} usuários atualizados para "${newUserType}"!`);
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Erro ao atualizar usuários.', { description: error.message });
    }
  };

  const toggleUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalPrestadores = users.filter(u => u.user_type === 'prestador').length;
  const totalClientes = users.filter(u => u.user_type === 'cliente').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestão de Usuários</h1>
        <p className="text-slate-600">Administração centralizada de todos os usuários da plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <Badge className="bg-blue-500">Total</Badge>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
            <p className="text-sm text-slate-500 mt-1">Usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <Badge className="bg-purple-500">Admins</Badge>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalAdmins}</p>
            <p className="text-sm text-slate-500 mt-1">Administradores</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-500">Prestadores</Badge>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalPrestadores}</p>
            <p className="text-sm text-slate-500 mt-1">Prestadores de serviço</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-cyan-600" />
              <Badge className="bg-cyan-500">Clientes</Badge>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalClientes}</p>
            <p className="text-sm text-slate-500 mt-1">Clientes ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Ações em Massa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="prestador">Prestador</SelectItem>
                <SelectItem value="indefinido">Indefinido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} selecionado(s)
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" onClick={() => handleBatchRoleUpdate('admin')}>
                  Tornar Admin
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBatchRoleUpdate('user')}>
                  Tornar User
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBatchUserTypeUpdate('prestador')}>
                  → Prestador
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBatchUserTypeUpdate('cliente')}>
                  → Cliente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Usuário</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="p-4 text-center text-sm font-semibold text-slate-700">Role</th>
                  <th className="p-4 text-center text-sm font-semibold text-slate-700">Tipo</th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-700">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{user.full_name || 'Sem nome'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={user.role === 'admin' ? 'bg-purple-500' : 'bg-slate-500'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className={
                        user.user_type === 'prestador' ? 'border-green-500 text-green-700' :
                        user.user_type === 'cliente' ? 'border-blue-500 text-blue-700' :
                        'border-yellow-500 text-yellow-700'
                      }>
                        {user.user_type || 'indefinido'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Nenhum usuário encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUserManagementPage() {
  return (
    <PermissionChecker requiredRole="admin">
      <AdminUserManagementContent />
    </PermissionChecker>
  );
}