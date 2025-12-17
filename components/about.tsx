"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { AnimatedCounter } from "./animated-counter"
import { TiltCard } from "./tilt-card"

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

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section id="about" className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-20 right-20 w-64 h-64 border-4 border-cyan-500/10 rounded-full -z-10"
      />
      <motion.div
        style={{ y: y2, rotate: useTransform(rotate, (r) => -r) }}
        className="absolute bottom-40 left-10 w-40 h-40 border-4 border-purple-500/10 rounded-full -z-10"
      />

      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-400 text-sm font-black tracking-[0.3em] uppercase mb-4 block">About Me</span>
            <h2 className="text-3xl md:text-5xl font-black mb-8 text-white leading-tight">
              Crafting Digital Experiences with{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Purpose
              </span>
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                I'm a passionate full-stack developer with expertise in building high-performance, scalable web
                applications. My journey in tech has led me through various environments—from startups to established
                fintech companies.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Currently at <span className="text-cyan-400 font-bold">ViewTrade</span>, I work on trading platforms
                that handle millions in transactions daily. My focus lies at the intersection of{" "}
                <span className="text-white font-semibold">design and development</span>, creating experiences that are
                not only visually appealing but also meticulously built for performance.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                I&apos;m increasingly drawn to <span className="text-purple-400 font-bold">AI/ML applications</span>,
                exploring how machine learning can enhance user experiences and solve complex problems. My side projects
                reflect this curiosity—from expense analyzers powered by AI to intelligent monitoring systems.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or
                writing about development best practices.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <TiltCard className="relative">
              <div className="glass-dark rounded-3xl p-10 border-2 border-cyan-500/20 shadow-[0_0_60px_rgba(0,255,255,0.1)]">
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
              style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 180]) }}
              className="absolute -top-6 -right-6 w-28 h-28 border-2 border-cyan-500/30 rounded-3xl -z-10"
            />
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, -180]) }}
              className="absolute -bottom-6 -left-6 w-36 h-36 border-2 border-purple-500/20 rounded-3xl -z-10"
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
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center p-4 rounded-2xl bg-black/20 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
    >
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
        <AnimatedCounter end={number} suffix={suffix} />
      </div>
      <div className="text-sm text-white/60 font-medium">{label}</div>
    </motion.div>
  )
}
