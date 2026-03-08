'use client'

import { useEffect, useRef, useState } from 'react'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'

export default function Scene2Page() {
  const [textVisible, setTextVisible] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 850)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const root = parallaxRef.current
    if (!root) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
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

    const handlePreferenceChange = () => {
      if (reducedMotion.matches) {
        disableParallax()
      } else {
        disableParallax()
        enableParallax()
      }
    }

    if (reducedMotion.matches) {
      setParallaxVariables()
    } else {
      enableParallax()
    }

    reducedMotion.addEventListener('change', handlePreferenceChange)

    return () => {
      reducedMotion.removeEventListener('change', handlePreferenceChange)
      disableParallax()
    }
  }, [])

  return (
    <SceneContainer>
      <div ref={parallaxRef} className="parallax-root absolute inset-0">
        <div className="parallax-layer-back absolute inset-0 z-0">
          <SceneLayer
            src="/scenes/scene-2/background.png"
            alt="Небо та просторе поле"
            className="animate-ken-burns"
            priority
          />
        </div>

        <div className="parallax-layer-mid absolute inset-0 z-10">
          <SceneLayer
            src="/scenes/scene-2/midground.png"
            alt="Віддалені пагорби та стигла пшениця"
            className="animate-fade-in-slow"
          />
        </div>

        <div className="parallax-layer-front absolute inset-0 z-20">
          <SceneLayer
            src="/scenes/scene-2/foreground.png"
            alt="Передній план із травою та польовими деталями"
            className="animate-fade-in-slow drop-shadow-[0_20px_44px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[25] bg-gradient-to-t from-[rgba(18,11,7,0.9)] via-[rgba(42,23,11,0.3)] to-[rgba(42,23,11,0.08)]" />
        <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_70%_14%,rgba(var(--color-accent),0.18),transparent_46%)]" />
        <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_30%_80%,rgba(var(--color-primary),0.16),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

        <div className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex items-center gap-3 animate-fade-in">
          <div className="relative h-12 w-12 rounded-full border border-[rgba(var(--color-accent),0.56)] bg-[rgba(var(--color-secondary),0.42)] shadow-lg shadow-black/45">
            <div className="animate-pulse-slow absolute inset-0 rounded-full bg-[rgba(var(--color-primary),0.24)]" />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[rgba(var(--color-accent),0.98)]">2</span>
          </div>
          <div className="rounded-full border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-3 py-1.5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-[rgba(var(--color-accent),0.94)]">Шлях у поле</p>
          </div>
        </div>

        <div
          className={`story-panel-wrap absolute bottom-[calc(6.4rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-30 transition-all duration-700 sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] md:left-[calc(3rem+env(safe-area-inset-left))] md:right-auto ${
            textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="story-panel depth-shadow relative p-5 sm:p-6 md:p-7">
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />
            <p className="story-text relative text-left font-medium text-[rgba(var(--color-accent),0.95)]">
              Одного дня шестеро братів пішли в поле працювати, а наймолодший залишився вдома.
            </p>
            <p className="relative mt-3 text-sm uppercase tracking-[0.16em] text-[rgba(var(--color-accent),0.72)]">
              Кінець першого розділу
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 h-2 bg-[rgba(18,11,7,0.7)] backdrop-blur-sm">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
            aria-label="Прогрес історії: 100 відсотків"
            className="h-full bg-[linear-gradient(to_right,rgba(var(--color-secondary),0.96),rgba(var(--color-primary),0.98),rgba(var(--color-secondary),0.96))]"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </SceneContainer>
  )
}
