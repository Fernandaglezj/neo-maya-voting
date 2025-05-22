"use client"

// Este archivo contiene la implementación de la página para descubrir tu elemento maya
// Última actualización: imágenes actualizadas para la pregunta 5

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Info, User, Mail, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  guardarResultadoElemento, 
  verificarCorreoExistente, 
  verificarInvitadoPalMar, 
  actualizarInvitadoPalMar 
} from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const ELEMENTOS = [
  {
    id: "fuego",
    nombre: "Fuego",
    descripcion: "K'AAK'",
    color: "orange",
    bgColor: "bg-orange-500",
    bgImage: "/images/bg-fire.jpg",
    detalle:
      "Elemento del impulso, la pasión y el liderazgo.\nEres chispa que enciende, llama que guía como el sol que nace entre los templos, inspiras con tu energía, tu determinación y tu calor. Llevas dentro la fuerza del jaguar que no teme avanzar, y el corazón valiente que enciende a otros.\nDonde tú vas, se siente el movimiento, la pasión por hacer y transformar. \n\n**Tu misión**: Encender caminos, contagiar entusiasmo y ser motor de cambio. \n**Tu valor sagrado**: La iniciativa.",
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
    id: "agua",
    nombre: "Agua",
    descripcion: "HA'",
    color: "blue",
    bgColor: "bg-blue-500",
    bgImage: "/images/bg-water.jpg",
    detalle:
      "Elemento de la sensibilidad, la empatía y la armonía.\nEres río que fluye, lluvia que nutre, espejo de emociones profundas. Como los cenotes sagrados, tienes una calma que conecta, una sabiduría suave que transforma sin imponer.\nEscuchas con el alma, cuidas con presencia, y construyes puentes entre personas y mundos.\n\n**Tu misión**: Sanar, unir y recordar lo esencial.\n**Tu valor sagrado**: La compasión.",
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
  {
    id: "aire",
    nombre: "Aire",
    descripcion: "IIK'",
    color: "sky",
    bgColor: "bg-sky-400",
    bgImage: "/images/bg-air.jpg",
    detalle:
      "Elemento del pensamiento, la creatividad y la comunicación.\nEres brisa que renueva, voz que viaja lejos. Como el viento entre las copas de los árboles, traes ideas frescas, soluciones inesperadas y una mente que no se detiene. Observas desde lo alto, ves conexiones invisibles y hablas con claridad.\nEres libertad en forma de palabra y pensamiento.\n\n**Tu misión**: Abrir horizontes, inspirar y conectar con nuevas posibilidades.\n**Tu valor sagrado**: La visión.",
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
    descripcion: "LU'UM",
    color: "emerald",
    bgColor: "bg-emerald-600",
    bgImage: "/images/bg-earth.jpg",
    detalle:
      "Elemento de la estabilidad, la constancia y la construcción.\nEres raíz profunda, camino firme, roca que sostiene, como la milpa sagrada sabes que el crecimiento lleva tiempo y cuidado, te mueves con propósito, edificas con paciencia y ofreces seguridad en medio del caos.\nTu presencia da calma, y tu fuerza dirección.\n\n**Tu misión**: Sostener, construir y hacer florecer a quienes te rodean.\n**Tu valor sagrado**: La responsabilidad.",
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
        <path d="M18 6L6 18M6 6l12 12"></path>
      </svg>
    ),
  },
]

// Define el tipo de opción de pregunta para permitir image, video o audio

type QuizOption = {
  text: string;
  element: string;
  image?: string;
  video?: string;
  audio?: string;
};

type QuizQuestion = {
  title: string;
  question: string;
  type: "image" | "text";
  options: QuizOption[];
};

