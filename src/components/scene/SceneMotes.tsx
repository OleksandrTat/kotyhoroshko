import React from 'react'
import type { SceneTheme } from '@/content/scenes'
import { THEME_META } from './sceneMeta'

const MOTE_LAYOUT = [
  { top: '12%', left: '18%', size: 10, delay: '0.2s', duration: '9s' },
  { top: '22%', left: '72%', size: 8, delay: '1.4s', duration: '11s' },
  { top: '34%', left: '52%', size: 12, delay: '2.2s', duration: '10s' },
  { top: '58%', left: '16%', size: 7, delay: '3.3s', duration: '12s' },
  { top: '68%', left: '78%', size: 11, delay: '1s', duration: '8.5s' },
  { top: '80%', left: '38%', size: 9, delay: '2.8s', duration: '10.5s' },
] as const

export const SceneMotes = React.memo(function SceneMotes({ theme }: { theme: SceneTheme }) {
  const meta = THEME_META[theme]

  return (
    <div className="pointer-events-none absolute inset-0 z-[14] overflow-hidden">
      {MOTE_LAYOUT.map((mote, index) => (
        <span
          key={`${theme}-${index}`}
          className={`scene-mote absolute rounded-full blur-[1px] ${meta.moteClass}`}
          style={{
            top: mote.top,
            left: mote.left,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
    </div>
  )
})
