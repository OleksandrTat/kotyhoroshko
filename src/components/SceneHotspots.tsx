'use client'

import { useState } from 'react'
import type { SceneHotspot } from '@/content/scenes'

export default function SceneHotspots({
  hotspots,
  onActivate,
}: {
  hotspots: SceneHotspot[]
  onActivate?: (index: number, element: HTMLButtonElement) => void
}) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      {hotspots.map((hotspot, index) => (
        <button
          key={`${hotspot.icon}-${hotspot.x}-${hotspot.y}-${index}`}
          onClick={(event) => {
            setActive(index)
            onActivate?.(index, event.currentTarget)
            window.setTimeout(() => setActive(null), 800)
          }}
          style={{
            position: 'absolute',
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: active === index ? '2.5rem' : '1.8rem',
            transition: 'font-size 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter:
              active === index
                ? 'drop-shadow(0 0 12px rgba(255,220,100,0.9))'
                : 'drop-shadow(0 0 4px rgba(255,200,80,0.4))',
            zIndex: 20,
            animation: active === index ? 'none' : 'hotspotPulse 3s ease-in-out infinite',
          }}
          aria-label={hotspot.tooltip ?? 'Interacción'}
          title={hotspot.tooltip}
          data-interactive="true"
          type="button"
        >
          {hotspot.icon}
        </button>
      ))}
    </>
  )
}
