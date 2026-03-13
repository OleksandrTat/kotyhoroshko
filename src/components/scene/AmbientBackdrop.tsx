import React from 'react'
import type { SceneTheme } from '@/content/scenes'

const THEME_STYLES: Record<
  SceneTheme,
  { base: string; glowA: string; glowB: string; veil: string }
> = {
  hearth: {
    base: 'bg-[linear-gradient(180deg,#28170f_0%,#140d08_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_22%_20%,rgba(244,188,85,0.34),transparent_42%)]',
    glowB: 'bg-[radial-gradient(circle_at_78%_78%,rgba(214,134,76,0.2),transparent_48%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.72)_100%)]',
  },
  field: {
    base: 'bg-[linear-gradient(180deg,#1b1e16_0%,#0d110d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_12%,rgba(255,215,128,0.22),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_18%_78%,rgba(122,89,44,0.28),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(2,3,1,0.7)_100%)]',
  },
  forest: {
    base: 'bg-[linear-gradient(180deg,#122018_0%,#09120d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_18%_24%,rgba(109,151,102,0.24),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_80%_74%,rgba(36,85,64,0.22),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.76)_100%)]',
  },
  dragon: {
    base: 'bg-[linear-gradient(180deg,#29110e_0%,#120707_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_76%_18%,rgba(224,92,60,0.34),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_78%,rgba(244,188,85,0.18),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.76)_100%)]',
  },
  dungeon: {
    base: 'bg-[linear-gradient(180deg,#15171d_0%,#06070b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_24%_26%,rgba(119,142,189,0.16),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_74%_78%,rgba(84,98,129,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_14%,rgba(0,0,0,0.82)_100%)]',
  },
  wonder: {
    base: 'bg-[linear-gradient(180deg,#15201f_0%,#08100f_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_32%_20%,rgba(162,229,180,0.26),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_72%_74%,rgba(244,188,85,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.72)_100%)]',
  },
  forge: {
    base: 'bg-[linear-gradient(180deg,#23130e_0%,#0f0806_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_68%_18%,rgba(244,114,52,0.3),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_82%,rgba(255,225,174,0.12),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.78)_100%)]',
  },
  sky: {
    base: 'bg-[linear-gradient(180deg,#132033_0%,#090e16_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_50%_14%,rgba(161,196,255,0.22),transparent_30%)]',
    glowB: 'bg-[radial-gradient(circle_at_22%_82%,rgba(244,188,85,0.16),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.74)_100%)]',
  },
  trail: {
    base: 'bg-[linear-gradient(180deg,#1a1a14_0%,#0e0d0b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_74%_20%,rgba(200,171,101,0.24),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_78%,rgba(98,112,72,0.22),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.74)_100%)]',
  },
  duel: {
    base: 'bg-[linear-gradient(180deg,#1b0d11_0%,#090407_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_72%_18%,rgba(255,119,82,0.26),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_26%_76%,rgba(255,225,174,0.14),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
  escape: {
    base: 'bg-[linear-gradient(180deg,#171826_0%,#08090e_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_16%,rgba(181,194,255,0.2),transparent_32%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_84%,rgba(221,102,83,0.2),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
}

export const AmbientBackdrop = React.memo(function AmbientBackdrop({ theme }: { theme: SceneTheme }) {
  const style = THEME_STYLES[theme]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute inset-0 ${style.base}`} />
      <div className={`animate-float absolute inset-0 ${style.glowA}`} />
      <div className={`animate-float absolute inset-0 ${style.glowB}`} style={{ animationDelay: '1.2s' }} />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,225,174,0.14)_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className={`absolute inset-0 ${style.veil}`} />
    </div>
  )
})
