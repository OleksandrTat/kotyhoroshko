'use client'

import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'
import { useEffect, useState } from 'react'

export default function Scene1Page() {
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    // Mostrar texto con delay para efecto dramático
    const timer = setTimeout(() => setTextVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <SceneContainer>
      {/* Background */}
      <SceneLayer
        src="/scenes/scene-1/background.jpeg"
        alt="Інтерʼєр української хати"
        className="scale-105 animate-ken-burns"
      />

      {/* Overlay sutil para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>

      {/* Foreground (персонажі + стіл) */}
      <SceneLayer
        src="/scenes/scene-1/foreground.png"
        alt="Родина за столом"
        className="animate-fade-in-slow hover:scale-[1.02] transition-transform duration-700"
      />

      {/* Efectos de ambiente - rayos de luz */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent blur-xl animate-pulse-slow"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-amber-300/15 via-amber-300/3 to-transparent blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Indicador de escena */}
      <div className="absolute top-6 left-6 flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 flex items-center justify-center">
          <span className="text-amber-300 font-bold" style={{ fontFamily: "'Philosopher', sans-serif" }}>1</span>
        </div>
        <div className="text-amber-200/80 text-sm" style={{ fontFamily: "'Philosopher', sans-serif" }}>
          Початок історії
        </div>
      </div>

      {/* Текст сцены mejorado */}
      <div className={`absolute top-20 left-1/2 -translate-x-1/2 max-w-4xl w-full px-6 transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="relative">
          {/* Borde decorativo superior */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
          
          <div className="rounded-3xl bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border border-amber-400/20 shadow-2xl shadow-black/50 p-8">
            <p className="text-xl md:text-2xl leading-relaxed text-center text-amber-50"
               style={{ fontFamily: "'Philosopher', sans-serif" }}>
              Жили колись чоловік із жінкою.<br />
              І було в них семеро синів та одна дочка.
            </p>
          </div>
          
          {/* Borde decorativo inferior */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[10%] shadow-lg shadow-amber-500/50 animate-progress"></div>
      </div>

      {/* Kнопка переходу mejorada */}
      <NextButton nextSceneId={2} />

      {/* Hint de navegación */}
      <div className="absolute bottom-24 right-6 text-amber-300/60 text-sm animate-bounce-slow">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </SceneContainer>
  )
}