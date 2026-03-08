'use client'

import { useEffect, useState } from 'react'

export function SceneTransition() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 1100)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      <div className="animate-veil-out absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,28,16,0.92),rgba(10,7,4,0.98))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(var(--color-accent),0.08),transparent_55%)]" />
    </div>
  )
}
