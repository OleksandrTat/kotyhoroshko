'use client'

import { useEffect, useState } from 'react'

export function SceneTransition() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,28,16,0.95),rgba(12,8,5,0.98))] animate-veil-out"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,225,174,0.08),transparent_55%)]"></div>
    </div>
  )
}
