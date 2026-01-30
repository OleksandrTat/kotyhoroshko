'use client'

import { useRouter } from 'next/navigation'

type Props = {
  nextSceneId: number
}

export function NextButton({ nextSceneId }: Props) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(`/scene/${nextSceneId}`)}
      className="absolute bottom-6 right-6 rounded-xl bg-white/90 px-5 py-3 text-black hover:bg-white transition"
    >
      Далі →
    </button>
  )
}
