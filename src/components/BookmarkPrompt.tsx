'use client'

type Bookmark = {
  sceneId: number
  title: string
}

type Props = {
  bookmark?: Bookmark | null
  onContinue?: () => void
}

export function BookmarkPrompt({ bookmark, onContinue }: Props) {
  if (!bookmark || !onContinue) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onContinue}
      className="rounded-[1.5rem] border border-[rgba(var(--color-accent),0.32)] bg-[rgba(255,255,255,0.06)] px-6 py-4 text-left text-lg font-semibold text-[rgba(var(--color-accent),0.92)] hover:bg-[rgba(255,255,255,0.12)]"
    >
      <span>Continuar desde escena {bookmark.sceneId}</span>
      <span className="mt-1 block text-sm font-medium text-[rgba(var(--color-accent),0.7)]">{bookmark.title}</span>
    </button>
  )
}
