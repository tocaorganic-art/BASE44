import { useEffect } from "react";

/**
 * Pré‑carrega imagens críticas da tela inicial.
 */
const ImagePreloader = () => {
  useEffect(() => {
    const criticalImages = [
      "https://base44.com/img/logo-symbol-blue.png",
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
    ];
    
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
};

export default ImagePreloader;