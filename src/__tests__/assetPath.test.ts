/// <reference types="vitest/globals" />
import { assetPath } from '@/lib/assetPath'

describe('assetPath', () => {
  it('encodes spaces', () => {
    expect(assetPath('/scenes/scene 1/bg.png')).toBe('/scenes/scene%201/bg.png')
  })

  it('does not double-encode', () => {
    const already = '/scenes/scene%201/bg.png'
    expect(assetPath(already)).toBe(already)
  })

  it('returns src on malformed input without throwing', () => {
    expect(() => assetPath('%zz')).not.toThrow()
  })
})
