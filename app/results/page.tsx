"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getElementosUsuarios, getInvitadosPalMar } from "@/lib/supabase"
import { Download, Lock, Eye, EyeOff } from "lucide-react"

type ElementType = "agua" | "fuego" | "tierra" | "aire";

// Mapeamos las IDs de elementos a nombres mostrados
const elementosNombres: Record<string, ElementType> = {
  "agua": "agua",
  "fuego": "fuego",
  "tierra": "tierra",
  "aire": "aire"
};

// Tipo para los resultados de usuarios desde Supabase
interface ElementoUsuario {
  id: string;
  nombre: string;
  correo_electronico: string;
  elemento: string;
  fecha_creacion?: string;
  respuestas?: {
    letterCounts: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
    tiebreaker?: string;
    completedAt: string;
  };
}

// Tipo para la versión mostrada de elementos de usuario
type PersonElement = {
  id: string;
  name: string;
  email: string;
  element: ElementType;
  description: string;
  elementColor: string;
  createdAt?: string;
  respuestas?: {
    letterCounts: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
    tiebreaker?: string;
    completedAt: string;
  };
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"elemento" | "palmar">("elemento")
  const [loading, setLoading] = useState<boolean>(true)
  const [elementosUsuarios, setElementosUsuarios] = useState<PersonElement[]>([])
  const [invitadosPalMar, setInvitadosPalMar] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<"todos" | "pendiente" | "completado">("todos")
  
  // Estados para la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  
  // Contraseña que dará acceso a los resultados (puedes cambiarla por la que prefieras)
  const CORRECT_PASSWORD = "PLMR@2025"

  // Verificar si ya tenemos una sesión guardada
  useEffect(() => {
    // Intentar recuperar el estado de autenticación del sessionStorage
    const savedAuth = sessionStorage.getItem("neomaya_results_auth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Manejar el envío del formulario de contraseña
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError("")
      // Guardar el estado de autenticación en sessionStorage para que persista durante la sesión
      sessionStorage.setItem("neomaya_results_auth", "true")
    } else {
      setPasswordError("Contraseña incorrecta. Intenta nuevamente.")
    }
  }

  // Función para exportar a CSV
  const exportToCSV = () => {
    // Filtrar solo los invitados completados
    const completedInvitees = invitadosPalMar.filter(invitado => invitado.estado === 'completado');
    
    if (completedInvitees.length === 0) {
      alert("No hay asistentes completados para exportar");
      return;
    }
    
    // Ordenar por fecha de completado (los más recientes al final)
    const sortedInvitees = [...completedInvitees].sort((a, b) => {
      // Si no hay fecha, colocar al principio
      if (!a.fecha_completado) return -1;
      if (!b.fecha_completado) return 1;
      
      // Convertir fechas a objetos Date para comparación
      const dateA = new Date(a.fecha_completado);
      const dateB = new Date(b.fecha_completado);
      
      // Ordenar de más antiguo a más reciente
      return dateA.getTime() - dateB.getTime();
    });
    
    // Cabeceras CSV
    const headers = [
      "Nombre", 
      "Correo", 
      "Estado", 
      "Elemento Principal",
      "Porcentaje Agua",
      "Porcentaje Fuego",
      "Porcentaje Tierra",
      "Porcentaje Aire",
      "Fecha"
    ];
    
    // Convertir datos a filas CSV
    const csvRows = [
      // Encabezados
      headers.join(','),
      // Datos de invitados ordenados
      ...sortedInvitees.map(invitado => {
        const percentages = calculateElementPercentages(invitado.respuestas);
        return [
          // Escapar comas y comillas en campos de texto
          `"${invitado.nombre?.replace(/"/g, '""') || ''}"`,
          `"${invitado.email?.replace(/"/g, '""') || ''}"`,
          "Completado",
          invitado.elemento 
            ? elementDisplayNames[invitado.elemento as ElementType] || invitado.elemento 
            : "N/A",
          percentages['agua'] || 0,
          percentages['fuego'] || 0,
          percentages['tierra'] || 0,
          percentages['aire'] || 0,
          invitado.fecha_completado 
            ? new Date(invitado.fecha_completado).toLocaleDateString('es-MX', {
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
              })
            : "N/A"
        ].join(',');
      })
    ].join('\n');
    
    // Crear el contenido del CSV
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows);
    
    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "asistentes_palmar_completados.csv");
    document.body.appendChild(link);
    
    // Descargar el archivo
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
  };

  // Cargar datos de Supabase
  useEffect(() => {
    async function cargarDatos() {
      setLoading(true);
      try {
        // Cargar resultados de elementos
        const datos = await getElementosUsuarios();
        
        // Convertir datos de Supabase al formato necesario
        const personElements: PersonElement[] = datos.map((item: ElementoUsuario) => ({
          id: item.id,
          name: item.nombre,
          email: item.correo_electronico,
          element: elementosNombres[item.elemento] || "agua",
          description: getElementDescription(item.elemento),
          elementColor: getElementColor(item.elemento),
          createdAt: item.fecha_creacion,
          respuestas: item.respuestas
        }));
        
        setElementosUsuarios(personElements);
        
        // Cargar invitados de PalMar 2025
        const invitados = await getInvitadosPalMar();
        setInvitadosPalMar(invitados || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // Si hay error, usamos los datos de ejemplo para que la UI no se rompa
        setElementosUsuarios(fallbackPersonElements);
      } finally {
        setLoading(false);
      }
    }
    
    cargarDatos();
  }, []);

  // Función para obtener descripción del elemento
  function getElementDescription(elemento: string): string {
    const descriptions: Record<string, string> = {
      "agua": "Representa la fluidez y adaptabilidad en procesos de innovación",
      "fuego": "Simboliza la pasión y energía en el liderazgo de equipos",
      "tierra": "Personifica la solidez y constancia en proyectos sustentables",
      "aire": "Encarna la comunicación y armonía en el trabajo colaborativo"
    };
    
    return descriptions[elemento] || "Elemento con propiedades únicas";
  }

  // Función para obtener color del elemento
  function getElementColor(elemento: string): string {
    const colors: Record<string, string> = {
      "agua": "#4A90E2",
      "fuego": "#E85D3A",
      "tierra": "#8E6E4E",
      "aire": "#92C6B8"
    };
    
    return colors[elemento] || "#888888";
  }

  // Datos de ejemplo para la sección de categorías (se mantienen igual)
  const categories = [
    {
      id: 1,
      name: "Innovación",
      winner: "María González",
      votes: 127,
      image: "/winners/innovation.jpg"
    },
    {
      id: 2,
      name: "Liderazgo",
      winner: "Carlos Ramírez",
      votes: 145,
      image: "/winners/leadership.jpg"
    },
    {
      id: 3,
      name: "Sustentabilidad",
      winner: "Ana Torres",
      votes: 98,
      image: "/winners/sustainability.jpg"
    },
    {
      id: 4,
      name: "Trabajo en Equipo",
      winner: "Juan Méndez",
      votes: 112,
      image: "/winners/teamwork.jpg"
    }
  ]

  // Datos de respaldo en caso de error
  const fallbackPersonElements: PersonElement[] = [
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@empresa.com",
      element: "agua",
      description: "Representa la fluidez y adaptabilidad en procesos de innovación",
      elementColor: "#4A90E2"
    },
    {
      id: "2",
      name: "Carlos Ramírez",
      email: "carlos.ramirez@empresa.com",
      element: "fuego",
      description: "Simboliza la pasión y energía en el liderazgo de equipos",
      elementColor: "#E85D3A"
    }
  ]

  // Agrupar personas por elemento usando los datos cargados desde Supabase
  const elementGroups: Partial<Record<ElementType, PersonElement[]>> = {
    "agua": elementosUsuarios.filter(person => person.element === "agua"),
    "fuego": elementosUsuarios.filter(person => person.element === "fuego"),
    "tierra": elementosUsuarios.filter(person => person.element === "tierra"),
    "aire": elementosUsuarios.filter(person => person.element === "aire")
  }

  // Definir colores para cada elemento
  const elementColors: Record<ElementType, string> = {
    "agua": "#4A90E2",
    "fuego": "#E85D3A",
    "tierra": "#8E6E4E",
    "aire": "#92C6B8"
  }

  // Mapear nombres de elementos para mostrar con primera letra mayúscula
  const elementDisplayNames: Record<ElementType, string> = {
    "agua": "Agua",
    "fuego": "Fuego",
    "tierra": "Tierra",
    "aire": "Aire"
  }

  // Función para calcular porcentajes de elementos
  function calculateElementPercentages(respuestas: any): Record<string, number> {
    if (!respuestas?.letterCounts) return {};

    const letterToElement: Record<string, string> = {
      'A': 'fuego',
      'B': 'agua',
      'C': 'aire',
      'D': 'tierra'
    };

    const letterCounts = respuestas.letterCounts as { A: number; B: number; C: number; D: number };
    const totalPoints = Object.values(letterCounts).reduce((sum, count) => sum + count, 0);

    // 1. Calcular porcentajes reales y residuos
    const realPercentages: Record<string, number> = {};
    const roundedPercentages: Record<string, number> = {};
    const residues: { element: string, residue: number }[] = [];
    let sum = 0;
    Object.entries(letterCounts).forEach(([letter, count]) => {
      const element = letterToElement[letter];
      if (element) {
        const real = (count / totalPoints) * 100;
        realPercentages[element] = real;
        const rounded = Math.round(real);
        roundedPercentages[element] = rounded;
        residues.push({ element, residue: real - rounded });
        sum += rounded;
      }
    });
    // LOGS TEMPORALES PARA DEPURAR
    console.log('letterCounts:', letterCounts);
    console.log('totalPoints:', totalPoints);
    console.log('realPercentages:', realPercentages);
    console.log('roundedPercentages:', roundedPercentages);
    console.log('residues:', residues);
    console.log('sum:', sum);
    // 2. Ajustar para que sumen 100%
    if (sum !== 100 && residues.length > 0) {
      residues.sort((a, b) => Math.abs(b.residue) - Math.abs(a.residue));
      let diff = 100 - sum;
      for (let i = 0; i < residues.length && diff !== 0; i++) {
        roundedPercentages[residues[i].element] += diff > 0 ? 1 : -1;
        diff += diff > 0 ? -1 : 1;
      }
    }
    return roundedPercentages;
  }

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-[#111111] border border-[#3A3A3A] rounded-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#E1B058] mb-2">PAL'MAR 2025</h1>
            <p className="text-[#B3B3B3]">Acceso restringido</p>
          </div>
          
          <div className="mb-8">
            <div className="h-1 bg-[#E1B058] w-full opacity-60"></div>
            <div className="h-0.5 bg-[#E1B058] w-full mt-1 opacity-30"></div>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#222222] flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#E1B058]" />
            </div>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-[#B3B3B3] mb-2">
                Ingresa la contraseña para ver los resultados
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E1B058] focus:border-transparent"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#E1B058] to-[#CF8A30] text-black font-medium rounded-lg hover:from-[#F0C078] hover:to-[#E1B058] transition-all duration-300"
            >
              Acceder
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#B3B3B3] hover:text-white text-sm transition-colors">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="pt-10 pb-6 px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-[#E1B058]">Resultados</h1>
        <p className="text-lg md:text-xl text-[#B3B3B3] mb-8">
          Pal'Mar 2025
        </p>
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-[#E1B058] w-full opacity-60"></div>
          <div className="h-0.5 bg-[#E1B058] w-full mt-1 opacity-30"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="border-b border-[#3A3A3A]">
            <div className="flex space-x-8 mb-4">
              <button 
                onClick={() => setActiveTab("elemento")}
                className={`text-xl font-medium pb-2 transition-colors ${
                  activeTab === "elemento" 
                    ? "text-[#E1B058] border-b-2 border-[#E1B058]" 
                    : "text-[#B3B3B3] hover:text-white"
                }`}
              >
                Por Elemento
              </button>
              <button 
                onClick={() => setActiveTab("palmar")}
                className={`text-xl font-medium pb-2 transition-colors ${
                  activeTab === "palmar" 
                    ? "text-[#E1B058] border-b-2 border-[#E1B058]" 
                    : "text-[#B3B3B3] hover:text-white"
                }`}
              >
                Asistentes PalMar 2025
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E1B058]"></div>
          </div>
        ) : activeTab === "elemento" ? (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#E1B058] text-center">
              Resultados por Elemento
              <span className="ml-3 text-sm font-normal bg-white/10 px-3 py-1 rounded-full text-white/70">
                {elementosUsuarios.length} participantes
              </span>
            </h2>
            
            <div className="space-y-12">
              {(Object.entries(elementGroups) as [ElementType, PersonElement[]][]).map(([element, persons]) => (
                persons.length > 0 && (
                  <div key={element} className="bg-[#0D0D0D] border border-[#3A3A3A] rounded-lg overflow-hidden">
                    <div 
                      className="p-4 flex items-center gap-4" 
                      style={{ backgroundColor: `${elementColors[element]}20` }}
                    >
                      <div 
                        className="h-12 w-12 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: `${elementColors[element]}30` }}
                      >
                        <span 
                          className="text-2xl font-bold" 
                          style={{ color: elementColors[element] }}
                        >
                          {elementDisplayNames[element].charAt(0)}
                        </span>
                      </div>
                      <h3 
                        className="text-2xl font-bold" 
                        style={{ color: elementColors[element] }}
                      >
                        Elemento: {elementDisplayNames[element]}
                      </h3>
                      <div className="ml-auto px-3 py-1 rounded-full bg-[#1A1A1A]">
                        {persons.length} {persons.length === 1 ? 'persona' : 'personas'}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-[#3A3A3A]">
                            <th className="text-left pb-3 text-[#B3B3B3] font-medium">Nombre</th>
                            <th className="text-left pb-3 text-[#B3B3B3] font-medium">Correo</th>
                            <th className="text-left pb-3 text-[#B3B3B3] font-medium">Elementos Secundarios</th>
                            <th className="text-left pb-3 text-[#B3B3B3] font-medium">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {persons.map((person) => {
                            const percentages = calculateElementPercentages(person.respuestas);
                            const allElements = Object.keys(elementDisplayNames);
                            const otherElements = allElements.filter(elem => elem !== person.element);
                            
                            return (
                              <tr 
                                key={person.id}
                                className="border-b border-[#3A3A3A]/50 hover:bg-[#1A1A1A]/30"
                              >
                                <td className="py-3 font-medium">{person.name}</td>
                                <td className="py-3 text-[#B3B3B3]">{person.email}</td>
                                <td className="py-3">
                                  <div className="flex flex-wrap gap-2">
                                    {otherElements.map((element) => (
                                      percentages[element] !== undefined && percentages[element] > 0 && (
                                        <span 
                                          key={element}
                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                          style={{ 
                                            backgroundColor: `${elementColors[element as ElementType]}20`,
                                            color: elementColors[element as ElementType]
                                          }}
                                        >
                                          {elementDisplayNames[element as ElementType]}: {percentages[element]}%
                                        </span>
                                      )
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 text-[#B3B3B3]">
                                  {person.createdAt 
                                    ? new Date(person.createdAt).toLocaleDateString('es-MX', {
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric'
                                      })
                                    : "N/A"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#E1B058] text-center">
              Asistentes PalMar 2025
              <span className="ml-3 text-sm font-normal bg-white/10 px-3 py-1 rounded-full text-white/70">
                {invitadosPalMar.length} invitados
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{invitadosPalMar.length}</div>
                <div className="text-[#B3B3B3] text-sm mt-1">Total de invitados</div>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {invitadosPalMar.filter(invitado => invitado.estado !== 'completado').length}
                </div>
                <div className="text-[#B3B3B3] text-sm mt-1">Pendientes por contestar</div>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {invitadosPalMar.filter(invitado => invitado.estado === 'completado').length}
                </div>
                <div className="text-[#B3B3B3] text-sm mt-1">Completados</div>
              </div>
            </div>
            
            <div className="mb-8 flex justify-center">
              <div className="inline-flex bg-[#1A1A1A] rounded-full p-1">
                <button
                  onClick={() => setStatusFilter("todos")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === "todos"
                      ? "bg-[#E1B058] text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter("pendiente")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === "pendiente"
                      ? "bg-yellow-500 text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setStatusFilter("completado")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === "completado"
                      ? "bg-green-500 text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Completados
                </button>
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="bg-[#0D0D0D] border border-[#3A3A3A] rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-4 bg-[#333333]">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#444444]">
                    <span className="text-2xl font-bold text-[#E1B058]">A</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#E1B058]">
                    Asistentes
                  </h3>
                  <div className="ml-auto px-3 py-1 rounded-full bg-[#1A1A1A]">
                    {invitadosPalMar.filter(invitado => 
                      statusFilter === "todos" ? true :
                      statusFilter === "pendiente" ? invitado.estado !== 'completado' :
                      invitado.estado === 'completado'
                    ).length} {invitadosPalMar.length === 1 ? 'invitado' : 'invitados'}
                  </div>
                  
                  {statusFilter === "completado" && (
                    <button
                      onClick={exportToCSV}
                      className="inline-flex items-center px-3 py-1 bg-green-700/30 hover:bg-green-700/50 border border-green-700/50 rounded-full text-xs text-green-300 transition-colors ml-2"
                    >
                      <Download className="w-3 h-3 mr-1" /> Descargar CSV
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#3A3A3A]">
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Nombre</th>
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Correo</th>
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Estado</th>
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Elemento Principal</th>
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Elementos Secundarios</th>
                        <th className="text-left pb-3 text-[#B3B3B3] font-medium">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitadosPalMar
                        .filter(invitado => 
                          statusFilter === "todos" ? true :
                          statusFilter === "pendiente" ? invitado.estado !== 'completado' :
                          invitado.estado === 'completado'
                        )
                        .map((invitado) => {
                          const percentages = calculateElementPercentages(invitado.respuestas);
                          const allElements = Object.keys(elementDisplayNames);
                          const otherElements = allElements.filter(elem => elem !== invitado.elemento);
                          
                          return (
                            <tr 
                              key={invitado.id}
                              className="border-b border-[#3A3A3A]/50 hover:bg-[#1A1A1A]/30"
                            >
                              <td className="py-3 font-medium">{invitado.nombre}</td>
                              <td className="py-3 text-[#B3B3B3]">{invitado.email}</td>
                              <td className="py-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                  invitado.estado === 'completado'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {invitado.estado === 'completado' ? 'Completado' : 'Pendiente'}
                                </span>
                              </td>
                              <td className="py-3">
                                {invitado.elemento ? (
                                  <span 
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                    style={{ 
                                      backgroundColor: `${elementColors[invitado.elemento as ElementType]}20`,
                                      color: elementColors[invitado.elemento as ElementType]
                                    }}
                                  >
                                    {elementDisplayNames[invitado.elemento as ElementType]}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="py-3">
                                <div className="flex flex-wrap gap-2">
                                  {otherElements.map((element) => (
                                    percentages[element] !== undefined && percentages[element] > 0 && (
                                      <span 
                                        key={element}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                        style={{ 
                                          backgroundColor: `${elementColors[element as ElementType]}20`,
                                          color: elementColors[element as ElementType]
                                        }}
                                      >
                                        {elementDisplayNames[element as ElementType]}: {percentages[element]}%
                                      </span>
                                    )
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 text-[#B3B3B3]">
                                {invitado.fecha_completado 
                                  ? new Date(invitado.fecha_completado).toLocaleDateString('es-MX', {
                                      day: 'numeric', 
                                      month: 'short', 
                                      year: 'numeric'
                                    })
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <footer className="bg-[#0D0D0D] py-6 border-t border-[#3A3A3A] mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#B3B3B3]">
          <Link href="/" className="text-[#E1B058] hover:text-[#F0C078] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  )
} 