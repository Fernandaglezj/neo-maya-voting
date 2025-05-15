"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, X, Save, Flame, Star, LogOut } from "lucide-react"

// Definiciones de tipos
interface TeamMember {
  id: number;
  name: string;
  role: string;
  element: "fire" | "water" | "earth" | "air";
  image: string;
}

interface Team {
  name: string;
  description: string;
  members: TeamMember[];
}

interface ElementStyle {
  gradient: string;
  border: string;
  nonSelectedBorder: string;
  text: string;
  glow: string;
  bg: string;
  name: string;
  flame: {
    active: string;
    inactive: string;
    hover: string;
  };
}

interface MemberCardProps {
  member: TeamMember;
  isSelected: boolean;
  isEvaluated: boolean;
  onSelect: () => void;
  elementStyle: ElementStyle;
}

interface EvaluationSectionProps {
  member: TeamMember;
  questions: string[];
  ratings: number[];
  onRatingChange: (questionIndex: number, rating: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string;
  isComplete: boolean;
  elementStyle: ElementStyle;
}

// Preguntas de evaluación
const EVALUATION_QUESTIONS: string[] = [
  "Demuestra habilidades para liderar y guiar al equipo cuando se necesita",
  "Vive los valores y la cultura de la empresa",
  "Se comunica con los demás de forma clara y demuestra empatía al interactuar",
  "Contribuye de forma colaborativa y es resolutivo ante los retos",
  "Se organiza para cumplir con sus responsabilidades y apoyar al equipo cuando se necesita",
]

// Datos simulados de miembros de equipos
const TEAM_DATA: Record<string, Team> = {
  "team1": {
    name: "Equipo Quetzal",
    description: "Desarrollo Frontend",
    members: [
      {
        id: 101,
        name: "Itzamná Kauil",
        role: "Desarrollador Senior",
        element: "fire",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        id: 102,
        name: "Ixchel Balam",
        role: "Diseñadora UX",
        element: "water",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: 103,
        name: "Kukulkán Chac",
        role: "Desarrollador Frontend",
        element: "air",
        image: "https://randomuser.me/api/portraits/men/76.jpg"
      }
    ]
  },
  "team2": {
    name: "Equipo Jaguar",
    description: "Desarrollo Backend",
    members: [
      {
        id: 201,
        name: "Nicté Canek",
        role: "Desarrollador Backend",
        element: "earth",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      {
        id: 202,
        name: "Yum Kaax",
        role: "DevOps Engineer",
        element: "water",
        image: "https://randomuser.me/api/portraits/men/41.jpg"
      }
    ]
  },
  "team3": {
    name: "Equipo Colibrí",
    description: "Diseño UX/UI",
    members: [
      {
        id: 301,
        name: "Ix Chel Moo",
        role: "Diseñadora UI",
        element: "fire",
        image: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: 302,
        name: "Hunab Ku",
        role: "UX Researcher",
        element: "air",
        image: "https://randomuser.me/api/portraits/women/54.jpg"
      }
    ]
  },
  "team4": {
    name: "Equipo Serpiente",
    description: "DevOps & Infraestructura",
    members: [
      {
        id: 401,
        name: "Kinich Ahau",
        role: "DevOps Engineer",
        element: "fire",
        image: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      {
        id: 402,
        name: "Chaac Mool",
        role: "SRE",
        element: "water",
        image: "https://randomuser.me/api/portraits/men/53.jpg"
      }
    ]
  }
};

// Definición de colores y estilos para cada elemento
const ELEMENT_STYLES: Record<string, ElementStyle> = {
  fire: {
    gradient: "from-orange-900 to-orange-700",
    border: "border-orange-500/50",
    nonSelectedBorder: "border-gray-800", 
    text: "text-orange-400",
    glow: "shadow-orange-500/30",
    bg: "bg-orange-500",
    name: "Fuego",
    flame: {
      active: "text-orange-400",
      inactive: "text-orange-900",
      hover: "hover:text-orange-300",
    },
  },
  water: {
    gradient: "from-blue-900 to-blue-700",
    border: "border-blue-500/50",
    nonSelectedBorder: "border-gray-800",
    text: "text-blue-400",
    glow: "shadow-blue-500/30",
    bg: "bg-blue-500",
    name: "Agua",
    flame: {
      active: "text-blue-400",
      inactive: "text-blue-900",
      hover: "hover:text-blue-300",
    },
  },
  earth: {
    gradient: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/50",
    nonSelectedBorder: "border-gray-800",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/30",
    bg: "bg-emerald-600",
    name: "Tierra",
    flame: {
      active: "text-emerald-400",
      inactive: "text-emerald-900",
      hover: "hover:text-emerald-300",
    },
  },
  air: {
    gradient: "from-sky-900 to-sky-700",
    border: "border-sky-500/50",
    nonSelectedBorder: "border-gray-800",
    text: "text-sky-400",
    glow: "shadow-sky-500/30",
    bg: "bg-sky-400",
    name: "Aire",
    flame: {
      active: "text-sky-400",
      inactive: "text-sky-900",
      hover: "hover:text-sky-300",
    },
  },
}

export default function EquipoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const equipoId = params.equipo as string;
  const accessCode = searchParams.get('code');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamInfo, setTeamInfo] = useState<Team | null>(null);
  
  // Estados para la evaluación
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [ratings, setRatings] = useState<number[]>(Array(EVALUATION_QUESTIONS.length).fill(0));
  const [evaluationsCompleted, setEvaluationsCompleted] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Verificar código y cargar información del equipo
  useEffect(() => {
    const validateAndLoadTeam = async () => {
      setLoading(true);
      
      // Simular verificación del código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!accessCode || accessCode.length !== 6) {
        setError("Código de acceso inválido");
        setLoading(false);
        return;
      }
      
      // Cargar datos del equipo (simulado)
      const teamData = TEAM_DATA[equipoId];
      if (!teamData) {
        setError("Equipo no encontrado");
        setLoading(false);
        return;
      }
      
      setTeamInfo(teamData);
      setLoading(false);
    };
    
    validateAndLoadTeam();
  }, [equipoId, accessCode]);
  
