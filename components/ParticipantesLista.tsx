"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipantesByEquipo, registrarEvaluacion } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type Participante = {
  id: string;
  nombre: string;
  cargo: string;
  area: string;
  equipo_id: string;
};

type ElementoType = "Agua" | "Fuego" | "Tierra" | "Aire";

export default function ParticipantesLista({ equipoId }: { equipoId: string }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ElementoType>("Agua");
  const [comentario, setComentario] = useState("");
  const [participanteActual, setParticipanteActual] = useState<Participante | null>(null);
  const [indiceActual, setIndiceActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  // Obtener participantes del equipo seleccionado
  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const data = await getParticipantesByEquipo(equipoId);
        setParticipantes(data);
        if (data.length > 0) {
          setParticipanteActual(data[0]);
        }
      } catch (error) {
        console.error("Error al obtener participantes:", error);
      } finally {
        setCargando(false);
      }
    };

    if (equipoId) {
      fetchParticipantes();
    }
  }, [equipoId]);

  const handleSiguiente = async () => {
    if (!participanteActual) return;
    
    try {
      setCargando(true);
      
      // Registrar la evaluación actual
      const ceremoniaId = localStorage.getItem('ceremonia_id') || '';
      const equipoEvaluadorId = localStorage.getItem('equipo_id') || '';
      
      await registrarEvaluacion({
        ceremonia_id: ceremoniaId,
        equipo_evaluador_id: equipoEvaluadorId,
        participante_evaluado_id: participanteActual.id,
        elemento_asignado: elementoSeleccionado,
        comentario: comentario
      });
      
      // Pasar al siguiente participante o finalizar
      if (indiceActual < participantes.length - 1) {
        setIndiceActual(indiceActual + 1);
        setParticipanteActual(participantes[indiceActual + 1]);
        // Resetear los valores para el siguiente participante
        setElementoSeleccionado("Agua");
        setComentario("");
      } else {
        // Si ya evaluamos a todos, redirigir a confirmación
        router.push('/confirmacion');
      }
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando && participantes.length === 0) {
    return <div className="text-center py-10">Cargando participantes...</div>;
  }

  if (!cargando && participantes.length === 0) {
    return <div className="text-center py-10">No hay participantes para evaluar en este equipo.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Evaluar Participante {indiceActual + 1} de {participantes.length}</CardTitle>
          <CardDescription>
            Asigna un elemento que mejor represente a esta persona
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {participanteActual && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">{participanteActual.nombre}</h3>
                <p className="text-sm text-muted-foreground">{participanteActual.cargo} - {participanteActual.area}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Selecciona un elemento:</h4>
                
                <RadioGroup 
                  value={elementoSeleccionado} 
                  onValueChange={(value) => setElementoSeleccionado(value as ElementoType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agua" id="agua" />
                    <Label htmlFor="agua">Agua 💧</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Fuego" id="fuego" />
                    <Label htmlFor="fuego">Fuego 🔥</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Tierra" id="tierra" />
                    <Label htmlFor="tierra">Tierra 🌱</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Aire" id="aire" />
                    <Label htmlFor="aire">Aire 💨</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comentario">Comentario (opcional):</Label>
                <Textarea
                  id="comentario"
                  placeholder="¿Por qué elegiste este elemento para esta persona?"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleSiguiente} 
            className="w-full"
            disabled={cargando}
          >
            {indiceActual < participantes.length - 1 ? 'Siguiente Participante' : 'Finalizar Evaluación'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 