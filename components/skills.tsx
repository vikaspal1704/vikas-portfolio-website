"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { TiltCard } from "./tilt-card"
import { Code2, Server, LineChart, Brain } from "lucide-react"

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "Framer Motion", "D3.js"],
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Backend & DevOps",
    icon: Server,
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "CI/CD", "REST APIs", "GraphQL"],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Fintech",
    icon: LineChart,
    skills: ["Trading UI", "Real-time Data", "Financial Charts", "WebSocket", "Low Latency", "Market Data"],
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "AI/ML",
    icon: Brain,
    skills: ["OpenAI API", "TensorFlow.js", "Python ML", "Data Analysis", "Vector Search", "LLM Integration"],
    color: "from-orange-500/20 to-red-500/20",
  },
]

export function Skills() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section id="skills" className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] -z-10"
      />

      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-black tracking-[0.3em] uppercase mb-4 block">Expertise</span>
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
            Skills &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Full-stack expertise built over years of crafting production-grade applications across frontend, backend,
            and DevOps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCard key={category.title} category={category} index={categoryIndex} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCard({
  category,
  index,
  isInView,
}: {
  category: (typeof skillCategories)[0]
  index: number
  isInView: boolean
}) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <TiltCard>
        <div className="glass-dark rounded-2xl p-6 h-full border-2 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          />

          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon size={22} className="text-cyan-400" />
            </motion.div>
            <h3 className="text-lg font-black text-white">{category.title}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, skillIndex) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-default transition-all duration-300 ${
                  hoveredSkill === skill
                    ? "bg-cyan-500 text-black scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                    : "bg-black/40 text-white/80 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10"
                }`}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
