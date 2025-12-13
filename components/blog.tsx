"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ArrowUpRight, Calendar } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog-service"

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch posts client-side for the homepage section
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.slice(0, 3)) // Show only 3 on homepage
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="blog" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Writing</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Latest Articles</h2>
            <p className="text-muted-foreground max-w-2xl">
              Thoughts on full-stack development, fintech, and emerging technologies
            </p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary hover:underline">
            View all posts
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="space-y-6">
          {loading
            ? // Skeleton loading
              [1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="flex gap-2 mb-2">
                    <div className="h-5 w-16 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))
            : posts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group glass rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:glow transition-all duration-300 block"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                      <span className="hidden md:inline">·</span>
                      <span>{post.readTime}</span>
                      <ArrowUpRight
                        size={16}
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Link>
                </motion.article>
              ))}
        </div>

        <Link href="/blog" className="md:hidden flex items-center justify-center gap-2 text-primary mt-8">
          View all posts
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  )
}
