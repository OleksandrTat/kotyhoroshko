'use client'

import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'
import { useEffect, useState } from 'react'

export default function Scene1Page() {
  const [textVisible, setTextVisible] = useState(false)
  const [useVideo, setUseVideo] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setUseVideo(!mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <SceneContainer>
      {/* Background Layer */}
      {useVideo ? (
        <SceneLayer
          media="video"
          src="/scenes/scene-1/video.mp4"
          poster="/scenes/scene-1/background.jpeg"
          alt="Interior de una casa ucraniana"
          className="scale-[1.03] animate-fade-in-slow z-0"
          priority
        />
      ) : (
        <SceneLayer
          src="/scenes/scene-1/background.jpeg"
          alt="Interior de una casa ucraniana"
          className="scale-110 animate-ken-burns z-0"
          priority
        />
      )}

      {/* Warm overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120b07]/85 via-[#2a170b]/35 to-[#2a170b]/10 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,225,174,0.16),transparent_45%)] z-10"></div>

      {/* Foreground Layer (characters + table) */}
      <SceneLayer
        src="/scenes/scene-1/foreground.png"
        alt="Familia alrededor de la mesa"
        className="animate-fade-in-slow hover:scale-[1.01] transition-transform duration-1000 drop-shadow-[0_25px_55px_rgba(0,0,0,0.55)] z-20"
      />

      {/* Soft light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-35 z-10">
        <div className="absolute top-0 left-1/4 w-1.5 h-full bg-gradient-to-b from-[#f8e2ba]/25 via-[#f8e2ba]/10 to-transparent blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-0 right-1/3 w-1.5 h-full bg-gradient-to-b from-[#f4bc55]/20 via-[#f4bc55]/5 to-transparent blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scene indicator badge */}
      <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] left-[calc(1.5rem+env(safe-area-inset-left))] flex items-center gap-4 animate-fade-in z-40">
        <div className="relative">
          <div className="absolute inset-0 bg-[#f4bc55]/30 blur-xl animate-pulse-slow"></div>
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#d29a5e]/50 to-[#e6b87a]/30 backdrop-blur-md border-2 border-[#f2d4a4]/40 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-[#fbe9c9]" style={{ fontFamily: "'Philosopher', sans-serif" }}>1</span>
          </div>
        </div>
        <div className="backdrop-blur-sm bg-[#2a170b]/35 px-4 py-2 rounded-full border border-[#f2d4a4]/25">
          <span className="text-[#f7efe4]/90 text-sm font-medium" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            Inicio de la historia
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
              Erase una vez un hombre y su esposa.
              <br />
              <span className="text-[#f2d4a4]/85">Tuvieron siete hijos y una hija.</span>
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
          style={{ width: '10%' }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={10}
          aria-label="Progreso de la historia"
        ></div>
      </div>

      {/* Next button */}
      <NextButton nextSceneId={2} />

      {/* Navigation hint */}
      <div className="absolute bottom-[calc(8rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] text-[#f2d4a4]/70 text-sm animate-bounce-slow z-20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </SceneContainer>
  )
}
