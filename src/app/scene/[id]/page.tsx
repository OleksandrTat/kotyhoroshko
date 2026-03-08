import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryScene } from '@/components/StoryScene'
import { TOTAL_SCENES, getSceneById } from '@/content/scenes'

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const sceneId = parseSceneId(id)

  if (!sceneId) {
    return {
      title: 'Escena no encontrada | Kotyhoroshko',
    }
  }

  const scene = getSceneById(sceneId)
  if (!scene) {
    return {
      title: 'Escena no encontrada | Kotyhoroshko',
    }
  }

  return {
    title: `${scene.title} | Kotyhoroshko`,
    description: scene.text[0],
  }
}

export default async function ScenePage({ params }: PageProps) {
  const { id } = await params
  const sceneId = parseSceneId(id)

  if (!sceneId) {
    notFound()
  }

  const scene = getSceneById(sceneId)
  if (!scene) {
    notFound()
  }

  return <StoryScene scene={scene} />
}
