/// <reference types="vitest/globals" />
import { navigateWithPageTurn } from '@/lib/pageTurn'

describe('navigateWithPageTurn', () => {
  it('calls navigate when window is undefined', () => {
    const navigate = vi.fn()
    const originalWindow = global.window
    // @ts-expect-error
    delete global.window
    navigateWithPageTurn(navigate)
    expect(navigate).toHaveBeenCalledOnce()
    global.window = originalWindow
  })

  it('calls navigate with prefersReducedMotion', () => {
    const navigate = vi.fn()
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    navigateWithPageTurn(navigate)
    expect(navigate).toHaveBeenCalledOnce()
  })
})
