"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoveRight, Compass, Award } from "lucide-react"
import SupabaseTest from "./components/SupabaseTest"

// Interfaz para la información del usuario y resultado del quiz
interface QuizData {
  result: string
  userInfo: {
    name: string
    email: string
  }
  completedAt: string
}

interface ElementCircleProps {
  color: string;
  icon: "fire" | "air" | "earth" | "water";
}

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userElement, setUserElement] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [showTest, setShowTest] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Marcar como montado una vez que el componente esté en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar si el usuario ya ha completado el quiz
  useEffect(() => {
    try {
      const savedQuizData = localStorage.getItem("elementQuizData")
      if (savedQuizData) {
        const quizData: QuizData = JSON.parse(savedQuizData)
        setQuizCompleted(true)
        setUserElement(quizData.result)
        setUserName(quizData.userInfo.name)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
    // Usar setTimeout para dar tiempo a que el renderizado se complete
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [])

  const startQuiz = () => {
    router.push("/descubre-elemento")
  }

  // No renderizar nada hasta que estemos en el cliente para evitar problemas de hidratación
  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Contenido principal */}
      <div className="z-10 text-center px-6 max-w-3xl flex flex-col items-center">
        {/* Efectos de elementos como elementos absolutos a nivel global */}
        <div className="absolute top-0 right-[20%] w-24 h-24 bg-orange-500/40 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute top-[15%] right-[30%] w-16 h-16 bg-amber-400/30 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-[40%] left-[20%] w-32 h-32 bg-blue-500/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-[50%] left-[30%] w-20 h-20 bg-cyan-400/30 rounded-full blur-lg animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[25%] w-20 h-20 bg-sky-400/30 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-[30%] right-[15%] w-28 h-28 bg-emerald-500/30 rounded-full blur-xl animate-float"></div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text tracking-wider">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-200 animate-shimmer">
            Descubre tu Elemento
          </span>
        </h1>

        {/* Mensaje de guía para el usuario */}
        <div className="mb-8 max-w-lg">
          {!isLoading && (
            <p className={`${!quizCompleted ? 'text-2xl md:text-3xl font-semibold text-white animate-pulse bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent' : 'text-white/500 text-lg'}`}>
              {quizCompleted
                ? `Bienvenido, ${userName}. Tu elemento es ${getElementName(userElement as string)}. Ahora puedes iniciar la ceremonia de reconocimiento.`
                : "¡Conéctate con la energía de los elementos y revela tu verdadera esencia!"}
            </p>
          )}
        </div>

        {/* Elementos circulares */}
        <div className="flex justify-center gap-8 mb-12">
          <ElementCircle color="bg-orange-500" icon="fire" />
          <ElementCircle color="bg-sky-400" icon="air" />
          <ElementCircle color="bg-emerald-600" icon="earth" />
          <ElementCircle color="bg-blue-500" icon="water" />
        </div>

        {/* Contenedor de botones */}
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
          {/* Botón Quiz de Elementos - Deshabilitado si ya se completó */}
          {!isLoading &&
            (quizCompleted ? (
              <Link
                href="/descubre-elemento"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full 
                           bg-white/10 backdrop-blur-sm text-white font-medium text-lg 
                           hover:bg-white/20 transition-all duration-300 
                           border border-white/20"
              >
                Volver al Quiz <Compass className="ml-1" />
              </Link>
            ) : (
              <button
                onClick={startQuiz}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full 
                         bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-lg 
                         hover:from-amber-600 hover:to-orange-700 transition-all duration-300 
                         shadow-lg shadow-orange-500/30 border border-orange-400/30
                         transform hover:scale-105"
              >
                Descubre tu Elemento <Compass className="ml-1" />
              </button>
            ))}

          {/* Botón Iniciar Ceremonia - Ahora oculto */}
          {false && (
            <Link
              href="/seleccion"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full 
                       bg-white/10 backdrop-blur-sm text-white font-medium text-lg 
                       hover:bg-white/20 transition-all duration-300 
                       border border-white/20 shadow-lg"
            >
              Iniciar Ceremonia <MoveRight className="ml-1" />
            </Link>
          )}
        </div>
        
        {/* Herramienta de diagnóstico de Supabase */}
        {showTest && <SupabaseTest />}
      </div>
    </main>
  )
}

function ElementCircle({ color, icon }: ElementCircleProps) {
  return (
    <div className={`w-16 h-16 md:w-20 md:h-20 ${color} rounded-full flex items-center justify-center glow-effect`}>
      {icon === "fire" && (
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
      )}
      {icon === "air" && (
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
      )}
      {icon === "earth" && (
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
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      )}
      {icon === "water" && (
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
      )}
    </div>
  )
}

// Función para obtener el nombre del elemento en español
function getElementName(elementId: string): string {
  switch (elementId) {
    case "fuego":
      return "Fuego"
    case "agua":
      return "Agua"
    case "aire":
      return "Aire"
    case "tierra":
      return "Tierra"
    default:
      return "desconocido"
  }
}
