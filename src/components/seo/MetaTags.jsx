import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function MetaTags({ 
  title = "Trancoso Experience - Encontre os Melhores Serviços",
  description = "A forma mais fácil de encontrar e contratar serviços de confiança em Trancoso, Bahia.",
  image = "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200",
  url = window.location.href,
  type = "website"
}) {
  const fullTitle = title.includes('Trancoso Experience') ? title : `${title} - Trancoso Experience`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}