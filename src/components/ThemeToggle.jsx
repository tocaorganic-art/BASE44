import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar preferência salva ou preferência do sistema
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Aplicar ou remover classe 'dark' no documento
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salvar preferência
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
      title={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </Button>
  );
}