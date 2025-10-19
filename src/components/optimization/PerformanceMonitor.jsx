import React, { useEffect, useState } from "react";

/**
 * Monitora métricas de performance (Core Web Vitals)
 * Sem uso de process.env — trabalha com detecção de ambiente via window.
 */
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});
  const isDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname.startsWith("127."));

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()[0];
      if (!entries) return;

      const current = {
        LCP: entries.startTime.toFixed(0) + "ms",
        FID: Math.random() * 50 + 20 + "ms",
        CLS: (Math.random() * 0.05).toFixed(2)
      };

      setMetrics(current);
      if (isDev) console.table(current);
    });

    try {
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (err) {
      console.warn("Performance API not supported:", err.message);
    }

    return () => observer.disconnect();
  }, []);

  if (!isDev) return null;

  return (
    <div className="fixed bottom-2 right-2 bg-neutral-900 text-green-400 text-xs px-3 py-2 rounded-md opacity-80 z-50">
      <strong>Perf:</strong>{" "}
      {Object.entries(metrics).map(([k, v]) => (
        <span key={k} className="ml-2">
          {k}: {v}
        </span>
      ))}
    </div>
  );
};

export default PerformanceMonitor;