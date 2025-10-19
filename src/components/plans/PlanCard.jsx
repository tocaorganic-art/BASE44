import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PlanCard({ plan, isCurrentPlan }) {
  const isFeatured = plan.is_featured;

  return (
    <Card 
        className={cn(
            "flex flex-col shadow-lg transition-all hover:shadow-xl hover:-translate-y-2",
            isFeatured && "scale-105 ring-2",
            isCurrentPlan ? "bg-slate-50" : "bg-white"
        )}
        style={{ borderColor: isFeatured ? plan.color_theme : undefined }}
    >
        <CardHeader className="relative text-center p-6" style={{ backgroundColor: isFeatured ? plan.color_theme : (isCurrentPlan ? '#e2e8f0' : '#f8fafc')}}>
            {isFeatured && <Badge className="absolute -top-3 right-5 bg-yellow-400 text-black">Mais Popular</Badge>}
            <h2 className={cn("text-2xl font-bold", isFeatured ? 'text-white' : 'text-slate-900')}>{plan.name}</h2>
            
            {plan.monthly_price > 0 ? (
                <div className={cn("font-bold", isFeatured ? 'text-white' : 'text-slate-900')}>
                    <span className="text-4xl">R${plan.monthly_price.toFixed(2).split('.')[0]}</span>
                    <span className="text-2xl">,{plan.monthly_price.toFixed(2).split('.')[1]}</span>
                    <span className="text-base font-normal">/mês</span>
                </div>
            ) : (
                <span className="text-4xl font-extrabold text-green-600">Grátis</span>
            )}
        </CardHeader>

        <CardContent className="flex-grow p-6 space-y-4">
            <p className="text-slate-600 text-sm h-12">{plan.description}</p>
            
            <ul className="space-y-3 text-slate-700">
                {(plan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>

        <CardFooter className="p-6">
             <Button asChild className="w-full" variant={isFeatured ? 'default' : 'outline'} style={{backgroundColor: isFeatured ? plan.color_theme : undefined}}>
                <Link to={createPageUrl('CadastroTipo')}>
                    {isCurrentPlan ? "Seu Plano Atual" : "Escolher Plano"}
                </Link>
             </Button>
        </CardFooter>
    </Card>
  );
}