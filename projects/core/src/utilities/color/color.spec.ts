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

  it('accepts 3-digit hex shorthand', () => {
    expect(new Color('#f80', 100).rgba).toBe('rgba(255, 136, 0, 1)')
  })

  it('accepts a CSS named colour', () => {
    expect(new Color('rebeccapurple', 100).rgba).toBe('rgba(102, 51, 153, 1)')
  })

  it('accepts an rgb() string', () => {
    expect(new Color('rgb(10, 20, 30)', 40).rgba).toBe('rgba(10, 20, 30, 0.4)')
  })
})
