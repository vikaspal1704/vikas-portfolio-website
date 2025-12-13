"use client"

// To use:
// 1. Create a Google Sheet with columns: slug, title, excerpt, content, date, readTime, tags (comma-separated)
// 2. Publish it to web: File > Share > Publish to web > Select Sheet > CSV
// 3. Replace GOOGLE_SHEET_ID below with your sheet ID from the URL

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  tags: string[]
}

// Replace with your Google Sheet ID
// Your sheet URL looks like: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
// Copy the ID portion and paste below
const GOOGLE_SHEET_ID = "YOUR_GOOGLE_SHEET_ID"
const SHEET_NAME = "posts" // Name of your sheet tab

// Alternative: Use a JSON file hosted on GitHub Gist or any URL
// const EXTERNAL_BLOG_URL = "https://gist.githubusercontent.com/YOUR_USERNAME/GIST_ID/raw/posts.json"

// Fallback posts when external source is unavailable
const fallbackPosts: BlogPost[] = [
  {
    slug: "building-high-performance-trading-ui",
    title: "Building High-Performance Trading UIs with React",
    excerpt:
      "Deep dive into optimizing React applications for real-time financial data, handling thousands of updates per second while maintaining smooth 60fps rendering.",
    date: "Dec 5, 2024",
    readTime: "8 min read",
    tags: ["React", "Performance", "Fintech", "WebSocket"],
    content: `
## The Challenge of Real-Time Trading Interfaces

Building a trading platform isn't like building a typical web application. When you're dealing with market data streaming at thousands of updates per second, every millisecond matters. At ViewTrade, I've spent countless hours optimizing our Bridge platform to handle this scale while keeping the interface buttery smooth.

## Key Optimization Strategies

### 1. Virtualization is Non-Negotiable

When displaying hundreds of stock tickers, you simply cannot render them all to the DOM. We use windowing techniques to only render what's visible:

\`\`\`typescript
const VirtualizedWatchlist = ({ stocks }) => {
  const { scrollTop, containerHeight } = useScrollPosition()
  const visibleRange = calculateVisibleRange(scrollTop, containerHeight, ROW_HEIGHT)
  
  return stocks.slice(visibleRange.start, visibleRange.end).map(stock => (
    <StockRow key={stock.symbol} data={stock} />
  ))
}
\`\`\`

### 2. Batching Updates with RequestAnimationFrame

Instead of updating the UI on every WebSocket message, batch updates to align with the browser's refresh rate:

\`\`\`typescript
const useBatchedUpdates = () => {
  const pendingUpdates = useRef(new Map())
  const rafId = useRef(null)
  
  const scheduleUpdate = useCallback((symbol, data) => {
    pendingUpdates.current.set(symbol, data)
    
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        // Apply all pending updates at once
        flushUpdates(pendingUpdates.current)
        pendingUpdates.current.clear()
        rafId.current = null
      })
    }
  }, [])
  
  return scheduleUpdate
}
\`\`\`

### 3. Immutable Data Structures

Using immutable data patterns with proper memoization prevents unnecessary re-renders:

\`\`\`typescript
const stockReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PRICE':
      // Only create new reference if data actually changed
      if (state[action.symbol]?.price === action.price) return state
      return {
        ...state,
        [action.symbol]: { ...state[action.symbol], price: action.price }
      }
  }
}
\`\`\`

## Results

After implementing these optimizations, we achieved:
- **60fps** rendering with 500+ active tickers
- **<16ms** update latency from WebSocket to screen
- **40% reduction** in memory usage

## Conclusion

Building high-performance trading UIs requires thinking differently about state management and rendering. The techniques here aren't just for fintech—they apply to any real-time application dealing with high-frequency updates.
    `.trim(),
  },
  {
    slug: "ai-integration-frontend-apps",
    title: "Integrating AI into Frontend Applications",
    excerpt:
      "Practical patterns for adding AI capabilities to your web apps, from chatbots to intelligent data analysis, with real-world examples from my projects.",
    date: "Nov 28, 2024",
    readTime: "6 min read",
    tags: ["AI", "React", "OpenAI", "TypeScript"],
    content: `
## Why AI in the Frontend?

The rise of AI APIs has made it incredibly accessible to add intelligent features to web applications. From my work on AI Expense Analyzer and other projects, I've developed patterns that make AI integration seamless and maintainable.

## Pattern 1: Streaming Responses

Users hate waiting. Stream AI responses for immediate feedback:

\`\`\`typescript
const useStreamingAI = () => {
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  
  const query = async (prompt: string) => {
    setIsStreaming(true)
    setResponse('')
    
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })
    
    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader!.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      setResponse(prev => prev + chunk)
    }
    
    setIsStreaming(false)
  }
  
  return { response, isStreaming, query }
}
\`\`\`

## Pattern 2: Intelligent Caching

AI API calls are expensive. Cache aggressively:

\`\`\`typescript
const aiCache = new Map<string, { result: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

const cachedAIQuery = async (prompt: string) => {
  const cacheKey = hashPrompt(prompt)
  const cached = aiCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result
  }
  
  const result = await queryAI(prompt)
  aiCache.set(cacheKey, { result, timestamp: Date.now() })
  return result
}
\`\`\`

## Pattern 3: Graceful Degradation

Always have a fallback when AI fails:

\`\`\`typescript
const categorizeExpense = async (description: string) => {
  try {
    return await aiCategorize(description)
  } catch (error) {
    // Fallback to rule-based categorization
    return ruleBased Categorize(description)
  }
}
\`\`\`

## Real-World Application: AI Expense Analyzer

In my AI Expense Analyzer project, I combined these patterns to create an intelligent expense tracking system that:

1. **Auto-categorizes** transactions using GPT-4
2. **Predicts** monthly spending patterns
3. **Suggests** budget optimizations

The key was making AI feel instant and reliable, even when the underlying API might be slow or unavailable.

## Conclusion

AI integration doesn't have to be complex. Start with streaming for UX, add caching for cost control, and always have fallbacks for reliability.
    `.trim(),
  },
  {
    slug: "fullstack-journey-frontend-to-devops",
    title: "My Full-Stack Journey: From Frontend to DevOps",
    excerpt:
      "Reflections on growing from a frontend developer to handling backend services and DevOps infrastructure at Zeus Learning and beyond.",
    date: "Nov 15, 2024",
    readTime: "5 min read",
    tags: ["Career", "DevOps", "Full-Stack", "Learning"],
    content: `
## Starting Point: Frontend Developer

When I joined Zeus Learning, I was primarily a React developer. I could build beautiful, responsive interfaces, but everything behind the API was a black box. That changed when I started working on Test Maverick.

## The Catalyst: Test Maverick

Test Maverick needed more than just a frontend. It needed:
- Scalable backend APIs
- Real-time test session management
- AI-powered analytics
- Robust deployment pipelines

There was no choice but to learn. And honestly? It was the best thing for my career.

## Backend: Understanding the Other Side

Learning Node.js and Python backend development changed how I think about frontends:

\`\`\`typescript
// Before: I'd call an API without thinking about it
const data = await fetch('/api/users')

// After: I understand what's happening
// - Database query optimization
// - Connection pooling
// - Response serialization
// - Error handling strategies
\`\`\`

Key learnings:
- **Database design matters**: A poorly designed schema haunts you forever
- **APIs should be designed frontend-first**: Build what the UI needs
- **Error handling is an art**: Users need meaningful feedback

## DevOps: The Missing Piece

Setting up CI/CD pipelines and AWS infrastructure taught me:

\`\`\`yaml
# Simple but powerful: GitHub Actions for deployment
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v2
      - run: aws s3 sync ./dist s3://my-bucket
\`\`\`

Understanding infrastructure makes you a better developer:
- You write more efficient code when you pay for compute
- You handle errors better when you've seen production logs
- You design better when you understand system constraints

## Current State: ViewTrade

At ViewTrade, I'm focused on frontend for Bridge, but my full-stack background helps daily:
- I can debug API issues without waiting for backend team
- I understand WebSocket infrastructure decisions
- I can propose architectural changes with full context

## Advice for Frontend Developers

1. **Don't wait for permission**: Volunteer for backend tasks
2. **Build side projects end-to-end**: No better learning than doing
3. **Learn one thing at a time**: Master Node.js before jumping to DevOps
4. **Document everything**: Your future self will thank you

## What's Next?

I'm preparing to take on more backend responsibilities at ViewTrade. The journey from frontend to full-stack isn't a destination—it's a continuous evolution.
    `.trim(),
  },
]

