import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Animated background with better gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Floating particles with better animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${25 + i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12 px-6 max-w-4xl">
        {/* Title section with improved effects */}
        <div className="space-y-6">
          <div className="inline-block relative">
            {/* Glow effect behind title */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/30 animate-pulse-slow"></div>
            
            <h1 
              className="relative text-7xl md:text-9xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]"
              style={{ 
                fontFamily: "'Marck Script', cursive",
                textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
              }}
            >
              Котигорошко
            </h1>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/60 animate-pulse-slow"></div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-amber-500/60 to-transparent"></div>
          </div>
          
          <p 
            className="text-3xl md:text-4xl text-amber-100/90 font-medium animate-fade-in-up"
            style={{ 
              fontFamily: "'Philosopher', sans-serif",
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            Українська народна казка
          </p>
        </div>

        {/* Description with better spacing */}
        <p 
          className="text-xl md:text-2xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ 
            fontFamily: "'Philosopher', sans-serif",
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          Зануртесь у чарівний світ давньої легенди про хороброго героя,
          <br className="hidden md:block" />
          який народився з магічної горошини
        </p>

        {/* Improved button */}
        <div 
          className="pt-6 animate-fade-in-up" 
          style={{ 
            animationDelay: '0.9s',
            opacity: 0,
          }}
        >
          <Link
            href="/scene/1"
            className="group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 px-12 py-6 text-xl md:text-2xl font-bold text-white shadow-2xl shadow-amber-900/60 transition-all duration-500 hover:scale-105 hover:shadow-amber-900/80 active:scale-95 bg-[length:200%_100%] hover:bg-[position:100%_0] overflow-hidden"
            style={{ fontFamily: "'Philosopher', sans-serif" }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10">Почати подорож</span>
            
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

        {/* Additional decorative element */}
        <div 
          className="pt-12 animate-fade-in-up" 
          style={{ 
            animationDelay: '1.2s',
            opacity: 0,
          }}
        >
          <div className="flex items-center justify-center gap-3 text-amber-400/70 text-base">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60"></div>
            <span style={{ fontFamily: "'Philosopher', sans-serif" }}>Інтерактивна історія</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60"></div>
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
    </main>
  )
}