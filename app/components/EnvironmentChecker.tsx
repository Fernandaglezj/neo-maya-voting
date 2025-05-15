'use client';

import { useState, useEffect } from 'react';

export default function EnvironmentChecker() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: '',
    supabaseKeyPresent: false,
    checking: true,
    error: null as string | null
  });

  useEffect(() => {
    const checkEnvironmentVariables = () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        setEnvStatus({
          supabaseUrl: supabaseUrl || '',
          supabaseKeyPresent: !!supabaseKey,
          checking: false,
          error: null
        });
        
        console.log('Variables de entorno del lado del cliente:');
        console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY presente:', !!supabaseKey);
      } catch (error) {
        setEnvStatus({
          supabaseUrl: '',
          supabaseKeyPresent: false,
          checking: false,
          error: 'Error al verificar variables de entorno'
        });
      }
    };
    
    checkEnvironmentVariables();
  }, []);

  if (envStatus.checking) {
    return <div className="hidden">Verificando variables de entorno...</div>;
  }

  // Solo mostrar si hay problemas
  if (!envStatus.supabaseUrl || !envStatus.supabaseKeyPresent) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-900/80 text-white p-4 rounded-lg shadow-lg z-50 text-sm">
        <h3 className="font-bold mb-2">Error de configuración</h3>
        <ul className="list-disc pl-5">
          {!envStatus.supabaseUrl && (
            <li>URL de Supabase no configurada</li>
          )}
          {!envStatus.supabaseKeyPresent && (
            <li>API Key de Supabase no configurada</li>
          )}
        </ul>
        <p className="mt-2">Verifica tu archivo .env.local</p>
      </div>
    );
  }

  return null; // No mostrar nada si todo está bien
} 