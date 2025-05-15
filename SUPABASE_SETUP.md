# Configuración de Supabase para Neo-Maya Voting

Este proyecto utiliza Supabase como base de datos. Sigue estas instrucciones para configurarlo correctamente:

## 1. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://cfrmqfwommmpevffmevt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y
```

Puedes encontrar estos valores en el panel de Supabase bajo **Project Settings > API**.

## 2. Verificar conexión

Para verificar que la conexión funciona correctamente, ejecuta la aplicación y prueba el formulario de inicio de ceremonia. Si puedes acceder con una clave de acceso válida, la conexión está funcionando.

## 3. Estructura de la base de datos

La base de datos utiliza las siguientes tablas:

- **ceremonias**: Almacena información sobre las ceremonias
- **equipos**: Contiene los equipos con sus claves de acceso
- **participantes**: Lista de personas que pueden ser evaluadas
- **evaluaciones**: Registra las evaluaciones realizadas
- **sesiones**: Mantiene registro de las sesiones activas

## 4. Obteniendo información de Supabase

Para obtener las credenciales de Supabase:

1. Inicia sesión en [https://supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **Project Settings > API**
4. Copia el "Project URL" y la "anon public" key
5. Pégalos en tu archivo `.env.local`

## 5. Debugging

Si tienes problemas de conexión:

- Verifica que las credenciales sean correctas
- Asegúrate de que tu proyecto de Supabase esté activo
- Revisa que las tablas estén creadas correctamente
- Verifica las políticas de Row Level Security si has configurado alguna

## 6. Recomendaciones de seguridad

- No compartas tus claves de Supabase
- Considera implementar políticas de Row Level Security para proteger tus datos
- Utiliza variables de entorno para tus credenciales y nunca las cometas al repositorio 