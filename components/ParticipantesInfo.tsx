"use client";

import { useState, useEffect } from 'react';
import { getParticipantesByEquipo, verificarConexion } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, RefreshCcw, AlertCircle, UserCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Participante = {
  id: string;
  nombre: string;
  cargo: string;
  area: string;
  equipo_id: string;
};

export default function ParticipantesInfo({ 
  equipoId, 
  equipoNombre,
  onSeleccionarParticipante,
  participantesEvaluados = {}
}: { 
  equipoId: string, 
  equipoNombre: string,
  onSeleccionarParticipante?: (participante: Participante) => void,
  participantesEvaluados?: Record<string, boolean>
}) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [statusConexion, setStatusConexion] = useState<{ conectado: boolean, mensaje: string } | null>(null);
  const router = useRouter();

  // Verificar conexión con Supabase
  const comprobarConexion = async () => {
    try {
      const status = await verificarConexion();
      console.log("Estado de conexión:", status);
      setStatusConexion(status);
      return status.conectado;
    } catch (error) {
      console.error("Error al verificar conexión:", error);
      setStatusConexion({ conectado: false, mensaje: 'No se pudo verificar la conexión' });
      return false;
    }
  };

  // Obtener participantes del equipo seleccionado
  const cargarParticipantes = async () => {
    setCargando(true);
    setError('');
    
    try {
      console.log("Solicitando participantes para el equipo:", equipoId);
      
      // Primero verificar la conexión
      const conexionOk = await comprobarConexion();
      if (!conexionOk) {
        setError('No se pudo establecer conexión con la base de datos. Se mostrarán datos de prueba.');
      }
      
      // Intentar obtener participantes incluso si la conexión falló (podrían usarse datos de fallback)
      const data = await getParticipantesByEquipo(equipoId);
      console.log("Respuesta de participantes:", data);
      
      if (data && Array.isArray(data)) {
        setParticipantes(data);
        if (data.length === 0) {
          console.log("La consulta fue exitosa pero no devolvió participantes");
        }
      } else {
        console.error("Formato de datos inválido:", data);
        setError('Los datos recibidos no tienen el formato esperado');
      }
    } catch (error) {
      console.error("Error al obtener participantes:", error);
      setError('No se pudieron cargar los participantes. Se mostrarán datos de prueba.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (equipoId) {
      cargarParticipantes();
    } else {
      setCargando(false);
      setError('No se proporcionó un ID de equipo válido');
    }
  }, [equipoId]);

  const handleContinuar = () => {
    // Redirigir a la página de selección para continuar el proceso
    router.push(`/seleccion/${equipoId}`);
  };

  const handleReintentar = () => {
    cargarParticipantes();
  };

  // Función para manejar la selección de un participante
  const handleSeleccionarParticipante = (participante: Participante) => {
    if (onSeleccionarParticipante) {
      onSeleccionarParticipante(participante);
    }
  };

  if (cargando) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Cargando participantes...</CardTitle>
          <CardDescription>Obteniendo la lista de participantes para {equipoNombre}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-md dark:bg-gray-700"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Contar participantes evaluados
  const contarEvaluados = () => {
    return participantes.filter(p => participantesEvaluados[p.id]).length;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{equipoNombre}</CardTitle>
        <CardDescription>
          {participantes.length > 0
            ? `Selecciona un participante para evaluarlo (${contarEvaluados()} de ${participantes.length} evaluados)`
            : "No hay participantes registrados para este equipo"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {statusConexion && !statusConexion.conectado && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problema de conexión</AlertTitle>
            <AlertDescription>
              {statusConexion.mensaje}. Se mostrarán datos de prueba para continuar.
            </AlertDescription>
          </Alert>
        )}
        
        {participantes.length > 0 ? (
          <div className="space-y-4">
            {participantes.map((participante) => {
              const estaEvaluado = participantesEvaluados[participante.id];
              
              return (
                <div 
                  key={participante.id} 
                  className={`p-4 border rounded-md transition-colors flex justify-between items-center
                    ${estaEvaluado 
                      ? 'bg-blue-950/30 border-blue-700/50 cursor-default' 
                      : 'bg-white/5 border-gray-700 hover:bg-slate-800 cursor-pointer'}`}
                  onClick={() => !estaEvaluado && handleSeleccionarParticipante(participante)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{participante.nombre}</h3>
                      {estaEvaluado && (
                        <Badge variant="outline" className="bg-green-900/40 text-green-300 border-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Evaluado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {participante.cargo} - {participante.area}
                    </p>
                  </div>

                  {!estaEvaluado && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hidden sm:flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeleccionarParticipante(participante);
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      Evaluar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">No se encontraron participantes para este equipo.</p>
            <Button onClick={handleReintentar} variant="outline" className="mb-4">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
      </CardContent>
      
      {!onSeleccionarParticipante && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleContinuar} className="flex items-center gap-2">
            Continuar con la evaluación
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 