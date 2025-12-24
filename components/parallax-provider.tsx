"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"

interface ParallaxContextType {
  scrollY: number
  mouseX: number
  mouseY: number
}

const ParallaxContext = createContext<ParallaxContextType>({
  scrollY: 0,
  mouseX: 0,
  mouseY: 0,
})

export function useParallax() {
  return useContext(ParallaxContext)
}

export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  const scrollRafRef = useRef<number>(0)
  const mouseRafRef = useRef<number>(0)
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRafRef.current) return
      scrollRafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        scrollRafRef.current = 0
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX
      mousePosRef.current.y = e.clientY

      if (mouseRafRef.current) return
      mouseRafRef.current = requestAnimationFrame(() => {
        setMouseX(mousePosRef.current.x)
        setMouseY(mousePosRef.current.y)
        mouseRafRef.current = 0
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current)
    }
  }, [])

  return <ParallaxContext.Provider value={{ scrollY, mouseX, mouseY }}>{children}</ParallaxContext.Provider>
}
