import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = "Carregando..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-600 text-lg">{message}</p>
    </div>
  );
}