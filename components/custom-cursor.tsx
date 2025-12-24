"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 })

  const rafIdRef = useRef<number>(0)
  const posRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(false)
  const hoverRef = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY

      if (!visibleRef.current) {
        visibleRef.current = true
        setIsVisible(true)
      }

      if (rafIdRef.current) return
      rafIdRef.current = requestAnimationFrame(() => {
        cursorX.set(posRef.current.x)
        cursorY.set(posRef.current.y)
        rafIdRef.current = 0
      })
    }

    const handleMouseLeave = () => {
      visibleRef.current = false
      setIsVisible(false)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const shouldHover =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        !!target.dataset.magnetic

      if (shouldHover !== hoverRef.current) {
        hoverRef.current = shouldHover
        setIsHovering(shouldHover)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mouseover", handleMouseOver)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      >
        <motion.div
          className="rounded-full bg-primary"
          animate={{
            width: isHovering ? 50 : 8,
            height: isHovering ? 50 : 8,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.5 }}
        />
      </motion.div>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      >
        <motion.div
          className="rounded-full border border-primary/40"
          animate={{
            width: isHovering ? 70 : 28,
            height: isHovering ? 70 : 28,
            opacity: isVisible ? 0.4 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
        />
      </motion.div>
    </>
  )
}
