"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProteccionRuta from "@/app/components/ProteccionRuta"
import { getParticipantesByEquipo, registrarEvaluacion } from "@/lib/supabase"


const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Itzamná Kauil",
    role: "Desarrollador Senior",
    department: "Tecnología",
  },
  {
    id: 2,
    name: "Ixchel Balam",
    role: "Diseñadora UX",
    department: "Diseño",
  },
  {
    id: 3,
    name: "Kukulkán Chac",
    role: "Gerente de Proyecto",
    department: "Administración",
  },
  {
    id: 4,
    name: "Nicté Canek",
    role: "Analista de Datos",
    department: "Inteligencia",
  },
  {
    id: 5,
    name: "Yum Kaax",
    role: "Especialista en Marketing",
    department: "Comercial",
  },
]

const ELEMENTOS = [
  {
    id: "fuego",
    nombre: "Fuego",
    descripcion: "Excelencia Técnica",
    color: "orange",
    bgColor: "bg-orange-500",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-white"
      >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
      </svg>
    ),
  },
  {
    id: "aire",
    nombre: "Aire",
    descripcion: "Liderazgo",
    color: "sky",
    bgColor: "bg-sky-400",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-white"
      >
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
      </svg>
    ),
  },
  {
    id: "tierra",
    nombre: "Tierra",
    descripcion: "Trabajo en Equipo",
    color: "emerald",
    bgColor: "bg-emerald-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-white"
      >
        <path d="m21 21-9-9m9 9a9 9 0 1 0-9-9c0 2.25.82 4.3 2.18 5.88L21 21Z"></path>
      </svg>
    ),
  },
  {
    id: "agua",
    nombre: "Agua",
    descripcion: "Innovación",
    color: "blue",
    bgColor: "bg-blue-500",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-white"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
      </svg>
    ),
  },
]

interface ElementoType {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface ElementCircleProps {
  elemento: ElementoType;
  isSelected: boolean;
  onSelect: () => void;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
}

interface Participante {
  id: string;
  nombre: string;
  rol: string;
  departamento: string;
  equipo_id: string;
}

export default function CategoriaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const miembroId = searchParams.get("miembro")
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [miembro, setMiembro] = useState<TeamMember | null>(null)
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [cargandoParticipantes, setCargandoParticipantes] = useState(false)
  const [errorParticipantes, setErrorParticipantes] = useState("")

  // Cargar participantes de Supabase
  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        setCargandoParticipantes(true)
        setErrorParticipantes("")
        
        // Obtener el ID del equipo del localStorage
        const equipoId = localStorage.getItem("equipo_id")
        
        if (equipoId) {
          // Obtener participantes de Supabase
          const participantesData = await getParticipantesByEquipo(equipoId)
          setParticipantes(participantesData)
        }
      } catch (error) {
        console.error("Error al cargar participantes:", error)
        setErrorParticipantes("No se pudieron cargar los participantes")
        // Fallback a datos estáticos
        setParticipantes([])
      } finally {
        setCargandoParticipantes(false)
      }
    }
    
    cargarParticipantes()
  }, []) // Se ejecuta solo al montar el componente

  useEffect(() => {
    if (miembroId) {
      const foundMember = TEAM_MEMBERS.find((m) => m.id.toString() === miembroId)
      if (foundMember) {
        setMiembro(foundMember)
      } else {
        router.push("/seleccion")
      }
    } else {
      router.push("/seleccion")
    }
  }, [miembroId, router])

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId)
  }

  const handleSubmit = () => {
    if (selectedElement && message.trim() !== "") {
      router.push(
        `/confirmacion?miembro=${miembroId}&elemento=${selectedElement}&mensaje=${encodeURIComponent(message)}`,
      )
    }
  }

  if (!miembro) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Link href="/seleccion" className="text-white hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold ml-4 neon-text-sm">ELIGE UN ELEMENTO</h1>
        </div>

        <div className="mb-8">
          <p className="text-white/80 text-lg">
            Cada elemento representa una cualidad diferente para reconocer a {miembro?.name}.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {ELEMENTOS.map((elemento) => (
            <ElementCircle
              key={elemento.id}
              elemento={elemento}
              isSelected={selectedElement === elemento.id}
              onSelect={() => handleElementSelect(elemento.id)}
            />
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white neon-text-sm">TU MENSAJE</h2>

          <div
            className={`relative rounded-lg overflow-hidden border 
            ${selectedElement ? `border-${ELEMENTOS.find((e) => e.id === selectedElement)?.color || "white"}-500/50` : "border-white/20"}
            transition-colors duration-300 mb-6 backdrop-blur-sm bg-black/30`}
          >
            <div className="absolute inset-0 maya-pattern opacity-5"></div>
            <textarea
              className={`w-full p-4 min-h-[150px] bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 relative z-10`}
              placeholder="Escribe tu mensaje de reconocimiento aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={!selectedElement || message.trim() === ""}
              className={`px-8 py-4 rounded-full font-medium text-lg shadow-lg transition-all duration-300
                ${
                  selectedElement && message.trim() !== ""
                    ? `${ELEMENTOS.find((e) => e.id === selectedElement)?.bgColor || "bg-gray-500"} text-white hover:shadow-xl glow-effect-sm`
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
            >
              Continuar con la Ofrenda
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function ElementCircle({ elemento, isSelected, onSelect }: ElementCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2" onClick={onSelect}>
      <div
        className={`w-20 h-20 md:w-24 md:h-24 ${elemento.bgColor} rounded-full flex items-center justify-center transition-all duration-300
          ${isSelected ? "glow-effect scale-110" : "opacity-80 hover:opacity-100 hover:scale-105"}`}
      >
        {elemento.icon}
      </div>
      <div className="text-center">
        <div className={`font-medium text-lg text-white ${isSelected ? "text-white" : "text-white/80"}`}>
          {elemento.nombre}
        </div>
        <div className={`text-sm text-${elemento.color}-400`}>{elemento.descripcion}</div>
      </div>
    </div>
  )
}
