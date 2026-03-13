'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-[#0b0a08] p-8 text-center">
      <h1
        className="text-6xl text-[rgba(var(--color-accent),0.9)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Algo salió mal
      </h1>
      <p className="text-xl text-[rgba(var(--color-accent),0.7)]">
        El cuento se ha interrumpido. Puedes intentarlo de nuevo.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="button-primary btn-glow rounded-2xl px-6 py-3 font-bold">
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-[rgba(var(--color-accent),0.3)] px-6 py-3 text-[rgba(var(--color-accent),0.8)]"
        >
          Inicio
        </Link>
      </div>
    </main>
  )
}