// Cambia la declaración de QUIZ_QUESTIONS:
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    title: "🪶 El Altar de los Cuatro Signos",
    question: "En el momento en que te acercas al altar sagrado, ¿cuál de estos objetos llama tu atención?",
    type: "image",
    options: [
      {
        text: "Un cuenco de obsidiana que vibra con un zumbido interior.",
        element: "fuego",
        image: "/images/1-AA.png",
      },
      {
        text: "Un trozo de jade oscuro envuelto en hilos rojos, tibio al contacto.",
        element: "agua",
        image: "/images/1-BB.png",
      },
      {
        text: "Un anillo suspendido en el aire, girando sin sostén.",
        element: "aire",
        image: "/images/1-CC.png",
      },
      {
        text: "Una piedra agrietada con formas antiguas que sangran luz.",
        element: "tierra",
        image: "/images/1-DD.png",
      },
    ],
  },
  {
    title: "🔥 Invocación del Corazón",
    question: "En el momento en que el fuego sagrado es encendido y se pide guía, tú…",
    type: "text",
    options: [
      {
        text: "Sientes que debes dar el primer paso, aunque no sepas hacia dónde.",
        element: "fuego",
      },
      {
        text: "Cierras los ojos y dejas que la energía te atraviese.",
        element: "agua",
      },
      {
        text: "Observas lo invisible, como si algo te hablara entre pensamientos.",
        element: "aire",
      },
      {
        text: "Tomas una posición firme, como si el suelo mismo te sostuviera.",
        element: "tierra",
      },
    ],
  },
  {
    title: "🌀 Consejo de los Sonidos Olvidados",
    question: "En un antiguo templo, cuatro ecos resuenan sin fin. Solo uno entra en tu pecho y se queda ¿Cuál eliges?",
    type: "text",
    options: [
      {
        text: "Un canto fragmentado que parece salido de tu infancia.",
        element: "fuego",
        audio: "/audio/3-A.mp3"
      },
      {
        text: "Un lamento que sube desde la piedra mojada.",
        element: "agua",
        audio: "/audio/3-B.mp3"
      },
      {
        text: "Un silbido breve que desaparece antes de que lo escuches completo.",
        element: "aire",
        audio: "/audio/3-C.mp3"
      },
      {
        text: "Un golpe constante que parece acompasado con tus latidos.",
        element: "tierra",
        audio: "/audio/3-D.mp3"
      }
    ],
  },
  {
    title: "🌑 El Guardián del Umbral",
    question: "Un anciano cubierto con mantos de ceniza te detiene antes de cruzar el río sagrado. No te dice nada, solo te mira a los ojos. ¿Cómo reaccionas? ",
    type: "text",
    options: [
      {
        text: "Lo reconoces como una prueba y cruzas con paso firme.",
        element: "fuego",
      },
      {
        text: "Lo observas con respeto, y esperas a que él haga el primer movimiento.",
        element: "agua",
      },
      {
        text: "Le haces una pregunta con voz tranquila, buscando comprensión.",
        element: "aire",
      },
      {
        text: "Das media vuelta, confiando en que si es el momento, volverás por otro camino.",
        element: "tierra",
      },
    ],
  },
  {
    title: "🌘 Kinam - El Día Sin Nombre ",
    question: "Durante el Kinam, una decisión importante llega a ti de forma inesperada. Nadie puede ayudarte. ¿Qué haces? ",
    type: "text",
    options: [
      {
        text: "Tomas una decisión rápida y sigues adelante, confiando en tu instinto.",
        element: "fuego",
      },
      {
        text: "Te tomas un momento para sentir qué es lo correcto, y entonces actúas.",
        element: "agua",
      },
      {
        text: "Consideras distintas posibilidades antes de elegir una dirección.",
        element: "aire",
      },
      {
        text: "Optas por mantener las cosas estables, aunque eso implique esperar.",
        element: "tierra",
      },
    ],
  },
  {
    title: "🎭 Máscara del Nahual Dormido",
    question: "Ante ti cuelgan cuatro máscaras mayas. No sabes a quién representan, pero una te observa. ¿Cuál tomas? ",
    type: "image",
    options: [
      {
        text: "La que pesa más de lo que aparenta.",
        element: "fuego",
        image: "/images/6-A.png",
      },
      {
        text: "La que huele a humo de copal y tierra húmeda.",
        element: "agua",
        image: "/images/6-B.png",
      },
      {
        text: "La que se mueve con el viento aunque no haya brisa.",
        element: "aire",
        image: "/images/6-C.png",
      },
      {
        text: "La que no tiene aberturas, pero te deja respirar.",
        element: "tierra",
        image: "/images/6-D.png",
      },
    ],
  },
  {
    title: "🌾 El Consejo Silencioso",
    question: "Durante una ceremonia, el fuego se apaga. Los ancianos te miran. ¿Qué sientes que no puede faltar para restaurar el equilibrio? ",
    type: "text",
    options: [
      {
        text: "Iniciativa.",
        element: "fuego",
      },
      {
        text: "Compasión.",
        element: "agua",
      },
      {
        text: "Visión.",
        element: "aire",
      },
      {
        text: "Estabilidad.",
        element: "tierra",
      },
    ],
  },
  {
    title: "🌙 Sueño del Primer Jaguar",
    question: "Desde hace tiempo sueñas con un mismo lugar. Lo que sucede ahí es… ",
    type: "image",
    options: [
      {
        text: "Una figura cubierta de plumas deja algo en tus manos y desaparece.",
        element: "fuego",
        video: "/videos/8-A.mp4",
      },
      {
        text: "Abres una puerta que se desplaza en espiral, pero no entras.",
        element: "agua",
        video: "/videos/8-B.mp4",
      },
      {
        text: "Una montaña se parte en dos sin ruido, y de ella sale neblina.",
        element: "aire",
        video: "/videos/8-C.mp4",
      },
      {
        text: "Un tambor suena bajo tierra y tus pies se mueven solos.",
        element: "tierra",
        video: "/videos/8-D.mp4",
      },
    ],
  },
  {
    title: "🗝️ Inicio del Mundo",
    question: "Antes del primer amanecer, tú despiertas. Aún no hay tiempo, ni forma, ni cuerpo. Solo intención. Lo primero que haces es…",
    type: "text",
    options: [
      {
        text: "Llamar con tu voz para que otros te escuchen.",
        element: "fuego",
      },
      {
        text: "Fundirte con lo invisible y esperar el momento justo.",
        element: "agua",
      },
      {
        text: "Soñar lo que vendrá, aunque aún no exista.",
        element: "aire",
      },
      {
        text: "Trazar líneas en el polvo, como si siempre hubieran estado ahí.",
        element: "tierra",
      },
    ],
  },
]

// Interfaz para la información del usuario
interface UserInfo {
  name: string
  email: string
}

// Componente para subir audio (solo visible si es admin)
function AudioUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Subir a Supabase Storage o a un endpoint de tu preferencia
    // Aquí solo se simula la subida y se genera una URL local
    const url = URL.createObjectURL(file);
    onUpload(url);
    // En producción, deberías subir el archivo y obtener la URL pública
  };
  return (
    <div className="mb-2">
      <label className="block text-white/80 mb-1 text-sm">Subir audio para opción:</label>
      <input type="file" accept="audio/*" onChange={handleFileChange} className="text-white" />
    </div>
  );
}