  const handleSelectMember = (id: number) => {
    setSelectedMember(id);
    // Resetear calificaciones solo si no se ha completado antes
    if (!evaluationsCompleted[id]) {
      setRatings(Array(EVALUATION_QUESTIONS.length).fill(0));
    }
    setShowEvaluation(true);
    setSubmitSuccess(false);
    setSubmitError("");
  };
  
  const handleRatingChange = (questionIndex: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[questionIndex] = rating;
    setRatings(newRatings);
  };
  
  const handleCloseEvaluation = () => {
    setShowEvaluation(false);
  };
  
  const isEvaluationComplete = () => {
    return ratings.every((rating) => rating > 0);
  };
  
  const handleSubmitEvaluation = async () => {
    if (!selectedMember || !isEvaluationComplete()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simulamos un tiempo de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // En lugar de guardar en una base de datos, guardamos en localStorage para demostración
      try {
        // Obtener evaluaciones existentes o inicializar array
        const existingEvaluationsStr = localStorage.getItem("teamEvaluations") || "[]";
        const existingEvaluations = JSON.parse(existingEvaluationsStr);

        // Obtener información del evaluador
        let evaluatorInfo = null;
        const savedQuizData = localStorage.getItem("elementQuizData");
        if (savedQuizData) {
          const quizData = JSON.parse(savedQuizData);
          evaluatorInfo = {
            name: quizData.userInfo.name,
            email: quizData.userInfo.email,
            element: quizData.result,
          };
        }

        // Crear nueva evaluación
        const member = teamInfo?.members.find(m => m.id === selectedMember);
        const newEvaluation = {
          team_id: equipoId,
          team_name: teamInfo?.name,
          member_id: selectedMember,
          member_name: member?.name,
          evaluator_info: evaluatorInfo,
          ratings: ratings,
          questions: EVALUATION_QUESTIONS,
          average_rating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          access_code: accessCode,
          created_at: new Date().toISOString(),
        };

        // Añadir a las evaluaciones existentes
        existingEvaluations.push(newEvaluation);

        // Guardar en localStorage
        localStorage.setItem("teamEvaluations", JSON.stringify(existingEvaluations));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        throw error;
      }

      // Marcar esta evaluación como completada
      setEvaluationsCompleted({
        ...evaluationsCompleted,
        [selectedMember]: true
      });
      
      // Éxito
      setSubmitSuccess(true);

      // Cerrar evaluación después de un breve retraso
      setTimeout(() => {
        setShowEvaluation(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setSubmitError("Hubo un error al guardar la evaluación. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Verificar si todas las evaluaciones están completas
  const allEvaluationsComplete = () => {
    if (!teamInfo) return false;
    return teamInfo.members.every(member => evaluationsCompleted[member.id]);
  };
  
  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/10 rounded mb-4 mx-auto w-1/3"></div>
              <div className="h-32 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-10 bg-white/10 rounded-lg w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Link
              href="/seleccion"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full 
                       bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium 
                       hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
            >
              Volver a selección de equipo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/seleccion" className="text-white hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold ml-4 neon-text-sm">{teamInfo?.name || "EQUIPO"}</h1>
            <div className="ml-4 bg-white/10 px-3 py-1 rounded-full text-white/70 text-sm">
              Código: <span className="font-mono">{accessCode}</span>
            </div>
          </div>
          
          <Link 
            href="/seleccion" 
            className="flex items-center text-white/70 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Salir
          </Link>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Reconocimiento de Miembros del Equipo</h2>
          <p className="text-white/70">
            Selecciona a los miembros del equipo para evaluarlos y reconocer sus contribuciones.
            {allEvaluationsComplete() && " ¡Has completado todas las evaluaciones!"}
          </p>
        </div>
        
        {/* Lista de miembros del equipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teamInfo?.members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isSelected={selectedMember === member.id}
              isEvaluated={!!evaluationsCompleted[member.id]}
              onSelect={() => handleSelectMember(member.id)}
              elementStyle={ELEMENT_STYLES[member.element]}
            />
          ))}
        </div>
        
        {/* Sección de completado */}
        {allEvaluationsComplete() && (
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center text-green-400 mb-4">
              <Check className="w-6 h-6 mr-2" />
              <span className="text-lg font-medium">¡Evaluaciones completadas!</span>
            </div>
            <p className="text-white/70 mb-6">
              Has completado todas las evaluaciones para los miembros de este equipo.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full 
                       bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium 
                       hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
      
      {/* Sección de evaluación */}
      {showEvaluation && selectedMember && teamInfo && (
        <EvaluationSection
          member={teamInfo.members.find((m) => m.id === selectedMember) as TeamMember}
          questions={EVALUATION_QUESTIONS}
          ratings={ratings}
          onRatingChange={handleRatingChange}
          onClose={handleCloseEvaluation}
          onSubmit={handleSubmitEvaluation}
          isSubmitting={isSubmitting}
          submitSuccess={submitSuccess}
          submitError={submitError}
          isComplete={isEvaluationComplete()}
          elementStyle={ELEMENT_STYLES[teamInfo.members.find((m) => m.id === selectedMember)?.element || "fire"]}
        />
      )}
    </main>
  );
}

function MemberCard({ member, isSelected, isEvaluated, onSelect, elementStyle }: MemberCardProps) {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer rounded-lg
        ${isSelected ? "scale-105 z-20" : "hover:scale-102 z-10"}
        bg-gradient-to-br ${elementStyle.gradient}
        border-2 ${isEvaluated ? "border-green-500/50" : elementStyle.border} shadow-lg ${isSelected ? elementStyle.glow : ""}`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white/30">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <h3 className={`text-xl font-bold text-white ${isSelected ? elementStyle.text : ""}`}>{member.name}</h3>
            <p className="text-white/70 text-sm">{member.role}</p>
            
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center gap-1 text-xs ${elementStyle.text}`}>
                {elementStyle.name}
                <span className={`w-2 h-2 rounded-full ${elementStyle.bg}`}></span>
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de selección/evaluación */}
        <div
          className={`mt-4 pt-4 border-t border-white/20 text-center transition-all duration-300
          ${isSelected ? "bg-white/10" : ""}`}
        >
          <div
            className={`text-white font-medium flex items-center justify-center gap-2
            ${isEvaluated ? "text-green-400" : isSelected ? elementStyle.text : "text-white/70"}`}
          >
            {isEvaluated ? (
              <>
                <Check className="w-5 h-5" />
                <span>Evaluado</span>
              </>
            ) : isSelected ? (
              <>
                <Check className="w-5 h-5" />
                <span>Seleccionado</span>
              </>
            ) : (
              "Seleccionar para evaluar"
            )}
          </div>
        </div>

        {/* Efecto de brillo en los bordes cuando está seleccionado */}
        {isSelected && <div className="absolute inset-0 border-2 border-white/30 rounded-lg animate-pulse-slow"></div>}
      </div>
    </div>
  );
}

function EvaluationSection({
  member,
  questions,
  ratings,
  onRatingChange,
  onClose,
  onSubmit,
  isSubmitting,
  submitSuccess,
  submitError,
  isComplete,
  elementStyle,
}: EvaluationSectionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className={`bg-gradient-to-br ${elementStyle.gradient} border ${elementStyle.border} rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-white/20 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border border-white/30">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h2 className={`text-xl font-bold ${elementStyle.text}`}>Evaluación de {member.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 relative">
          <div className="relative">
            <p className="text-white/80 mb-8">
              Por favor, evalúa a {member.name} en las siguientes áreas usando una escala del 1 al 5.
            </p>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={index} className="pb-6 border-b border-white/20 last:border-0">
                  <p className="text-white font-medium mb-4">{question}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => onRatingChange(index, rating)}
                          className={`p-3 rounded-lg border transition-all flex flex-col items-center
                                     ${ratings[index] === rating
                                       ? 'bg-amber-500/20 border-amber-400'
                                       : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          <Star
                            className={`w-6 h-6 mb-1 ${ratings[index] >= rating ? 'text-amber-400' : 'text-white/40'}`}
                            fill={ratings[index] >= rating ? '#F59E0B' : 'none'}
                          />
                          <span className="text-sm">{rating}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">
                      {ratings[index] > 0 ? `${ratings[index]}/5` : "Sin calificar"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200 flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Evaluación guardada correctamente.
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={onSubmit}
                disabled={!isComplete || isSubmitting || submitSuccess}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
                  ${
                    isComplete && !isSubmitting && !submitSuccess
                      ? `bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg ${elementStyle.glow}`
                      : "bg-white/10 text-white/50 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar evaluación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 