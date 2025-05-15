'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Contexto para Supabase
const SupabaseContext = createContext<SupabaseClient | null>(null);

// Hook para usar Supabase
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase debe usarse dentro de un SupabaseProvider');
  }
  return context;
};

// Componente Provider
export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Crear cliente en el lado del cliente para asegurar que las variables de entorno están disponibles
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log("SupabaseProvider - URL disponible:", !!url);
      console.log("SupabaseProvider - API Key disponible:", !!key);
      
      if (!url || !key) {
        throw new Error('Variables de entorno de Supabase no disponibles');
      }
      
      const client = createClient(url, key);
      setSupabase(client);
    } catch (err) {
      console.error('Error al inicializar Supabase en el cliente:', err);
      setError('Error al conectar con Supabase');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mostrar estado de carga o error
  if (loading) {
    return <div className="text-white text-center p-4">Conectando con Supabase...</div>;
  }

  if (error || !supabase) {
    return <div className="text-red-400 text-center p-4">{error || 'Error de conexión con Supabase'}</div>;
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
} 