'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'

export function FogEffect({ density = 'medium' }: { density?: 'light' | 'medium' | 'heavy' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const opacity = density === 'light' ? 0.3 : density === 'heavy' ? 0.65 : 0.45

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Salida temprana si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layers = 4
    const elements: HTMLDivElement[] = []

    for (let i = 0; i < layers; i++) {
      const fog = document.createElement('div')
      const size = 150 + i * 40
      fog.style.cssText = `
        position: absolute;
        width: ${size}%;
        height: 35%;
        bottom: ${i * 12}%;
        left: ${-20 + i * 5}%;
        background: radial-gradient(ellipse at center, rgba(220,230,245,${opacity - i * 0.05}) 0%, transparent 70%);
        filter: blur(${12 + i * 6}px);
      `
      container.appendChild(fog)
      elements.push(fog)

      gsap.to(fog, {
        x: i % 2 === 0 ? '8%' : '-8%',
        duration: 8 + i * 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 1.2,
      })
    }

    return () => {
      elements.forEach((el) => {
        gsap.killTweensOf(el)
        el.remove()
      })
    }
  }, [opacity])

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[16] overflow-hidden"
      aria-hidden="true"
    />
  )
}
