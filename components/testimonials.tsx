"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

const testimonials = [
  {
    quote:
      "Vikas consistently delivers high-quality code that exceeds expectations. His attention to detail and understanding of fintech requirements made him invaluable to our trading platform.",
    author: "Sarah Chen",
    role: "Engineering Lead",
    company: "ViewTrade",
  },
  {
    quote:
      "Working with Vikas was a pleasure. He brought both technical expertise and creative problem-solving to every challenge. The UI components he built are still the foundation of our product.",
    author: "Michael Roberts",
    role: "Product Manager",
    company: "TechStart Inc.",
  },
  {
    quote:
      "Vikas has a rare combination of strong technical skills and excellent communication. He always ensured our clients were happy and delivered projects on time without compromising quality.",
    author: "Emily Parker",
    role: "Creative Director",
    company: "Digital Agency",
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div style={{ y }} className="absolute top-20 left-10 text-primary/5 pointer-events-none">
        <Quote size={200} />
      </motion.div>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute bottom-20 right-10 text-primary/5 pointer-events-none rotate-180"
      >
        <Quote size={150} />
      </motion.div>

      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">What People Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from colleagues and clients I&apos;ve had the pleasure of working with
          </p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} isInView={isInView} />
          ))}
        </div>

        <div className="md:hidden relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialCard testimonial={testimonials[activeIndex]} index={0} isInView={true} />
          </motion.div>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevTestimonial}>
              <ChevronLeft size={18} />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
  isInView,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass rounded-xl p-6 hover:glow transition-all duration-300 relative group"
    >
      <Quote
        className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors"
        size={32}
      />

      <motion.p
        className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </motion.p>

      <div className="flex items-center gap-4">
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center ring-2 ring-primary/20"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-primary font-semibold text-sm">
            {testimonial.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </motion.div>
        <div>
          <div className="font-medium text-sm">{testimonial.author}</div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
