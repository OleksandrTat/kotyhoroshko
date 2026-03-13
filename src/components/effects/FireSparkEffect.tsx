'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'

export function FireSparkEffect() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Salida temprana si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sparks: HTMLDivElement[] = []
    const sparkCount = 30

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div')
      const size = Math.random() * 6 + 3
      spark.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #fff9c4, #ff6b00);
        border-radius: 50%;
        bottom: 0;
        left: ${Math.random() * 100}%;
        opacity: 0;
        filter: blur(1px);
      `
      container.appendChild(spark)
      sparks.push(spark)

      gsap.to(spark, {
        y: -(Math.random() * window.innerHeight * 0.6 + 100),
        x: (Math.random() - 0.5) * 200,
        opacity: gsap.utils.random(0.6, 1),
        duration: Math.random() * 1.5 + 1,
        delay: Math.random() * 3,
        ease: 'power2.out',
        repeat: -1,
        repeatDelay: Math.random() * 1.5,
        onRepeat() {
          gsap.set(spark, {
            y: 0,
            x: 0,
            opacity: 0,
            left: `${Math.random() * 100}%`,
          })
        },
      })
    }

    return () => {
      sparks.forEach((s) => {
        gsap.killTweensOf(s)
        s.remove()
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
