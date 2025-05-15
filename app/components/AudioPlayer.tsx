"use client"

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
  loop?: boolean;
}

const AudioPlayer = ({ audioSrc, autoPlay = true, loop = true }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Efecto para crear el elemento de audio
  useEffect(() => {
    audioRef.current = new Audio(audioSrc)
    audioRef.current.loop = loop
    
    // Configurar eventos
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoaded(true)
      
      // Iniciar reproducción si autoPlay es true inicialmente
      if (autoPlay) {
        playAudio()
      }
    })
    
    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [audioSrc, loop])
  
  // Efecto adicional para reaccionar a cambios en autoPlay
  useEffect(() => {
    if (isLoaded) {
      if (autoPlay) {
        playAudio()
      } else {
        pauseAudio()
      }
    }
  }, [autoPlay, isLoaded])
  
  const playAudio = () => {
    if (audioRef.current && isLoaded) {
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(err => {
            console.error("Error al reproducir audio:", err)
            setIsPlaying(false)
          })
      }
    }
  }
  
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }
  
  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }
  
  return (
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
  )
}

export default AudioPlayer 