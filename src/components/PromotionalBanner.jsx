
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/ui/LazyImage';

const banners = [
  {
    id: 1,
    title: "MeAjudaToca agora em Trancoso!",
    subtitle: "Conectando você aos melhores prestadores de serviços da região.",
    cta: "Explore Serviços",
    ctaLink: "/ServicosCategoria",
    bgColor: "linear-gradient(135deg, #0A81D1 0%, #0D8A6F 100%)",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Ganhe R$ 30 OFF no primeiro serviço",
    subtitle: "Use o código BEMVINDO30 ao agendar com qualquer prestador.",
    cta: "Aproveitar Agora",
    ctaLink: "/ServicosCategoria",
    bgColor: "linear-gradient(135deg, #F4D35E 0%, #F95738 100%)",
    image: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Seja um Prestador Premium",
    subtitle: "3 meses grátis no plano Premium para os 50 primeiros cadastros.",
    cta: "Cadastre-se Agora",
    ctaLink: "/CadastroTipo",
    bgColor: "linear-gradient(135deg, #0D8A6F 0%, #2D3047 100%)",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Baixe nosso aplicativo",
    subtitle: "Serviços mesmo offline, perfeito para Trancoso. Disponível em breve!",
    cta: "Saiba Mais",
    ctaLink: "#",
    bgColor: "linear-gradient(135deg, #2D3047 0%, #0A81D1 100%)",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }
];

export default function PromotionalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl my-8">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0"
          )}
          style={{ background: banner.bgColor }} // Base background for the entire banner
        >
          <div className="relative w-full h-full">
            {/* Image container, positioned on the right */}
            <div className="absolute right-0 top-0 h-full w-full md:w-3/5">
              <LazyImage 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Unified Overlay for Text Readability and visual blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            {/* Text Content */}
            <div className="relative container mx-auto h-full flex items-center z-20">
              <div className="text-white md:w-1/2 p-8">
                <h2 className="text-4xl font-bold mb-3 drop-shadow-md">{banner.title}</h2>
                <p className="text-lg opacity-90 mb-6 drop-shadow-sm">{banner.subtitle}</p>
                <Link to={banner.ctaLink}>
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg">
                    {banner.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Buttons */}
      <Button variant="ghost" size="icon" className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white bg-black/20 hover:bg-black/40 rounded-full" onClick={prevSlide}>
        <ChevronLeft />
      </Button>
      <Button variant="ghost" size="icon" className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white bg-black/20 hover:bg-black/40 rounded-full" onClick={nextSlide}>
        <ChevronRight />
      </Button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              currentIndex === index ? "bg-white scale-125" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
