'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'

const PREVIEW_CARDS = [
  {
    label: 'Origen',
    title: 'La familia y el campo',
    src: '/scenes/scene-2/background.png',
    className: 'lg:absolute lg:left-2 lg:top-16 lg:w-52 lg:-rotate-6',
  },
  {
    label: 'Duelo',
    title: 'El golpe decisivo',
    src: '/scenes/scene-25/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_b18fd58a45.jpeg',
    className: 'lg:absolute lg:right-4 lg:bottom-8 lg:w-60 lg:-rotate-4',
  },
]

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
    <main className="relative min-h-[100svh] overflow-hidden bg-[#120804]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(130deg,#150904_0%,#251108_38%,#0d0603_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,216,164,0.18),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(214,134,76,0.2),transparent_26%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_82%,rgba(118,54,28,0.22),transparent_32%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,225,174,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,225,174,0.07)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="animate-float absolute -left-24 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,225,174,0.22),transparent_68%)] blur-3xl" />
        <div
          className="animate-float absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(214,134,76,0.18),transparent_66%)] blur-3xl"
          style={{ animationDelay: '1.1s' }}
        />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-8 lg:px-12">
        <div
          className="animate-hero-lift inline-flex items-center gap-3 rounded-full border border-[rgba(var(--color-accent),0.26)] bg-[rgba(28,14,9,0.58)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.8)] backdrop-blur-md"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="h-2 w-2 rounded-full bg-[rgba(var(--color-accent),0.92)]" />
          Kotyhoroshko
        </div>
        <p
          className="animate-hero-lift hidden text-sm uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.56)] md:block"
          style={{ animationDelay: '0.18s' }}
        >
          Cuento visual para leer y jugar
        </p>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-7xl flex-col justify-center gap-14 px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:pt-10">
        <div className="max-w-xl flex-1">
          <p
            className="animate-hero-lift text-sm uppercase tracking-[0.35em] text-[rgba(var(--color-accent),0.58)] sm:text-base"
            style={{ animationDelay: '0.18s' }}
          >
            Cuento popular ucraniano
          </p>

          <h1
            className="animate-hero-lift mt-5 max-w-[8ch] text-[clamp(3.8rem,9vw,7rem)] leading-[0.9] text-[rgba(var(--color-accent),0.98)]"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '0.28s' }}
          >
            Kotyhoroshko
          </h1>

          <p
            className="animate-hero-lift mt-6 max-w-lg text-xl leading-relaxed text-[rgba(var(--color-accent),0.84)] sm:text-2xl"
            style={{ animationDelay: '0.42s' }}
          >
            Un heroe nacido de un guisante magico, un dragon que rompe la calma del hogar y una aventura pensada para avanzar escena a escena.
          </p>

          <div
            className="animate-hero-lift mt-8 max-w-lg rounded-[1.6rem] border border-[rgba(var(--color-accent),0.16)] bg-[linear-gradient(145deg,rgba(28,15,10,0.82),rgba(14,7,5,0.88))] p-5 text-base leading-relaxed text-[rgba(var(--color-accent),0.76)] shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:text-lg"
            style={{ animationDelay: '0.56s' }}
          >
            En los momentos de accion, el cuento se detiene un instante para que puedas tocar, arrastrar o seguir pequenas pistas antes de continuar.
          </div>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/scene/1"
              onClick={handleStart}
              aria-label="Empezar la historia desde la primera escena"
              aria-disabled={isNavigating}
              className={`button-primary btn-glow animate-hero-lift group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[1.6rem] px-8 py-4 text-xl font-bold shadow-2xl shadow-black/45 transition-all duration-300 hover:scale-[1.03] sm:min-w-[18rem] sm:text-2xl ${
                isNavigating ? 'pointer-events-none opacity-75' : ''
              }`}
              style={{ fontFamily: 'var(--font-body)', animationDelay: '0.72s' }}
            >
              <span className="absolute inset-0 translate-x-[-125%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-[125%]" />
              <span className="animate-accent-sweep absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-70" />
              <span className="relative z-10">Abrir el cuento</span>
              <svg
                className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </Link>

            <p
              className="animate-hero-lift max-w-xs text-sm leading-relaxed text-[rgba(var(--color-accent),0.62)] sm:text-base"
              style={{ animationDelay: '0.86s' }}
            >
              Empieza directamente en la primera escena y entra en la historia sin pasos intermedios.
            </p>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="animate-hero-halo pointer-events-none absolute left-1/2 top-1/2 hidden h-[33rem] w-[33rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.08)] lg:block" />
          <div
            className="animate-hero-halo pointer-events-none absolute left-1/2 top-1/2 hidden h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.08)] lg:block"
            style={{ animationDelay: '1.3s' }}
          />

          <div className="relative mx-auto grid max-w-2xl gap-4 sm:grid-cols-2 lg:block lg:h-[38rem]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--color-accent),0.22)] bg-[linear-gradient(155deg,rgba(31,16,10,0.94),rgba(14,8,6,0.94))] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.42)] sm:col-span-2 lg:absolute lg:left-16 lg:top-8 lg:w-[24rem] lg:rotate-2 lg:p-4">
              <div className="animate-hero-card relative" style={{ animationDelay: '0.34s' }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-accent),0.12),transparent_58%)]" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={encodeURI('/scenes/scene-16/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_62f5e3bb0d.jpeg')}
                    alt="Kotyhoroshko levanta la maza hacia el cielo"
                    fill
                    sizes="(min-width: 1024px) 24rem, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(12,7,5,0.84)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_12%,rgba(255,255,255,0.14),transparent_30%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.68)]">Tramo central</p>
                    <p className="mt-2 text-3xl text-[rgba(var(--color-accent),0.96)]" style={{ fontFamily: 'var(--font-display)' }}>
                      El heroe toma forma
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {PREVIEW_CARDS.map((card, index) => (
              <div
                key={card.title}
                className={`group relative overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[rgba(22,11,7,0.86)] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.36)] transition-transform duration-300 hover:scale-[1.02] ${card.className}`}
              >
                <div className="animate-hero-card relative" style={{ animationDelay: `${0.62 + index * 0.16}s` }}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem]">
                    <Image
                      src={encodeURI(card.src)}
                      alt={card.title}
                      fill
                      sizes="(min-width: 1024px) 16rem, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(10,6,4,0.84)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_34%)]" />
                  </div>
                  <div className="mt-4 px-2 pb-2">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[rgba(var(--color-accent),0.62)]">{card.label}</p>
                    <p className="mt-2 text-lg text-[rgba(var(--color-accent),0.92)] sm:text-xl">{card.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
