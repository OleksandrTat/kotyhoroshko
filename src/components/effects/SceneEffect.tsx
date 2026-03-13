import type { SceneTheme } from '@/content/scenes'
import { FireSparkEffect, FogEffect, RainEffect, WindEffect } from '.'

const THEME_EFFECTS: Partial<Record<SceneTheme, React.ReactNode>> = {
  forest: <RainEffect intensity="light" />,
  dungeon: <FogEffect density="heavy" />,
  dragon: <FogEffect density="light" />,
  field: <WindEffect />,
  forge: <FireSparkEffect />,
  duel: <RainEffect intensity="heavy" />,
  trail: <WindEffect />,
}

export function SceneEffect({ theme }: { theme: SceneTheme }) {
  return THEME_EFFECTS[theme] ?? null
}
