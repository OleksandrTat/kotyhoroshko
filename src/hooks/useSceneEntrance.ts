'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'
import type { Scene } from '@/content/scenes'

// Additional delay for scene 1 - wait for SceneTransition to finish
const FIRST_SCENE_DELAY = 1.0

export function useSceneEntrance(
  scene: Scene,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const hasEnteredRef = useRef(false)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Reduced motion: show everything immediately without animation
    if (prefersReduced) {
      const overlay = container.querySelector<HTMLElement>('[data-gsap="reveal-overlay"]')
      if (overlay) gsap.set(overlay, { opacity: 0, pointerEvents: 'none' })
      return
    }

    // Initial state for all elements
    const setInitialState = () => {
      const overlay = container.querySelector('[data-gsap="reveal-overlay"]')
      const bg = container.querySelector('[data-gsap="bg-image"]')
      const hud = container.querySelector('[data-gsap="hud"]')
      const title = container.querySelector('[data-gsap="title"]')
      const panel = container.querySelector('[data-gsap="story-panel"]')
      const paragraphs = container.querySelectorAll('[data-gsap^="story-text-"]')
      const narrator = container.querySelector('[data-gsap="narrator"]')
      const interactives = container.querySelectorAll('[data-gsap="interactive"]')

      if (overlay) gsap.set(overlay, { opacity: 1 })
      if (bg) gsap.set(bg, { opacity: 0.5, scale: 1.06 })
      if (hud) gsap.set(hud, { x: -40, opacity: 0 })
      if (title) gsap.set(title, { y: 28, opacity: 0, filter: 'blur(10px)' })
      if (panel) gsap.set(panel, { y: 56, opacity: 0, filter: 'blur(8px)' })
      if (paragraphs.length > 0) gsap.set(paragraphs, { y: 12, opacity: 0 })
      if (narrator) gsap.set(narrator, { scale: 0, opacity: 0 })
      if (interactives.length > 0) gsap.set(interactives, { scale: 0, opacity: 0 })
    }

    // Entrance timeline
    const playEntrance = () => {
      timelineRef.current?.kill()
      ctxRef.current?.revert()
      setInitialState()

      const delay = scene.id === 1 ? FIRST_SCENE_DELAY : 0

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay })
        timelineRef.current = tl

        const overlay = container.querySelector('[data-gsap="reveal-overlay"]')
        const bg = container.querySelector('[data-gsap="bg-image"]')
        const hud = container.querySelector('[data-gsap="hud"]')
        const title = container.querySelector('[data-gsap="title"]')
        const panel = container.querySelector('[data-gsap="story-panel"]')
        const paragraphs = container.querySelectorAll('[data-gsap^="story-text-"]')
        const narrator = container.querySelector('[data-gsap="narrator"]')
        const interactives = container.querySelectorAll('[data-gsap="interactive"]')

        // 1. Overlay fades + background appears
        if (overlay) {
          tl.to(overlay, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(overlay, { pointerEvents: 'none' })
            },
          }, 0)
        }
        if (bg) {
          tl.to(bg, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'scale',
          }, 0.1)
        }

        // 2. HUD enters from left
        if (hud) {
          tl.to(hud, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'x,opacity',
          }, 0.45)
        }

        // 3. Title rises with blur
        if (title) {
          tl.to(title, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'y,filter',
          }, 0.58)
        }

        // 4. Story panel rises
        if (panel) {
          tl.to(panel, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'y,filter',
          }, 0.74)
        }

        // 5. Paragraphs stagger in
        if (paragraphs.length > 0) {
          tl.to(paragraphs, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.14,
            ease: 'power2.out',
            clearProps: 'y,opacity',
          }, 1.02)
        }

        // 6. Narrator pops in
        if (narrator) {
          tl.to(narrator, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            clearProps: 'scale,opacity',
          }, 1.35)
        }

        // 7. Interactive elements bounce in
        if (interactives.length > 0) {
          tl.to(interactives, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(2)',
            clearProps: 'scale,opacity',
          }, 1.5)
        }
      }, container)

      ctxRef.current = ctx
    }

    // IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.5 && !hasEnteredRef.current) {
            hasEnteredRef.current = true
            playEntrance()
          } else if (entry.intersectionRatio < 0.05) {
            // Scene fully exited - reset for next entry
            hasEnteredRef.current = false
            timelineRef.current?.kill()
            ctxRef.current?.revert()

            // Restore overlay to initial dark state
            const overlay = container.querySelector<HTMLElement>('[data-gsap="reveal-overlay"]')
            if (overlay) {
              gsap.set(overlay, { opacity: 1, pointerEvents: '' })
            }
            setInitialState()
          }
        })
      },
      { threshold: [0.05, 0.5] },
    )

    // Small delay to avoid incorrect triggers on initial mount
    const timeoutId = window.setTimeout(() => {
      observer.observe(container)
    }, 50)

    return () => {
      window.clearTimeout(timeoutId)
      observer.disconnect()
      timelineRef.current?.kill()
      ctxRef.current?.revert()
    }
  }, [scene.id, containerRef])
}
