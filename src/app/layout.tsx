import type { Metadata } from 'next'
import { Marck_Script, Philosopher } from 'next/font/google'
import './globals.css'

const displayFont = Marck_Script({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
})

const bodyFont = Philosopher({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Kotyhoroshko | cuento interactivo',
  description: 'Sumérgete en una versión interactiva del cuento popular ucraniano de Kotyhoroshko.',
  keywords: ['cuento ucraniano', 'Kotyhoroshko', 'historia interactiva', 'folclore', 'cuento popular'],
  authors: [{ name: 'Kotyhoroshko Tale' }],
  openGraph: {
    title: 'Kotyhoroshko | cuento interactivo',
    description: 'Sumérgete en una versión interactiva del cuento popular ucraniano de Kotyhoroshko.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
