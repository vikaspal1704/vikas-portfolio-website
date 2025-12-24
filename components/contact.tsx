"use client"

import type React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TiltCard } from "./tilt-card"
import { MagneticButton } from "./magnetic-button"

export function Contact() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setIsSubmitted(true)
      e.currentTarget.reset()
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
      console.error('Contact form error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    { href: "https://github.com/vikaspal1704", icon: <Github size={18} />, label: "GitHub" },
    { href: "https://www.linkedin.com/in/vikaspal1704/", icon: <Linkedin size={18} />, label: "LinkedIn" },
    { href: "https://twitter.com/vikas", icon: <Twitter size={18} />, label: "Twitter" },
  ]

  return (
    <section id="contact" className="py-32 relative overflow-hidden" ref={containerRef}>
      <motion.div
        style={{ y }}
        className="absolute top-20 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        className="absolute bottom-20 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance">
              Let&apos;s Build Something Great Together
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              I&apos;m always interested in hearing about new projects, especially those involving fintech, AI, or
              building products that scale globally. Whether you&apos;re a company looking to hire or just want to say
              hi, my inbox is always open.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: <Mail size={18} />, text: "palv499@gmail.com", href: "mailto:palv499@gmail.com" },
                { icon: <MapPin size={18} />, text: "India", href: null },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 text-muted-foreground group"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-primary">{item.icon}</span>
                  </div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <MagneticButton key={social.label}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                </MagneticButton>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TiltCard>
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSubmitted ? 1 : 0 }}
                  className={`absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 ${
                    isSubmitted ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isSubmitted ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-16 h-16 text-primary mb-4" />
                  </motion.div>
                  <p className="text-lg font-medium">Message sent!</p>
                  <p className="text-muted-foreground text-sm">I&apos;ll get back to you soon.</p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Project inquiry"
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 }}
                >
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                    className="bg-secondary/50 border-border/50 resize-none focus:border-primary transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <MagneticButton className="w-full">
                    <Button type="submit" className="w-full group" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </motion.div>
              </form>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
