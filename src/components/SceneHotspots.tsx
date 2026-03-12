'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import type { SceneHotspot } from '@/content/scenes'

export default function SceneHotspots({
  hotspots,
  onActivate,
}: {
  hotspots: SceneHotspot[]
  onActivate?: (index: number, el: HTMLButtonElement) => void
}) {
  const refsMap = useRef<Map<number, HTMLButtonElement>>(new Map())

  const handleTap = (index: number) => {
    const el = refsMap.current.get(index)
    if (!el) return

    gsap.timeline()
      .to(el, { scale: 1.6, duration: 0.15, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1.5, 0.4)' })

    spawnSparkles(el)
    onActivate?.(index, el)

    if ('vibrate' in navigator) navigator.vibrate(30)
  }

  return (
    <>
      {hotspots.map((spot, i) => (
        <button
          key={i}
          ref={(el) => { if (el) refsMap.current.set(i, el) }}
          type="button"
          onClick={() => handleTap(i)}
          aria-label={spot.tooltip ?? 'Торкнись мене!'}
          data-cursor="hotspot"
          style={{
            position: 'absolute',
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '2.8rem',
            lineHeight: 1,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            minWidth: '56px',
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'hotspotPulse 2.5s ease-in-out infinite',
            filter: 'drop-shadow(0 0 8px rgba(255,200,80,0.6))',
            zIndex: 20,
          }}
        >
          {spot.icon}
        </button>
      ))}
    </>
  )
}

function spawnSparkles(origin: HTMLElement) {
  const rect = origin.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const emojis = ['?', '?', '??', '??']

  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div')
    el.textContent = emojis[i % emojis.length]
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      font-size:${22 + Math.random() * 14}px;
      pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
    `
    document.body.appendChild(el)
    gsap.to(el, {
      x: -60 + Math.random() * 120,
      y: -70 - Math.random() * 80,
      opacity: 0,
      scale: 0.4,
      duration: 0.9 + Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    })
  }
}
