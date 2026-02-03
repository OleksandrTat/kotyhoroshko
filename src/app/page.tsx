'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)

  const handleStart = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isExiting) return
    setIsExiting(true)
    setTimeout(() => {
      router.push('/scene/1')
    }, 520)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#120b07]">
      {/* Warm dusk glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a170b] via-[#120b07] to-black"></div>
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,225,174,0.25),transparent_60%)] blur-2xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,188,85,0.18),transparent_55%)]"></div>
      </div>

      {/* Soft hills silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh]">
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] bg-[#2a170b]"
          style={{
            clipPath:
              'polygon(0 100%, 0 60%, 6% 56%, 12% 62%, 20% 52%, 28% 64%, 36% 55%, 44% 65%, 52% 54%, 60% 66%, 68% 56%, 76% 64%, 84% 54%, 92% 60%, 100% 56%, 100% 100%)',
          }}
        ></div>
        <div
          className="absolute inset-x-0 bottom-0 h-[45%] bg-[#1d1209]"
          style={{
            clipPath:
              'polygon(0 100%, 0 70%, 8% 68%, 16% 74%, 24% 66%, 32% 76%, 40% 68%, 48% 78%, 56% 66%, 64% 78%, 72% 68%, 80% 76%, 88% 70%, 96% 74%, 100% 68%, 100% 100%)',
          }}
        ></div>
      </div>

      {/* Candle mist */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,188,85,0.12),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#1a1009]/60 to-transparent"></div>
        <div className="absolute bottom-6 left-1/4 h-24 w-72 rounded-full bg-[#f2c98a]/15 blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-1/4 h-20 w-64 rounded-full bg-[#f2c98a]/10 blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-10 px-6 max-w-5xl">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-4 rounded-full border border-[#f2d4a4]/30 bg-[#2a170b]/50 px-6 py-2 text-[#f7efe4]/90 shadow-lg shadow-black/40">
            <span className="text-sm tracking-[0.3em] uppercase">Cuento al calor del hogar</span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#fce8c8] via-[#f4bc55] to-[#fce8c8] bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]"
            style={{
              fontFamily: "'Marck Script', cursive",
              textShadow: '0 0 40px rgba(244, 188, 85, 0.25)',
            }}
          >
            Kotyhoroshko
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#f2d4a4]/70 to-transparent"></div>
            <div className="w-3 h-3 rotate-45 bg-[#f2d4a4]/80 shadow-sm shadow-[#f2d4a4]/40"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-[#f2d4a4]/70 to-transparent"></div>
          </div>

          <p
            className="text-2xl md:text-3xl text-[#f7efe4]/90 font-medium animate-fade-in-up"
            style={{
              fontFamily: "'Philosopher', sans-serif",
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            Un cuento popular ucraniano, contado con luz suave y corazón cálido
          </p>
        </div>

        <p
          className="text-lg md:text-xl text-[#f1e4d3]/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
          style={{
            fontFamily: "'Philosopher', sans-serif",
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          Entra en una historia de hogares sencillos, caminos de trigo y un héroe nacido de una
          semilla mágica. Todo empieza con un silencio que se transforma en destino.
        </p>

        <div
          className="pt-4 animate-fade-in-up"
          style={{
            animationDelay: '0.9s',
            opacity: 0,
          }}
        >
          <Link
            href="/scene/1"
            onClick={handleStart}
            className="group relative inline-flex items-center gap-4 rounded-xl border border-[#f2d4a4]/40 bg-gradient-to-r from-[#d29a5e] via-[#e6b87a] to-[#d29a5e] px-10 py-5 text-xl md:text-2xl font-bold text-[#2a170b] shadow-2xl shadow-black/60 transition-all duration-500 hover:scale-[1.03] hover:border-[#f9e1b5]/80 overflow-hidden"
            style={{ fontFamily: "'Philosopher', sans-serif" }}
          >
            <span className="absolute inset-0 rounded-xl bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000"></span>
            <span className="relative z-10">Abrir el portal</span>
            <svg
              className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div
          className="pt-8 animate-fade-in-up"
          style={{
            animationDelay: '1.2s',
            opacity: 0,
          }}
        >
          <div className="inline-flex items-center gap-3 text-[#f2d4a4]/70 text-sm tracking-widest uppercase">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#f2d4a4]/60"></span>
            Historia interactiva
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#f2d4a4]/60"></span>
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.65)_100%)]"></div>

      {isExiting ? (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,28,16,0.95),rgba(12,8,5,0.98))] animate-veil-in"></div>
        </div>
      ) : null}
    </main>
  )
}
