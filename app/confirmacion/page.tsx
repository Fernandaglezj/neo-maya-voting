"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Home, Check } from "lucide-react"

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

const ELEMENTOS = {
  fuego: {
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
  aire: {
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
  tierra: {
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
  agua: {
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
}

// Define types for miembro and elemento
interface TeamMember {
  id: number
  name: string
  role: string
  department: string
}

interface Elemento {
  nombre: string
  descripcion: string
  color: string
  bgColor: string
  icon: React.ReactNode
}

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const miembroId = searchParams.get("miembro")
  const elementoId = searchParams.get("elemento")
  const mensaje = searchParams.get("mensaje")

  const [miembro, setMiembro] = useState<TeamMember | null>(null)
  const [elemento, setElemento] = useState<Elemento | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (miembroId && elementoId && mensaje) {
      const foundMember = TEAM_MEMBERS.find((m) => m.id.toString() === miembroId)
      
      // Use type assertion to help TypeScript understand this is a valid key
      const foundElement = elementoId && ELEMENTOS[elementoId as keyof typeof ELEMENTOS]

      if (foundMember && foundElement) {
        setMiembro(foundMember)
        setElemento(foundElement)

        // Simular animación de completado
        setTimeout(() => {
          setShowSuccess(true)
        }, 1500)
      } else {
        router.push("/seleccion")
      }
    } else {
      router.push("/seleccion")
    }
  }, [miembroId, elementoId, mensaje, router])

  if (!miembro || !elemento) {
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
          <Link href="/" className="text-white hover:text-amber-300 transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold ml-4 neon-text-sm">CERTIFICADO DE OFRENDA</h1>
        </div>

        <div
          className={`relative rounded-lg overflow-hidden transition-all duration-1000 transform
          ${showSuccess ? "scale-100 opacity-100" : "scale-95 opacity-90"}
          backdrop-blur-sm bg-black/30
          border border-white/20 shadow-lg`}
        >
          <div className="absolute inset-0 maya-pattern opacity-5"></div>

          {/* Certificado estilo códice maya */}
          <div className="p-8 relative">
            <div className="flex justify-between items-start mb-10">
              <div className="maya-glyph-border p-4 rounded-lg bg-black/30">
                <h2 className="text-2xl font-bold text-amber-400">Códice de Reconocimiento</h2>
                <p className="text-white/60">Ciclo Solar 2025</p>
              </div>

              <div
                className={`w-16 h-16 rounded-full ${elemento.bgColor} flex items-center justify-center
                ${showSuccess ? "glow-effect" : ""}`}
              >
                {elemento.icon}
              </div>
            </div>

            <div className="text-center mb-10">
              <div className="inline-block">
                <h3 className="text-3xl font-bold text-white neon-text-sm mb-2">{miembro.name}</h3>
                <div className={`h-1 bg-${elemento.color}-500 mx-auto rounded-full`}></div>
                <p className="text-white/80 mt-2">{miembro.role} • {miembro.department}</p>
              </div>
            </div>

            <div className="mb-10 text-center">
              <h4 className="text-xl font-medium text-amber-300 mb-4">
                Ha sido reconocido con el elemento
              </h4>
              <div className="inline-block mb-2">
                <span
                  className={`text-3xl font-bold text-${elemento.color}-400 mx-2 tracking-wide`}
                >
                  {elemento.nombre}
                </span>
              </div>
              <p className="text-white/70 text-lg mt-2">"{mensaje}"</p>
            </div>

            {/* Sello de autenticidad */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={`bg-${elemento.color}-500/20 border-2 border-${elemento.color}-500/40 rounded-full p-4
                  ${showSuccess ? "animate-pulse-slow" : ""}`}
                >
                  <Check className={`w-8 h-8 text-${elemento.color}-400`} />
                </div>
                {showSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute h-full w-full rounded-full bg-white opacity-20"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
