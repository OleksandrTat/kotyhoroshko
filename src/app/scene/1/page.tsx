'use client'

import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'
import { useEffect, useState } from 'react'

export default function Scene1Page() {
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <SceneContainer>
      {/* Background Layer */}
      <SceneLayer
        src="/scenes/scene-1/background.jpeg"
        alt="Інтер'єр української хати"
        className="scale-110 animate-ken-burns"
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50"></div>

      {/* Foreground Layer (characters + table) */}
      <SceneLayer
        src="/scenes/scene-1/foreground.png"
        alt="Родина за столом"
        className="animate-fade-in-slow hover:scale-[1.01] transition-transform duration-1000"
      />

      {/* Atmospheric light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-amber-400/30 via-amber-400/10 to-transparent blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-0 right-1/3 w-2 h-full bg-gradient-to-b from-yellow-300/20 via-yellow-300/5 to-transparent blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scene indicator badge */}
      <div className="absolute top-8 left-8 flex items-center gap-4 animate-fade-in z-20">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/30 blur-xl animate-pulse-slow"></div>
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 backdrop-blur-md border-2 border-amber-400/40 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-amber-300" style={{ fontFamily: "'Philosopher', sans-serif" }}>1</span>
          </div>
        </div>
        <div className="backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-amber-400/20">
          <span className="text-amber-200/90 text-sm font-medium" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            Початок історії
          </span>
        </div>
      </div>

      {/* Story text panel */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full px-6 transition-all duration-1000 z-10 ${
          textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative">
          {/* Top decorative border */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400/70 animate-pulse-slow"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent via-amber-400/70 to-transparent"></div>
          </div>
          
          {/* Text container */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-purple-950/95 to-slate-900/95 backdrop-blur-2xl border-2 border-amber-400/30 shadow-2xl shadow-black/60 p-10 md:p-12">
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
            
            <p 
              className="relative text-2xl md:text-3xl leading-relaxed text-center text-amber-50/95 font-medium"
              style={{ fontFamily: "'Philosopher', sans-serif" }}
            >
              Жили колись чоловік із жінкою.
              <br />
              <span className="text-amber-200/80">І було в них семеро синів та одна дочка.</span>
            </p>
          </div>
          
          {/* Bottom decorative border */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400/70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent via-amber-400/70 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50 backdrop-blur-sm z-20">
        <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg shadow-amber-500/50 animate-progress" style={{ width: '10%' }}></div>
      </div>

      {/* Next button */}
      <NextButton nextSceneId={2} />

      {/* Navigation hint */}
      <div className="absolute bottom-32 right-8 text-amber-300/60 text-sm animate-bounce-slow z-20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </SceneContainer>
  )
}