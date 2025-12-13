"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}

export function TextReveal({ children, className = "", delay = 0, staggerDelay = 0.03 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const text = typeof children === "string" ? children : String(children ?? "")
  const words = text.split(" ")

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function CharReveal({ children, className = "", delay = 0, staggerDelay = 0.02 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const text = typeof children === "string" ? children : String(children ?? "")
  const chars = text.split("")

  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              ease: [0.33, 1, 0.68, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
