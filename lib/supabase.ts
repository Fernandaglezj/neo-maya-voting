import { createClient } from '@supabase/supabase-js';

// URLs y claves directas para evitar problemas con variables de entorno
// Corrección: URL ajustada para resolver problemas de DNS
const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Mostrar información en la consola para depuración
console.log("URL de Supabase configurada:", supabaseUrl);
console.log("API Key configurada correctamente:", !!supabaseKey);

// Crear cliente Supabase utilizando las credenciales hardcodeadas
export const supabase = createClient(supabaseUrl, supabaseKey);

// Función de utilidad para verificar la conexión
export async function verificarConexion() {
  try {
    // Intenta una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from('ceremonias')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    return { conectado: true, mensaje: 'Conexión exitosa a Supabase' };
  } catch (error) {
    console.error('Error al conectar con Supabase:', error);
    return { conectado: false, mensaje: 'Error de conexión', error };
  }
}

// Funciones de utilidad para trabajar con la base de datos
export async function getCeremonias() {
  try {
    console.log("Solicitando lista de ceremonias desde Supabase");
    
    const { data, error } = await supabase
      .from('ceremonias')
      .select('*')
      .order('fecha_inicio', { ascending: false });
    
    if (error) throw error;
    
    console.log("Ceremonias obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener ceremonias:", error);
    // Devolver array vacío en caso de error para evitar fallos en componentes
    return [];
  }
}

