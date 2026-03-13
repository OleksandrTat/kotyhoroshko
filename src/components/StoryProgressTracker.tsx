'use client'

import { useEffect, useState } from 'react'
import { TOTAL_SCENES } from '@/content/scenes'
import { useSaveSceneProgress } from '@/hooks/useSceneProgress'

export function StoryProgressTracker() {
  const [activeSceneId, setActiveSceneId] = useState(1)

  useSaveSceneProgress(activeSceneId)

  useEffect(() => {
    const updateScene = () => {
      const vh = window.innerHeight || 1
      const currentSection = Math.round(window.scrollY / vh)
      const sceneId = Math.min(Math.max(currentSection, 1), TOTAL_SCENES)
      setActiveSceneId(sceneId)
    }

    updateScene()
    window.addEventListener('scroll', updateScene, { passive: true })
    window.addEventListener('resize', updateScene)

    return () => {
      window.removeEventListener('scroll', updateScene)
      window.removeEventListener('resize', updateScene)
    }
  }, [])

  return null
}
