import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vikas (Suraj Pal) | Frontend Developer & Fintech Engineer",
  description:
    "Frontend Developer specializing in React, TypeScript, and fintech products. Building scalable, high-performance web applications with a focus on user experience.",
  keywords: ["Frontend Developer", "React", "TypeScript", "Fintech", "Software Engineer", "Next.js", "Tailwind CSS"],
  authors: [{ name: "Vikas (Suraj Pal)" }],
  openGraph: {
    title: "Vikas (Suraj Pal) | Frontend Developer & Fintech Engineer",
    description: "Frontend Developer specializing in React, TypeScript, and fintech products.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikas (Suraj Pal) | Frontend Developer",
    description: "Frontend Developer specializing in React, TypeScript, and fintech products.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
