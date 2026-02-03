'use client'

import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'
import { useEffect, useState } from 'react'

export default function Scene2Page() {
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <SceneContainer>
      {/* Single background image */}
      <SceneLayer
        src="/scenes/scene-2/img.jpeg"
        alt="Campo abierto con cielo y luz suave"
        className="scale-[1.02] animate-ken-burns"
        priority
      />

      {/* Warm overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120b07]/80 via-[#2a170b]/30 to-[#2a170b]/10 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,225,174,0.14),transparent_45%)] z-10"></div>

      {/* Scene indicator */}
      <div className="absolute top-8 left-8 flex items-center gap-4 animate-fade-in z-40">
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
        className={`absolute bottom-24 left-12 right-12 md:left-16 md:right-auto md:max-w-2xl w-auto px-4 transition-all duration-1000 z-30 ${
          textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative">
          <div className="absolute -top-5 left-8 flex items-center gap-2">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f2d4a4]/70 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-[#f2d4a4]/80 animate-pulse-slow"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-[#f2d4a4]/70 to-transparent"></div>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-br from-[#2a170b]/90 via-[#1f1209]/92 to-[#2a170b]/90 backdrop-blur-xl border border-[#f2d4a4]/25 shadow-2xl shadow-black/70 p-6 md:p-8">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f8e2ba]/10 via-transparent to-[#f4bc55]/10 pointer-events-none"></div>

            <p
              className="relative text-xl md:text-2xl leading-relaxed text-left text-[#f7efe4]/95 font-medium"
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
        ></div>
      </div>

      {/* Next button */}
      <NextButton nextSceneId={3} />

      {/* Navigation hint */}
      <div className="absolute bottom-32 right-8 text-[#f2d4a4]/70 text-sm animate-bounce-slow z-20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </SceneContainer>
  )
}
