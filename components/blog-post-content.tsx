"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, LinkIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/blog-service"
import ReactMarkdown from "react-markdown"
import { useState } from "react"

interface Props {
  post: BlogPost
}

export function BlogPostContent({ post }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20">
      <article className="container mx-auto px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">{post.title}</h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>

          <p className="text-xl text-muted-foreground leading-relaxed mb-12">{post.excerpt}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:marker:text-primary
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
            prose-table:border-collapse prose-th:bg-card prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-border"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Share this article</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={shareOnTwitter}>
                  <Twitter size={18} />
                </Button>
                <Button variant="outline" size="icon" onClick={shareOnLinkedIn}>
                  <Linkedin size={18} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <LinkIcon size={18} />
                </Button>
                {copied && <span className="text-sm text-primary ml-2">Link copied!</span>}
              </div>
            </div>

            <Button asChild>
              <Link href="/blog">Read more articles</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
          <p className="text-muted-foreground mb-6">
            Let's connect and discuss more about full-stack development and fintech.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild variant="outline">
              <Link href="https://www.linkedin.com/in/vikaspal1704/" target="_blank">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </Link>
            </Button>
            <Button asChild>
              <Link href="/#contact">Get in Touch</Link>
            </Button>
          </div>
        </motion.div>
      </article>
    </main>
  )
}
