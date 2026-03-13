'use client'

import { useEffect, useRef } from 'react'

/**
 * ConfettiEffect — explosión de confeti al completar un minijuego.
 * Se monta, anima y se desmonta automáticamente en `durationMs` ms.
 *
 * Uso:
 *   {isDone && <ConfettiEffect />}
 */

type ConfettiPiece = {
  x:       number
  y:       number
  vx:      number
  vy:      number
  size:    number
  color:   string
  rotation: number
  rotSpeed: number
  gravity: number
  opacity: number
}

const COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF',
  '#5F27CD', '#FF9F43',
]

const PARTICLE_COUNT = 80

export function ConfettiEffect({ durationMs = 2200 }: { durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Crear partículas desde el centro-arriba
    const pieces: ConfettiPiece[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:        canvas.width  * (0.3 + Math.random() * 0.4),
      y:        canvas.height * 0.15,
      vx:       (Math.random() - 0.5) * 12,
      vy:       -(Math.random() * 10 + 4),
      size:     Math.random() * 8 + 4,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity:  0.35 + Math.random() * 0.2,
      opacity:  1,
    }))

    let rafId = 0
    const startTime = performance.now()

    const draw = (now: number) => {
      const elapsed = now - startTime
      const fadeStart = durationMs * 0.65

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of pieces) {
        p.x       += p.vx
        p.vy      += p.gravity
        p.y       += p.vy
        p.rotation += p.rotSpeed
        p.vx      *= 0.99

        // Fade out al final
        if (elapsed > fadeStart) {
          p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (durationMs * 0.35))
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(draw)
      }
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [durationMs])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[200] h-full w-full"
      aria-hidden="true"
    />
  )
}