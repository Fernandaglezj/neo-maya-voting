"use client"

import { useState, useEffect } from 'react'

export default function ElementsBackground() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Precargar la imagen de fondo para asegurar que esté disponible
    const img = new Image()
    img.src = "/images/fondo.png"
    img.onload = () => {
      setLoaded(true)
    }
    
    // En caso de error o tiempo de espera excesivo, mostrar de todos modos
    const timeout = setTimeout(() => {
      setLoaded(true)
    }, 1000)
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={`mystical-background ${loaded ? 'opacity-100' : 'opacity-0'}`} 
      style={{
        backgroundImage: 'url("/images/fondo.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        transition: 'opacity 0.3s ease-in'
      }}>
      {/* Overlay para mejorar contraste */}
      <div className="background-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}></div>
    </div>
  )
} 