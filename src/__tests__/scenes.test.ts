/// <reference types="vitest/globals" />
import { getSceneById, TOTAL_SCENES, SCENES } from '@/content/scenes'

describe('scenes data', () => {
  it('all scene IDs are sequential', () => {
    SCENES.forEach((scene, index) => {
      expect(scene.id).toBe(index + 1)
    })
  })

  it('TOTAL_SCENES matches SCENES.length', () => {
    expect(TOTAL_SCENES).toBe(SCENES.length)
  })

  it('getSceneById returns correct scene', () => {
    expect(getSceneById(1)?.id).toBe(1)
    expect(getSceneById(TOTAL_SCENES)?.id).toBe(TOTAL_SCENES)
    expect(getSceneById(0)).toBeUndefined()
    expect(getSceneById(TOTAL_SCENES + 1)).toBeUndefined()
  })

  it('each scene has non-empty title and text', () => {
    SCENES.forEach(scene => {
      expect(scene.title.length).toBeGreaterThan(0)
      expect(scene.text.length).toBeGreaterThan(0)
      scene.text.forEach(p => expect(p.length).toBeGreaterThan(0))
    })
  })
})
