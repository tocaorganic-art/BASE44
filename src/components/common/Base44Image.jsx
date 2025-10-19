import React, { useState } from 'react';

/**
 * Componente de imagem otimizado para Base44
 * - Lazy loading nativo
 * - Fallback automático em caso de erro
 * - Placeholder durante carregamento
 * - Suporte a diferentes formatos e tamanhos
 */
const Base44Image = ({ 
  src, 
  alt = 'imagem', 
  className = '', 
  fallback = '/assets/placeholders/fallback.jpg',
  placeholder = '/assets/placeholders/loading.svg',
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    setCurrentSrc(fallback);
    if (onError) onError(e);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-md" />
      )}
      <img
        src={currentSrc || fallback}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`object-cover rounded-md transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
          Imagem indisponível
        </div>
      )}
    </div>
  );
};

export default Base44Image;