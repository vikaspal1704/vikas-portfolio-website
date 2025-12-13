"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/blog-service"

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/#blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-primary text-sm font-mono tracking-wider uppercase mb-4 block">Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Articles & Insights</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Thoughts on full-stack development, fintech engineering, AI integration, and building products at scale.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group glass rounded-2xl p-8 flex flex-col gap-4 hover:glow transition-all duration-300 block"
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{post.title}</h2>

                <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span className="flex items-center gap-2 text-primary text-sm font-medium">
                    Read article
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  )
}
