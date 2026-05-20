import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PedreiroTrancoso() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Trancoso, Bahia</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Pedreiro em Trancoso para Casas, Pousadas e Imóveis de Temporada
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Precisa de pedreiro em Trancoso para obras, reformas ou construção?
            Na Trancoso Resolve você encontra profissionais selecionados para
            casas, pousadas e imóveis de temporada, com atendimento local e
            confiável.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            Pedir orçamento de pedreiro em Trancoso
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Principais serviços de pedreiro em Trancoso
          </h2>
          <div className="space-y-4">
            {[
              "Construção e reforma de casas e pousadas",
              "Assentamento de pisos, azulejos e revestimentos",
              "Obras em imóveis de temporada e condomínios",
              "Reparos estruturais e manutenção predial",
              "Construção de muros, calçadas e áreas externas",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 border rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Encontre pedreiro verificado em Trancoso agora
          </h2>
          <p className="text-blue-100 mb-8">
            Todos os prestadores da Trancoso Resolve passam por verificação de
            identidade e antecedentes. Peça orçamento com segurança.
          </p>
          <Link to={createPageUrl("ServicosCategoria")}>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
              Ver prestadores disponíveis
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
