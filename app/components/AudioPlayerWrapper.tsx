"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { X, Volume2, VolumeX } from 'lucide-react'

// Importar AudioPlayer con carga dinámica
const AudioPlayer = dynamic(() => import('./AudioPlayer'), {
  ssr: false,
})

export default function AudioPlayerWrapper() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasUserChosen, setHasUserChosen] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  
  // Cargar preferencias y mostrar diálogo
  useEffect(() => {
    // Intentamos usar una combinación de estado local y localStorage
    // para evitar problemas de hidratación en Next.js
    const checkPreference = () => {
      try {
        // Limpiar preferencia anterior para forzar que aparezca el modal (quitar en producción)
        localStorage.removeItem('audioPreference')
        
        const userChoice = localStorage.getItem('audioPreference')
        console.log("Preferencia de audio encontrada:", userChoice)
        
        if (userChoice !== null) {
          setHasUserChosen(true)
          setShowPlayer(true)
          if (userChoice === 'true') {
            const audio = new Audio('/audio/mayan-ambience.mp3')
            audio.loop = true
            setAudioElement(audio)
          }
        } else {
          // Si no hay preferencia, mostrar el prompt después de un breve retraso
          console.log("No se encontró preferencia de audio, mostrando prompt...")
          // Mostrar el prompt inmediatamente
          setShowPrompt(true)
        }
      } catch (error) {
        console.error("Error al acceder a localStorage:", error)
        // En caso de error, mostrar el prompt por defecto
        setShowPrompt(true)
      }
    }
    
    // Ejecutar después de que el componente se monte completamente
    // Esto ayuda con los problemas de SSR/hidratación en Next.js
    if (typeof window !== 'undefined') {
      // Ejecutar casi inmediatamente para que aparezca rápido
      setTimeout(checkPreference, 10)
    }
    
    return () => {
      // Limpieza al desmontar
      if (audioElement) {
        audioElement.pause()
      }
    }
  }, [])
  
  const handleChoice = (choice: boolean) => {
    setShowPrompt(false)
    setHasUserChosen(true)
    
    try {
      localStorage.setItem('audioPreference', choice.toString())
    } catch (error) {
      console.error("Error al guardar en localStorage:", error)
    }
    
    if (choice) {
      // El usuario quiere música - crear el elemento de audio
      const audio = new Audio('/audio/mayan-ambience.mp3')
      audio.loop = true
      
      // Intentar reproducir (esto funcionará porque es una respuesta directa a un clic)
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setAudioElement(audio)
            setShowPlayer(true)
          })
          .catch(err => {
            console.error("Error al reproducir audio:", err)
            // Aún así mostrar el controlador para que el usuario pueda hacer clic
            setAudioElement(audio)
            setShowPlayer(true)
          })
      }
    } else {
      // El usuario no quiere música
      setShowPlayer(true)
    }
  }
  
  const toggleAudio = () => {
    if (!audioElement) {
      // Si no hay elemento de audio, crearlo
      const audio = new Audio('/audio/mayan-ambience.mp3')
      audio.loop = true
      setAudioElement(audio)
      
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(err => {
            console.error("Error al reproducir audio:", err)
          })
      }
      return
    }
    
    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioElement.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(err => {
            console.error("Error al reproducir audio:", err)
          })
      }
    }
  }
  
  return (
    <>
      {showPrompt && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-xl animate-fade-in max-w-xs w-full">
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
          <div className="text-center">
            <h3 className="text-white text-lg font-medium mb-3">Experiencia musical</h3>
            <p className="text-white/80 text-sm mb-4">
              ¿Te gustaría disfrutar de música ambiental maya mientras exploras el sitio?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleChoice(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm transition-colors"
              >
                Sí, reproducir
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm transition-colors"
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reproductor de audio simplificado (manejado directamente en este componente) */}
      {showPlayer && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={toggleAudio}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors duration-300 border border-white/20"
            title={isPlaying ? "Silenciar música" : "Reproducir música"}
          >
            {isPlaying ? 
              <Volume2 className="w-5 h-5 text-white/80" /> : 
              <VolumeX className="w-5 h-5 text-white/80" />
            }
          </button>
        </div>
      )}
    </>
  )
} 