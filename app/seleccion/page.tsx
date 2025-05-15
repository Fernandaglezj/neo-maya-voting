"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, Save, Flame, Users, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'

// Listado de equipos de respaldo
const TEAMS_BACKUP = [
  {
    id: "team1",
    name: "Equipo Quetzal",
    description: "Desarrollo Frontend",
    memberCount: 6,
    clave_acceso: "QZAL23", // Clave de acceso para pruebas
    ceremonia_id: "cer_backup1"
  },
  {
    id: "team2",
    name: "Equipo Jaguar",
    description: "Desarrollo Backend",
    memberCount: 5,
    clave_acceso: "JGR123", // Clave de acceso para pruebas
    ceremonia_id: "cer_backup1"
  },
  {
    id: "team3",
    name: "Equipo Colibrí",
    description: "Diseño UX/UI",
    memberCount: 4,
    clave_acceso: "COLBR1", // Clave de acceso para pruebas
    ceremonia_id: "cer_backup1"
  },
  {
    id: "team4",
    name: "Equipo Serpiente",
    description: "DevOps & Infraestructura",
    memberCount: 3,
    clave_acceso: "SERP22", // Clave de acceso para pruebas
    ceremonia_id: "cer_backup1"
  }
];

// Definición de colores y estilos para cada elemento
const ELEMENT_STYLES = {
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

export default function SeleccionPage() {
  const [teams, setTeams] = useState(TEAMS_BACKUP);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [ceremoniaId, setCeremoniaId] = useState('');
  
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const router = useRouter();

  // Cargar equipos - solo cuando se solicite
  const cargarEquipos = async () => {
    setLoadingTeams(true);
    setConnectionError("");
    
    try {
      // Inicializar cliente de Supabase localmente con valores hardcodeados para depuración
      const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';
      
      console.log("Conectando a Supabase con:", supabaseUrl);
      
      // Crear cliente Supabase (esto ayuda a evitar problemas de CORS)
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Verificar conexión básica primero
      console.log("Verificando conexión básica a Supabase...");
      try {
        const { data: healthCheck, error: healthError } = await supabase.from('_health').select('*').limit(1);
        if (healthError) {
          console.warn("Error en health check, pero continuando:", healthError);
        } else {
          console.log("Conexión básica a Supabase establecida");
        }
      } catch (healthErr) {
        console.warn("Error al realizar health check, pero continuando:", healthErr);
      }

      // Consultar ceremonias - usando la API de cliente con estrategia alternativa
      console.log("Cargando ceremonias - Intento 1...");
      let ceremoniasResult;
      try {
        ceremoniasResult = await supabase
          .from('ceremonias')
          .select('*');
          
        if (ceremoniasResult.error) {
          throw ceremoniasResult.error;
        }
        
        // Log the raw data received
        console.log("Datos de ceremonias recibidos:", JSON.stringify(ceremoniasResult.data, null, 2));
      } catch (error1) {
        console.error("Error en primer intento de carga de ceremonias:", error1);
        
        // Intento alternativo con consulta más simple
        console.log("Cargando ceremonias - Intento 2 (consulta simple)...");
        try {
          ceremoniasResult = await supabase
            .from('ceremonias')
            .select('id, nombre, fecha_inicio, activa');
            
          if (ceremoniasResult.error) {
            throw ceremoniasResult.error;
          }
          
          console.log("Datos de ceremonias recibidos (intento 2):", JSON.stringify(ceremoniasResult.data, null, 2));
        } catch (error2) {
          console.error("Error en segundo intento de carga de ceremonias:", error2);
          
          // Tercer intento: consultar directamente la API REST de Supabase
          console.log("Cargando ceremonias - Intento 3 (API REST directa)...");
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/ceremonias?select=*`, {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              }
            });
            
            if (!response.ok) {
              throw new Error(`Error en respuesta API: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Datos de ceremonias recibidos (API REST):", JSON.stringify(data, null, 2));
            
            if (data && data.length > 0) {
              ceremoniasResult = { data };
            } else {
              throw new Error("No se recibieron datos de la API REST");
            }
          } catch (error3) {
            console.error("Error en tercer intento de carga de ceremonias:", error3);
            throw new Error("No se pudieron cargar las ceremonias después de múltiples intentos");
          }
        }
      }
      
      const ceremonias = ceremoniasResult.data;
      
      if (!ceremonias || ceremonias.length === 0) {
        console.log("Datos ceremonias está vacío o nulo:", ceremonias);
        throw new Error('No se encontraron ceremonias en la base de datos');
      }
      
      console.log("Ceremonias cargadas:", ceremonias);
      
      // Verificar si los nombres de campos son diferentes a los esperados
      const primeraEntrada = ceremonias[0];
      const tieneNombreDiferente = !primeraEntrada.nombre && (primeraEntrada.name || primeraEntrada.title);
      
      // Usar la primera ceremonia activa o la primera si no hay activas
      let ceremonia;
      if (tieneNombreDiferente) {
        // Ajustar a un esquema diferente
        console.log("Detectado esquema diferente en la tabla de ceremonias");
        ceremonia = ceremonias.find((c: any) => c.active || c.is_active || c.activa) || ceremonias[0];
      } else {
        ceremonia = ceremonias.find((c: any) => c.activa) || ceremonias[0];
      }
      
      setCeremoniaId(ceremonia.id);
      console.log("Ceremonia seleccionada:", ceremonia.id);
      
      // Cargar equipos de la ceremonia - usando la API de cliente
      console.log("Cargando equipos...");
      const { data: equipos, error: equiposError } = await supabase
        .from('equipos')
        .select('*')
        .eq('ceremonia_id', ceremonia.id);
      
      if (equiposError) {
        console.error("Error al cargar equipos:", equiposError);
        throw new Error(`Error al cargar equipos: ${equiposError.message}`);
      }
      
      console.log("Equipos cargados:", equipos);
      
      if (equipos && equipos.length > 0) {
        // Mapear a formato compatible con nuestra UI
        const mappedTeams = equipos.map(equipo => ({
          id: equipo.id,
          name: equipo.nombre,
          description: equipo.descripcion || 'Equipo participante',
          memberCount: equipo.miembros || 0, // Usar datos de la BD si están disponibles
          clave_acceso: equipo.clave_acceso || '',
          ceremonia_id: equipo.ceremonia_id || ''
        }));
        
        console.log("Equipos mapeados para UI:", mappedTeams);
        setTeams(mappedTeams);
      } else {
        console.log("No se encontraron equipos para la ceremonia", ceremonia.id);
        // No mostrar error aquí, simplemente no mostrar equipos
        setConnectionError("No se encontraron equipos para la ceremonia seleccionada");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setConnectionError(error instanceof Error ? error.message : 'Error de conexión a la base de datos');
      // Mantener los equipos de respaldo si hay error
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSelectTeam = (id: string) => {
    const team = teams.find(t => t.id === id);
    setSelectedTeam(id);
    setSelectedTeamName(team?.name || "");
    setShowAccessCode(true);
    setError("");
  };

  // Verificación de código de acceso
  const verifyAccessCode = async () => {
    if (!accessCode || accessCode.trim().length < 3) {
      setError("Por favor ingresa un código de acceso válido");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log("Verificando código de acceso:", accessCode.trim());
      
      // Intentar encontrar equipo por clave de acceso
      let equipo = null;
      let error: any = null;
      let supabase: any = null;
      
      try {
        // Inicializar cliente de Supabase localmente con valores hardcodeados para depuración
        const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';
        
        console.log("Verificando código con Supabase:", accessCode.trim());
        
        // Crear cliente Supabase (esto ayuda a evitar problemas de CORS)
        supabase = createClient(supabaseUrl, supabaseKey);
        
        // Buscar equipo por clave de acceso
        const result = await supabase
          .from('equipos')
          .select('*')
          .eq('clave_acceso', accessCode.trim());
        
        if (result.error) {
          error = result.error;
          console.error("Error al verificar código con Supabase:", error);
        } else if (result.data && result.data.length > 0) {
          equipo = result.data[0];
          console.log("Equipo encontrado:", equipo);
        } else {
          console.log("Ningún equipo coincide con el código:", accessCode.trim());
        }
      } catch (supabaseError: any) {
        error = supabaseError;
        console.error("Excepción al verificar código con Supabase:", supabaseError);
      }
      
      // Si no se encontró en Supabase, verificar con los equipos de respaldo
      if (!equipo) {
        console.log("Verificando con equipos de respaldo...");
        equipo = TEAMS_BACKUP.find(team => team.clave_acceso === accessCode.trim());
        
        if (equipo) {
          console.log("Equipo encontrado en respaldo:", equipo);
        } else if (error) {
          if (error.code === 'PGRST116') {
            setError("No se encontró un equipo con este código de acceso");
          } else {
            setError(`Error al verificar código: ${error.message}`);
          }
          setLoading(false);
          return;
        } else {
          setError("Código de acceso no válido");
          setLoading(false);
          return;
        }
      }
      
      console.log("Equipo encontrado:", equipo);
      
      // Registrar nueva sesión - omitir para equipos de respaldo
      if (!equipo.id.startsWith('team') && supabase) {
        try {
          const { error: sesionError } = await supabase
            .from('sesiones')
            .insert([{
              equipo_id: equipo.id,
              ceremonia_id: equipo.ceremonia_id,
              fecha_inicio: new Date(),
              activa: true
            }]);
          
          if (sesionError) {
            console.error("Error al registrar sesión:", sesionError);
            // Continuar a pesar del error
          }
        } catch (sesionExcepcion) {
          console.error("Excepción al registrar sesión:", sesionExcepcion);
          // Continuar a pesar del error
        }
      }
      
      // Guardar datos en localStorage para mantener la sesión
      localStorage.setItem('equipo_id', equipo.id);
      localStorage.setItem('ceremonia_id', equipo.ceremonia_id);
      localStorage.setItem('equipo_nombre', equipo.nombre || equipo.name);
      
      console.log("Sesión iniciada correctamente, redirigiendo...");
      
      // Redirigir a la página de participantes para mostrar los datos
      // antes de continuar con la evaluación
      router.push('/participantes');
    } catch (error) {
      console.error("Error al verificar código:", error);
      setError(error instanceof Error ? error.message : "Ocurrió un error. Por favor intenta nuevamente.");
      setLoading(false);
    }
  };

  // Botón para cargar equipos cuando el usuario lo solicite
  const BotonCargarEquipos = () => (
    <div className="text-center pb-8">
      <button
        onClick={cargarEquipos}
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700
                  text-white font-medium py-3 px-6 rounded-md shadow-lg shadow-orange-500/30
                  border border-orange-400/30 transition-all duration-300"
      >
        Cargar equipos desde la base de datos
      </button>
      {connectionError && (
        <p className="text-red-400 mt-3">{connectionError}</p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-white hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold ml-4 neon-text-sm">SELECCIÓN DE EQUIPO</h1>
        </div>

        {showAccessCode && selectedTeam ? (
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-md mx-auto">
            <button 
              onClick={() => setShowAccessCode(false)}
              className="text-white/60 hover:text-white mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedTeamName}
            </h2>
            <p className="text-white/70 mb-6">
              Ingresa el código de acceso para este equipo
            </p>
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Ej: AB12CD"
                  className="w-full px-10 py-3 rounded-md bg-white/10 border border-white/20 
                            text-white text-center text-xl tracking-wider uppercase
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              {error && (
                <p className="text-red-400 mt-2 text-sm">
                  {error}
                </p>
              )}
            </div>
            
            <button
              onClick={verifyAccessCode}
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-md 
                         ${loading 
                           ? "bg-gray-600 cursor-not-allowed" 
                           : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"} 
                         text-white font-medium transition-all duration-300 
                         shadow-lg shadow-orange-500/30 border border-orange-400/30`}
            >
              {loading ? "Verificando..." : "Acceder al equipo"}
            </button>
          </div>
        ) : (
          <div>
            <BotonCargarEquipos />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingTeams ? (
                // Mostrar indicador de carga
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-black/30 animate-pulse h-60 rounded-lg border border-white/10"></div>
                ))
              ) : teams.length > 0 ? (
                // Mostrar equipos 
                teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectTeam(team.id)}
                    className="relative bg-black/30 hover:bg-gray-900/40 backdrop-blur-sm 
                              border border-white/20 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 
                              transition-all duration-300 rounded-lg overflow-hidden p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">{team.name}</h2>
                      <Users className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="text-white/70 mb-4 text-sm">
                      {team.description}
                    </p>
                    <div className="flex gap-1">
                      {/* Mostrar número de integrantes si está disponible */}
                      {team.memberCount > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                          {team.memberCount} {team.memberCount === 1 ? 'integrante' : 'integrantes'}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                // Mensaje cuando no hay equipos
                <div className="col-span-4 text-center py-12">
                  <p className="text-white/70 mb-4">
                    No hay equipos disponibles en este momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}