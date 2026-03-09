'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'

const STATS = [
  { value: '28', label: 'escenas' },
  { value: '5', label: 'videos interactivos' },
  { value: '100%', label: 'en español' },
]

const PREVIEW_CARDS = [
  {
    label: 'Origen',
    title: 'La familia y el campo',
    src: '/scenes/scene-2/background.png',
    className: 'md:absolute md:-left-8 md:top-8 md:w-56 md:-rotate-6',
  },
  {
    label: 'Poder',
    title: 'La prueba de la maza',
    src: '/scenes/scene-16/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_62f5e3bb0d.jpeg',
    className: 'md:absolute md:right-0 md:top-0 md:w-[22rem] md:rotate-3',
  },
  {
    label: 'Duelo',
    title: 'El encuentro con el dragón',
    src: '/scenes/scene-22/______e3814a2548.jpeg',
    className: 'md:absolute md:bottom-2 md:right-10 md:w-60 md:-rotate-3',
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(214,134,76,0.22),transparent_26%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_82%,rgba(118,54,28,0.24),transparent_32%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,225,174,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,225,174,0.08)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="animate-float absolute -left-24 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,225,174,0.24),transparent_68%)] blur-3xl" />
        <div
          className="animate-float absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(214,134,76,0.22),transparent_66%)] blur-3xl"
          style={{ animationDelay: '1.1s' }}
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center gap-14 px-5 py-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-12">
        <div className="max-w-2xl flex-1">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(var(--color-accent),0.3)] bg-[rgba(32,16,9,0.62)] px-4 py-2 text-xs uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.84)] backdrop-blur-md sm:text-sm">
            <span className="animate-pulse-slow h-2 w-2 rounded-full bg-[rgba(var(--color-accent),0.95)]" />
            Relato interactivo
          </div>

          <div className="mt-6 max-w-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[rgba(var(--color-accent),0.58)] sm:text-base">
              Cuento popular ucraniano
            </p>
            <h1
              className="mt-4 text-[clamp(4rem,11vw,8.5rem)] leading-[0.9] text-[rgba(var(--color-accent),0.98)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Kotyhoroshko
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[rgba(var(--color-accent),0.84)] sm:text-2xl">
              Un héroe nacido de un guisante mágico, un dragón que roba a la familia y una travesía escena a escena
              con pausas interactivas para niñas y niños.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.4rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(145deg,rgba(31,16,10,0.85),rgba(17,9,6,0.88))] px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.32)]"
              >
                <p className="text-3xl font-bold text-[rgba(var(--color-accent),0.96)] sm:text-4xl">{item.value}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[rgba(var(--color-accent),0.58)]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/scene/1"
              onClick={handleStart}
              aria-label="Empezar la historia desde la primera escena"
              aria-disabled={isNavigating}
              className={`button-primary btn-glow group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[1.6rem] px-8 py-4 text-xl font-bold shadow-2xl shadow-black/45 transition-all duration-300 hover:scale-[1.03] sm:min-w-[18rem] sm:text-2xl ${
                isNavigating ? 'pointer-events-none opacity-75' : ''
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="absolute inset-0 translate-x-[-125%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-[125%]" />
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

            <div className="max-w-sm rounded-[1.35rem] border border-[rgba(var(--color-accent),0.16)] bg-[rgba(20,10,7,0.65)] px-4 py-3 text-sm leading-relaxed text-[rgba(var(--color-accent),0.72)] backdrop-blur-md sm:text-base">
              En las escenas con vídeo verás un primer segundo automático y luego una miniaventura corta para continuar.
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(255,225,174,0.06)] px-4 py-2 text-sm text-[rgba(var(--color-accent),0.78)]">
              Lectura inmersiva
            </span>
            <span className="rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(255,225,174,0.06)] px-4 py-2 text-sm text-[rgba(var(--color-accent),0.78)]">
              Minijuegos sencillos
            </span>
            <span className="rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(255,225,174,0.06)] px-4 py-2 text-sm text-[rgba(var(--color-accent),0.78)]">
              Diseño adaptable
            </span>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.08)] lg:block" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.08)] lg:block" />

          <div className="relative mx-auto grid max-w-2xl gap-4 sm:grid-cols-2 md:max-w-3xl md:gap-5 lg:block lg:h-[38rem]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--color-accent),0.2)] bg-[linear-gradient(155deg,rgba(31,16,10,0.94),rgba(14,8,6,0.94))] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.42)] sm:col-span-2 lg:absolute lg:left-10 lg:top-10 lg:w-[20rem] lg:p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-accent),0.12),transparent_58%)]" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem]">
                <Image
                  src={encodeURI('/scenes/scene-16/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_62f5e3bb0d.jpeg')}
                  alt="Kotyhoroshko levanta la maza hacia el cielo"
                  fill
                  sizes="(min-width: 1024px) 20rem, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(12,7,5,0.82)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.68)]">Tramo central</p>
                  <p className="mt-2 text-2xl text-[rgba(var(--color-accent),0.96)]" style={{ fontFamily: 'var(--font-display)' }}>
                    El héroe toma forma
                  </p>
                </div>
              </div>
            </div>

            {PREVIEW_CARDS.map((card) => (
              <div
                key={card.title}
                className={`group relative overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[rgba(22,11,7,0.86)] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.36)] transition-transform duration-300 hover:scale-[1.02] ${card.className}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem]">
                  <Image
                    src={encodeURI(card.src)}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 16rem, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(10,6,4,0.84)_100%)]" />
                </div>
                <div className="mt-4 px-2 pb-2">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[rgba(var(--color-accent),0.62)]">{card.label}</p>
                  <p className="mt-2 text-lg text-[rgba(var(--color-accent),0.92)] sm:text-xl">{card.title}</p>
                </div>
              </div>
            ))}

            <div className="pointer-events-none absolute -bottom-6 left-1/2 hidden w-max -translate-x-1/2 rounded-full border border-[rgba(var(--color-accent),0.16)] bg-[rgba(18,9,6,0.78)] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.68)] backdrop-blur-md lg:block">
              Viaje visual escena a escena
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
