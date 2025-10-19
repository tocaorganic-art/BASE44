
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Camera, Trash2, PlusCircle, AlertCircle, FileUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import ServiceLocationMap from '@/components/map/ServiceLocationMap';
import { Progress } from '@/components/ui/progress';
import PermissionChecker from "../components/auth/PermissionChecker";

const occupations = ["Limpeza", "Garçom", "Pedreiro", "Jardinagem", "Babá", "Eletricista", "Encanador", "Pintor", "Cozinheiro", "Outro"];
const priceRanges = ["$", "$$", "$$$"];
const paymentMethods = ["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"];

const ProfileCompleteness = ({ formData }) => {
    // Define checks and their weights for profile completeness
    const completenessChecks = {
        photo_url: { weight: 15, label: 'Adicionar uma foto de perfil' },
        phone: { weight: 10, label: 'Informar um telefone de contato' },
        bio: { weight: 15, label: 'Escrever uma biografia (Sobre mim)' },
        experience_years: { weight: 10, label: 'Informar seus anos de experiência' },
        specialties: { weight: 10, label: 'Listar suas especialidades' },
        rates: { weight: 10, label: 'Definir um valor (por hora ou dia)' },
        portfolio_images: { weight: 15, label: 'Adicionar fotos ao seu portfólio' },
        payment_methods: { weight: 5, label: 'Selecionar os métodos de pagamento' },
    };

    let score = 0;
    const suggestions = [];

    // Calculate score and collect suggestions
    for (const key in completenessChecks) {
        const check = completenessChecks[key];
        let isComplete = false;

        if (!formData) { // Handle case where formData might be null initially
            isComplete = false;
        } else if (key === 'specialties' || key === 'portfolio_images' || key === 'payment_methods') {
            isComplete = formData[key] && formData[key].length > 0;
        } else if (key === 'rates') {
            isComplete = (formData.rates?.hourly > 0) || (formData.rates?.daily > 0);
        } else {
            isComplete = !!formData[key];
        }

        if (isComplete) {
            score += check.weight;
        } else {
            suggestions.push(check.label);
        }
    }
    
    // Determine progress bar color based on score (not used in current Progress component, but good for custom styling)
    const progressColor = score > 80 ? 'bg-green-600' : score > 50 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <Card className="mb-8 bg-slate-50 border-slate-200">
            <CardHeader>
                <CardTitle className="text-lg">Força do Perfil</CardTitle>
                 <CardDescription>Perfis completos recebem mais propostas. Siga as dicas para melhorar o seu.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <Progress value={score} className="h-2 [&>*]:bg-green-500" /> {/* The `[&>*]:bg-green-500` sets the color for the progress indicator */}
                    <span className="text-lg font-bold text-slate-700">{score}%</span>
                </div>
                {suggestions.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-slate-800">Dicas para melhorar:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                            {/* Display up to 3 suggestions */}
                            {suggestions.slice(0, 3).map(suggestion => <li key={suggestion}>{suggestion}</li>)}
                        </ul>
                    </div>
                )}
                 {suggestions.length === 0 && (
                    <p className="text-sm text-green-700 font-medium">🎉 Ótimo trabalho! Seu perfil está excelente.</p>
                )}
            </CardContent>
        </Card>
    );
};


