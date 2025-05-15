'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function SupabaseTest() {
  const [status, setStatus] = useState('No probado');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Prueba directa con fetch para verificar conectividad general
  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      setStatus('Verificando conexión con fetch...');
      
      // Intentar hacer una petición básica a un URL externo conocido
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const result = await response.json();
      
      setData(result);
      setStatus('Conexión general a internet exitosa');
    } catch (err: any) {
      console.error('Error de conexión general:', err);
      setError(err.message || 'Error de conexión a internet');
      setStatus('Error de conexión general');
    } finally {
      setLoading(false);
    }
  };

  // Prueba de conexión a Supabase usando el cliente oficial
  const testSupabaseClient = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      // Usar la URL correcta del proyecto Supabase
      const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co'; 
      // Clave anónima de Supabase actualizada
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';
      
      setStatus('Conectando a Supabase...');
      console.log('URL Supabase:', supabaseUrl);
      
      // Crear cliente Supabase - esto evita problemas de CORS
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Probar una consulta simple
      const { data, error } = await supabase
        .from('ceremonias')
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) throw error;
      
      // Probar otra tabla para asegurar acceso completo
      const { data: equiposData, error: equiposError } = await supabase
        .from('equipos')
        .select('*', { count: 'exact' })
        .limit(1);
        
      if (equiposError) {
        console.error('Error al probar tabla equipos:', equiposError);
        throw equiposError;
      }
      
      setData({
        ceremonias: data,
        equipos: equiposData
      });
      setStatus('Conexión a Supabase exitosa');
    } catch (err: any) {
      console.error('Error con Supabase:', err);
      setError(err.message || 'Error desconocido');
      setStatus('Error de conexión a Supabase');
    } finally {
      setLoading(false);
    }
  };

  // Prueba específica para la tabla ceremonias
  const testCeremoniasTable = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co'; 
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';
      
      setStatus('Probando tabla ceremonias...');
      console.log('URL Supabase:', supabaseUrl);
      
      // Crear cliente Supabase
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Probar diferentes formatos de consulta
      console.log('Intento 1: Consulta básica');
      const { data: data1, error: error1 } = await supabase
        .from('ceremonias')
        .select('*')
        .limit(5);
      
      if (error1) {
        console.error('Error en consulta básica:', error1);
        throw new Error(`Error en consulta básica: ${error1.message}`);
      }
      
      // Probar con un formato alternativo
      console.log('Intento 2: Consulta de conteo');
      const { data: data2, error: error2, count } = await supabase
        .from('ceremonias')
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error2) {
        console.error('Error en consulta de conteo:', error2);
      }
      
      // Probar con RPC si existe
      console.log('Intento 3: Consulta con order by');
      const { data: data3, error: error3 } = await supabase
        .from('ceremonias')
        .select('id, nombre, fecha_inicio')
        .order('fecha_inicio', { ascending: false });
      
      if (error3) {
        console.error('Error en consulta con order by:', error3);
      }
      
      // Mostrar todos los resultados
      setData({
        consulta_basica: data1,
        consulta_conteo: { data: data2, count },
        consulta_ordenada: data3
      });
      
      setStatus('Pruebas de tabla ceremonias completadas');
    } catch (err: any) {
      console.error('Error con tabla ceremonias:', err);
      setError(err.message || 'Error desconocido');
      setStatus('Error al acceder a tabla ceremonias');
    } finally {
      setLoading(false);
    }
  };

  // Verificar información de conexión
  const showConnectionInfo = () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';
      
      // Mostrar información detallada
      setData({
        info: {
          url: supabaseUrl,
          keyPreview: `${supabaseKey.substring(0, 15)}...${supabaseKey.substring(supabaseKey.length - 10)}`,
          browser: navigator.userAgent,
          time: new Date().toISOString()
        }
      });
      
      setStatus('Información de conexión');
    } catch (err: any) {
      setError(err.message || 'Error al obtener información');
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Diagnóstico de conexión</h2>
      
      <div className="flex flex-col gap-4 mb-6">
        {/* Botones de prueba */}
        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          1. Probar conexión a internet
        </button>
        
        <button
          onClick={testSupabaseClient}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          2. Probar conexión a Supabase
        </button>
        
        <button
          onClick={testCeremoniasTable}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          3. Probar tabla ceremonias
        </button>
        
        <button
          onClick={showConnectionInfo}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          4. Mostrar información de conexión
        </button>
      </div>
      
      <div className="text-white mb-2">
        <strong>Estado:</strong> {status}
      </div>
      
      {loading && (
        <div className="text-amber-400 mb-2">Cargando...</div>
      )}
      
      {error && (
        <div className="text-red-400 mb-2 p-2 border border-red-500/30 bg-red-900/20 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="text-green-400 mb-2">
          <strong>Datos recibidos:</strong>
          <pre className="bg-black/50 p-2 rounded mt-2 text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 