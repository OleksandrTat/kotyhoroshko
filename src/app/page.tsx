'use client'

import { SCENES } from '@/content/scenes'
import { SmoothScroller } from '@/components/SmoothScroller'
import { StoryProgressTracker } from '@/components/StoryProgressTracker'
import { StoryScene } from '@/components/StoryScene'

export default function HomePage() {
  return (
    <>
      <SmoothScroller />
      <StoryProgressTracker />
      <main>
        <section
          id="scene-0"
          style={{ height: '100svh', width: '100vw', scrollSnapAlign: 'start' }}
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0b0a08]"
        >
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

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[rgba(var(--color-accent),0.6)] sm:text-sm">
              Cuento popular ucraniano
            </p>
            <h1
              className="mt-5 text-[clamp(3.4rem,9vw,6.5rem)] leading-[0.9] text-[rgba(var(--color-accent),0.98)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Kotyhoroshko
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[rgba(var(--color-accent),0.82)] sm:text-2xl">
              Un heroe nacido de un guisante magico, un dragon que rompe la calma del hogar y una aventura para leer y jugar.
            </p>
            <p className="mt-5 max-w-xl text-base text-[rgba(var(--color-accent),0.7)] sm:text-lg">
              Desliza para avanzar por las escenas. Cada parada incluye texto, animacion y retos interactivos.
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow flex flex-col items-center gap-2 text-[rgba(var(--color-accent),0.7)]">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm uppercase tracking-[0.3em]">Desliza para empezar</span>
          </div>
        </section>

        {SCENES.map((scene) => (
          <section
            key={scene.id}
            id={`scene-${scene.id}`}
            style={{ height: '100svh', width: '100vw', scrollSnapAlign: 'start' }}
          >
            <StoryScene scene={scene} />
          </section>
        ))}
      </main>
    </>
  )
}