function MeuPerfilPrestadorContent() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: provider, isLoading: isLoadingProvider } = useQuery({
    queryKey: ['myServiceProvider', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.ServiceProvider.filter({ created_by: user.email });
      return results[0] || null;
    },
    enabled: !!user,
  });

  const [formData, setFormData] = useState(null);
  const [uploading, setUploading] = useState({ profile: false, portfolio: false, document: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (provider) {
      setFormData({
        ...provider,
        specialties: provider.specialties || [],
        payment_methods: provider.payment_methods || [],
        rates: provider.rates || { hourly: 0, daily: 0 },
        location: {
          city: provider.location?.city || 'Trancoso',
          coverage_radius_km: provider.location?.coverage_radius_km || 5,
          lat: provider.location?.lat || -16.5925, // Default Trancoso lat
          lng: provider.location?.lng || -39.0931, // Default Trancoso lng
        },
      });
    } else if (!isLoadingProvider) {
      setFormData({
        full_name: user?.full_name || '',
        email: user?.email || '',
        photo_url: '',
        occupation: '',
        phone: '',
        bio: '',
        experience_years: 0,
        specialties: [],
        price_range: '$',
        rates: { hourly: 0, daily: 0 },
        location: { city: 'Trancoso', coverage_radius_km: 5, lat: -16.5925, lng: -39.0931 },
        portfolio_images: [],
        payment_methods: [],
        verification_document_url: '',
      });
    }
  }, [provider, isLoadingProvider, user]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const { id, ...rest } = data;
      if (id) {
        return base44.entities.ServiceProvider.update(id, rest);
      } else {
        return base44.entities.ServiceProvider.create(rest);
      }
    },
    onSuccess: () => {
      toast.success('Perfil salvo com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['myServiceProvider'] });
    },
    onError: (error) => {
      toast.error('Erro ao salvar perfil.', { description: error.message });
    }
  });

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const phoneNumber = value.replace(/\D/g, ''); // Remove todos os não-dígitos
    const maxLength = 11;
    const truncatedPhone = phoneNumber.substring(0, maxLength);

    if (truncatedPhone.length > 10) {
        return `(${truncatedPhone.slice(0, 2)}) ${truncatedPhone.slice(2, 7)}-${truncatedPhone.slice(7, 11)}`;
    } else if (truncatedPhone.length > 6) {
        return `(${truncatedPhone.slice(0, 2)}) ${truncatedPhone.slice(2, 6)}-${truncatedPhone.slice(6)}`;
    } else if (truncatedPhone.length > 2) {
        return `(${truncatedPhone.slice(0, 2)}) ${truncatedPhone.slice(2)}`;
    } else if (truncatedPhone.length > 0) {
        return `(${truncatedPhone}`;
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined })); // Clear error for this field
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    // Clear error for the parent field if it's a composite check like 'rates'
    if (parent === 'rates') {
        setErrors(prev => ({ ...prev, rates: undefined }));
    }
  };

  const handleLocationSelect = (newPosition) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        lat: newPosition[0],
        lng: newPosition[1],
      }
    }))
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    setUploading(prev => ({...prev, [type]: true}));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'profile') {
        handleInputChange('photo_url', file_url);
      } else if (type === 'portfolio') {
        handleInputChange('portfolio_images', [...(formData.portfolio_images || []), file_url]);
      } else if (type === 'document') {
        handleInputChange('verification_document_url', file_url);
      }
      toast.success(`Upload de ${type} concluído!`);
    } catch (error) {
      toast.error('Erro no upload.', { description: error.message });
    } finally {
      setUploading(prev => ({...prev, [type]: false}));
    }
  };

  const removePortfolioImage = (index) => {
    const updatedImages = [...formData.portfolio_images];
    updatedImages.splice(index, 1);
    handleInputChange('portfolio_images', updatedImages);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name || formData.full_name.trim() === '') {
      newErrors.full_name = 'Nome completo é obrigatório.';
    }
    
    if (!formData.occupation) {
      newErrors.occupation = 'Ocupação principal é obrigatória.';
    }
    
    if (!formData.photo_url || formData.photo_url.trim() === '') {
      newErrors.photo_url = 'Foto de perfil é obrigatória para o seu perfil.';
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = 'Telefone de contato é obrigatório.';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato (XX) XXXXX-XXXX.';
    }
    
    if (!formData.bio || formData.bio.trim() === '') {
      newErrors.bio = 'Biografia é obrigatória.';
    } else if (formData.bio.length < 50) {
      newErrors.bio = `Biografia muito curta. Escreva pelo menos 50 caracteres (você digitou ${formData.bio.length}).`;
    }
    
    if (!formData.rates?.hourly && !formData.rates?.daily) {
      newErrors.rates = 'Informe pelo menos um valor (por hora ou por dia) para seus serviços.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }
    
    mutation.mutate(formData);
  };

  const isUploading = Object.values(uploading).some(Boolean);

  if (isLoadingProvider || formData === null) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meu Perfil de Prestador</CardTitle>
          <CardDescription>Mantenha suas informações atualizadas para atrair mais clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileCompleteness formData={formData} />

          {!provider && (
             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-blue-900">Complete seu perfil!</h4>
                    <p className="text-sm text-blue-800">Seu perfil ainda não está visível para clientes. Preencha as informações abaixo e salve para começar a receber solicitações.</p>
                </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Foto de Perfil */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Perfil" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <label htmlFor="profile-pic" className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-slate-100">
                  <Camera className="w-4 h-4 text-slate-600" />
                  <input id="profile-pic" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'profile')} />
                </label>
              </div>
              <div className="flex-1">
                <Label htmlFor="full_name">Nome Completo <span className="text-red-500">*</span></Label>
                <Input 
                  id="full_name" 
                  required 
                  value={formData.full_name} 
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
              </div>
            </div>
            {errors.photo_url && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 mt-4">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{errors.photo_url}</p>
              </div>
            )}

            {/* Informações Profissionais */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Informações Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occupation">Ocupação Principal <span className="text-red-500">*</span></Label>
                  <Select 
                    required 
                    value={formData.occupation} 
                    onValueChange={(value) => handleInputChange('occupation', value)}
                  >
                    <SelectTrigger className={errors.occupation ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione sua ocupação" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>}
                </div>
                <div>
                  <Label htmlFor="experience_years">Anos de Experiência</Label>
                  <Input id="experience_years" type="number" value={formData.experience_years || ''} onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
                <Input id="specialties" value={(formData.specialties || []).join(', ')} onChange={(e) => handleInputChange('specialties', e.target.value.split(',').map(s => s.trim()))} placeholder="Ex: Pintura fina, Jardinagem de luxo"/>
              </div>
            </div>

            {/* Contato e Localização */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Contato e Localização</h3>
              <div>
                <Label htmlFor="phone">Telefone de Contato (WhatsApp) <span className="text-red-500">*</span></Label>
                <Input 
                  id="phone" 
                  value={formatPhoneNumber(formData.phone)} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  placeholder="(73) 99999-9999"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label>Localização Principal</Label>
                <ServiceLocationMap 
                  initialPosition={formData.location?.lat && formData.location?.lng ? [formData.location.lat, formData.location.lng] : undefined}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              <div>
                <Label htmlFor="coverage_radius_km">Raio de Atendimento (km)</Label>
                <Input id="coverage_radius_km" type="number" value={formData.location?.coverage_radius_km || ''} onChange={(e) => handleNestedInputChange('location', 'coverage_radius_km', parseInt(e.target.value) || 0)} />
                 <p className="text-xs text-slate-500 mt-1">Até que distância de sua localização principal você atende.</p>
              </div>
            </div>

            {/* Biografia */}
            <div>
              <Label htmlFor="bio">
                Sobre mim (Biografia) <span className="text-red-500">*</span>
                <span className="text-xs text-slate-500 ml-2">
                  ({formData.bio?.length || 0}/50 caracteres mínimos)
                </span>
              </Label>
              <Textarea 
                id="bio" 
                value={formData.bio} 
                onChange={(e) => handleInputChange('bio', e.target.value)} 
                placeholder="Fale um pouco sobre você, sua experiência e seus serviços..." 
                rows={5}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
            </div>

            {/* Portfólio */}
            <div>
              <Label>Portfólio de Trabalhos (fotos de antes/depois)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {(formData.portfolio_images || []).map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Portfolio ${index}`} className="w-full h-32 rounded-lg object-cover" />
                    <button type="button" onClick={() => removePortfolioImage(index)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label htmlFor="portfolio-upload" className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                  <PlusCircle className="w-8 h-8 text-slate-400 mb-1" />
                  <span className="text-sm text-slate-500">Adicionar foto</span>
                  <input id="portfolio-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'portfolio')} />
                </label>
              </div>
            </div>

            {/* Preços e Pagamento */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Preços e Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price_range">Faixa de Preço</Label>
                  <Select value={formData.price_range} onValueChange={(value) => handleInputChange('price_range', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priceRanges.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hourly_rate">Valor por Hora (R$)</Label>
                  <Input 
                    id="hourly_rate" 
                    type="number" 
                    value={formData.rates?.hourly || ''} 
                    onChange={(e) => handleNestedInputChange('rates', 'hourly', parseFloat(e.target.value) || 0)}
                    className={errors.rates ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="daily_rate">Valor por Dia (R$)</Label>
                  <Input 
                    id="daily_rate" 
                    type="number" 
                    value={formData.rates?.daily || ''} 
                    onChange={(e) => handleNestedInputChange('rates', 'daily', parseFloat(e.target.value) || 0)}
                    className={errors.rates ? 'border-red-500' : ''}
                  />
                </div>
              </div>
              {errors.rates && <p className="text-xs text-red-500 mt-1">{errors.rates}</p>}
              
              <div>
                <Label>Métodos de Pagamento Aceitos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {paymentMethods.map(method => (
                    <Button 
                      key={method}
                      type="button"
                      variant={formData.payment_methods?.includes(method) ? "default" : "outline"}
                      onClick={() => {
                        const currentMethods = formData.payment_methods || [];
                        const newMethods = currentMethods.includes(method) 
                          ? currentMethods.filter(m => m !== method) 
                          : [...currentMethods, method];
                        handleInputChange('payment_methods', newMethods);
                      }}
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verificação */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Verificação de Identidade</h3>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="verification_document">Documento de Verificação (CNH ou RG)</Label>
                      <p className="text-xs text-slate-500">Envie um documento para receber o selo "Verificado" em seu perfil. Seu documento é confidencial.</p>
                      {formData.verification_document_url && (
                        <p className="text-sm text-green-600 mt-2">✅ Documento enviado. Aguardando análise.</p>
                      )}
                      {/* Assuming 'verified' status might come from the backend after document analysis */}
                      {provider?.verified && (
                        <p className="text-sm text-blue-600 mt-2">🎉 Seu perfil foi verificado!</p>
                      )}
                    </div>
                    <label htmlFor="verification-upload">
                      <Button variant="outline" asChild className="cursor-pointer">
                        <span><FileUp className="w-4 h-4 mr-2" /> Enviar Documento</span>
                      </Button>
                      <input id="verification-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'document')} />
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" disabled={mutation.isPending || isUploading}>
                {(mutation.isPending || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Perfil
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MeuPerfilPrestadorPage() {
  return (
    <PermissionChecker requiredUserType="prestador">
      <MeuPerfilPrestadorContent />
    </PermissionChecker>
  );
}
