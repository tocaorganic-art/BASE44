import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({ rating, onRatingChange, size = 16, interactive = false, className }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((starValue) => (
        <Star
          key={starValue}
          size={size}
          className={cn(
            'transition-colors',
            interactive ? 'cursor-pointer' : '',
            starValue <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-slate-300 dark:text-slate-600'
          )}
          onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
          onMouseEnter={() => interactive && onRatingChange && onRatingChange(starValue)}
        />
      ))}
    </div>
  );
}