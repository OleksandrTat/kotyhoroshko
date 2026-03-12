'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LEAF_SHAPES = ['🍃', '🍂', '🍁', '🌿']

export default function WindLayer({ active = true }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) {
      return
    }

    const container = containerRef.current

    const spawnLeaf = () => {
      const leaf = document.createElement('span')
      leaf.textContent = LEAF_SHAPES[Math.floor(Math.random() * LEAF_SHAPES.length)]
      leaf.style.cssText = `
        position: absolute;
        font-size: ${14 + Math.random() * 18}px;
        top: ${10 + Math.random() * 80}%;
        left: -60px;
        opacity: 0;
        pointer-events: none;
        user-select: none;
      `
      container.appendChild(leaf)

      gsap.to(leaf, {
        x: window.innerWidth + 140,
        y: `${-30 + Math.random() * 60}%`,
        rotation: Math.random() * 720 - 360,
        opacity: 0.85,
        duration: 3 + Math.random() * 4,
        ease: 'power1.inOut',
        onComplete: () => leaf.remove(),
      })
    }

    const intervalId = window.setInterval(spawnLeaf, 600 + Math.random() * 800)
    return () => window.clearInterval(intervalId)
  }, [active])

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[13] overflow-hidden" aria-hidden="true" />
}
