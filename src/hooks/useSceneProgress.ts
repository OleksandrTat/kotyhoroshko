'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'kotyhoroshko-last-scene'

export function useSaveSceneProgress(sceneId: number) {
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(sceneId))
    } catch {}
  }, [sceneId])
}

export function getLastSceneId(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const id = parseInt(stored, 10)
    return Number.isInteger(id) && id >= 1 ? id : null
  } catch {
    return null
  }
}
