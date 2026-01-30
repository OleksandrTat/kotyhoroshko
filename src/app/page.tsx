import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
        {/* Título con efecto de brillo */}
        <div className="space-y-4">
          <div className="inline-block">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                style={{ fontFamily: "'Marck Script', cursive" }}>
              Котигорошко
            </h1>
          </div>
          
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse-slow"></div>
          
          <p className="text-2xl md:text-3xl text-amber-100/90 animate-fade-in-up"
             style={{ fontFamily: "'Philosopher', sans-serif", animationDelay: '0.3s' }}>
            Українська народна казка
          </p>
        </div>

        {/* Descripción */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
           style={{ fontFamily: "'Philosopher', sans-serif", animationDelay: '0.6s' }}>
          Зануртесь у чарівний світ давньої легенди про хороброго героя,
          який народився з магічної горошини
        </p>

        {/* Botón principal mejorado */}
        <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Link
            href="/scene/1"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-10 py-5 text-xl font-semibold text-white shadow-2xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 hover:shadow-amber-900/70 active:scale-95"
            style={{ fontFamily: "'Philosopher', sans-serif" }}
          >
            <span className="relative z-10">Почати подорож</span>
            <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            {/* Efecto de brillo */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </Link>
        </div>

        {/* Decoración adicional */}
        <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center justify-center gap-2 text-amber-400/60 text-sm">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60"></div>
            <span style={{ fontFamily: "'Philosopher', sans-serif" }}>Інтерактивна історія</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60"></div>
          </div>
        </div>
      </div>

      {/* Viñeta en los bordes */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
    </main>
  )
}