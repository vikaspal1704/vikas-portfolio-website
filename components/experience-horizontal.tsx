"use client"

import { motion, useScroll } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ArrowUpRight, Briefcase, Calendar, MapPin } from "lucide-react"

const experiences = [
  {
    period: "2023 — Present",
    title: "Software Development Engineer",
    company: "ViewTrade",
    location: "Remote",
    companyUrl: "https://viewtrade.com",
    description:
      "Building Bridge - a global access provider for international stock trading. Developing high-performance React interfaces with real-time market data, advanced charting with D3.js, and seamless order execution.",
    achievements: [
      "Architected scalable trading UI handling 10K+ concurrent users",
      "Reduced page load time by 60% through code-splitting and lazy loading",
      "Implemented real-time WebSocket connections for live market data",
    ],
    technologies: ["React", "TypeScript", "Redux Toolkit", "WebSocket", "D3.js", "Fintech"],
    highlight: true,
    role: "Frontend Engineer (transitioning to Full-Stack)",
  },
  {
    period: "2021 — 2023",
    title: "Full Stack Developer",
    company: "Zeus Learning",
    location: "Bangalore, IN",
    companyUrl: "https://zeuslearning.com",
    description:
      "Led development of Test Maverick, an AI-powered test taking platform. Handled full-stack responsibilities including React frontend, Node.js backend APIs, Python ML services, and DevOps infrastructure.",
    achievements: [
      "Designed and deployed microservices architecture on AWS",
      "Built CI/CD pipelines reducing deployment time by 75%",
      "Integrated ML models for intelligent test analysis and recommendations",
    ],
    technologies: ["React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "CI/CD"],
    highlight: false,
    role: "Full-Stack & DevOps",
  },
  {
    period: "2020 — 2021",
    title: "Junior Software Developer",
    company: "Zeus Learning",
    location: "Bangalore, IN",
    companyUrl: "https://zeuslearning.com",
    description:
      "Started professional journey building educational technology products. Developed frontend interfaces, contributed to backend services, and learned enterprise development practices in an agile environment.",
    achievements: [
      "Contributed to 5+ production features in the first year",
      "Collaborated with cross-functional teams in agile sprints",
      "Improved unit test coverage from 40% to 85%",
    ],
    technologies: ["React", "JavaScript", "Node.js", "MongoDB", "Git"],
    highlight: false,
    role: "Full-Stack Developer",
  },
]

export function ExperienceHorizontal() {
  const containerRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const wheelRafRef = useRef<number>(0)
  const accumulatedDeltaRef = useRef(0)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollContainerRef.current) return

      const scrollContainer = scrollContainerRef.current
      const rect = scrollContainer.getBoundingClientRect()

      // Only activate horizontal scroll when the cards container is visible
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (!isVisible) return

      // Get current scroll state
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
      const maxScroll = scrollWidth - clientWidth
      const atStart = scrollLeft <= 2
      const atEnd = scrollLeft >= maxScroll - 2

      // If at start and scrolling up, allow vertical scroll to exit upward
      if (atStart && e.deltaY < 0) {
        return
      }

      // If at end and scrolling down, allow vertical scroll to continue downward
      if (atEnd && e.deltaY > 0) {
        return
      }

      // Otherwise, lock vertical scroll and convert to horizontal
      e.preventDefault()

      accumulatedDeltaRef.current += e.deltaY

      if (wheelRafRef.current) return
      wheelRafRef.current = requestAnimationFrame(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += accumulatedDeltaRef.current
          accumulatedDeltaRef.current = 0
        }
        wheelRafRef.current = 0
      })
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (wheelRafRef.current) cancelAnimationFrame(wheelRafRef.current)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-black" ref={containerRef}>
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 text-sm font-black tracking-[0.3em] uppercase mb-4 block">Career Journey</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">
            Work{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl">
            Scroll to explore my journey from full-stack development to fintech specialization
          </p>
        </motion.div>
      </div>

      <div className="relative h-[700px] md:h-[600px] overflow-hidden">
        <div
          ref={scrollContainerRef}
            className="flex gap-8 px-6 overflow-x-auto scrollbar-hide h-full snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {experiences.map((exp, index) => (
            <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} index={index} />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-[400px] flex-shrink-0 h-full flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-cyan-500/20 border-t-cyan-400"
              />
              <h3 className="text-2xl font-black text-white mb-3">What's Next?</h3>
              <p className="text-white/60 mb-6">Let's build something amazing together</p>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-black hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
                <ArrowUpRight size={18} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-[450px] md:w-[500px] flex-shrink-0 relative group snap-start"
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="h-full glass-dark rounded-3xl p-8 border-2 border-cyan-500/20 relative overflow-hidden"
        whileHover={{
          y: -8,
          borderColor: "rgba(0,255,255,0.5)",
          boxShadow: "0 20px 60px rgba(0,255,255,0.3), 0 0 80px rgba(0,255,255,0.2)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.2 }}
        />

        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,255,255,0.06), transparent 40%)`,
          }}
          transition={{ duration: 0 }}
        />

        {exp.highlight && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 right-6 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-black tracking-wider border border-cyan-500/30"
          >
            CURRENT
          </motion.div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-mono">
              <Calendar size={14} />
              {exp.period}
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <MapPin size={14} />
              {exp.location}
            </div>
          </div>

          <div className="mb-4">
            <motion.h3
              className="text-2xl font-black text-white mb-2"
              whileHover={{ x: 4, color: "rgba(0,255,255,1)" }}
              transition={{ duration: 0.15 }}
            >
              {exp.title}
            </motion.h3>
            <motion.a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg text-cyan-400 hover:text-cyan-300 font-bold group/link"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
            >
              <Briefcase size={16} />
              {exp.company}
              <motion.div whileHover={{ x: 2, y: -2 }} transition={{ duration: 0.1 }}>
                <ArrowUpRight size={14} />
              </motion.div>
            </motion.a>
            <motion.div
              className="mt-2 inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(168,85,247,0.3)" }}
              transition={{ duration: 0.15 }}
            >
              {exp.role}
            </motion.div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed mb-4">{exp.description}</p>

          <div className="mb-6">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-3">Key Achievements</h4>
            <ul className="space-y-2">
              {exp.achievements.map((achievement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-white/60 flex items-start gap-2"
                >
                  <span className="text-cyan-400 mt-1">▸</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,255,255,0.1)" }}
                className="px-3 py-1.5 text-xs bg-black/40 text-white/80 rounded-lg border border-white/10 font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
