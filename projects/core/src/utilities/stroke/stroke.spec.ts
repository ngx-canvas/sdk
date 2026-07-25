import { Stroke } from './stroke'

describe('Stroke', () => {
  it('applies sensible defaults', () => {
    const stroke = new Stroke()
    expect(stroke.width).toBe(1)
    expect(stroke.color).toBe('#000000')
    expect(stroke.style).toBe('solid')
    expect(stroke.cap).toBe('round')
  })

  it('overrides only provided options', () => {
    const stroke = new Stroke({ width: 4, color: '#123456' })
    expect(stroke.width).toBe(4)
    expect(stroke.color).toBe('#123456')
    expect(stroke.style).toBe('solid')
  })

  describe('dasharray', () => {
    it('returns "none" for a solid stroke', () => {
      expect(new Stroke({ style: 'solid' }).dasharray()).toBe('none')
    })

    it('scales dashes with width', () => {
      expect(new Stroke({ style: 'dashed', width: 2 }).dasharray()).toBe('8,8')
    })

    it('scales dots with width', () => {
      expect(new Stroke({ style: 'dotted', width: 3 }).dasharray()).toBe('3,6')
    })
  })
})
