"use client";

import { useState } from 'react';
import { registrarEvaluacion } from '@/lib/supabase';

type RegistrarEvaluacionProps = {
  participanteId: string;
  elemento: string;
  onComplete?: () => void;
};

export default function RegistrarEvaluacion({ 
  participanteId, 
  elemento,
  onComplete
}: RegistrarEvaluacionProps) {
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    
    try {
      const equipoId = localStorage.getItem('equipo_id') || '';
      const ceremoniaId = localStorage.getItem('ceremonia_id') || '';
      
      await registrarEvaluacion({
        ceremonia_id: ceremoniaId,
        equipo_evaluador_id: equipoId,
        participante_evaluado_id: participanteId,
        elemento_asignado: elemento,
        comentario: comentario
      });
      
      setExito(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error al registrar evaluación:", error);
      setError('No se pudo registrar la evaluación. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };
  
  if (exito) {
    return (
      <div className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
        <p className="text-green-400 text-center">¡Evaluación registrada con éxito!</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comentario" className="block text-white/80 mb-2">
          Comentario adicional (opcional)
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="¿Por qué elegiste este elemento para esta persona?"
          className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20
                    text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows={3}
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={enviando}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-md 
                   ${enviando 
                     ? "bg-gray-600 cursor-not-allowed" 
                     : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"} 
                   text-white font-medium transition-all duration-300 
                   shadow-lg shadow-orange-500/30 border border-orange-400/30`}
      >
        {enviando ? "Registrando..." : "Confirmar Evaluación"}
      </button>
    </form>
  );
}