// Fetch posts from Google Sheets (published as CSV)
async function fetchFromGoogleSheets(): Promise<BlogPost[]> {
  if (GOOGLE_SHEET_ID === "YOUR_GOOGLE_SHEET_ID") {
    return fallbackPosts
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`
    const response = await fetch(url, { next: { revalidate: 300 } }) // Revalidate every 5 minutes

    if (!response.ok) throw new Error("Failed to fetch")

    const text = await response.text()
    // Google Sheets returns JSONP, need to extract JSON
    const jsonString = text.substring(47, text.length - 2)
    const data = JSON.parse(jsonString)

    const rows = data.table.rows
    const posts: BlogPost[] = rows
      .slice(0)
      .map((row: any) => ({
        slug: row.c[0]?.v || "",
        title: row.c[1]?.v || "",
        excerpt: row.c[2]?.v || "",
        content: row.c[3]?.v || "",
        date: row.c[4]?.v || "",
        readTime: row.c[5]?.v || "",
        tags: (row.c[6]?.v || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
      }))
      .filter((post: BlogPost) => post.slug && post.title)

    return posts.length > 0 ? posts : fallbackPosts
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error)
    return fallbackPosts
  }
}

// Alternative: Fetch from a JSON URL (GitHub Gist, etc.)
async function fetchFromJsonUrl(url: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 300 } })
    if (!response.ok) throw new Error("Failed to fetch")

    const posts: BlogPost[] = await response.json()
    return posts.length > 0 ? posts : fallbackPosts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return fallbackPosts
  }
}

// Main export function - uses Google Sheets by default
export async function getBlogPosts(): Promise<BlogPost[]> {
  return fetchFromGoogleSheets()
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts()
  return posts.map((post) => post.slug)
}
