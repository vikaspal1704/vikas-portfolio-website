"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { AnimatedCounter } from "./animated-counter"
import { TiltCard } from "./tilt-card"
import { TextReveal } from "./text-reveal"

export function About() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section id="about" className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 right-20 w-64 h-64 border border-primary/10 rounded-full -z-10"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-40 left-10 w-40 h-40 border border-primary/5 rounded-full -z-10"
      />

      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">About Me</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance">
              <TextReveal>Crafting Digital Experiences with Purpose</TextReveal>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {[
                `I'm a passionate frontend developer with expertise in building high-performance, scalable web applications. My journey in tech has led me through various environments—from startups to established fintech companies.`,
                <>
                  Currently at <span className="text-primary font-medium">ViewTrade</span>, I work on trading platforms
                  that handle millions in transactions daily. My focus lies at the intersection of{" "}
                  <span className="text-foreground">design and development</span>, creating experiences that are not
                  only visually appealing but also meticulously built for performance and accessibility.
                </>,
                <>
                  I&apos;m increasingly drawn to <span className="text-foreground">AI/ML applications</span>, exploring
                  how machine learning can enhance user experiences and solve complex problems. My side projects reflect
                  this curiosity—from expense analyzers powered by AI to intelligent monitoring systems.
                </>,
                `When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or writing about frontend development best practices.`,
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <TiltCard className="relative">
              <div className="glass rounded-2xl p-8 glow">
                <div className="grid grid-cols-2 gap-8">
                  <StatCard number={3} suffix="+" label="Years Experience" delay={0} />
                  <StatCard number={15} suffix="+" label="Projects Delivered" delay={0.1} />
                  <StatCard number={5} suffix="+" label="Fintech Products" delay={0.2} />
                  <StatCard number={100} suffix="%" label="Client Satisfaction" delay={0.3} />
                </div>
              </div>
            </TiltCard>

            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-4 -right-4 w-24 h-24 border border-primary/20 rounded-2xl -z-10"
            />
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 w-32 h-32 border border-primary/10 rounded-2xl -z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ number, suffix, label, delay }: { number: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
        <AnimatedCounter end={number} suffix={suffix} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
