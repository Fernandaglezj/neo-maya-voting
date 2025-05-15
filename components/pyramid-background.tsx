"use client"

import { useEffect, useRef } from "react"

export default function PyramidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Variables para animación
    let time = 0
    let animationFrameId: number

    // Función para dibujar el cielo con gradiente de atardecer
    const drawSky = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

      // Colores de atardecer
      gradient.addColorStop(0, "#FF9E5E") // Naranja claro en la parte superior
      gradient.addColorStop(0.3, "#FF7B4C") // Naranja más intenso
      gradient.addColorStop(0.6, "#9E4B89") // Púrpura
      gradient.addColorStop(0.8, "#472E5B") // Púrpura oscuro
      gradient.addColorStop(1, "#1A1A2E") // Azul muy oscuro en la parte inferior

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar nubes sutiles
      drawClouds()

      // Dibujar estrellas que aparecen gradualmente
      drawStars()
    }

    // Función para dibujar nubes
    const drawClouds = () => {
      ctx.save()

      // Nubes en el horizonte
      const cloudGradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8,
      )

      cloudGradient.addColorStop(0, "rgba(255, 158, 94, 0.3)")
      cloudGradient.addColorStop(0.5, "rgba(255, 123, 76, 0.1)")
      cloudGradient.addColorStop(1, "rgba(255, 123, 76, 0)")

      ctx.fillStyle = cloudGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Nubes individuales
      const numClouds = 5
      for (let i = 0; i < numClouds; i++) {
        const x = canvas.width * (0.1 + (0.8 * i) / numClouds) + Math.sin(time * 0.0005 + i) * 20
        const y = canvas.height * 0.3 + i * 10
        const width = canvas.width * (0.1 + 0.05 * Math.sin(i))
        const height = width * 0.2

        const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, width)

        cloudGradient.addColorStop(0, "rgba(255, 158, 94, 0.4)")
        cloudGradient.addColorStop(1, "rgba(255, 158, 94, 0)")

        ctx.fillStyle = cloudGradient
        ctx.beginPath()
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // Función para dibujar estrellas
    const drawStars = () => {
      ctx.save()

      // Solo dibujar estrellas en la parte superior del cielo
      const starOpacity = Math.min(1, Math.max(0, (time % 10000) / 10000))

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.5
        const size = Math.random() * 1.5 + 0.5

        // Hacer que las estrellas parpadeen
        const flicker = 0.7 + 0.3 * Math.sin(time * 0.01 + i * 10)

        ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * 0.5 * flicker})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // Función para dibujar la pirámide maya
    const drawPyramid = () => {
      ctx.save()

      const pyramidHeight = canvas.height * 0.7
      const pyramidWidth = pyramidHeight * 1.2
      const baseX = canvas.width / 2 - pyramidWidth / 2
      const baseY = canvas.height * 0.95

      // Sombra de la pirámide
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.beginPath()
      ctx.moveTo(baseX, baseY)
      ctx.lineTo(baseX + pyramidWidth, baseY)
      ctx.lineTo(baseX + pyramidWidth / 2, baseY - pyramidHeight)
      ctx.closePath()
      ctx.fill()

      // Estructura principal de la pirámide
      const steps = 9 // Número de escalones

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        const stepWidth = pyramidWidth * (1 - ratio * 0.8)
        const stepHeight = pyramidHeight * ratio * 0.9
        const stepX = canvas.width / 2 - stepWidth / 2
        const stepY = baseY - stepHeight

        // Color base del escalón
        const brightness = 0.2 + 0.3 * (1 - ratio) // Más brillante en la base
        ctx.fillStyle = `rgba(${50 + brightness * 50}, ${30 + brightness * 30}, ${20 + brightness * 20}, 0.9)`

        // Dibujar el escalón
        ctx.beginPath()
        ctx.moveTo(stepX, stepY)
        ctx.lineTo(stepX + stepWidth, stepY)
        ctx.lineTo(stepX + stepWidth, stepY + pyramidHeight / steps)
        ctx.lineTo(stepX, stepY + pyramidHeight / steps)
        ctx.closePath()
        ctx.fill()

        // Añadir detalles a los escalones (líneas horizontales)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(stepX, stepY + pyramidHeight / steps)
        ctx.lineTo(stepX + stepWidth, stepY + pyramidHeight / steps)
        ctx.stroke()
      }

      // Templo en la cima
      const templeWidth = pyramidWidth * 0.2
      const templeHeight = pyramidHeight * 0.1
      const templeX = canvas.width / 2 - templeWidth / 2
      const templeY = baseY - pyramidHeight * 0.9

      // Dibujar el templo
      ctx.fillStyle = "rgba(40, 30, 20, 0.9)"
      ctx.fillRect(templeX, templeY - templeHeight, templeWidth, templeHeight)

      // Puerta del templo
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      const doorWidth = templeWidth * 0.3
      const doorHeight = templeHeight * 0.6
      ctx.fillRect(canvas.width / 2 - doorWidth / 2, templeY - doorHeight, doorWidth, doorHeight)

      // Detalles mayas en la pirámide (glifos)
      drawMayanGlyphs(baseX, baseY, pyramidWidth, pyramidHeight)

      // Efecto de luz en la pirámide
      const lightX = canvas.width / 2
      const lightY = baseY - pyramidHeight
      const lightRadius = pyramidWidth * 1.2

      const lightGradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius)

      lightGradient.addColorStop(0, "rgba(255, 200, 100, 0.1)")
      lightGradient.addColorStop(0.5, "rgba(255, 150, 50, 0.05)")
      lightGradient.addColorStop(1, "rgba(255, 100, 50, 0)")

      ctx.fillStyle = lightGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.restore()
    }

    // Función para dibujar glifos mayas
    const drawMayanGlyphs = (baseX, baseY, width, height) => {
      ctx.save()

      // Dibujar algunos glifos en la parte frontal de la pirámide
      const glyphSize = width * 0.05
      const numGlyphs = 5

      for (let i = 0; i < numGlyphs; i++) {
        const x = baseX + width * (0.3 + 0.4 * (i / (numGlyphs - 1)))
        const y = baseY - height * 0.3

        // Dibujar un glifo simple
        ctx.strokeStyle = "rgba(255, 200, 100, 0.3)"
        ctx.lineWidth = 1

        // Forma base del glifo
        ctx.beginPath()
        ctx.rect(x - glyphSize / 2, y - glyphSize / 2, glyphSize, glyphSize)
        ctx.stroke()

        // Detalles internos del glifo
        ctx.beginPath()
        ctx.arc(x, y, glyphSize * 0.3, 0, Math.PI * 2)
        ctx.stroke()

        // Líneas decorativas
        ctx.beginPath()
        ctx.moveTo(x - glyphSize * 0.4, y)
        ctx.lineTo(x + glyphSize * 0.4, y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y - glyphSize * 0.4)
        ctx.lineTo(x, y + glyphSize * 0.4)
        ctx.stroke()
      }

      ctx.restore()
    }

    // Función para dibujar partículas flotantes
    const drawParticles = () => {
      ctx.save()

      const numParticles = 100

      for (let i = 0; i < numParticles; i++) {
        // Posición basada en el tiempo
        const x = (canvas.width * (i / numParticles) + time * 0.02) % canvas.width
        const y = canvas.height * 0.5 + Math.sin(x * 0.01 + time * 0.001) * canvas.height * 0.2

        // Tamaño y opacidad variables
        const size = Math.max(0.5, 1 + Math.sin(i + time * 0.001) * 1)
        const opacity = 0.1 + 0.1 * Math.sin(i * 10 + time * 0.002)

        // Color basado en la posición
        const hue = (30 + (i % 30)) % 360 // Tonos dorados y ámbar

        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // Función principal de dibujo
    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar el cielo
      drawSky()

      // Dibujar la pirámide
      drawPyramid()

      // Dibujar partículas flotantes
      drawParticles()

      // Añadir un overlay para oscurecer ligeramente y mejorar el contraste
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawScene()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Función de animación
    const animate = () => {
      time += 16 // Aproximadamente 60 FPS
      drawScene()
      animationFrameId = requestAnimationFrame(animate)
    }

    // Iniciar la animación
    animate()

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: -1 }} />
}
