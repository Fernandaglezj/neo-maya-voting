"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verificarClaveAcceso, registrarSesion } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CeremoniaLogin() {
  const [claveAcceso, setClaveAcceso] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verificar si la clave de acceso es válida
      const equipo = await verificarClaveAcceso(claveAcceso);
      
      if (!equipo) {
        setError('Clave de acceso incorrecta. Por favor intenta de nuevo.');
        setLoading(false);
        return;
      }
      
      // Registrar una nueva sesión
      await registrarSesion({
        equipo_id: equipo.id,
        ceremonia_id: equipo.ceremonia_id
      });
      
      // Guardar información del equipo en localStorage
      localStorage.setItem('equipo_id', equipo.id);
      localStorage.setItem('ceremonia_id', equipo.ceremonia_id);
      localStorage.setItem('equipo_nombre', equipo.nombre);
      
      // Redirigir a la página de participantes para mostrar los datos
      // antes de continuar con la evaluación
      router.push('/participantes');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error al intentar iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Iniciar Ceremonia</CardTitle>
        <CardDescription className="text-center">
          Ingresa la clave de acceso de tu equipo para comenzar la evaluación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="claveAcceso"
                placeholder="Clave de acceso"
                value={claveAcceso}
                onChange={(e) => setClaveAcceso(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Acceder a la Ceremonia'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Comunícate con el administrador si no tienes una clave de acceso.
        </p>
      </CardFooter>
    </Card>
  );
} 