import type { Metadata, Viewport } from 'next'
import { IM_Fell_English, Marck_Script } from 'next/font/google'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const siteUrl = getSiteUrl()

const displayFont = Marck_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-var',
  display: 'swap',
})

const bodyFont = IM_Fell_English({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body-var',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Kotyhoroshko | cuento interactivo infantil',
  description: 'Cuento interactivo infantil de Kotyhoroshko con scroll suave, narrador, animaciones, tacto y audio.',
  manifest: '/manifest.json',
  keywords: ['cuento infantil', 'Kotyhoroshko', 'cuento interactivo', 'Next.js', 'GSAP', 'Lenis', 'cuento clasico'],
  authors: [{ name: 'Kotyhoroshko Tale' }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Kotyhoroshko | cuento interactivo infantil',
    description: 'Una reinterpretacion infantil de Kotyhoroshko con scroll por escenas, narrador visible y juego tactil.',
    type: 'website',
    url: '/',
    siteName: 'Kotyhoroshko',
    locale: 'es_ES',
    images: [
      {
        url: '/scenes/scene-25/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_b18fd58a45.jpeg',
        width: 1200,
        height: 630,
        alt: 'Kotyhoroshko lucha contra el dragon bajo el roble de hierro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kotyhoroshko | cuento interactivo infantil',
    description: 'Scroll suave, narrador, sonido y escenas tactiles para publico infantil.',
    images: ['/scenes/scene-25/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_b18fd58a45.jpeg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0a08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
