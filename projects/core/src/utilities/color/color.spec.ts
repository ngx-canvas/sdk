import { Color } from './color'

describe('Color', () => {
  it('converts a 6-digit hex to rgba with normalized opacity', () => {
    const color = new Color('#ff8800', 50)
    expect(color.hex).toBe('#ff8800')
    expect(color.opacity).toBe(50)
    expect(color.rgba).toBe('rgba(255, 136, 0, 0.5)')
  })

  it('accepts hex without a leading hash', () => {
    const color = new Color('00ff00', 100)
    expect(color.rgba).toBe('rgba(0, 255, 0, 1)')
  })

  it('leaves rgba undefined for an invalid hex', () => {
    const color = new Color('not-a-color', 100)
    expect(color.rgba).toBeUndefined()
  })
})
