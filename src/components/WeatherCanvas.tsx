'use client'

import { useEffect, useRef } from 'react'

export type WeatherType = 'rain' | 'snow' | 'ash' | 'petals' | 'sparkles' | 'none'

type Props = {
  type: WeatherType
  intensity?: number
  color?: string
}

type Particle = {
  update: () => void
  draw: () => void
  isDead: () => boolean
  reset: () => void
}

export default function WeatherCanvas({ type, intensity = 0.5, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

    let animId = 0
    const clampedIntensity = Math.max(0, Math.min(intensity, 1))
    const count = Math.max(12, Math.floor(clampedIntensity * 180))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    class RainDrop implements Particle {
      x = Math.random() * canvas.width
      y = Math.random() * -canvas.height
      vx = -1.5 - Math.random() * 0.5
      vy = 14 + Math.random() * 8
      len = 14 + Math.random() * 20
      opacity = 0.4 + Math.random() * 0.5

      update() {
        this.x += this.vx
        this.y += this.vy
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.strokeStyle = color ?? 'rgba(174,210,255,0.6)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.vx * 2, this.y + this.len)
        ctx.stroke()
        ctx.restore()
      }

      isDead() {
        return this.y > canvas.height + 50
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -50
      }
    }

    class Snowflake implements Particle {
      r = 2 + Math.random() * 5
      phase = Math.random() * Math.PI * 2
      x = Math.random() * canvas.width
      y = Math.random() * canvas.height
      vy = 0.8 + Math.random() * 2
      vx = -0.5 + Math.random()

      update() {
        this.phase += 0.02
        this.x += Math.sin(this.phase) * 0.6 + this.vx
        this.y += this.vy
      }

      draw() {
        ctx.save()
        ctx.fillStyle = color ?? 'rgba(255,255,255,0.85)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.y > canvas.height + 20
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -20
      }
    }

    class Petal implements Particle {
      r = 5 + Math.random() * 9
      phase = Math.random() * Math.PI * 2
      x = Math.random() * canvas.width
      y = Math.random() * canvas.height
      vy = 0.6 + Math.random() * 1.2
      vx = -1 + Math.random() * 2
      rot = Math.random() * 360

      update() {
        this.phase += 0.025
        this.x += Math.sin(this.phase) * 1.2 + this.vx
        this.y += this.vy
        this.rot += 1.5
      }

      draw() {
        ctx.save()
        ctx.fillStyle = color ?? 'rgba(255,182,193,0.8)'
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rot * Math.PI) / 180)
        ctx.beginPath()
        ctx.ellipse(0, 0, this.r, this.r * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.y > canvas.height + 30
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -30
      }
    }

    class AshParticle implements Particle {
      r = 1.5 + Math.random() * 4
      x = Math.random() * canvas.width
      y = Math.random() * canvas.height
      vy = 0.5 + Math.random() * 1.5
      vx = -0.8 + Math.random() * 1.6
      rot = Math.random() * 360
      opacity = 0.3 + Math.random() * 0.5

      update() {
        this.x += this.vx
        this.y += this.vy
        this.rot += 1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = color ?? 'rgba(200,200,200,0.5)'
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rot * Math.PI) / 180)
        ctx.fillRect(-this.r / 2, -this.r / 2, this.r, this.r * 0.5)
        ctx.restore()
      }

      isDead() {
        return this.y > canvas.height + 20
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -20
      }
    }

    class Sparkle implements Particle {
      r = 2 + Math.random() * 4
      maxLife = 60 + Math.random() * 80
      life = 0
      x = Math.random() * canvas.width
      y = Math.random() * canvas.height
      vy = -0.5 - Math.random() * 1

      update() {
        this.y += this.vy
        this.life += 1
      }

      draw() {
        const alpha = Math.sin((this.life / this.maxLife) * Math.PI)
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = color ?? 'rgba(244,188,85,0.9)'
        ctx.shadowBlur = 10
        ctx.shadowColor = color ?? 'rgba(244,188,85,0.9)'
        ctx.beginPath()
        for (let i = 0; i < 4; i += 1) {
          const angle = (i * Math.PI) / 2
          ctx.lineTo(this.x + Math.cos(angle) * this.r, this.y + Math.sin(angle) * this.r)
          ctx.lineTo(
            this.x + Math.cos(angle + Math.PI / 4) * this.r * 0.4,
            this.y + Math.sin(angle + Math.PI / 4) * this.r * 0.4,
          )
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.life >= this.maxLife
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.life = 0
      }
    }

    const spawn = (): Particle => {
      switch (type) {
        case 'rain':
          return new RainDrop()
        case 'snow':
          return new Snowflake()
        case 'petals':
          return new Petal()
        case 'ash':
          return new AshParticle()
        default:
          return new Sparkle()
      }
    }

    const particles = Array.from({ length: count }, spawn)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
        if (particle.isDead()) {
          particle.reset()
        }
      })
      animId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [type, intensity, color])

  if (type === 'none') {
    return null
  }

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full pointer-events-none" aria-hidden="true" />
}
