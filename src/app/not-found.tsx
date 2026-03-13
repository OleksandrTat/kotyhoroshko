import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-[#0b0a08] p-8 text-center">
      <h1
        className="text-6xl text-[rgba(var(--color-accent),0.9)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Escena no encontrada
      </h1>
      <p className="text-xl text-[rgba(var(--color-accent),0.7)]">Esta parte del cuento no existe.</p>
      <Link href="/" className="button-primary btn-glow rounded-2xl px-8 py-4 text-lg font-bold">
        Volver al inicio
      </Link>
    </main>
  )
}
