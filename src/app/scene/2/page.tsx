'use client'

import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'
import { useEffect, useRef, useState } from 'react'

export default function Scene2Page() {
  const [textVisible, setTextVisible] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 900)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const root = parallaxRef.current
    if (!root || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frameId = 0

    const setVars = () => {
      root.style.setProperty('--parallax-x-s', `${current.x * 0.2}px`)
      root.style.setProperty('--parallax-y-s', `${current.y * 0.2}px`)
      root.style.setProperty('--parallax-x-m', `${current.x * 0.5}px`)
      root.style.setProperty('--parallax-y-m', `${current.y * 0.5}px`)
      root.style.setProperty('--parallax-x-l', `${current.x * 0.85}px`)
      root.style.setProperty('--parallax-y-l', `${current.y * 0.85}px`)
    }

    if (mediaQuery.matches) {
      setVars()
      return
    }

    const update = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      setVars()
      frameId = window.requestAnimationFrame(update)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      target.x = nx * 24
      target.y = ny * 16
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      const nx = touch.clientX / window.innerWidth - 0.5
      const ny = touch.clientY / window.innerHeight - 0.5
      target.x = nx * 18
      target.y = ny * 12
    }

    const handleReset = () => {
      target.x = 0
      target.y = 0
    }

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        handleReset()
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleReset)

    frameId = window.requestAnimationFrame(update)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleReset)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <SceneContainer>
      <div ref={parallaxRef} className="absolute inset-0 parallax-root">
        {/* Layered background */}
        <div className="absolute inset-0 parallax-layer-back z-0">
          <SceneLayer
            src="/scenes/scene-2/background.png"
            alt="Cielo y campos abiertos"
            className="animate-ken-burns"
            priority
          />
        </div>

        <div className="absolute inset-0 parallax-layer-mid z-10">
          <SceneLayer
            src="/scenes/scene-2/midground.png"
            alt="Colinas y trigo a media distancia"
            className="animate-fade-in-slow"
          />
        </div>

        <div className="absolute inset-0 parallax-layer-front z-20">
          <SceneLayer
            src="/scenes/scene-2/foreground.png"
            alt="Hierbas cercanas en primer plano"
            className="animate-fade-in-slow hover:scale-[1.01] transition-transform duration-1000 drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Warm overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120b07]/85 via-[#2a170b]/30 to-[#2a170b]/10 z-25 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,225,174,0.16),transparent_45%)] z-25 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,214,153,0.12),transparent_55%)] z-25 pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.55)_100%)] z-25"></div>

        {/* Scene indicator */}
        <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] left-[calc(1.5rem+env(safe-area-inset-left))] flex items-center gap-4 animate-fade-in z-40">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f4bc55]/30 blur-xl animate-pulse-slow"></div>
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#d29a5e]/50 to-[#e6b87a]/30 backdrop-blur-md border-2 border-[#f2d4a4]/40 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-[#fbe9c9]" style={{ fontFamily: "'Philosopher', sans-serif" }}>2</span>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-[#2a170b]/35 px-4 py-2 rounded-full border border-[#f2d4a4]/25">
            <span className="text-[#f7efe4]/90 text-sm font-medium" style={{ fontFamily: "'Philosopher', sans-serif" }}>
              Camino al campo
            </span>
          </div>
        </div>

        {/* Story text panel */}
        <div
          className={`story-panel-wrap absolute bottom-[calc(7rem+env(safe-area-inset-bottom))] md:bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-4 sm:left-8 sm:right-8 md:left-16 md:right-auto w-auto px-2 sm:px-4 transition-all duration-1000 z-30 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative">
            <div className="absolute -top-5 left-8 flex items-center gap-2">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f2d4a4]/70 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-[#f2d4a4]/80 animate-pulse-slow"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-[#f2d4a4]/70 to-transparent"></div>
            </div>

            <div className="relative story-panel p-6 md:p-8">
              <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-[#f8e2ba]/10 via-transparent to-[#f4bc55]/10 pointer-events-none"></div>

              <p
                className="relative story-text text-left text-[#f7efe4]/95 font-medium"
                style={{ fontFamily: "'Philosopher', sans-serif" }}
              >
                Un dia, seis de los hijos fueron al campo a trabajar.
                <br />
                <span className="text-[#f2d4a4]/85">El hermano menor se quedo en casa.</span>
              </p>
            </div>

            <div className="absolute -bottom-5 left-8 flex items-center gap-2">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f2d4a4]/70 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-[#f2d4a4]/80 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-[#f2d4a4]/70 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#1a0f08]/70 backdrop-blur-sm z-40">
          <div
            className="h-full bg-gradient-to-r from-[#d29a5e] via-[#f4bc55] to-[#d29a5e] shadow-lg shadow-black/40 animate-progress"
            style={{ width: '20%' }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={20}
            aria-label="Progreso de la historia"
          ></div>
        </div>

        {/* Next button */}
        <NextButton nextSceneId={3} />

        {/* Navigation hint */}
        <div className="absolute bottom-[calc(8rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] text-[#f2d4a4]/70 text-sm animate-bounce-slow z-20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

    </SceneContainer>
  )
}
