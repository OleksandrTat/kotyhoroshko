'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'
import type { Scene } from '@/content/scenes'

const NARRATOR_LINES: Record<number, string> = {
  1: '¡Había una vez una gran familia!',
  2: 'Los hermanos fueron al campo a trabajar...',
  3: 'Hicieron un camino en la tierra.',
  4: '¡Un dragón malvado preparó una trampa!',
  5: '¡La hermana se perdió!',
  6: 'Los hermanos la buscaron por el bosque.',
  7: 'El dragón los desafió a luchar.',
  8: 'En el patio había un árbol de hierro.',
  9: '¡El dragón los encerró bajo tierra!',
  10: 'Sus padres esperaban con esperanza.',
  11: 'Creció una vaina mágica en el jardín.',
  12: '¡Nació Kotyhoroshko del guisante mágico!',
  13: '¡Creció muy, muy rápido!',
  14: 'Levantó una roca enorme él solo.',
  15: 'Pidió al herrero una maza muy pesada.',
  16: 'Lanzó la maza hasta el cielo.',
  17: 'Doce días después... ¡volvió!',
  18: 'El herrero la hizo todavía más fuerte.',
  19: '¡Ya estaba lista para la batalla!',
  20: 'Siguió el viejo camino hasta el dragón.',
  21: 'Llegó al patio del dragón.',
  22: 'El dragón silbó y las hojas cayeron.',
  23: '¡Kotyhoroshko lo engañó y le dio un golpe!',
  24: 'El dragón pidió paz, pero él dijo: ¡no!',
  25: '¡Kotyhoroshko ganó y el dragón quedó atrapado!',
}

export function NarratorBubble({ scene }: { scene: Scene }) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const line = NARRATOR_LINES[scene.id]

  useEffect(() => {
    const bubble = bubbleRef.current
    if (!bubble) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.fromTo(
        bubble,
        { scale: 0, opacity: 0, transformOrigin: 'bottom left' },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 1.2 },
      )
    } else {
      bubble.style.opacity = '1'
      bubble.style.transform = 'none'
    }

    const timer = window.setTimeout(() => {
      if (!prefersReducedMotion) {
        gsap.to(bubble, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(1.7)' })
      } else {
        bubble.style.opacity = '0'
      }
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [scene.id])

  if (!line) return null

  return (
    <div
      ref={bubbleRef}
      className="absolute bottom-[calc(5rem+env(safe-area-inset-bottom))] left-[calc(1.5rem+env(safe-area-inset-left))] z-[45] flex items-end gap-3"
      aria-live="polite"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[rgba(255,225,174,0.8)] bg-[linear-gradient(145deg,#3d2010,#1e0f06)] text-3xl shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        🦉
      </div>

      <div className="relative max-w-[16rem] rounded-[1.4rem] rounded-bl-sm border-2 border-[rgba(255,225,174,0.5)] bg-[rgba(255,248,230,0.96)] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <p className="text-sm font-bold leading-snug text-[#2a170b] sm:text-base" style={{ fontFamily: 'var(--font-body)' }}>
          {line}
        </p>
        <div className="absolute -bottom-3 left-4 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-[rgba(255,248,230,0.96)]" />
        <div className="absolute -bottom-[14px] left-[14px] h-0 w-0 border-l-[11px] border-r-[11px] border-t-[11px] border-l-transparent border-r-transparent border-t-[rgba(255,225,174,0.5)]" />
      </div>
    </div>
  )
}
