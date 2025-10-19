import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Júlia S.',
    role: 'Cliente de São Paulo',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Contratei um serviço de limpeza de última hora e foi impecável. O prestador era verificado e super profissional. O MeAjudaToca salvou minhas férias!'
  },
  {
    name: 'Carlos F.',
    role: 'Chef de Cozinha',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    comment: 'Desde que me cadastrei, minha agenda está sempre cheia. A plataforma me deu a visibilidade que eu precisava para conseguir clientes de alto padrão em Trancoso.'
  },
  {
    name: 'Mariana C.',
    role: 'Arquiteta e Cliente',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    comment: 'Usei para contratar um eletricista e um jardineiro para uma casa que estou reformando. Ambos foram excelentes. A facilidade de encontrar profissionais qualificados é o grande diferencial.'
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
      />
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="bg-slate-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">O que nossos usuários dizem</h2>
          <p className="text-slate-600 mt-2">Histórias reais de quem usa e aprova a nossa plataforma.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg bg-white">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex-grow mb-4">
                  <StarRating rating={testimonial.rating} />
                  <p className="text-slate-700 mt-4 italic">"{testimonial.comment}"</p>
                </div>
                <div className="flex items-center mt-auto">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}