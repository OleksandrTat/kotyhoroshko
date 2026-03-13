'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'

export function WindEffect() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Salida temprana si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const leaves: HTMLDivElement[] = []
    const leafCount = 18
    const leafEmojis = ['🍃', '🍂', '🍁']

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('div')
      leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)]
      leaf.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 14 + 10}px;
        left: ${Math.random() * 10 - 10}%;
        top: ${Math.random() * 80 + 5}%;
        opacity: 0;
        will-change: transform;
      `
      container.appendChild(leaf)
      leaves.push(leaf)

      gsap.to(leaf, {
        x: `${110 + Math.random() * 30}vw`,
        y: `${(Math.random() - 0.5) * 200}px`,
        rotation: Math.random() * 720 - 360,
        opacity: gsap.utils.random(0.4, 0.8),
        duration: Math.random() * 3 + 2.5,
        delay: Math.random() * 4,
        ease: 'power1.inOut',
        repeat: -1,
        repeatDelay: Math.random() * 2,
        onRepeat() {
          gsap.set(leaf, {
            x: 0,
            y: 0,
            opacity: 0,
            top: `${Math.random() * 80 + 5}%`,
          })
        },
      })
    }

    return () => {
      leaves.forEach((l) => {
        gsap.killTweensOf(l)
        l.remove()
      })
    }
  }, [])

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
