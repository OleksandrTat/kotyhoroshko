'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'

const HIGHLIGHTS = ['28 escenas ilustradas', 'Ritmo de lectura inmersivo', 'Cuento popular ucraniano']

export default function HomePage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    router.prefetch('/scene/1')
  }, [router])

  const handleStart = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isNavigating) {
      return
    }

    setIsNavigating(true)
    navigateWithPageTurn(() => {
      router.push('/scene/1')
    }, { direction: 'forward' })
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0f0905] px-4 py-[calc(2rem+env(safe-area-inset-top))]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#2b180e_0%,#1b1009_38%,#0b0704_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-primary),0.3),transparent_56%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(var(--color-accent),0.22)_1px,transparent_1px)] [background-size:3px_3px]" />
        <div className="animate-float absolute -top-16 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(var(--color-accent),0.35),transparent_64%)] blur-3xl" />
      </div>

      <section className="glass-panel relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border-[rgba(var(--color-accent),0.3)] px-6 py-10 sm:px-10 sm:py-12 md:px-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(var(--color-primary),0.2)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[rgba(var(--color-secondary),0.2)] blur-3xl" />

        <div className="relative text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-3 rounded-full border border-[rgba(var(--color-accent),0.34)] bg-[rgba(var(--color-secondary),0.34)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[rgba(var(--color-accent),0.88)] sm:text-sm">
            <span className="animate-pulse-slow h-2 w-2 rounded-full bg-[rgba(var(--color-accent),0.95)]" />
            Cuento popular ucraniano
            <span className="animate-pulse-slow h-2 w-2 rounded-full bg-[rgba(var(--color-accent),0.95)]" style={{ animationDelay: '0.8s' }} />
          </div>

          <h1
            className="text-gradient animate-shimmer mt-6 bg-[length:220%_100%] text-6xl leading-none sm:text-7xl md:text-8xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Kotyhoroshko
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-3xl text-xl text-[rgba(var(--color-accent),0.9)] sm:text-2xl md:text-3xl"
            style={{ fontFamily: 'var(--font-body)', animationDelay: '0.2s', opacity: 0 }}
          >
            Una reinterpretación visual del cuento sobre el héroe nacido de un guisante mágico que sale a rescatar a
            su familia.
          </p>

          <div
            className="animate-fade-in-up mt-7 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.38s', opacity: 0 }}
          >
            {HIGHLIGHTS.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(var(--color-accent),0.34)] bg-[rgba(var(--color-secondary),0.26)] px-4 py-2 text-sm text-[rgba(var(--color-accent),0.9)] sm:text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="animate-fade-in-up mt-10" style={{ animationDelay: '0.54s', opacity: 0 }}>
            <Link
              href="/scene/1"
              onClick={handleStart}
              aria-label="Empezar la historia desde la primera escena"
              aria-disabled={isNavigating}
              className={`btn-glow group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(var(--color-accent),0.52)] bg-[linear-gradient(125deg,rgba(var(--color-secondary),0.95),rgba(var(--color-primary),0.97),rgba(var(--color-secondary),0.95))] px-8 py-4 text-xl font-bold text-[#2a170b] shadow-2xl shadow-black/55 transition-all duration-300 hover:scale-[1.03] hover:border-[rgba(var(--color-accent),0.78)] sm:px-10 sm:py-5 sm:text-2xl ${
                isNavigating ? 'pointer-events-none opacity-75' : ''
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="absolute inset-0 translate-x-[-125%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-[125%]" />
              <span className="relative z-10">Empezar la historia</span>
              <svg
                className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5 sm:h-7 sm:w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <p
            className="animate-fade-in-up mt-6 text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.72)] sm:text-sm"
            style={{ animationDelay: '0.68s', opacity: 0 }}
          >
            Pulsa para abrir la primera escena
          </p>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.7)_100%)]" />
    </main>
  )
}
