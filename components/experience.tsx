"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight, Briefcase } from "lucide-react"

const experiences = [
  {
    period: "Aug 2023 — Present",
    title: "Software Development Engineer (SDE I)",
    company: "ViewTrade IFSC (GIFT City)",
    companyUrl: "https://viewtrade.com",
    description:
      "Building and scaling mission-critical fintech trading platforms handling 10,000+ concurrent traders with 99.9%+ uptime. Designed low-latency WebSocket architecture delivering sub-100ms real-time market data and reduced order execution latency by 62.5%. Led frontend performance modernization achieving 44% faster Time-to-Interactive and 38% bundle size reduction. Actively contributing to backend modernization, microservices migration, and platform reliability improvements.",
    technologies: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "WebSocket",
      "Fintech Systems",
      "Microservices",
      "Performance Optimization",
      "AWS"
    ],
    highlight: true,
    role: "Frontend Engineer → Full-Stack (Fintech)"
  },
  {
    period: "Jan 2021 — Jul 2023",
    title: "Software Developer",
    company: "Zeus Learning",
    companyUrl: "https://zeuslearning.com",
    description:
      "Developed and scaled AI-powered assessment and chatbot platforms serving 100K+ daily users and 10K+ concurrent test-takers. Owned full-stack delivery across React frontend, Node.js backend services, and Python-based ML systems. Improved platform response times by 55–65%, supported 50M+ API requests per day, and reduced infrastructure and LLM costs by ~40% through semantic caching, batching, and performance optimization.",
    technologies: [
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "PostgreSQL",
      "Microservices",
      "LLMs"
    ],
    highlight: false,
    role: "Full-Stack Engineer"
  },
  {
    period: "Jun 2020 — Aug 2020",
    title: "Software Engineering Intern",
    company: "CultureX Entertainment",
    companyUrl: "https://culturex.in",
    description:
      "Worked on early-stage product development for a consumer entertainment platform. Built responsive UI components, integrated REST APIs, and collaborated closely with founders to ship production features under tight timelines. Gained hands-on experience with real-world product delivery, code reviews, and agile execution.",
    technologies: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "REST APIs",
      "Git"
    ],
    highlight: false,
    role: "Frontend Engineering Intern"
  }
];

export function Experience() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  return (
    <section id="experience" className="py-32 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Career</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Work Experience</h2>
          <p className="text-muted-foreground max-w-2xl">
            My journey from full-stack development to fintech specialization
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 md:left-[200px] lg:left-[200px] top-0 bottom-0 w-px bg-border hidden md:block">
            <motion.div className="w-full bg-gradient-to-b from-primary to-primary/20" style={{ height: lineHeight }} />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({
  exp,
  index,
  isInView,
}: {
  exp: (typeof experiences)[0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 group relative"
    >
      <div className="hidden md:flex absolute left-[200px] -translate-x-1/2 items-center justify-center">
        <motion.div
          className={`w-4 h-4 rounded-full border-2 ${
            exp.highlight ? "bg-primary border-primary" : "bg-background border-primary"
          }`}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
        />
        {exp.highlight && (
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-primary"
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>

      <div className="text-sm text-muted-foreground font-mono flex items-start gap-2 md:justify-end md:pr-8">
        <Briefcase size={16} className="text-primary shrink-0 mt-0.5 md:hidden" />
        {exp.period}
      </div>

      <motion.div
        className={`glass rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
          exp.highlight ? "border-primary/30 glow" : "hover:glow"
        }`}
        whileHover={{ x: 10 }}
      >
        {exp.highlight && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.3 }}
            className="absolute top-4 right-4 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-mono"
          >
            Current
          </motion.div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{exp.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 group/link"
            >
              {exp.company}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
            <span className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full text-muted-foreground">{exp.role}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{exp.description}</p>

        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.15 + i * 0.05 }}
              className="px-2.5 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
