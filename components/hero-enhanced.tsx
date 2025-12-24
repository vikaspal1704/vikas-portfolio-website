"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { CharReveal } from "./text-reveal"
import { MagneticButton } from "./magnetic-button"

const RESUME_URL = "https://drive.google.com/file/d/1HxLwWeAZZJB_1mq73S36DKmEuaZVAxcL/view?usp=drive_link"

export function HeroEnhanced() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })

  const y = useTransform(smoothProgress, [0, 1], [0, -300])
  const yText = useTransform(smoothProgress, [0, 1], [0, -200])
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.8])
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.6], [1, 0.8, 0])
  const blur = useTransform(smoothProgress, [0, 0.5], [0, 10])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="h-[150vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              background: "radial-gradient(circle, rgba(0,255,255,0.5) 0%, rgba(0,255,255,0) 70%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{
            x: -mousePosition.x * 2,
            y: -mousePosition.y * 2,
          }}
          className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              background: "radial-gradient(circle, rgba(255,0,255,0.5) 0%, rgba(255,0,255,0) 70%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              background: "radial-gradient(circle, rgba(0,255,200,0.3) 0%, rgba(0,255,200,0) 70%)",
            }}
          />
        </motion.div>

        <motion.div style={{ y, scale, opacity }} className="container mx-auto px-8 md:px-6 relative z-10 w-full">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10"
            >
              <motion.span
                className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-black/40 border-2 border-primary/40 text-primary text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.3)]"
                whileHover={{ scale: 1.05, borderColor: "rgba(0,255,255,0.8)" }}
              >
                <motion.span
                  className="relative flex h-3 w-3"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
                </motion.span>
                Full-Stack Developer
                <Sparkles className="w-4 h-4" />
              </motion.span>
            </motion.div>

            <motion.div style={{ y: yText, filter: `blur(${blur}px)` }} className="overflow-visible">
              <h1 className="text-[clamp(3rem,10vw,10rem)] font-black leading-[0.95] mb-12 tracking-tighter overflow-visible">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <CharReveal className="text-white" delay={0.4}>
                    VIKAS
                  </CharReveal>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  <CharReveal delay={0.7}>PAL</CharReveal>
                </motion.div>
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="space-y-6 mb-16"
              >
                <h2 className="text-3xl md:text-5xl text-white/90 font-bold tracking-tight max-w-4xl">
                  Building the future, one line at a time
                </h2>
                <p className="text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed">
                  Crafting <span className="text-white font-semibold">high-performance fintech products</span> at{" "}
                  <span className="text-cyan-400 font-semibold">ViewTrade</span>. Exploring{" "}
                  <span className="text-pink-400 font-semibold">AI/ML</span> to build the next generation of global
                  tech.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-wrap gap-6 mb-20"
              >
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    className="relative overflow-hidden group px-12 py-8 text-xl rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-black border-0 shadow-[0_0_60px_rgba(0,255,255,0.6)] hover:shadow-[0_0_80px_rgba(0,255,255,0.8)] transition-all duration-300"
                  >
                    <Link href="#projects">
                      <span className="relative z-10">Explore Work</span>
                      <ArrowDown className="ml-3 h-6 w-6 relative z-10 group-hover:animate-bounce" />
                    </Link>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    className="group px-12 py-8 text-xl rounded-full border-4 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-black bg-black/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)] transition-all duration-300"
                  >
                    <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                      <span>Resume</span>
                    </a>
                  </Button>
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex items-center gap-6"
              >
                {[
                  { href: "https://github.com/vikaspal1704", icon: <Github size={32} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/vikaspal1704/", icon: <Linkedin size={32} />, label: "LinkedIn" },
                  { href: "mailto:palv499@gmail.com", icon: <Mail size={32} />, label: "Email" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-cyan-400 transition-all relative p-4 rounded-full hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                    aria-label={social.label}
                    whileHover={{ y: -5, scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-xs text-cyan-400 font-black uppercase tracking-[0.3em]">Scroll</span>
            <div className="w-8 h-14 border-4 border-cyan-500/60 rounded-full flex items-start justify-center p-2.5 backdrop-blur-sm bg-black/20 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <motion.div
                animate={{ y: [0, 20, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                className="w-2 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,255,255,1)]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
