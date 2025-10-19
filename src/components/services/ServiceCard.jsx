import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, DollarSign } from "lucide-react";

export default function ServiceCard({ service }) {
  const categoryColors = {
    "Eventos": "bg-purple-100 text-purple-800",
    "Restaurantes": "bg-orange-100 text-orange-800",
    "Passeios": "bg-blue-100 text-blue-800",
    "Praias": "bg-cyan-100 text-cyan-800",
    "Fornecedores": "bg-green-100 text-green-800",
    "Transporte": "bg-yellow-100 text-yellow-800",
    "Bem-estar": "bg-pink-100 text-pink-800",
    "Compras": "bg-indigo-100 text-indigo-800",
  };

  return (
    <Card className="glass-card border-none shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
      {service.images && service.images[0] && (
        <div className="h-48 overflow-hidden rounded-t-xl">
          <img 
            src={service.images[0]} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className={`${service.images && service.images[0] ? '' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} border-b`}>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge className={categoryColors[service.category]}>
            {service.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {service.summary && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {service.summary}
          </p>
        )}

        {service.description && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {service.description}
          </p>
        )}

        {service.location && service.location.address && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{service.location.address}</span>
          </div>
        )}

        {service.contact && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>{service.contact}</span>
          </div>
        )}

        {service.price_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {service.price_range}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}