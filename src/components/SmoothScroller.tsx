'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { connectGsapToLenis } from '@/lib/gsapSetup'

export function SmoothScroller() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      duration: prefersReduced ? 0.01 : 1.2,
      easing: prefersReduced ? (t: number) => t : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !prefersReduced,
      touchMultiplier: 2,
    })

    // Conectar con GSAP ScrollTrigger - debe hacerse aqui, tras crear lenis
    connectGsapToLenis(lenis)

    // Exponer para uso externo si hiciera falta
    const win = window as unknown as { lenis?: Lenis }
    win.lenis = lenis

    // Snap suave solo cuando el scroll se detiene
    let snapTimeoutId: number | null = null
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      if (prefersReduced) return
      if (snapTimeoutId !== null) {
        window.clearTimeout(snapTimeoutId)
      }

      snapTimeoutId = window.setTimeout(() => {
        const vh = window.innerHeight
        const currentSection = Math.round(scroll / vh)
        const snapTarget = currentSection * vh
        const distanceToSnap = Math.abs(scroll - snapTarget)

        if (distanceToSnap > vh * 0.12) {
          lenis.scrollTo(snapTarget, { duration: 0.6 })
        }
      }, 140)
    })

    // Swipe tactil
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY
      const vh = window.innerHeight
      const currentSection = Math.round(window.scrollY / vh)

      if (Math.abs(delta) > 50) {
        const target = delta > 0 ? currentSection + 1 : currentSection - 1
        lenis.scrollTo(Math.max(0, target) * vh, { duration: prefersReduced ? 0 : 0.8 })
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // RAF - Lenis necesita su propio loop
    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      if (snapTimeoutId !== null) {
        window.clearTimeout(snapTimeoutId)
      }
      cancelAnimationFrame(rafId)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      lenis.destroy()
      win.lenis = undefined
    }
  }, [])

  return null
}
