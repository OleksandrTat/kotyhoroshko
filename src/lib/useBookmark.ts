import { useEffect, useState } from 'react'

const BOOKMARK_KEY = 'kotyhoroshko-bookmark'

export function useBookmark() {
  const [bookmark, setBookmark] = useState<number | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(BOOKMARK_KEY)
      if (saved) {
        const parsed = Number(saved)
        setBookmark(Number.isNaN(parsed) ? null : parsed)
      }
    } catch {
      setBookmark(null)
    }
  }, [])

  const saveBookmark = (sceneId: number) => {
    try {
      window.localStorage.setItem(BOOKMARK_KEY, String(sceneId))
    } catch {
      // Ignore storage errors.
    }
    setBookmark(sceneId)
  }

  const clearBookmark = () => {
    try {
      window.localStorage.removeItem(BOOKMARK_KEY)
    } catch {
      // Ignore storage errors.
    }
    setBookmark(null)
  }

  return { bookmark, saveBookmark, clearBookmark }
}
