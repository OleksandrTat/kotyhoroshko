'use client'

import { useMemo } from 'react'

type Firefly = {
  id: number
  size: number
  x: number
  y: number
  duration: number
  glowDuration: number
  delay: number
}

export default function FirefliesLayer({ count = 12 }: { count?: number }) {
  const fireflies = useMemo<Firefly[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        size: 4 + Math.random() * 6,
        x: 5 + Math.random() * 90,
        y: 10 + Math.random() * 80,
        duration: 4 + Math.random() * 6,
        glowDuration: 1.5 + Math.random() * 2,
        delay: Math.random() * 5,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 pointer-events-none z-[14]" aria-hidden="true">
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          style={{
            position: 'absolute',
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            width: firefly.size,
            height: firefly.size,
            borderRadius: '50%',
            background: '#b4ffb4',
            animation: `fireflyMove ${firefly.duration}s ease-in-out ${firefly.delay}s infinite, fireflyGlow ${firefly.glowDuration}s ease-in-out ${firefly.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