export default function DescubreElementoPage() {
  const router = useRouter()
  // Referencia para controlar el timeout del chequeo de email
  const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Estados generales
  const [view, setView] = useState<"intro" | "form" | "quiz" | "tiebreaker" | "result" | "loading">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [letterCounts, setLetterCounts] = useState<{A: number, B: number, C: number, D: number}>({A: 0, B: 0, C: 0, D: 0})
  const [result, setResult] = useState<string | null>(null)
  const [hoveredOption, setHoveredOption] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Estado para el formulario de usuario
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" })
  const [formErrors, setFormErrors] = useState({ name: "", email: "" })
  const [isFormValid, setIsFormValid] = useState(false)

  // Estado para verificar si el usuario es invitado de PalMar 2025
  const [isPalMarInvitee, setIsPalMarInvitee] = useState<boolean>(false)
  const [inviteeInfo, setInviteeInfo] = useState<any>(null)
  
  // Mapeo de letras a elementos
  const letterToElement: Record<string, string> = {
    'A': 'fuego',
    'B': 'agua',
    'C': 'aire',
    'D': 'tierra'
  }

  // Mensajes de resultado según el elemento
  const elementMessages: Record<string, string> = {
    'fuego': "Eres impulso, visión, y liderazgo natural. Inspiras y mueves a los demás con tu energía ardiente.",
    'agua': "Eres sensibilidad, empatía y adaptabilidad. Transformas lo que tocas con calma y profundidad.",
    'aire': "Eres creatividad, comunicación y cambio. Vuelas alto y traes nuevas ideas a cada rincón.",
    'tierra': "Eres estructura, lealtad y constancia. Sostienes y haces florecer con tu compromiso silencioso."
  }

  // Función para reiniciar el quiz
  const resetQuiz = () => {
    setAnimating(true)
    setTimeout(() => {
      setView("quiz")
      setCurrentQuestion(0)
      setAnswers([])
      setLetterCounts({A: 0, B: 0, C: 0, D: 0})
      setResult(null)
      setAnimating(false)
    }, 500)
  }

  // Función para borrar todos los datos y reiniciar desde el formulario
  const resetCompletely = () => {
    setAnimating(true)
    try {
      localStorage.removeItem("elementQuizData")
    } catch (error) {}
    setTimeout(() => {
      setCurrentQuestion(0)
      setAnswers([])
      setLetterCounts({A: 0, B: 0, C: 0, D: 0})
      setResult(null)
      setQuizCompleted(false)
      setUserInfo({ name: "", email: "" })
      setView("form")
      setAnimating(false)
    }, 500)
  }

  // Al cargar la página, limpia cualquier información previa de sesiones anteriores
  useEffect(() => {
    // Limpiar datos de localStorage
    try {
      localStorage.removeItem("elementQuizData");
    } catch (error) {
      // Ignorar error
    }
    // Reiniciar todos los estados
    setUserInfo({ name: "", email: "" });
    setAnswers([]);
    setLetterCounts({ A: 0, B: 0, C: 0, D: 0 });
    setResult(null);
    setQuizCompleted(false);
    setView("form");
    // Limpiamos el timeout por buenas prácticas
    return () => {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
    };
  }, []);

  // Función para verificar si un email ya completó el test o es invitado PalMar
  const verificarEmailCompletado = async (email: string) => {
    try {
      const resultado = await verificarCorreoExistente(email);
      
      if (resultado && resultado.existe) {
        // El correo ya existe en la base de datos de elementos
        setFormErrors(prev => ({
          ...prev,
          email: "Este correo ya ha completado el test. Cada persona solo puede completarlo una vez."
        }));
        // Asegurar que el formulario no se pueda enviar
        setIsFormValid(false);
      } else {
        // Verificar si es un invitado de PalMar 2025
        const invitado = await verificarInvitadoPalMar(email);
        
        if (invitado) {
          setIsPalMarInvitee(true);
          setInviteeInfo(invitado);
          
          // Si ya completó el test, mostrar mensaje
          if (invitado.estado === 'completado') {
            setFormErrors(prev => ({
              ...prev,
              email: "Ya has completado el test para PalMar 2025. ¡Gracias por participar!"
            }));
            // Asegurar que el formulario no se pueda enviar
            setIsFormValid(false);
          } else {
            // Es invitado pero no ha completado, limpiar errores
            setFormErrors(prev => ({
              ...prev,
              email: ""
            }));
            
            toast({
              title: "¡Bienvenido a la ceremonia de elementos de Pal'Mar 2025!",
              description: "¿Listo para descubrir qué elemento representa tu esencia espiritual? Esta sabiduría ancestral maya te revelará tus fortalezas.",
              variant: "default"
            });
          }
        } else {
          // No es invitado de PalMar, limpiar errores
          setIsPalMarInvitee(false);
          setInviteeInfo(null);
          setFormErrors(prev => ({
            ...prev,
            email: ""
          }));
        }
      }
    } catch (error) {
      console.error("Error al verificar email:", error);
    }
  };

  // Validar el formulario cuando cambian los datos
  useEffect(() => {
    validateForm()
  }, [userInfo])

  // Función para validar el formulario
  const validateForm = () => {
    const errors = { name: "", email: "" }
    let valid = true

    // Validar nombre
    if (!userInfo.name.trim()) {
      errors.name = "El nombre es obligatorio"
      valid = false
    } else if (userInfo.name.trim().length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres"
      valid = false
    }

    // Validar email - debe tener el dominio @arkusnexus.com
    if (!userInfo.email.trim()) {
      errors.email = "El correo electrónico es obligatorio"
      valid = false
    } else if (!userInfo.email.trim().toLowerCase().endsWith("@arkusnexus.com")) {
      errors.email = "Debes usar un correo con dominio @arkusnexus.com"
      valid = false
    } else {
      // Verificar que el formato general del email sea válido
      const emailRegex = /^[^\s@]+@arkusnexus\.com$/
      if (!emailRegex.test(userInfo.email.trim().toLowerCase())) {
        errors.email = "Formato de correo electrónico inválido"
        valid = false
      }
    }

    setFormErrors(errors)
    setIsFormValid(valid)
  }

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
    
    // Si es el campo de email y parece un email válido, verificar si ya existe
    if (name === 'email' && value && value.includes('@') && value.toLowerCase().endsWith('@arkusnexus.com')) {
      // Usamos un debounce para no hacer muchas peticiones mientras escribe
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
      
      const timeoutId = setTimeout(() => {
        verificarEmailCompletado(value);
      }, 1000); // Esperar 1 segundo después de que el usuario termine de escribir
      
      emailCheckTimeout.current = timeoutId;
    }
  }

  // Manejar envío del formulario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      setAnimating(true);
      
      try {
        // Verificar si el correo ya existe en la base de datos
        const resultado = await verificarCorreoExistente(userInfo.email);
        
        if (resultado && resultado.existe) {
          // El usuario ya completó el test anteriormente, no permitir continuar
          toast({
            title: "Email ya registrado",
            description: "Este correo ya completó el test anteriormente. Cada persona solo puede completar el test una vez.",
            variant: "destructive"
          });
          
          // Establecer el error en el formulario y detener la animación
          setFormErrors(prev => ({
            ...prev,
            email: "Este correo ya ha completado el test. Cada persona solo puede completarlo una vez."
          }));
          
          setAnimating(false);
          return; // Detener la ejecución y no avanzar al quiz
        }
        
        // Si llegamos aquí, el correo no existe, podemos continuar con el quiz
        setTimeout(() => {
          setView("quiz");
          setAnimating(false);
        }, 500);
      } catch (error) {
        console.error("Error al verificar correo:", error);
        // Si hay error en la verificación, mostramos mensaje pero permitimos continuar
        toast({
          title: "Error de verificación",
          description: "No pudimos verificar si el correo ya ha sido utilizado. Puedes continuar, pero ten en cuenta que los resultados pueden no guardarse correctamente si ya has completado el test antes.",
          variant: "destructive"
        });
        
        setTimeout(() => {
          setView("quiz");
          setAnimating(false);
        }, 500);
      }
    }
  }

  // Función para manejar la respuesta
  const handleAnswer = (element: string, optionIndex: number) => {
    // Determinar la letra basada en el índice de la opción (0->A, 1->B, 2->C, 3->D)
    const optionLetter = String.fromCharCode(65 + optionIndex)
    
    // Actualizar respuestas
    const newAnswers = [...answers, element]
    setAnswers(newAnswers)
    
    // Actualizar conteo de letras
    const newLetterCounts = {...letterCounts}
    
    // Score por pregunta según el índice (0-based)
    let scoreMultiplier = 1;
    if (currentQuestion === 4) {
      scoreMultiplier = 2; // Pregunta 5
    } else if (currentQuestion === 8) {
      scoreMultiplier = 4; // Pregunta 9
    }
    
    // Aplicar el multiplicador de puntaje
    newLetterCounts[optionLetter as keyof typeof newLetterCounts] += scoreMultiplier
    setLetterCounts(newLetterCounts)

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setAnimating(false)
      }, 500)
    } else {
      // Calcular resultado basado en la mayoría de letras
      calculateResult(newLetterCounts)
    }
  }
  
  const handleTiebreakerAnswer = (letter: string, element: string) => {
    // Determinar el resultado final basado en la respuesta de desempate
    const resultElement = letterToElement[letter] || element
    
    setAnimating(true)
    // Añadir transición dramática
    document.body.classList.add('transition-to-element')
    
    setTimeout(() => {
      setResult(resultElement)
      setView("result")
      setQuizCompleted(true)

      // Guardar el resultado sólo en Supabase, no en localStorage
      guardarResultadoElemento({
        nombre: userInfo.name,
        correo_electronico: userInfo.email,
        elemento: resultElement,
        respuestas: {
          letterCounts,
          tiebreaker: letter,
          completedAt: new Date().toISOString()
        }
      })
      .then(() => {
        // Verificar si el correo está en personas_invitadas y actualizar
        verificarInvitadoPalMar(userInfo.email).then((invitado) => {
          console.log("[PalMar] Resultado de verificarInvitadoPalMar:", invitado);
          if (invitado) {
            const percentages = {
              agua: letterCounts.B || 0,
              fuego: letterCounts.A || 0,
              tierra: letterCounts.D || 0,
              aire: letterCounts.C || 0
            };
            console.log("[PalMar] Llamando a actualizarInvitadoPalMar para:", userInfo.email, invitado);
            actualizarInvitadoPalMar(
              userInfo.email,
              resultElement,
              percentages,
              {
                letterCounts,
                tiebreaker: letter,
                completedAt: new Date().toISOString()
              }
            )
              .then((result) => {
                if (result) {
                  console.log("Asistencia PalMar registrada:", { 
                    email: userInfo.email, 
                    elemento: result 
                  });
                } else {
                  console.error("No se pudo actualizar el estado del invitado PalMar:", { 
                    email: userInfo.email, 
                    elemento: result 
                  });
                  toast({
                    title: "Error en PalMar 2025",
                    description: "Hubo un problema al registrar tu asistencia. Contacta al administrador.",
                    variant: "destructive"
                  });
                }
              })
              .catch(error => {
                console.error("Error al actualizar estado de invitado PalMar:", error);
                toast({
                  title: "Error en PalMar 2025",
                  description: "Hubo un problema al registrar tu asistencia. Contacta al administrador.",
                  variant: "destructive"
                });
              });
          } else {
            console.error("[PalMar] Invitado no encontrado en personas_invitadas para:", userInfo.email);
          }
        });
        toast({
          title: "Resultado guardado",
          description: "Tu elemento ha sido registrado exitosamente.",
          variant: "success"
        });
      })
      .catch(error => {
        console.error("Error al guardar en Supabase:", error);
        // Verificar si es un error de permisos (RLS policy)
        const errorMsg = error.message && error.message.includes("permisos") 
          ? "No tienes permisos para guardar en la base de datos. Los administradores deben configurar las políticas de acceso."
          : "No pudimos guardar tu resultado en la base de datos, pero puedes continuar con la experiencia.";
          
        toast({
          title: "Error al guardar",
          description: errorMsg,
          variant: "destructive"
        });
      });

      // Quitar la clase de transición después de un momento
      setTimeout(() => {
        document.body.classList.remove('transition-to-element')
        setAnimating(false)
      }, 600)
    }, 800)
  }

  // Calcular resultado basado en la mayoría de letras
  const calculateResult = (counts: {A: number, B: number, C: number, D: number}) => {
    // Convertir conteos a array para ordenar
    const countsArray = Object.entries(counts).map(([letter, count]) => ({
      letter,
      count,
      element: letterToElement[letter]
    }))
    
    // Ordenar por conteo de mayor a menor
    countsArray.sort((a, b) => b.count - a.count)
    
    // Mostrar resultado directamente, sin lógica de empate
    const result = letterToElement[countsArray[0].letter]
    setResult(result)
    
    // Guardar en Supabase
    guardarResultadoElemento({
      nombre: userInfo.name,
      correo_electronico: userInfo.email,
      elemento: result,
      respuestas: {
        letterCounts: counts,
        completedAt: new Date().toISOString()
      }
    })
    .then(() => {
      // Verificar si el correo está en personas_invitadas y actualizar
      verificarInvitadoPalMar(userInfo.email).then((invitado) => {
        console.log("[PalMar] Resultado de verificarInvitadoPalMar:", invitado);
        if (invitado) {
          const percentages = {
            agua: counts.B || 0,
            fuego: counts.A || 0,
            tierra: counts.D || 0,
            aire: counts.C || 0
          };
          console.log("[PalMar] Llamando a actualizarInvitadoPalMar para:", userInfo.email, invitado);
          actualizarInvitadoPalMar(
            userInfo.email,
            result,
            percentages,
            {
              letterCounts: counts,
              completedAt: new Date().toISOString()
            }
          )
          .then((updateResult) => {
            if (updateResult) {
              console.log("Asistencia PalMar registrada:", { 
                email: userInfo.email, 
                elemento: updateResult 
              });
            } else {
              console.error("No se pudo actualizar el estado del invitado PalMar:", { 
                email: userInfo.email, 
                elemento: result 
              });
              toast({
                title: "Error en PalMar 2025",
                description: "Hubo un problema al registrar tu asistencia. Contacta al administrador.",
                variant: "destructive"
              });
            }
          })
          .catch(error => {
            console.error("Error al actualizar estado de invitado PalMar:", error);
            toast({
              title: "Error en PalMar 2025",
              description: "Hubo un problema al registrar tu asistencia. Contacta al administrador.",
              variant: "destructive"
            });
          });
        } else {
          console.error("[PalMar] Invitado no encontrado en personas_invitadas para:", userInfo.email);
        }
      });
      
      toast({
        title: "Resultado guardado",
        description: "Tu elemento ha sido registrado exitosamente.",
        variant: "success"
      });
    })
    .catch(error => {
      console.error("Error al guardar en Supabase:", error);
      // Verificar si es un error de permisos (RLS policy)
      const errorMsg = error.message && error.message.includes("permisos") 
        ? "No tienes permisos para guardar en la base de datos. Los administradores deben configurar las políticas de acceso."
        : "No pudimos guardar tu resultado en la base de datos, pero puedes continuar con la experiencia.";
        
      toast({
        title: "Error al guardar",
        description: errorMsg,
        variant: "destructive"
      });
    });
    
    setView("result")
  }

  // Función para obtener el color de borde según el elemento
  const getElementBorderColor = (element: string): string => {
    switch (element) {
      case "fuego":
        return "border-orange-500/50"
      case "agua":
        return "border-blue-500/50"  
      case "aire":
        return "border-sky-500/50"
      case "tierra":
        return "border-emerald-500/50"
      default:
        return "border-white/20"
    }
  }

  // Función para obtener el color de fondo según el elemento
  const getElementBgGradient = (element: string): string => {
    switch (element) {
      case "fuego":
        return "from-orange-900/30 to-orange-700/10"
      case "agua":
        return "from-blue-900/30 to-blue-700/10"
      case "aire":
        return "from-sky-900/30 to-sky-700/10"
      case "tierra":
        return "from-emerald-900/30 to-emerald-700/10"
      default:
        return "from-white/5 to-white/0"
    }
  }

  // Función para obtener el fondo según el elemento
  const getElementBackground = () => {
    if (view !== 'result' || !result) return null;
    
    // Configuración del fondo por elemento
    const backgroundStyles = {
      fuego: {
        background: "linear-gradient(to bottom, #7a1f1d, #a73121, #e25822, #000000)",
        overlay: "rgba(255, 69, 0, 0.2)"
      },
      agua: {
        background: "linear-gradient(to bottom, #0d253f, #1a4d7c, #2e79a3, #000000)",
        overlay: "rgba(0, 119, 190, 0.2)"
      },
      aire: {
        background: "linear-gradient(to bottom, #1e3a8a, #2563eb, #60a5fa, #000000)",
        overlay: "rgba(91, 173, 220, 0.2)"
      },
      tierra: {
        background: "linear-gradient(to bottom, #064e3b, #065f46, #10b981, #000000)",
        overlay: "rgba(52, 168, 83, 0.2)"
      }
    };
    
    const elementStyle = backgroundStyles[result as keyof typeof backgroundStyles] || backgroundStyles.fuego;
    
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Fondo base con gradiente personalizado */}
        <div 
          className="absolute inset-0 animate-slow-pulse" 
          style={{ background: elementStyle.background }}
        ></div>
        
        {/* Patrón maya */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full maya-pattern"></div>
        </div>
        
        {/* Capa de superposición de color */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ backgroundColor: elementStyle.overlay }}
        ></div>
        
        {/* Gradiente de oscurecimiento */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
    );
  };

  if (view === "loading") {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Fondo dinámico basado en el elemento resultado */}
      {getElementBackground()}
      
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-white hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold ml-4 neon-text-sm">DESCUBRE TU ELEMENTO</h1>
        </div>

        {/* Formulario de registro de usuario */}
        {view === "form" && (
          <div className="max-w-sm mx-auto">
            <div
              className={`bg-black/30 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-4 mb-8 transition-all duration-500 
              ${animating ? "opacity-0 transform translate-y-10" : "opacity-100 transform translate-y-0"}`}
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Registro para la Ceremonia</h2>
              <p className="text-white/80 mb-6 text-center text-base">
                Antes de descubrir tu elemento, necesitamos conocer quién eres.
              </p>

              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-white/90 mb-1 font-medium text-base">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-white/10 border-2 ${
                        formErrors.name ? "border-red-500/70" : "border-white/20"
                      } rounded-xl text-white text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent shadow-inner`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-red-400 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-white/90 mb-1 font-medium text-base">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-white/10 border-2 ${
                        formErrors.email ? "border-red-500/70" : "border-white/20"
                      } rounded-xl text-white text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent shadow-inner`}
                      placeholder="tucorreo@arkusnexus.com"
                    />
                  </div>
                  {formErrors.email && (
                    <div className="mt-1 text-red-400 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{formErrors.email}</p>
                        {formErrors.email.includes("ya ha completado") && (
                          <p className="text-xs mt-1"></p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-6 py-3 rounded-full font-medium text-base shadow-lg transition-all duration-300
                      ${
                        isFormValid
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-[1.02]"
                          : "bg-white/10 text-white/50 cursor-not-allowed"
                      }`}
                  >
                    Comenzar el Quiz
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-3 flex items-start">
              <Info className="w-5 h-5 text-white/60 mr-2 shrink-0 mt-0.5" />
              <p className="text-white/70 text-sm">
                Esta ceremonia es exclusiva para miembros de ArkusNexus. Por favor, utiliza tu correo corporativo con
                dominio @arkusnexus.com para continuar.
              </p>
            </div>
          </div>
        )}

        {view === "quiz" && (
          <div className="max-w-4xl mx-auto">
            {/* Progreso del quiz */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80">
                  Pregunta {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Pregunta actual */}
            <div
              className={`bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8 transition-all duration-500 
              ${animating ? "opacity-0 transform translate-x-10" : "opacity-100 transform translate-x-0"}`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                {QUIZ_QUESTIONS[currentQuestion].title}
              </h2>
              <p className="text-xl text-white/90 mb-8 text-center">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </p>

              {QUIZ_QUESTIONS[currentQuestion].type === "image" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300
                border-3 ${hoveredOption === index ? getElementBorderColor(option.element) : "border-white/20"}
                hover:shadow-lg transform hover:scale-[1.03]`}
                      onClick={() => handleAnswer(option.element, index)}
                      onMouseEnter={() => setHoveredOption(index)}
                      onMouseLeave={() => setHoveredOption(null)}
                    >
                      <div className="relative aspect-square flex items-center justify-center bg-black/10">
                        {option.video ? (
                          <video
                            ref={el => {
                              if (el && hoveredOption === index) {
                                el.play();
                              } else if (el) {
                                el.pause();
                                el.currentTime = 0;
                              }
                            }}
                            controls
                            muted
                            width="100%"
                            style={{ borderRadius: '1rem', maxHeight: '100%' }}
                            onClick={e => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                          >
                            <source src={option.video} type="video/mp4" />
                            Tu navegador no soporta el video.
                          </video>
                        ) : (
                          <Image
                            src={option.image || "/placeholder.svg"}
                            alt={option.text}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        )}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${
                            hoveredOption === index ? getElementBgGradient(option.element) : "from-black/60 to-black/0"
                          } transition-all duration-300`}
                        ></div>
                        <div className="absolute top-4 left-4">
                          <span className="inline-block w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                      </div>
                      {option.audio && (
                        <audio
                          controls
                          controlsList="nodownload noplaybackrate"
                          className="mt-2 w-full custom-audio-player"
                          style={{
                            background: '#232323',
                            borderRadius: '1rem',
                            padding: '0.5rem',
                            border: '2px solid #E1B058',
                            boxShadow: '0 2px 8px #0004',
                            outline: 'none',
                            accentColor: '#E1B058',
                            colorScheme: 'dark',
                          }}
                        >
                          <source src={option.audio} type="audio/mp3" />
                          Tu navegador no soporta el audio.
                        </audio>
                      )}
                      {/* Si eres admin, muestra el uploader para cambiar el audio de la opción */}
                      {process.env.NEXT_PUBLIC_ADMIN_MODE === 'true' && (
                        <AudioUploader onUpload={url => {
                          // Aquí podrías actualizar la opción en el estado si lo deseas
                          // Por simplicidad, solo muestra la URL
                          alert('URL de audio para usar en la opción: ' + url);
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                QUIZ_QUESTIONS[currentQuestion].type === "text" ? (
                  currentQuestion === 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                        <div key={index} className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center shadow-lg border border-[#292929]">
                          <button
                            onClick={() => handleAnswer(option.element, index)}
                            onMouseEnter={() => setHoveredOption(index)}
                            onMouseLeave={() => setHoveredOption(null)}
                            className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center text-xl font-bold shadow-inner transition-all duration-300
                              ${hoveredOption === index ? 'bg-amber-500 text-white scale-110' : 'bg-white/10 text-white/80'}`}
                          >
                            {String.fromCharCode(65 + index)}
                          </button>
                          {option.audio && (
                            <div className="w-full flex flex-col items-center">
                              <audio
                                controls
                                controlsList="nodownload noplaybackrate"
                                className="w-full custom-audio-player"
                                style={{
                                  background: '#232323',
                                  borderRadius: '1rem',
                                  padding: '0.5rem',
                                  border: '2px solid #E1B058',
                                  boxShadow: '0 2px 8px #0004',
                                  outline: 'none',
                                  accentColor: '#E1B058',
                                  colorScheme: 'dark',
                                }}
                              >
                                <source src={option.audio} type="audio/mp3" />
                                Tu navegador no soporta el audio.
                              </audio>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(option.element, index)}
                          onMouseEnter={() => setHoveredOption(index)}
                          onMouseLeave={() => setHoveredOption(null)}
                          className={`w-full text-left p-5 rounded-xl 
                            ${hoveredOption === index ? `bg-gradient-to-r ${getElementBgGradient(option.element)}` : "bg-white/5"}
                            hover:bg-white/10 
                            border-2 ${hoveredOption === index ? getElementBorderColor(option.element) : "border-white/10"} 
                            hover:border-white/30 transition-all duration-300
                            text-white hover:text-white flex items-start mb-2`}
                        >
                          <span className="inline-block w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 shrink-0 text-lg font-bold shadow-inner">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-lg">{option.text}</span>
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.element, index)}
                        onMouseEnter={() => setHoveredOption(index)}
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`w-full text-left p-5 rounded-xl 
                          ${hoveredOption === index ? `bg-gradient-to-r ${getElementBgGradient(option.element)}` : "bg-white/5"}
                          hover:bg-white/10 
                          border-2 ${hoveredOption === index ? getElementBorderColor(option.element) : "border-white/10"} 
                          hover:border-white/30 transition-all duration-300
                          text-white hover:text-white flex items-start mb-2`}
                      >
                        <span className="inline-block w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 shrink-0 text-lg font-bold shadow-inner">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-lg">{option.text}</span>
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {view === "result" && result && (
          <div className="max-w-4xl mx-auto relative animate-fade-in">
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-8 mb-8 animate-scale-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Tu elemento es</h2>
                <div className="inline-block relative">
                  {ELEMENTOS.find(e => e.id === result)?.icon && (
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${ELEMENTOS.find(e => e.id === result)?.bgColor} glow-effect`}>
                      {ELEMENTOS.find(e => e.id === result)?.icon}
                    </div>
                  )}
                  <h3 className={`text-4xl md:text-5xl font-bold mb-2 text-${ELEMENTOS.find(e => e.id === result)?.color}-400 animate-glow`}>
                    {ELEMENTOS.find(e => e.id === result)?.nombre}
                  </h3>
                  <div className="text-white/90 text-lg md:text-xl font-medium mb-6">
                    {ELEMENTOS.find(e => e.id === result)?.descripcion}
                  </div>
                </div>
              </div>

              {/* Descripción principal del elemento */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
                <div className="text-white/80 leading-relaxed text-center">
                  {ELEMENTOS.find(e => e.id === result)?.detalle.includes('\n') ? (
                    <>
                      {ELEMENTOS.find(e => e.id === result)?.detalle.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">
                          {line.startsWith('**') && line.endsWith('**') ? (
                            <strong>{line.replace(/\*\*/g, '')}</strong>
                          ) : line.includes('**') ? (
                            <>
                              {line.split('**').map((part, i) => (
                                i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                              ))}
                            </>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p className="mb-4">{ELEMENTOS.find(e => e.id === result)?.detalle}</p>
                  )}
                  <p className="italic text-white/60">
                    Este elemento refleja tus fortalezas naturales y la energía que aportas al equipo.
                  </p>
                </div>
              </div>

              {/* Elementos decorativos según el elemento */}
              <div className="absolute -top-10 -left-10 -right-10 -bottom-10 -z-10 pointer-events-none">
                {result === "fuego" && (
                  <>
                    <div className="absolute top-0 right-1/4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-float"></div>
                    <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                  </>
                )}
                {result === "agua" && (
                  <>
                    <div className="absolute top-1/4 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-float"></div>
                    <div className="absolute bottom-20 left-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                  </>
                )}
                {result === "aire" && (
                  <>
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-sky-500/20 rounded-full blur-xl animate-float"></div>
                    <div className="absolute bottom-10 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-pulse-slow"></div>
                  </>
                )}
                {result === "tierra" && (
                  <>
                    <div className="absolute top-20 right-0 w-36 h-36 bg-emerald-500/20 rounded-full blur-xl animate-float"></div>
                    <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-green-600/20 rounded-full blur-xl animate-pulse-slow"></div>
                  </>
                )}
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6">
                  <div className="text-white/90 font-medium">{userInfo.name}</div>
                  <div className="text-white/70 text-sm">{userInfo.email}</div>
                </div>
              </div>

              {/* Sección de elementos secundarios - solo para Fuego */}
              {result === 'fuego' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">✨ También habita en ti el equilibrio de los otros elementos:</h3>
                  <div className="space-y-3">
                    {Object.entries(letterCounts).map(([letter, count]) => {
                      const element = letterToElement[letter];
                      if (element === result) return null; // No mostrar el elemento principal
                      // Calcular el porcentaje total
                      const total = Object.values(letterCounts).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      if (percentage === 0) return null;
                      type ElementInfo = {
                        agua: { emoji: string; message: string };
                        aire: { emoji: string; message: string };
                        tierra: { emoji: string; message: string };
                      };
                      const elementInfo: ElementInfo = {
                        agua: { emoji: "💧", message: "tu empatía suaviza tu fuego" },
                        aire: { emoji: "🌬️", message: "tu visión se enriquece con creatividad" },
                        tierra: { emoji: "🌱", message: "tu impulso se fortalece con constancia" }
                      };
                      return (
                        <div key={letter} className="flex items-center justify-center text-white/90">
                          <span className="text-2xl mr-2">{elementInfo[element as keyof ElementInfo].emoji}</span>
                          <span className="font-medium">{ELEMENTOS.find(e => e.id === element)?.nombre}</span>
                          <span className="mx-2">•</span>
                          <span className="text-amber-400 font-bold">{percentage}%</span>
                          <span className="mx-2">–</span>
                          <span className="text-white/70">{elementInfo[element as keyof ElementInfo].message}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-white/80 text-center mt-6">Tu fuego guía, pero es el balance con los demás elementos lo que te convierte en una fuerza poderosa y sabia.</p>
                </div>
              )}

              {/* Sección de elementos secundarios - solo para Aire */}
              {result === 'aire' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">✨ También habita en ti el equilibrio de los otros elementos:</h3>
                  <div className="space-y-3">
                    {Object.entries(letterCounts).map(([letter, count]) => {
                      const element = letterToElement[letter];
                      if (element === result) return null;
                      const total = Object.values(letterCounts).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      if (percentage === 0) return null;
                      type ElementInfoAire = {
                        fuego: { emoji: string; message: string };
                        agua: { emoji: string; message: string };
                        tierra: { emoji: string; message: string };
                      };
                      const elementInfoAire: ElementInfoAire = {
                        fuego: { emoji: "🔥", message: "te impulsa a llevar tus ideas a la acción." },
                        agua: { emoji: "💧", message: "nutre tu comunicación con empatía." },
                        tierra: { emoji: "🌱", message: "aterriza tus pensamientos en planes concretos." }
                      };
                      if (!(element in elementInfoAire)) return null;
                      return (
                        <div key={letter} className="flex items-center justify-center text-white/90">
                          <span className="text-2xl mr-2">{elementInfoAire[element as keyof ElementInfoAire].emoji}</span>
                          <span className="font-medium">{ELEMENTOS.find(e => e.id === element)?.nombre}</span>
                          <span className="mx-2">•</span>
                          <span className="text-amber-400 font-bold">{percentage}%</span>
                          <span className="mx-2">–</span>
                          <span className="text-white/70">{elementInfoAire[element as keyof ElementInfoAire].message}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-white/80 text-center mt-6">Tu aire es libre, creativo y despierto, pero es gracias a la danza con los otros elementos que tus ideas toman forma y dirección.</p>
                </div>
              )}

              {/* Sección de elementos secundarios - solo para Tierra */}
              {result === 'tierra' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">✨ También habita en ti el equilibrio de los otros elementos:</h3>
                  <div className="space-y-3">
                    {Object.entries(letterCounts).map(([letter, count]) => {
                      const element = letterToElement[letter];
                      if (element === result) return null;
                      const total = Object.values(letterCounts).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      if (percentage === 0) return null;
                      type ElementInfoTierra = {
                        fuego: { emoji: string; message: string };
                        agua: { emoji: string; message: string };
                        aire: { emoji: string; message: string };
                      };
                      const elementInfoTierra: ElementInfoTierra = {
                        fuego: { emoji: "🔥", message: "enciende tu determinación." },
                        agua: { emoji: "💧", message: "suaviza tu fuerza con sensibilidad." },
                        aire: { emoji: "🌬️", message: "abre tu mente a nuevas formas de construir." }
                      };
                      if (!(element in elementInfoTierra)) return null;
                      return (
                        <div key={letter} className="flex items-center justify-center text-white/90">
                          <span className="text-2xl mr-2">{elementInfoTierra[element as keyof ElementInfoTierra].emoji}</span>
                          <span className="font-medium">{ELEMENTOS.find(e => e.id === element)?.nombre}</span>
                          <span className="mx-2">•</span>
                          <span className="text-amber-400 font-bold">{percentage}%</span>
                          <span className="mx-2">–</span>
                          <span className="text-white/70">{elementInfoTierra[element as keyof ElementInfoTierra].message}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-white/80 text-center mt-6">Tu tierra es fértil y firme, y con el apoyo de los otros elementos, logras sembrar, cuidar y transformar a largo plazo.</p>
                </div>
              )}

              {/* Sección de elementos secundarios - solo para Agua */}
              {result === 'agua' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">✨ También habita en ti el equilibrio de los otros elementos:</h3>
                  <div className="space-y-3">
                    {Object.entries(letterCounts).map(([letter, count]) => {
                      const element = letterToElement[letter];
                      if (element === result) return null;
                      const total = Object.values(letterCounts).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      if (percentage === 0) return null;
                      type ElementInfoAgua = {
                        fuego: { emoji: string; message: string };
                        aire: { emoji: string; message: string };
                        tierra: { emoji: string; message: string };
                      };
                      const elementInfoAgua: ElementInfoAgua = {
                        fuego: { emoji: "🔥", message: "te da el impulso para actuar cuando es necesario." },
                        aire: { emoji: "🌬️", message: "potencia tu intuición con ideas frescas." },
                        tierra: { emoji: "🌱", message: "te ayuda a sostener lo que transformas." }
                      };
                      if (!(element in elementInfoAgua)) return null;
                      return (
                        <div key={letter} className="flex items-center justify-center text-white/90">
                          <span className="text-2xl mr-2">{elementInfoAgua[element as keyof ElementInfoAgua].emoji}</span>
                          <span className="font-medium">{ELEMENTOS.find(e => e.id === element)?.nombre}</span>
                          <span className="mx-2">•</span>
                          <span className="text-amber-400 font-bold">{percentage}%</span>
                          <span className="mx-2">–</span>
                          <span className="text-white/70">{elementInfoAgua[element as keyof ElementInfoAgua].message}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-white/80 text-center mt-6">Tu agua fluye con sabiduría, y los otros elementos la acompañan para crear un camino profundo y generoso.</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <button
                  onClick={resetCompletely}
                  className="px-6 py-3 rounded-full font-medium text-white transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl"
                >
                  Volver al Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Añadir el componente Toaster para mostrar notificaciones */}
      <div className="z-50">
        <Toaster />
      </div>
    </main>
  )
}
