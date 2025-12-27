import { getBlogPosts } from "@/lib/blog-service"
import { BlogListClient } from "@/components/blog-list-client"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return <BlogListClient posts={posts} />
}