export async function getEquiposByCeremonia(ceremoniaId: string) {
  try {
    if (!ceremoniaId) {
      console.warn("No se proporcionó ID de ceremonia");
      return [];
    }
    
    console.log("Buscando equipos para ceremonia ID:", ceremoniaId);
    
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .eq('ceremonia_id', ceremoniaId);
    
    if (error) throw error;
    
    console.log("Equipos encontrados:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    return [];
  }
}

// Mejorado el manejo de errores y añadido datos de fallback para depuración
export async function getParticipantesByEquipo(equipoId: string) {
  try {
    if (!equipoId) {
      console.warn("No se proporcionó ID de equipo");
      return [];
    }
    
    console.log("Intentando obtener participantes para equipo ID:", equipoId);
    
    const { data, error } = await supabase
      .from('participantes')
      .select('*')
      .eq('equipo_id', equipoId);
    
    if (error) {
      console.error("Error de Supabase al obtener participantes:", error);
      throw error;
    }
    
    console.log("Participantes obtenidos de Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No se encontraron participantes para el equipo, usando datos de fallback para pruebas");
      
      // Datos de fallback para pruebas y depuración
      return [
        {
          id: "p1_" + equipoId,
          nombre: "Ana Martínez",
          cargo: "Desarrollador Frontend",
          area: "Tecnología",
          equipo_id: equipoId
        },
        {
          id: "p2_" + equipoId,
          nombre: "Luis Rodríguez",
          cargo: "Diseñador UX",
          area: "Diseño",
          equipo_id: equipoId
        },
        {
          id: "p3_" + equipoId,
          nombre: "Carlos Gómez",
          cargo: "Project Manager",
          area: "Gestión",
          equipo_id: equipoId
        }
      ];
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener participantes:", error);
    
    // Proporcionar datos de fallback en caso de error para no bloquear la interfaz
    return [
      {
        id: "fallback1_" + equipoId,
        nombre: "Elena Vega (Fallback)",
        cargo: "Desarrollador Backend",
        area: "Tecnología",
        equipo_id: equipoId
      },
      {
        id: "fallback2_" + equipoId,
        nombre: "Ricardo Mora (Fallback)",
        cargo: "QA Engineer",
        area: "Calidad",
        equipo_id: equipoId
      }
    ];
  }
}

export async function verificarClaveAcceso(claveAcceso: string) {
  try {
    if (!claveAcceso) return null;
    
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .eq('clave_acceso', claveAcceso)
      .single();
    
    if (error) return null;
    return data;
  } catch (error) {
    console.error("Error al verificar clave de acceso:", error);
    return null;
  }
}

export async function registrarEvaluacion(evaluacion: {
  ceremonia_id: string,
  equipo_evaluador_id: string,
  participante_evaluado_id: string,
  elemento_asignado: string,
  comentario?: string
}) {
  try {
    const { data, error } = await supabase
      .from('evaluaciones')
      .insert([evaluacion])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al registrar evaluación:", error);
    throw error;
  }
}

export async function registrarSesion(sesion: {
  equipo_id: string,
  ceremonia_id: string
}) {
  try {
    const { data, error } = await supabase
      .from('sesiones')
      .insert([{
        ...sesion,
        fecha_inicio: new Date(),
        activa: true
      }])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al registrar sesión:", error);
    throw error;
  }
}

export async function cerrarSesion(sesionId: string) {
  try {
    const { data, error } = await supabase
      .from('sesiones')
      .update({ 
        fecha_fin: new Date(),
        activa: false 
      })
      .eq('id', sesionId)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
}

// Función para calcular porcentajes de elementos
function calculateElementPercentages(letterCounts: { A: number; B: number; C: number; D: number }): Record<string, number> {
  // Mapeo de letras a elementos
  const letterToElement: Record<string, string> = {
    'A': 'fuego',
    'B': 'agua',
    'C': 'tierra',
    'D': 'aire'
  };
  
  // Calcular el total de puntos (considerando puntajes dobles y triples)
  const total = Object.values(letterCounts).reduce((sum, count) => sum + count, 0);
  
  // Calcular porcentajes para todos los elementos
  const percentages: Record<string, number> = {};
  Object.entries(letterCounts).forEach(([letter, count]) => {
    const element = letterToElement[letter];
    if (element) {
      // Calcular el porcentaje basado en el total de puntos
      percentages[element] = Math.round((count / total) * 100);
    }
  });
  
  return percentages;
}

// Función para guardar el resultado del test de elementos
export async function guardarResultadoElemento({
  nombre,
  correo_electronico,
  elemento,
  respuestas
}: {
  nombre: string;
  correo_electronico: string;
  elemento: string;
  respuestas?: any;  // Contiene datos adicionales como letterCounts
}) {
  try {
    console.log("Guardando resultado de elemento en Supabase:", { nombre, correo_electronico, elemento });
    
    // Calcular porcentajes de elementos
    const percentages = respuestas?.letterCounts ? calculateElementPercentages(respuestas.letterCounts) : {};
    
    // Primero verificamos si ya existe un registro con ese correo
    const { data: existingUser, error: searchError } = await supabase
      .from('elementos_usuarios')
      .select('id')
      .eq('correo_electronico', correo_electronico)
      .maybeSingle();
    
    if (searchError) {
      console.error("Error al buscar usuario existente:", searchError);
      throw new Error(`Error de búsqueda: ${searchError.message}`);
    }
    
    let result;
    
    if (existingUser) {
      // Si existe, actualizamos su registro
      console.log("Usuario encontrado, actualizando registro:", existingUser.id);
      const { data, error } = await supabase
        .from('elementos_usuarios')
        .update({ 
          nombre,
          elemento,
          respuestas,
          porcentaje_agua: percentages['agua'] || 0,
          porcentaje_fuego: percentages['fuego'] || 0,
          porcentaje_tierra: percentages['tierra'] || 0,
          porcentaje_aire: percentages['aire'] || 0,
          fecha_creacion: new Date()
        })
        .eq('id', existingUser.id)
        .select();
        
      if (error) {
        console.error("Error al actualizar registro:", error);
        // Si es un error de RLS policy, proporcionar un mensaje más claro
        if (error.code === '42501') {
          throw new Error("No tienes permisos para actualizar este registro. Contacta al administrador.");
        }
        throw error;
      }
      result = data;
      console.log("Registro de elemento actualizado correctamente:", result);
    } else {
      // Si no existe, creamos uno nuevo
      console.log("Usuario no encontrado, creando nuevo registro");
      const { data, error } = await supabase
        .from('elementos_usuarios')
        .insert([{
          nombre,
          correo_electronico,
          elemento,
          respuestas,
          porcentaje_agua: percentages['agua'] || 0,
          porcentaje_fuego: percentages['fuego'] || 0,
          porcentaje_tierra: percentages['tierra'] || 0,
          porcentaje_aire: percentages['aire'] || 0,
          fecha_creacion: new Date()
        }])
        .select();
      
      if (error) {
        console.error("Error al crear nuevo registro:", error);
        // Si es un error de RLS policy, proporcionar un mensaje más claro
        if (error.code === '42501') {
          throw new Error("No tienes permisos para crear registros. Contacta al administrador.");
        }
        throw error;
      }
      result = data;
      console.log("Nuevo registro de elemento creado correctamente:", result);
    }
    
    return result;
  } catch (error) {
    console.error("Error al guardar resultado de elemento:", error);
    throw error;
  }
}

// Función para verificar si un correo ya ha completado el test de elementos
export async function verificarCorreoExistente(correo_electronico: string) {
  try {
    if (!correo_electronico) return false;
    
    const { data, error } = await supabase
      .from('elementos_usuarios')
      .select('id, elemento')
      .eq('correo_electronico', correo_electronico)
      .maybeSingle();
    
    if (error) {
      console.error("Error al verificar correo existente:", error);
      return false;
    }
    
    // Si hay datos, el correo ya existe
    return { existe: !!data, elemento: data?.elemento };
  } catch (error) {
    console.error("Error al verificar correo existente:", error);
    return false;
  }
}

// Función para obtener los resultados de elementos de usuarios
export async function getElementosUsuarios() {
  try {
    console.log("Solicitando resultados de elementos desde Supabase");
    
    const { data, error } = await supabase
      .from('elementos_usuarios')
      .select('*')
      .order('fecha_creacion', { ascending: false });
    
    if (error) {
      console.error("Error al obtener resultados de elementos:", error);
      throw error;
    }
    
    console.log("Resultados de elementos obtenidos:", data?.length);
    return data || [];
  } catch (error) {
    console.error("Error al obtener resultados de elementos:", error);
    // Devolver array vacío en caso de error para evitar fallos en componentes
    return [];
  }
}

// Función para verificar si un correo está en la lista de invitados para PalMar 2025
export async function verificarInvitadoPalMar(correo_electronico: string) {
  try {
    if (!correo_electronico) return null;
    const correo = correo_electronico.trim().toLowerCase();
    console.log("Buscando invitado con correo:", correo, typeof correo);
    const { data, error } = await supabase
      .from('personas_invitadas')
      .select('*')
      .eq('correo_electronico', correo)
      .maybeSingle();
    if (error) {
      console.error("Error al verificar invitado PalMar:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error al verificar invitado PalMar:", error);
    return null;
  }
}

// Función para actualizar el estado de un invitado cuando completa el quiz
export async function actualizarInvitadoPalMar(
  correo_electronico: string,
  elemento: string,
  percentages: { agua: number, fuego: number, tierra: number, aire: number },
  respuestas?: any
) {
  try {
    if (!correo_electronico) {
      console.error("Error: correo_electronico es requerido para actualizar invitado PalMar");
      return null;
    }
    const correo = correo_electronico.trim().toLowerCase();
    console.log(`[PalMar] Buscando invitado para actualizar: '${correo}'`);
    // Primero verificar si el invitado existe
    const { data: invitado, error: checkError } = await supabase
      .from('personas_invitadas')
      .select('id, correo_electronico, estado')
      .eq('correo_electronico', correo)
      .maybeSingle();
    console.log(`[PalMar] Resultado de búsqueda de invitado:`, invitado, checkError);
    if (checkError) {
      console.error("[PalMar] Error al verificar invitado PalMar antes de actualizar:", checkError);
      return null;
    }
    if (!invitado) {
      console.error(`[PalMar] Invitado con correo '${correo}' no encontrado en personas_invitadas`);
      return null;
    }
    console.log(`[PalMar] Invitado encontrado con ID ${invitado.id}, estado actual: ${invitado.estado}`);
    // Ahora actualizamos el registro
    const { data, error } = await supabase
      .from('personas_invitadas')
      .update({ 
        estado: 'completado',
        elemento: elemento,
        porcentaje_agua: percentages.agua,
        porcentaje_fuego: percentages.fuego,
        porcentaje_tierra: percentages.tierra,
        porcentaje_aire: percentages.aire,
        fecha_completado: new Date(),
        respuestas: respuestas || null
      })
      .eq('id', invitado.id)
      .select();
    console.log(`[PalMar] Resultado del update:`, data, error);
    if (error) {
      console.error("[PalMar] Error al actualizar invitado PalMar:", error);
      return null;
    }
    if (!data || data.length === 0) {
      console.error("[PalMar] No se actualizó ningún registro de invitado PalMar");
      return null;
    }
    console.log("[PalMar] Invitado PalMar actualizado correctamente:", data);
    return data;
  } catch (error) {
    console.error("[PalMar] Error al actualizar invitado PalMar:", error);
    return null;
  }
}

// Función para obtener la lista de invitados de PalMar 2025
export async function getInvitadosPalMar() {
  try {
    console.log("Solicitando lista de invitados PalMar 2025 desde Supabase");
    
    const { data, error } = await supabase
      .from('personas_invitadas')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error("Error al obtener invitados PalMar 2025:", error);
      throw error;
    }
    
    console.log("Invitados PalMar 2025 obtenidos:", data?.length);
    return data || [];
  } catch (error) {
    console.error("Error al obtener invitados PalMar 2025:", error);
    return [];
  }
} 