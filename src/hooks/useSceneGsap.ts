'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsapSetup'
import type { Scene } from '@/content/scenes'

// DEPRECATED: replaced by useSceneEntrance.ts
// which uses IntersectionObserver instead of ScrollTrigger
// (ScrollTrigger does not fire reliably inside scroll-snap)
export function useSceneGsap(scene: Scene, containerRef: React.RefObject<HTMLElement | null>) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      timelineRef.current?.kill()
      return
    }

    // Limpiar timeline anterior
    timelineRef.current?.kill()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      })

      // Animación de entrada del HUD
      tl.from('[data-gsap="hud"]', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0)

      // Animación del título de escena
      tl.from('[data-gsap="title"]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        filter: 'blur(8px)',
      }, 0.2)

      // Animación del panel de texto — aparición progresiva párrafo a párrafo
      tl.from('[data-gsap="story-panel"]', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        filter: 'blur(6px)',
      }, 0.4)

      // Animación letra a letra del primer párrafo (texto narrado)
      const firstParagraph = container.querySelector('[data-gsap="story-text-0"]')
      if (firstParagraph) {
        tl.from(firstParagraph, {
          opacity: 0,
          y: 12,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.8)
      }

      // Animaciones adicionales por párrafo
      const extraParagraphs = container.querySelectorAll('[data-gsap^="story-text-"]:not([data-gsap="story-text-0"])')
      if (extraParagraphs.length > 0) {
        tl.from(extraParagraphs, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power2.out',
        }, 1.2)
      }

      timelineRef.current = tl
    }, container)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [scene.id, containerRef])
}
