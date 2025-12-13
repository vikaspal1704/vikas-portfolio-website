"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef } from "react"
import { TextReveal, CharReveal } from "./text-reveal"
import { MagneticButton } from "./magnetic-button"

const RESUME_URL = "https://drive.google.com/file/d/YOUR_RESUME_FILE_ID/view?usp=sharing"

export function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-[linear-gradient(rgba(94,234,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(94,234,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />

      <motion.div style={{ opacity, scale }} className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono tracking-wider uppercase">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Software Development Engineer
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance">
            <CharReveal className="text-foreground" delay={0.2}>
              Vikas
            </CharReveal>
            <span className="text-muted-foreground">
              <TextReveal delay={0.6}> Pal</TextReveal>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative inline-block mb-8"
          >
            <h2 className="text-xl md:text-2xl text-primary font-medium">
              <TextReveal delay={0.8}>Frontend Developer</TextReveal>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.33, 1, 0.68, 1] }}
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-cyan-400 origin-left"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            I build accessible, pixel-perfect user interfaces that blend thoughtful design with robust engineering.
            Currently crafting <span className="text-foreground font-medium">fintech products</span> at{" "}
            <motion.span className="text-primary relative inline-block" whileHover={{ scale: 1.05 }}>
              ViewTrade
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
            , with a growing passion for <span className="text-foreground font-medium">AI/ML applications</span>.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-muted-foreground mb-12 leading-relaxed"
          >
            My ambition is to build large-scale global tech products that make a meaningful impact on millions of users
            worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <MagneticButton>
              <Button asChild size="lg" className="relative overflow-hidden group">
                <Link href="#projects">
                  <span className="relative z-10">View My Work</span>
                  <ArrowDown className="ml-2 h-4 w-4 relative z-10 group-hover:animate-bounce" />
                  <motion.span
                    className="absolute inset-0 bg-primary-foreground/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild variant="outline" size="lg" className="group bg-transparent">
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Resume
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-6"
          >
            {[
              { href: "https://github.com/vikas", icon: <Github size={20} />, label: "GitHub" },
              { href: "https://linkedin.com/in/vikas", icon: <Linkedin size={20} />, label: "LinkedIn" },
              { href: "mailto:vikas@example.com", icon: <Mail size={20} />, label: "Email" },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors relative"
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                whileHover={{ y: -3 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-mono">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
