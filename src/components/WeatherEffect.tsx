'use client'

import { useEffect, useRef } from 'react'

type WeatherType = 'rain' | 'snow' | 'none'
type WeatherIntensity = 'light' | 'medium' | 'heavy'

interface Props {
  type: WeatherType
  intensity?: WeatherIntensity
}

const COUNTS: Record<WeatherIntensity, number> = { light: 40, medium: 80, heavy: 150 }

export default function WeatherEffect({ type, intensity = 'medium' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (type === 'none') {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const isMobile = window.innerWidth < 768
    const count = COUNTS[intensity]
    const actualCount = isMobile ? Math.floor(count * 0.5) : count

    const particles = Array.from({ length: actualCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: type === 'rain' ? (Math.random() - 0.5) * 1.5 : (Math.random() - 0.5) * 0.4,
      vy: type === 'rain' ? 8 + Math.random() * 6 : 0.8 + Math.random() * 1.2,
      size: type === 'rain' ? 1 + Math.random() * 0.5 : 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      length: type === 'rain' ? 12 + Math.random() * 8 : 0,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity

        if (type === 'rain') {
          ctx.strokeStyle = 'rgba(180, 210, 255, 1)'
          ctx.lineWidth = particle.size
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x + particle.vx * 2, particle.y + particle.length)
          ctx.stroke()
        } else {
          ctx.fillStyle = 'rgba(240, 248, 255, 1)'
          ctx.shadowBlur = 4
          ctx.shadowColor = 'rgba(200, 230, 255, 0.8)'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()

        particle.x += particle.vx
        particle.y += particle.vy

        if (type === 'snow') {
          particle.vx += (Math.random() - 0.5) * 0.05
          particle.vx = Math.max(-1, Math.min(1, particle.vx))
        }

        if (particle.y > canvas.height) {
          particle.y = -10
          particle.x = Math.random() * canvas.width
        }
        if (particle.x > canvas.width) {
          particle.x = 0
        }
        if (particle.x < 0) {
          particle.x = canvas.width
        }
      })

      animRef.current = window.requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [intensity, type])

  if (type === 'none') {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  )
}
