"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import ParticipantesInfo from "@/components/ParticipantesInfo"
import EvaluacionParticipante from "@/components/EvaluacionParticipante"
import ProteccionRuta from "@/app/components/ProteccionRuta"
import ElementsBackground from "@/components/elements-background"
import { useToast } from "@/components/ui/use-toast"

export default function ParticipantesPage() {
  const [equipoId, setEquipoId] = useState<string>("")
  const [equipoNombre, setEquipoNombre] = useState<string>("")
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<any>(null)
  const [participantesEvaluados, setParticipantesEvaluados] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar si hay datos en localStorage
    const id = localStorage.getItem("equipo_id")
    const nombre = localStorage.getItem("equipo_nombre")

    if (!id) {
      // Redirigir al inicio si no hay datos de autenticación
      router.push("/")
      return
    }

    setEquipoId(id)
    setEquipoNombre(nombre || "Equipo")
    
    // Cargar participantes ya evaluados del localStorage
    const evaluadosGuardados = localStorage.getItem(`participantes_evaluados_${id}`)
    if (evaluadosGuardados) {
      try {
        setParticipantesEvaluados(JSON.parse(evaluadosGuardados))
      } catch (error) {
        console.error("Error al cargar participantes evaluados:", error)
      }
    }
  }, [router])

  // Función para manejar la selección de un participante
  const handleSeleccionarParticipante = (participante: any) => {
    // Comprobar si ya fue evaluado
    if (participantesEvaluados[participante.id]) {
      toast({
        title: "Participante ya evaluado",
        description: `${participante.nombre} ya ha sido evaluado por tu equipo.`,
        variant: "destructive"
      })
      return
    }
    
    setParticipanteSeleccionado(participante)
  }

  // Función para cerrar la evaluación
  const handleCerrarEvaluacion = () => {
    setParticipanteSeleccionado(null)
  }
  
  // Función para marcar un participante como evaluado después de guardar
  const handleEvaluacionGuardada = (participanteId: string) => {
    const nuevosEvaluados = {
      ...participantesEvaluados,
      [participanteId]: true
    }
    
    setParticipantesEvaluados(nuevosEvaluados)
    
    // Guardar en localStorage
    if (equipoId) {
      localStorage.setItem(`participantes_evaluados_${equipoId}`, JSON.stringify(nuevosEvaluados))
    }
    
    toast({
      title: "Evaluación guardada",
      description: "La evaluación se ha guardado correctamente.",
      variant: "default"
    })
  }

  return (
    <ProteccionRuta>
      <div className="min-h-screen bg-slate-950 text-white">
        <ElementsBackground />
        
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/" className="p-2 rounded-full hover:bg-slate-800">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">Participantes de {equipoNombre}</h1>
            </div>
            
            <Link 
              href="/seleccion" 
              className="inline-flex items-center gap-2 p-2 rounded hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Link>
          </div>
          
          {equipoId && (
            <ParticipantesInfo 
              equipoId={equipoId} 
              equipoNombre={equipoNombre} 
              onSeleccionarParticipante={handleSeleccionarParticipante}
              participantesEvaluados={participantesEvaluados}
            />
          )}
          
          {participanteSeleccionado && (
            <EvaluacionParticipante
              participante={participanteSeleccionado}
              onClose={handleCerrarEvaluacion}
              onEvaluacionGuardada={() => handleEvaluacionGuardada(participanteSeleccionado.id)}
              elementoSeleccionado="fuego"
            />
          )}
        </div>
      </div>
    </ProteccionRuta>
  )
} 