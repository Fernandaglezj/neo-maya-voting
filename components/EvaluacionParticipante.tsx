"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { registrarEvaluacion } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Icono de fuego personalizado
const FireIcon = ({ filled = false, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-8 h-8 ${filled ? "text-blue-400 fill-blue-400" : "text-blue-200/30"} ${className}`}
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
};

type EvaluacionParticipanteProps = {
  participante: {
    id: string;
    nombre: string;
    cargo: string;
    area: string;
    equipo_id: string;
  };
  onClose: () => void;
  onEvaluacionGuardada?: () => void;
  elementoSeleccionado?: string;
};

// Preguntas para la evaluación
const PREGUNTAS_EVALUACION = [
  "Demuestra habilidades para liderar y guiar al equipo cuando se necesita",
  "Vive los valores y la cultura de Arkus",
  "Se comunica con los demás de forma clara y demuestra empatía al interactuar",
  "Contribuye de forma colaborativa y es resolutivo ante los retos",
  "Se organiza para cumplir con sus responsabilidades y apoyar al equipo cuando se necesita",
];

export default function EvaluacionParticipante({
  participante,
  onClose,
  onEvaluacionGuardada,
  elementoSeleccionado = "agua",
}: EvaluacionParticipanteProps) {
  const [calificaciones, setCalificaciones] = useState<number[]>(Array(PREGUNTAS_EVALUACION.length).fill(0));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Función para manejar la selección de calificación
  const handleCalificacion = (preguntaIndex: number, valor: number) => {
    const nuevasCalificaciones = [...calificaciones];
    nuevasCalificaciones[preguntaIndex] = valor;
    setCalificaciones(nuevasCalificaciones);
  };

  // Guardar la evaluación
  const handleGuardar = async () => {
    try {
      setGuardando(true);
      setError("");

      // Verificar que todas las preguntas tengan calificación
      if (calificaciones.some(c => c === 0)) {
        setError("Por favor, califica todas las áreas antes de guardar");
        setGuardando(false);
        return;
      }

      const equipoId = localStorage.getItem("equipo_id");
      const ceremoniaId = localStorage.getItem("ceremonia_id");

      if (!equipoId || !ceremoniaId) {
        setError("Información de sesión no disponible");
        setGuardando(false);
        return;
      }

      // Registrar la evaluación en la base de datos
      const comentario = `Calificaciones: ${calificaciones.join(', ')}`;

      await registrarEvaluacion({
        ceremonia_id: ceremoniaId,
        equipo_evaluador_id: equipoId,
        participante_evaluado_id: participante.id,
        elemento_asignado: elementoSeleccionado,
        comentario: comentario,
      });
      
      // Notificar que la evaluación fue guardada
      if (onEvaluacionGuardada) {
        onEvaluacionGuardada();
      }

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      setError("Ocurrió un error al guardar la evaluación");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-blue-950 text-white border-blue-800">
        <CardHeader className="relative border-b border-blue-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="text-2xl">Evaluación de {participante.nombre}</CardTitle>
        </CardHeader>
        
        <CardContent className="py-6 space-y-8">
          <p className="text-white/90">
            Por favor, evalúa a {participante.nombre} en las siguientes áreas usando una escala del 1 al 5, 
            donde 1 es "Necesita mejorar" y 5 es "Excelente".
          </p>

          <div className="space-y-10">
            {PREGUNTAS_EVALUACION.map((pregunta, preguntaIndex) => (
              <div key={preguntaIndex} className="space-y-3">
                <h3 className="font-medium text-lg">{pregunta}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        onClick={() => handleCalificacion(preguntaIndex, valor)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <FireIcon filled={calificaciones[preguntaIndex] >= valor} />
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-right font-medium text-lg">
                    {calificaciones[preguntaIndex] > 0 ? `${calificaciones[preguntaIndex]}/5` : ""}
                  </div>
                </div>
                
                <div className="border-b border-blue-800/50 pt-2"></div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-blue-800 pt-4 flex justify-end">
          <Button
            onClick={handleGuardar}
            disabled={guardando}
            className="flex items-center gap-2 px-6 py-5 bg-amber-500 hover:bg-amber-600 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {guardando ? "Guardando..." : "Guardar evaluación"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 