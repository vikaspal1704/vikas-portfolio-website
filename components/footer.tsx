"use client"

import type React from "react"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react"

const footerLinks = {
  navigation: [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/resume.pdf", label: "Resume" },
    { href: "#contact", label: "Contact" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight inline-block mb-4">
              <span className="gradient-text">Vikas</span>
              <span className="text-muted-foreground ml-1 text-sm font-normal">/ SDE</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
              Frontend Developer specializing in React, TypeScript, and fintech products. Building scalable applications
              with a focus on performance and user experience.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com/vikaspal1704" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/vikaspal1704/" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="https://twitter.com/vikas" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="mailto:palv499@gmail.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} Vikas Pal. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart size={14} className="text-primary" /> using Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all"
      aria-label={label}
    >
      {icon}
    </a>
  )
}
