"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef } from "react"
import { CharReveal } from "./text-reveal"
import { MagneticButton } from "./magnetic-button"

const RESUME_URL = "https://drive.google.com/file/d/1HxLwWeAZZJB_1mq73S36DKmEuaZVAxcL/view?usp=drive_link"

export function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 250])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <section
      ref={containerRef}
      className="min-h-screen pt-24 flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full blur-[80px] opacity-20 pointer-events-none will-change-transform"
      >
        <motion.div
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(0,255,255,0) 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-[80px] opacity-15 pointer-events-none will-change-transform"
      >
        <motion.div
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(255,0,255,0.4) 0%, rgba(255,0,255,0) 70%)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </motion.div>

      <motion.div style={{ y: y1 }} className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div style={{ opacity, scale }} className="container mx-auto px-6 relative z-30">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <motion.span
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 border-2 border-primary/40 text-primary text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.25)] relative z-40"
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(0,255,255,0.8)",
                boxShadow: "0 0 40px rgba(0,255,255,0.4)",
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="relative flex h-2.5 w-2.5"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
              </motion.span>
              Full-Stack Developer
              <Sparkles className="w-3.5 h-3.5" />
            </motion.span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 tracking-tighter">
            <CharReveal className="text-white" delay={0.2}>
              VIKAS
            </CharReveal>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              <CharReveal delay={0.5}>PAL</CharReveal>
            </span>
          </h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-xl md:text-3xl text-white/80 font-semibold tracking-tight mb-4"
          >
            Building the future, one line at a time
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-base md:text-lg text-white/60 max-w-2xl mb-8 leading-relaxed"
          >
            Crafting <span className="text-white font-semibold">high-performance fintech products</span> at{" "}
            <span className="text-cyan-400 font-semibold">ViewTrade</span>. Exploring{" "}
            <span className="text-pink-400 font-semibold">AI/ML</span> to build next-gen global tech.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden group px-8 py-6 text-base rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-black border-0 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] transition-all duration-200"
              >
                <Link href="#projects">
                  <motion.span className="relative z-10" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    Explore Work
                  </motion.span>
                  <ArrowDown className="ml-2 h-5 w-5 relative z-10 group-hover:animate-bounce" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="group px-8 py-6 text-base rounded-full border-3 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-black bg-black/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.25)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-200"
              >
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Resume</span>
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center gap-4"
          >
            {[
              { href: "https://github.com/vikaspal1704", icon: Github, label: "GitHub", color: "cyan" },
              { href: "https://www.linkedin.com/in/vikaspal1704/", icon: Linkedin, label: "LinkedIn", color: "blue" },
              { href: "mailto:palv499@gmail.com", icon: Mail, label: "Email", color: "purple" },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-white/50 hover:text-cyan-400 transition-all p-3 rounded-full hover:bg-cyan-500/10 backdrop-blur-sm"
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + i * 0.1 }}
                whileHover={{
                  y: -5,
                  scale: 1.15,
                  boxShadow: "0 0 20px rgba(0,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <social.icon size={24} />
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs text-cyan-400 font-black uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-7 h-12 border-3 border-cyan-500/60 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-black/20 shadow-[0_0_20px_rgba(0,255,255,0.25)]">
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,1)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
