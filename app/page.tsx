import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { ExperienceHorizontal } from "@/components/experience-horizontal"
import { Testimonials } from "@/components/testimonials"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ParallaxProvider } from "@/components/parallax-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { FloatingParticles } from "@/components/floating-particles"
import { ScrollProgress } from "@/components/scroll-progress"

export default function Home() {
  return (
    <ParallaxProvider>
      <main className="min-h-screen bg-background">
        <CustomCursor />
        <FloatingParticles />
        <ScrollProgress />
        <Header />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <ExperienceHorizontal />
        <Testimonials />
        <Blog />
        <Contact />
        <Footer />
      </main>
    </ParallaxProvider>
  )
}
