"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProteccionRuta({ children }: { children: React.ReactNode }) {
  const [verificando, setVerificando] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Verificar si hay información de sesión en localStorage
    const equipoId = localStorage.getItem('equipo_id');
    const ceremoniaId = localStorage.getItem('ceremonia_id');
    
    if (!equipoId || !ceremoniaId) {
      // Redirigir a la página de selección si no hay sesión
      router.push('/seleccion');
    } else {
      setVerificando(false);
    }
  }, [router]);
  
  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}