"use client"

import { useEffect, useRef } from "react"
import { useParallax } from "./parallax-provider"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { mouseX, mouseY } = useParallax()
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const lastMouseMoveRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particleCount = Math.min(30, Math.floor(window.innerWidth / 40))
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.2,
    }))

    let lastTime = performance.now()
    const targetFPS = 60
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return

      const deltaTime = currentTime - lastTime
      if (deltaTime < frameDelay) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime - (deltaTime % frameDelay)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dx = mouseX - lastMouseMoveRef.current.x
      const dy = mouseY - lastMouseMoveRef.current.y
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        lastMouseMoveRef.current = { x: mouseX, y: mouseY }
      }

      particlesRef.current.forEach((particle, i) => {
        const dx = lastMouseMoveRef.current.x - particle.x
        const dy = lastMouseMoveRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.x -= (dx / distance) * force * 1.5
          particle.y -= (dy / distance) * force * 1.5
        }

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`
        ctx.fill()

        particlesRef.current.slice(i + 1, i + 4).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(performance.now())

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [mouseX, mouseY])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" aria-hidden="true" />
}
