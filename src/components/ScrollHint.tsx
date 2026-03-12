'use client'

type Props = {
  visible: boolean
}

export function ScrollHint({ visible }: Props) {
  if (!visible) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-6 z-[60] flex items-center gap-2 text-sm text-[rgba(var(--color-accent),0.78)] sm:right-10">
      <span className="scroll-hint-arrow text-2xl">→</span>
      <span className="uppercase tracking-[0.24em]">Desliza</span>
    </div>
  )
}
