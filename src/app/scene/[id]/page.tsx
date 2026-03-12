import { notFound, redirect } from 'next/navigation'
import { TOTAL_SCENES } from '@/content/scenes'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function parseSceneId(value: string) {
  const sceneId = Number.parseInt(value, 10)

  if (!Number.isInteger(sceneId) || sceneId < 1 || sceneId > TOTAL_SCENES) {
    return null
  }

  return sceneId
}

export async function generateStaticParams() {
  return Array.from({ length: TOTAL_SCENES }, (_, index) => ({
    id: String(index + 1),
  }))
}

export default async function ScenePage({ params }: PageProps) {
  const { id } = await params
  const sceneId = parseSceneId(id)

  if (!sceneId) {
    notFound()
  }

  redirect(`/#scene-${sceneId}`)
}
