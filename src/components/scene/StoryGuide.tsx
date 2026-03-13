export function StoryGuide({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div className="absolute bottom-[calc(7rem+env(safe-area-inset-bottom))] left-1/2 z-[37] w-[min(92vw,28rem)] -translate-x-1/2 animate-fade-in-up">
      <div className="glass-panel rounded-[1.35rem] border-[rgba(var(--color-accent),0.22)] px-4 py-3 text-[rgba(var(--color-accent),0.88)] shadow-[0_16px_36px_rgba(0,0,0,0.32)]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--color-secondary),0.26)] text-sm font-bold text-[rgba(var(--color-accent),0.95)]">
            i
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.62)]">Guia rapida</p>
            <p className="mt-1 text-sm leading-relaxed sm:text-base">{message}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(var(--color-accent),0.16)] bg-[rgba(255,255,255,0.03)] text-[rgba(var(--color-accent),0.74)] hover:bg-[rgba(255,255,255,0.08)]"
            aria-label="Cerrar ayuda"
          >
            Г—
          </button>
        </div>
      </div>
    </div>
  )
}
