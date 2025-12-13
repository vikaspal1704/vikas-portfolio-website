"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <ParallaxContext.Provider value={{ scrollY, mouseX, mouseY }}>{children}</ParallaxContext.Provider>
}
