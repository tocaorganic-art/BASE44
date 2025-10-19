import { Home, Hammer, Shirt, Car, Compass, UtensilsCrossed, PartyPopper, BookOpen, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BannerCategorias() {
  const categorias = [
    { icon: <Home size={24} />, name: "Limpeza" },
    { icon: <Hammer size={24} />, name: "Construção" },
    { icon: <Shirt size={24} />, name: "Beleza" },
    { icon: <Car size={24} />, name: "Transporte" },
    { icon: <Compass size={24} />, name: "Turismo" },
    { icon: <UtensilsCrossed size={24} />, name: "Gastronomia" },
    { icon: <PartyPopper size={24} />, name: "Festas" },
    { icon: <Wrench size={24} />, name: "Automóveis" },
  ];

  return (
    <section className="py-8 bg-[var(--background)]">
        <div className="container mx-auto">
            <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto py-4">
                {categorias.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={createPageUrl("ServicosCategoria", `?cat=${cat.name}`)}
                      className="group flex flex-col items-center gap-2 text-center flex-shrink-0"
                    >
                         <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-[var(--secondary)] group-hover:-translate-y-1 group-hover:shadow-lg">
                           <div className="text-gray-600 transition-colors duration-300 group-hover:text-white">{cat.icon}</div>
                         </div>
                         <span className="text-sm font-medium text-[var(--text-dark)]">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
}