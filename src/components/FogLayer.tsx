'use client'

type FogDensity = 'light' | 'medium' | 'heavy'

type Props = {
  density?: FogDensity
  color?: string
}

const DENSITY_LEVELS: Record<FogDensity, [number, number, number]> = {
  light: [0.12, 0.08, 0.06],
  medium: [0.22, 0.16, 0.11],
  heavy: [0.38, 0.28, 0.2],
}

export default function FogLayer({ density = 'medium', color = '220,210,200' }: Props) {
  const opacity = DENSITY_LEVELS[density]

  return (
    <div className="absolute inset-0 pointer-events-none z-[12] overflow-hidden" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 200% 60% at 20% 80%, rgba(${color},${opacity[0]}) 50%, transparent)`,
          animation: 'fogDrift1 28s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 180% 50% at 80% 70%, rgba(${color},${opacity[1]}) 50%, transparent)`,
          animation: 'fogDrift2 18s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-20%',
          right: '-20%',
          height: '35%',
          background: `linear-gradient(to top, rgba(${color},${opacity[2]}), transparent)`,
          animation: 'fogDrift3 12s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}
