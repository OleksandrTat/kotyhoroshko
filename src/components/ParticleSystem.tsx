'use client'

import React, { useEffect, useRef } from 'react'

type Particle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
}

const CELL_SIZE = 150

export const ParticleSystem = React.memo(function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const particles: Particle[] = []
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 20 : 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 30, // 30-90 (yellow-orange range)
      })
    }

    // Animation loop
    let animationFrameId = 0
    let isAnimating = true

    const getCellKey = (x: number, y: number) => `${Math.floor(x / CELL_SIZE)},${Math.floor(y / CELL_SIZE)}`

    const animate = () => {
      if (!isAnimating) {
        return
      }

      const grid = new Map<string, Particle[]>()
      const drawnPairs = new Set<string>()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = performance.now() * 0.001

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Pulse opacity
        particle.opacity = Math.sin(now + i) * 0.3 + 0.4

        // Draw particle
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = getCellKey(particle.x + dx * CELL_SIZE, particle.y + dy * CELL_SIZE)
            const bucket = grid.get(key)
            if (bucket) {
              bucket.push(particle)
            } else {
              grid.set(key, [particle])
            }
          }
        }
      })

      grid.forEach((bucket) => {
        for (let i = 0; i < bucket.length; i++) {
          const particle = bucket[i]
          for (let j = i + 1; j < bucket.length; j++) {
            const other = bucket[j]
            const pairKey = particle.id < other.id ? `${particle.id}-${other.id}` : `${other.id}-${particle.id}`
            if (drawnPairs.has(pairKey)) {
              continue
            }
            drawnPairs.add(pairKey)

            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < CELL_SIZE) {
              ctx.beginPath()
              ctx.strokeStyle = `hsla(${particle.hue}, 100%, 60%, ${0.1 * (1 - distance / CELL_SIZE)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleVisibility = () => {
      if (document.hidden) {
        isAnimating = false
        cancelAnimationFrame(animationFrameId)
        return
      }

      if (!isAnimating) {
        isAnimating = true
        animate()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      isAnimating = false
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  )
})
