import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Pré‑carregamento inteligente de rotas adjacentes.
 */
const RoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    const links = [
      "/Base44Templates",
      "/Base44ReportViewer",
      "/DiagnosticosCompletos"
    ];
    links.forEach((path) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      document.head.appendChild(link);
    });
  }, [location.pathname]);

  return null;
};

export default RoutePreloader;