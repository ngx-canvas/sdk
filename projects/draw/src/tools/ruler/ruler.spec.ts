/**
 * @jest-environment jsdom
 */
import { RulerTool } from './ruler'

/** A canvas shaped like the one `Project` builds, at the given user-unit size. */
const canvas = (width: number, height: number): RulerTool => {
  document.body.innerHTML = `
    <div id="canvas">
      <div id="ngx-container">
        <svg class="ngx-canvas" viewBox="0 0 ${width} ${height}"></svg>
      </div>
    </div>`
  return new RulerTool('canvas')
}

const ticks = (selector: string): Element[] => Array.from(document.querySelectorAll(`${selector} .tick`))

const labels = (selector: string): (string | null)[] =>
  Array.from(document.querySelectorAll(`${selector} .tick text`)).map((node) => node.textContent)

/**
 * The distance along its own axis that d3-axis placed each tick at. Horizontal
 * ticks are `translate(n,0)` and vertical ones `translate(0,n)`, so summing the
 * pair reads either without the caller caring which.
 */
const offsets = (selector: string): number[] =>
  ticks(selector).map((node) => {
    const [, x, y] = /translate\(([-\d.]+),([-\d.]+)\)/.exec(node.getAttribute('transform') ?? '') ?? []
    return Number(x) + Number(y)
  })

describe('RulerTool', () => {
  it('draws a tick every 10, 50 and 100 units across the canvas plus the gutter', () => {
    canvas(400, 200)

    // 0..410 inclusive of the 15px overhang, exclusive of the stop.
    expect(ticks('.x-ticks-10')).toHaveLength(42)
    expect(ticks('.x-ticks-50')).toHaveLength(9)
    expect(ticks('.x-ticks-100')).toHaveLength(5)
  })

  it('labels only the longest ticks', () => {
    canvas(400, 200)

    expect(labels('.x-ticks-100')).toEqual(['0', '100', '200', '300', '400'])
    expect(labels('.x-ticks-50')).toEqual([])
    expect(labels('.x-ticks-10')).toEqual([])
  })

  it('measures the vertical ruler off the canvas height, not its width', () => {
    canvas(400, 200)

    // Regression: this used to be built from the x container's width, so a
    // 400x200 canvas got five vertical labels instead of three.
    expect(labels('.y-ticks-100')).toEqual(['0', '100', '200'])
    expect(ticks('.y-ticks-10')).toHaveLength(22)
  })

  it('positions ticks on the half-pixel grid at zoom 1', () => {
    canvas(400, 200)

    expect(offsets('.x-ticks-100')).toEqual([0.5, 100.5, 200.5, 300.5, 400.5])
  })

  it('re-positions every tick when the zoom changes', () => {
    const ruler = canvas(400, 200)
    ruler.scale(2)

    expect(offsets('.x-ticks-100')).toEqual([0.5, 200.5, 400.5, 600.5, 800.5])
    // The tick set is re-bound, not rebuilt.
    expect(ticks('.x-ticks-100')).toHaveLength(5)
  })

  it('scales the vertical ruler independently of the horizontal one', () => {
    const ruler = canvas(400, 200)
    ruler.scale(2)

    expect(offsets('.y-ticks-100')).toEqual([0.5, 200.5, 400.5])
  })

  it('leaves no d3-axis baseline path behind', () => {
    canvas(400, 200)

    expect(document.querySelectorAll('.domain')).toHaveLength(0)
  })

  it('rotates the vertical ruler labels to read bottom-up', () => {
    canvas(400, 200)

    const label = document.querySelector('.y-ticks-100 .tick text')
    expect(label?.getAttribute('transform')).toBe('rotate(270)')
  })
})
