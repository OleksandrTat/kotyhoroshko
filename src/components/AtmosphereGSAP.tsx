'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
  type: 'fog' | 'mist' | 'wind' | 'embers' | 'rain' | 'magic' | 'starlight'
}

export function AtmosphereGSAP({ type }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ''
    const ctx = gsap.context(() => {
      if (type === 'fog' || type === 'mist') {
        for (let i = 0; i < 4; i++) {
          const fog = document.createElement('div')
          fog.style.cssText = `
            position:absolute;
            width:160%;
            height:${30 + i * 15}%;
            bottom:${i * 8}%;
            left:-30%;
            background:radial-gradient(ellipse 80% 60% at 50% 100%,
              rgba(220,215,205,${0.12 + i * 0.04}) 40%, transparent 80%);
            pointer-events:none;
            border-radius:50%;
          `
          el.appendChild(fog)
          gsap.to(fog, {
            x: `${i % 2 === 0 ? '+' : '-'}=8%`,
            scaleY: 1.1 + i * 0.05,
            duration: 12 + i * 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 1.5,
          })
        }
      }

      if (type === 'wind') {
        for (let i = 0; i < 8; i++) {
          const line = document.createElement('div')
          const y = 20 + Math.random() * 60
          line.style.cssText = `
            position:absolute;
            width:${20 + Math.random() * 30}%;
            height:2px;
            top:${y}%;
            left:-40%;
            background:linear-gradient(to right,
              transparent, rgba(255,240,200,0.6), transparent);
            border-radius:9999px;
            pointer-events:none;
          `
          el.appendChild(line)
          gsap.to(line, {
            x: '160vw',
            duration: 1.5 + Math.random() * 2,
            repeat: -1,
            delay: Math.random() * 3,
            ease: 'none',
          })
        }
      }

      if (type === 'embers') {
        for (let i = 0; i < 14; i++) {
          const ember = document.createElement('div')
          const size = 4 + Math.random() * 6
          ember.style.cssText = `
            position:absolute;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background:radial-gradient(circle,
              rgba(255,220,120,0.95), rgba(255,120,60,0.4) 60%, transparent 80%);
            left:${10 + Math.random() * 80}%;
            bottom:${10 + Math.random() * 40}%;
            pointer-events:none;
          `
          el.appendChild(ember)
          gsap.to(ember, {
            y: -(80 + Math.random() * 120),
            x: -20 + Math.random() * 40,
            opacity: 0,
            scale: 0.4,
            duration: 2 + Math.random() * 3,
            repeat: -1,
            delay: Math.random() * 4,
            ease: 'power1.out',
          })
        }
      }

      if (type === 'magic' || type === 'starlight') {
        for (let i = 0; i < 12; i++) {
          const star = document.createElement('div')
          const size = 6 + Math.random() * 10
          star.style.cssText = `
            position:absolute;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background:radial-gradient(circle,
              rgba(200,255,210,0.95), rgba(150,230,160,0.4) 60%, transparent 80%);
            left:${5 + Math.random() * 90}%;
            top:${5 + Math.random() * 85}%;
            pointer-events:none;
            box-shadow:0 0 ${size}px rgba(180,255,190,0.4);
          `
          el.appendChild(star)
          gsap.to(star, {
            y: -20 + Math.random() * 40,
            x: -15 + Math.random() * 30,
            opacity: 0,
            scale: 1.5,
            duration: 2.5 + Math.random() * 2.5,
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 5,
            ease: 'sine.inOut',
          })
        }
      }
    }, el)

    return () => ctx.revert()
  }, [type])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[8] overflow-hidden"
      aria-hidden="true"
    />
  )
}
