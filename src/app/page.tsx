import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Казка «Котигорошко»</h1>
        <p className="opacity-80">
          Інтерактивна історія з багатошаровими сценами
        </p>

        <Link
          href="/scene/1"
          className="inline-block rounded-xl bg-green-600 px-6 py-3 text-lg hover:bg-green-500 transition"
        >
          Почати казку →
        </Link>
      </div>
    </main>
  )
}
