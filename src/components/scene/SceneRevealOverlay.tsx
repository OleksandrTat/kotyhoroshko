import type { SceneTheme } from '@/content/scenes'

// Each theme has a base background and a soft center glow.
const THEME_COLORS: Record<SceneTheme, { bg: string; glow: string }> = {
  hearth: { bg: 'rgba(24,10,3,0.98)', glow: 'rgba(244,188,85,0.14)' },
  field: { bg: 'rgba(6,18,4,0.98)', glow: 'rgba(100,180,60,0.1)' },
  forest: { bg: 'rgba(3,16,7,0.98)', glow: 'rgba(60,140,80,0.1)' },
  dragon: { bg: 'rgba(22,3,3,0.98)', glow: 'rgba(200,55,25,0.16)' },
  dungeon: { bg: 'rgba(3,5,16,0.98)', glow: 'rgba(70,90,170,0.1)' },
  wonder: { bg: 'rgba(6,8,26,0.98)', glow: 'rgba(170,120,255,0.16)' },
  forge: { bg: 'rgba(26,7,2,0.98)', glow: 'rgba(255,90,15,0.18)' },
  sky: { bg: 'rgba(4,10,24,0.98)', glow: 'rgba(55,115,215,0.13)' },
  trail: { bg: 'rgba(14,10,4,0.98)', glow: 'rgba(130,95,45,0.1)' },
  duel: { bg: 'rgba(18,3,3,0.98)', glow: 'rgba(170,25,25,0.16)' },
  escape: { bg: 'rgba(10,14,4,0.98)', glow: 'rgba(95,155,55,0.1)' },
}

export function SceneRevealOverlay({ theme }: { theme: SceneTheme }) {
  const { bg, glow } = THEME_COLORS[theme]

  return (
    <div
      data-gsap="reveal-overlay"
      className="pointer-events-none absolute inset-0 z-[75]"
      aria-hidden="true"
      style={{ background: bg }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,225,174,0.1) 1px, transparent 1px)',
          backgroundSize: '5px 5px',
        }}
      />
    </div>
  )
}
