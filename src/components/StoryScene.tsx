'use client'

import { useEffect, useRef, useState } from 'react'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { SceneEffect } from '@/components/effects/SceneEffect'
import {
  AmbientBackdrop,
  DraggableStoryPanel,
  InteractiveVideoLayer,
  SceneHud,
  SceneJourney,
  SceneMotes,
  SceneTitleReveal,
  StoryGuide,
} from '@/components/scene'
import { TOTAL_SCENES, type Scene } from '@/content/scenes'
import { useSceneGsap } from '@/hooks/useSceneGsap'

function ScrollHint({ isLastScene }: { isLastScene: boolean }) {
  if (isLastScene) return null
  return (
    <div className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2 animate-bounce-slow">
      <div className="flex flex-col items-center gap-2 text-[rgba(var(--color-accent),0.7)]">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-xs uppercase tracking-[0.3em]">Sigue</span>
      </div>
    </div>
  )
}

export function StoryScene({ scene }: { scene: Scene }) {
  const [textVisible, setTextVisible] = useState(false)
  const [guideMessage, setGuideMessage] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sceneContainerRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useSceneGsap(scene, sceneContainerRef)

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
    const guideKey = scene.media.kind === 'video' && scene.videoGame ? 'story-guide-video' : 'story-guide-reading'
    const existingGuide = window.localStorage.getItem(guideKey)
    const rafId = window.requestAnimationFrame(() => {
      if (existingGuide) {
        setGuideMessage(null)
        return
      }

      const message =
        scene.media.kind === 'video' && scene.videoGame
          ? 'Esta escena se detiene para jugar un momento. Aqui puedes tocar, arrastrar o dibujar un camino antes de seguir con el cuento.'
          : 'Puedes arrastrar el cuadro de texto si tapa una parte importante de la ilustracion.'

      setGuideMessage(message)
      window.localStorage.setItem(guideKey, 'seen')
    })
    const timeoutId = window.setTimeout(() => setGuideMessage(null), 5600)
    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
    }
  }, [scene.id, scene.media.kind, scene.videoGame])

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

  return (
    <SceneContainer>
      <div ref={sceneContainerRef} className="absolute inset-0 overflow-hidden">
        <AmbientBackdrop theme={scene.theme} />
        <SceneMotes theme={scene.theme} />

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
          <InteractiveVideoLayer scene={scene} prefersReducedMotion={prefersReducedMotion} />
        ) : null}

        <SceneEffect theme={scene.theme} />

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[rgba(8,7,7,0.96)] via-[rgba(20,14,10,0.38)] to-[rgba(12,10,9,0.08)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(var(--color-accent),0.12),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_78%_82%,rgba(var(--color-primary),0.1),transparent_44%)]" />
      </div>

      <SceneHud scene={scene} progressValue={progressValue} />
      <SceneTitleReveal key={`title-${scene.id}`} scene={scene} visible={!prefersReducedMotion} />

      <DraggableStoryPanel scene={scene} visible={textVisible} />
      {guideMessage ? <StoryGuide message={guideMessage} onDismiss={() => setGuideMessage(null)} /> : null}
      <SceneJourney scene={scene} progressValue={progressValue} />

      <div className="absolute bottom-0 left-0 right-0 z-[32] h-2 bg-[rgba(18,11,7,0.7)] backdrop-blur-sm">
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
      <ScrollHint isLastScene={scene.id >= TOTAL_SCENES} />
    </SceneContainer>
  )
}
