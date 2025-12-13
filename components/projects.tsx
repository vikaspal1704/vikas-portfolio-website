"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Github, ExternalLink, ArrowUpRight, Lock, Building2 } from "lucide-react"
import Image from "next/image"
import { TiltCard } from "./tilt-card"

const projects = [
  {
    title: "Bridge - Global Access Provider",
    description:
      "Enterprise-grade global stock trading platform at ViewTrade enabling seamless access to international markets. Built high-performance trading interfaces with real-time market data visualization, advanced charting, and low-latency order execution.",
    image: "/global-stock-trading-platform-dark-theme-with-worl.jpg",
    tags: ["React", "TypeScript", "Redux Toolkit", "WebSocket", "D3.js", "Fintech"],
    github: null,
    live: null,
    featured: true,
    color: "from-cyan-500/20 to-blue-600/20",
    company: "ViewTrade",
    isCompanyProject: true,
  },
  {
    title: "Test Maverick",
    description:
      "AI-powered test taking platform revolutionizing online assessments. Led full-stack development including scalable backend architecture, DevOps pipelines, and intelligent test analysis features that improved student performance tracking.",
    image: "/ai-test-taking-platform-with-analytics-dashboard-d.jpg",
    tags: ["React", "Node.js", "Python", "AWS", "Docker", "AI/ML", "PostgreSQL"],
    github: null,
    live: null,
    featured: true,
    color: "from-violet-500/20 to-purple-600/20",
    company: "Zeus Learning",
    isCompanyProject: true,
  },
  {
    title: "AI Expense Analyzer",
    description:
      "Intelligent expense tracking application using machine learning to categorize transactions, predict spending patterns, and provide personalized financial insights with beautiful visualizations.",
    image: "/ai-expense-analyzer-dashboard-with-charts-and-grap.jpg",
    tags: ["React", "TypeScript", "OpenAI", "TailwindCSS", "Chart.js"],
    github: "https://github.com/vikas",
    live: null,
    featured: true,
    color: "from-green-500/20 to-emerald-600/20",
    company: null,
    isCompanyProject: false,
  },
  {
    title: "FreezerGuard",
    description:
      "IoT-powered freezer monitoring system tracking temperature in real-time with smart alerts when conditions become unsafe, preventing food spoilage and optimizing energy consumption.",
    image: "/iot-freezer-monitoring-dashboard-with-temperature-.jpg",
    tags: ["React", "Node.js", "MQTT", "WebSockets", "PostgreSQL", "IoT"],
    github: "https://github.com/vikas",
    live: null,
    featured: true,
    color: "from-orange-500/20 to-red-600/20",
    company: null,
    isCompanyProject: false,
  },
  {
    title: "Vector Engine",
    description:
      "High-performance vector search engine with semantic similarity matching. Built for AI applications requiring fast, accurate embeddings retrieval with sub-millisecond query times.",
    image: "/vector-database-search-interface-with-embeddings-v.jpg",
    tags: ["TypeScript", "Python", "FastAPI", "Pinecone", "Redis"],
    github: "https://github.com/vikas",
    live: null,
    featured: false,
    color: "from-pink-500/20 to-rose-600/20",
    company: null,
    isCompanyProject: false,
  },
]

export function Projects() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <section id="projects" className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div
        style={{ y }}
        className="absolute top-40 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        className="absolute bottom-40 -left-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl">
            A selection of enterprise and personal projects showcasing full-stack expertise across fintech, AI, and
            scalable systems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0]
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltCard>
        <div className="glass rounded-2xl overflow-hidden hover:glow transition-all duration-500 group relative">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          />

          {project.isCompanyProject && (
            <div className="absolute top-4 left-4 z-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border rounded-full text-xs font-medium"
              >
                <Building2 size={12} className="text-primary" />
                <span>{project.company}</span>
                <Lock size={10} className="text-muted-foreground ml-1" />
              </motion.div>
            </div>
          )}

          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              {project.isCompanyProject ? (
                <div className="text-center px-6">
                  <Lock size={32} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Proprietary project at {project.company}</p>
                </div>
              ) : (
                <>
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-all"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                      transition={{ delay: 0.1 }}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github size={24} />
                    </motion.a>
                  )}
                  {project.live && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-all"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                      transition={{ delay: 0.2 }}
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink size={24} />
                    </motion.a>
                  )}
                </>
              )}
            </motion.div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <motion.h3
                className="text-xl font-semibold group-hover:text-primary transition-colors flex items-center gap-2"
                layout
              >
                {project.title}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                >
                  <ArrowUpRight size={18} className="text-primary" />
                </motion.span>
              </motion.h3>
            </div>

            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  className="px-2.5 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
