'use client'

import { useEffect, useRef, useState } from 'react'
import { NextButton } from '@/components/NextButton'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { TOTAL_SCENES, type Scene, type SceneTheme } from '@/content/scenes'

const THEME_STYLES: Record<
  SceneTheme,
  { base: string; glowA: string; glowB: string; veil: string }
> = {
  hearth: {
    base: 'bg-[linear-gradient(180deg,#28170f_0%,#140d08_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_22%_20%,rgba(244,188,85,0.34),transparent_42%)]',
    glowB: 'bg-[radial-gradient(circle_at_78%_78%,rgba(214,134,76,0.2),transparent_48%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.72)_100%)]',
  },
  field: {
    base: 'bg-[linear-gradient(180deg,#1b1e16_0%,#0d110d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_12%,rgba(255,215,128,0.22),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_18%_78%,rgba(122,89,44,0.28),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(2,3,1,0.7)_100%)]',
  },
  forest: {
    base: 'bg-[linear-gradient(180deg,#122018_0%,#09120d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_18%_24%,rgba(109,151,102,0.24),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_80%_74%,rgba(36,85,64,0.22),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.76)_100%)]',
  },
  dragon: {
    base: 'bg-[linear-gradient(180deg,#29110e_0%,#120707_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_76%_18%,rgba(224,92,60,0.34),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_78%,rgba(244,188,85,0.18),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.76)_100%)]',
  },
  dungeon: {
    base: 'bg-[linear-gradient(180deg,#15171d_0%,#06070b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_24%_26%,rgba(119,142,189,0.16),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_74%_78%,rgba(84,98,129,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_14%,rgba(0,0,0,0.82)_100%)]',
  },
  wonder: {
    base: 'bg-[linear-gradient(180deg,#15201f_0%,#08100f_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_32%_20%,rgba(162,229,180,0.26),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_72%_74%,rgba(244,188,85,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.72)_100%)]',
  },
  forge: {
    base: 'bg-[linear-gradient(180deg,#23130e_0%,#0f0806_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_68%_18%,rgba(244,114,52,0.3),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_82%,rgba(255,225,174,0.12),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.78)_100%)]',
  },
  sky: {
    base: 'bg-[linear-gradient(180deg,#132033_0%,#090e16_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_50%_14%,rgba(161,196,255,0.22),transparent_30%)]',
    glowB: 'bg-[radial-gradient(circle_at_22%_82%,rgba(244,188,85,0.16),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.74)_100%)]',
  },
  trail: {
    base: 'bg-[linear-gradient(180deg,#1a1a14_0%,#0e0d0b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_74%_20%,rgba(200,171,101,0.24),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_78%,rgba(98,112,72,0.22),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.74)_100%)]',
  },
  duel: {
    base: 'bg-[linear-gradient(180deg,#1b0d11_0%,#090407_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_72%_18%,rgba(255,119,82,0.26),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_26%_76%,rgba(255,225,174,0.14),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
  escape: {
    base: 'bg-[linear-gradient(180deg,#171826_0%,#08090e_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_16%,rgba(181,194,255,0.2),transparent_32%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_84%,rgba(221,102,83,0.2),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
}

function AmbientBackdrop({ theme }: { theme: SceneTheme }) {
  const style = THEME_STYLES[theme]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute inset-0 ${style.base}`} />
      <div className={`animate-float absolute inset-0 ${style.glowA}`} />
      <div className={`animate-float absolute inset-0 ${style.glowB}`} style={{ animationDelay: '1.2s' }} />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,225,174,0.14)_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className={`absolute inset-0 ${style.veil}`} />
    </div>
  )
}

export function StoryScene({ scene }: { scene: Scene }) {
  const [textVisible, setTextVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [scene.id])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (scene.media.kind !== 'layered') {
      return
    }

    const root = parallaxRef.current
    if (!root) {
      return
    }

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frameId = 0

    const setParallaxVariables = () => {
      root.style.setProperty('--parallax-x-s', `${current.x * 0.2}px`)
      root.style.setProperty('--parallax-y-s', `${current.y * 0.2}px`)
      root.style.setProperty('--parallax-x-m', `${current.x * 0.5}px`)
      root.style.setProperty('--parallax-y-m', `${current.y * 0.5}px`)
      root.style.setProperty('--parallax-x-l', `${current.x * 0.85}px`)
      root.style.setProperty('--parallax-y-l', `${current.y * 0.85}px`)
    }

    const resetParallax = () => {
      target.x = 0
      target.y = 0
    }

    const updateParallax = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      setParallaxVariables()
      frameId = window.requestAnimationFrame(updateParallax)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return
      }

      const normalizedX = event.clientX / window.innerWidth - 0.5
      const normalizedY = event.clientY / window.innerHeight - 0.5
      target.x = normalizedX * 24
      target.y = normalizedY * 16
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) {
        return
      }

      const normalizedX = touch.clientX / window.innerWidth - 0.5
      const normalizedY = touch.clientY / window.innerHeight - 0.5
      target.x = normalizedX * 18
      target.y = normalizedY * 12
    }

    const enableParallax = () => {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', resetParallax)
      window.addEventListener('blur', resetParallax)
      frameId = window.requestAnimationFrame(updateParallax)
    }

    const disableParallax = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', resetParallax)
      window.removeEventListener('blur', resetParallax)
      window.cancelAnimationFrame(frameId)
      resetParallax()
      current.x = 0
      current.y = 0
      setParallaxVariables()
    }

    if (prefersReducedMotion) {
      setParallaxVariables()
      return
    }

    enableParallax()
    return disableParallax
  }, [prefersReducedMotion, scene.media.kind])

  const progressValue = (scene.id / TOTAL_SCENES) * 100
  const progressLabel = `Progreso del cuento: ${Math.round(progressValue)} por ciento`
  const panelSideClass =
    scene.panelAlign === 'right'
      ? 'md:left-auto md:right-[calc(3rem+env(safe-area-inset-right))]'
      : 'md:left-[calc(3rem+env(safe-area-inset-left))] md:right-auto'

  return (
    <SceneContainer>
      <div className="absolute inset-0 overflow-hidden">
        <AmbientBackdrop theme={scene.theme} />

        {scene.media.kind === 'layered' ? (
          <div ref={parallaxRef} className="parallax-root absolute inset-0 z-10">
            <div className="parallax-layer-back absolute inset-0">
              <SceneLayer
                src={scene.media.background}
                alt={scene.media.altBackground}
                className="animate-ken-burns"
                priority
              />
            </div>
            <div className="parallax-layer-mid absolute inset-0">
              <SceneLayer
                src={scene.media.midground}
                alt={scene.media.altMidground}
                className="animate-fade-in-slow"
                priority
              />
            </div>
            <div className="parallax-layer-front absolute inset-0">
              <SceneLayer
                src={scene.media.foreground}
                alt={scene.media.altForeground}
                className="animate-fade-in-slow drop-shadow-[0_20px_44px_rgba(0,0,0,0.48)]"
                priority
              />
            </div>
          </div>
        ) : null}

        {scene.media.kind === 'image' ? (
          <SceneLayer
            src={scene.media.src}
            alt={scene.media.alt}
            className="z-10 scale-[1.03] animate-ken-burns"
            priority
          />
        ) : null}

        {scene.media.kind === 'video' ? (
          <SceneLayer
            media="video"
            src={scene.media.src}
            poster={scene.media.poster}
            alt={scene.media.alt}
            className="z-10 scale-[1.03] animate-fade-in-slow"
            autoPlay={!prefersReducedMotion}
            loop={!prefersReducedMotion}
            priority
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[rgba(8,7,7,0.96)] via-[rgba(20,14,10,0.38)] to-[rgba(12,10,9,0.08)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(var(--color-accent),0.12),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_78%_82%,rgba(var(--color-primary),0.1),transparent_44%)]" />
      </div>

      <div className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex items-center gap-3 animate-fade-in">
        <div className="relative h-12 w-12 rounded-full border border-[rgba(var(--color-accent),0.56)] bg-[rgba(var(--color-secondary),0.42)] shadow-lg shadow-black/45">
          <div className="animate-pulse-slow absolute inset-0 rounded-full bg-[rgba(var(--color-primary),0.24)]" />
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[rgba(var(--color-accent),0.98)]">
            {scene.id}
          </span>
        </div>
        <div className="rounded-full border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-3 py-1.5 backdrop-blur-sm">
          <p className="text-sm font-semibold text-[rgba(var(--color-accent),0.94)]">Escena {scene.id}</p>
        </div>
      </div>

      <div
        className={`story-panel-wrap absolute bottom-[calc(6.7rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-30 transition-all duration-700 sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] ${panelSideClass} ${
          textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="story-panel depth-shadow relative p-5 sm:p-6 md:p-7">
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />

          <p className="relative text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">
            Escena {scene.id} de {TOTAL_SCENES}
          </p>

          <h1
            className="relative mt-3 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {scene.title}
          </h1>

          <div className="relative mt-5 space-y-4">
            {scene.text.map((paragraph) => (
              <p key={paragraph} className="story-text text-left font-medium text-[rgba(var(--color-accent),0.95)]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 h-2 bg-[rgba(18,11,7,0.7)] backdrop-blur-sm">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressValue)}
          aria-label={progressLabel}
          className="animate-progress h-full bg-[linear-gradient(to_right,rgba(var(--color-secondary),0.96),rgba(var(--color-primary),0.98),rgba(var(--color-secondary),0.96))]"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      {scene.id < TOTAL_SCENES ? (
        <NextButton nextSceneId={scene.id + 1} />
      ) : (
        <NextButton href="/" label="Volver al inicio" direction="backward" />
      )}
    </SceneContainer>
  )
}
