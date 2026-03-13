'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'

export function RainEffect({ intensity = 'medium' }: { intensity?: 'light' | 'medium' | 'heavy' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const count = intensity === 'light' ? 40 : intensity === 'heavy' ? 120 : 70

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Salida temprana si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Crear gotas
    const drops: HTMLDivElement[] = []
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div')
      drop.style.cssText = `
        position: absolute;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 20 + 10}px;
        background: linear-gradient(to bottom, transparent, rgba(174, 214, 255, 0.6));
        border-radius: 0 0 50% 50%;
        left: ${Math.random() * 110 - 5}%;
        top: ${Math.random() * -100}%;
        opacity: ${Math.random() * 0.6 + 0.2};
      `
      container.appendChild(drop)
      drops.push(drop)

      gsap.to(drop, {
        y: window.innerHeight + 100,
        x: `+=${Math.random() * 30 - 15}`,
        duration: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 2,
        ease: 'none',
        repeat: -1,
        onRepeat() {
          gsap.set(drop, {
            y: -100,
            left: `${Math.random() * 110 - 5}%`,
          })
        },
      })
    }

    return () => {
      drops.forEach((d) => {
        gsap.killTweensOf(d)
        d.remove()
      })
    }
  }, [count])

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    />
  )
}
