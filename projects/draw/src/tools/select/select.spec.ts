/**
 * @jest-environment jsdom
 */
import { select } from 'd3-selection'
import { SelectBoxEvent, SelectTool } from './select'
import { rotationOf } from './geometry'

const SVG = 'http://www.w3.org/2000/svg'

/** A canvas holding one selected 100x100 rect at the origin. */
const canvas = (): SelectTool => {
  document.body.innerHTML = `
    <div id="canvas">
      <div id="ngx-container">
        <svg class="ngx-canvas" viewBox="0 0 400 400"></svg>
      </div>
    </div>`

  const node = document.createElementNS(SVG, 'rect')
  document.querySelector('svg.ngx-canvas')?.appendChild(node)
  select(<never>node)
    .attr('class', 'shape selected')
    .attr('x', 0)
    .attr('y', 0)
    .attr('top', 0)
    .attr('left', 0)
    .attr('right', 100)
    .attr('width', 100)
    .attr('height', 100)
    .attr('bottom', 100)

  const tool = new SelectTool('canvas')
  tool.showBox({ x: 0, y: 0, top: 0, left: 0, width: 100, right: 100, height: 100, bottom: 100, scale: 1 })
  return tool
}

const shape = (): ReturnType<typeof select> => select(<never>document.querySelector('rect'))

/**
 * Drag the rotate handle to a point in container pixels.
 *
 * jsdom reports a zero-origin bounding rect, so d3-drag's pointer coordinates are
 * the client coordinates unchanged.
 */
const dragHandleTo = (x: number, y: number, options: MouseEventInit = {}): void => {
  const handle = <Element>document.querySelector('.tool.select .r')
  handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50, clientY: -25, view: window }))
  window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y, view: window, ...options }))
  window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y, view: window }))
}

describe('SelectTool rotation', () => {
  afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)))

  it('reads straight up as 0 degrees', () => {
    canvas()
    dragHandleTo(50, 0)
    expect(rotationOf(shape())).toBe(0)
  })

  it('reads right of centre as 90 degrees', () => {
    canvas()
    dragHandleTo(100, 50)
    expect(rotationOf(shape())).toBe(90)
  })

  it('reads below centre as 180 degrees', () => {
    canvas()
    dragHandleTo(50, 100)
    expect(rotationOf(shape())).toBe(180)
  })

  it('reads left of centre as 270 degrees, normalised into [0, 360)', () => {
    canvas()
    dragHandleTo(0, 50)
    expect(rotationOf(shape())).toBe(270)
  })

  it('pivots on the shape centre', () => {
    canvas()
    dragHandleTo(100, 50)
    expect(shape().attr('transform')).toBe('rotate(90,50,50)')
  })

  it('snaps to 15 degree steps while shift is held', () => {
    canvas()
    // 40 degrees off vertical snaps back to 45.
    dragHandleTo(100, 10, { shiftKey: true })
    expect(rotationOf(shape()) % 15).toBe(0)
  })

  it('leaves the axis-aligned box alone so selection stays consistent', () => {
    canvas()
    dragHandleTo(100, 50)

    const el = shape()
    expect(el.attr('top')).toBe('0')
    expect(el.attr('left')).toBe('0')
    expect(el.attr('width')).toBe('100')
    expect(el.attr('height')).toBe('100')
  })

  it('rotates the box element itself', () => {
    canvas()
    dragHandleTo(100, 50)
    expect(select('.tool.select').style('transform')).toBe('rotate(90deg)')
  })

  it('emits the rotation and an identity transform', () => {
    const tool = canvas()
    const events: SelectBoxEvent[] = []
    tool.changes.subscribe((event) => events.push(event))

    dragHandleTo(100, 50)

    expect(events).toHaveLength(1)
    expect(events[0]?.from).toBe('r')
    expect(events[0]?.rotation).toBe(90)
    expect(events[0]?.transform).toEqual({ ox: 0, oy: 0, nx: 0, ny: 0, kx: 1, ky: 1 })
  })

  it('does not rotate when a resize handle is dragged', () => {
    const tool = canvas()
    const events: SelectBoxEvent[] = []
    tool.changes.subscribe((event) => events.push(event))

    const handle = <Element>document.querySelector('.tool.select .se')
    handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100, view: window }))
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 120, clientY: 130, view: window }))
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 120, clientY: 130, view: window }))

    expect(events[0]?.rotation).toBeUndefined()
    expect(rotationOf(shape())).toBe(0)
    expect(shape().attr('width')).toBe('120')
  })

  it('keeps the outline over an already-rotated shape when re-shown', () => {
    const tool = canvas()
    dragHandleTo(100, 50)
    expect(select('.tool.select').style('transform')).toBe('rotate(90deg)')

    // Regression: this used to snap back to 0, drawing an axis-aligned outline
    // over a rotated shape and pointing the resize handles at the wrong axes.
    tool.showBox({ x: 0, y: 0, top: 0, left: 0, width: 100, right: 100, height: 100, bottom: 100, scale: 1 })
    expect(select('.tool.select').style('transform')).toBe('rotate(90deg)')
  })

  it('honours an explicitly supplied rotation', () => {
    const tool = canvas()
    tool.showBox({ x: 0, y: 0, top: 0, left: 0, width: 100, right: 100, height: 100, bottom: 100, scale: 1, rotation: 35 })
    expect(select('.tool.select').style('transform')).toBe('rotate(35deg)')
  })

  it('stays axis-aligned when several shapes are selected', () => {
    const tool = canvas()
    dragHandleTo(100, 50)

    // A second selected shape: the angles may differ, so no single outline fits.
    const node = document.createElementNS(SVG, 'rect')
    document.querySelector('svg.ngx-canvas')?.appendChild(node)
    select(<never>node).attr('class', 'shape selected').attr('top', 0).attr('left', 0).attr('right', 10).attr('bottom', 10)

    tool.showBox({ x: 0, y: 0, top: 0, left: 0, width: 100, right: 100, height: 100, bottom: 100, scale: 1 })
    expect(select('.tool.select').style('transform')).toBe('rotate(0deg)')
  })
})

describe('SelectTool rotation of several shapes', () => {
  afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)))

  /** Two 10x10 rects at opposite corners of a 100x100 selection. */
  const pair = (): SelectTool => {
    const tool = canvas()
    const svg = document.querySelector('svg.ngx-canvas')

    // Re-purpose the default rect as the top-left shape.
    select(<never>document.querySelector('rect'))
      .attr('right', 10)
      .attr('width', 10)
      .attr('height', 10)
      .attr('bottom', 10)

    const second = document.createElementNS(SVG, 'rect')
    svg?.appendChild(second)
    select(<never>second)
      .attr('class', 'shape selected')
      .attr('top', 90)
      .attr('left', 90)
      .attr('right', 100)
      .attr('width', 10)
      .attr('height', 10)
      .attr('bottom', 100)

    tool.showBox({ x: 0, y: 0, top: 0, left: 0, width: 100, right: 100, height: 100, bottom: 100, scale: 1, rotation: 0 })
    return tool
  }

  const boxes = (): { top: number, left: number }[] =>
    Array.from(document.querySelectorAll('rect')).map((node) => ({
      top: Number(node.getAttribute('top')),
      left: Number(node.getAttribute('left'))
    }))

  it('turns the selection rigidly about its centre, not each shape in place', () => {
    pair()
    // Straight down from the centre is a half turn.
    dragHandleTo(50, 100)

    // Regression: shapes used to spin in place, so their boxes never moved and
    // the result did not match the rotating outline.
    expect(boxes()).toEqual([
      { top: 90, left: 90 },
      { top: 0, left: 0 }
    ])
  })

  it('gives every shape the selection angle about its own new centre', () => {
    pair()
    dragHandleTo(50, 100)

    const transforms = Array.from(document.querySelectorAll('rect')).map((n) => n.getAttribute('transform'))
    expect(transforms).toEqual(['rotate(180,95,95)', 'rotate(180,5,5)'])
  })

  it('composes successive drags instead of re-applying from zero', () => {
    pair()

    const handle = <Element>document.querySelector('.tool.select .r')
    handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50, clientY: -25, view: window }))
    // 90 degrees, then another 90.
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100, clientY: 50, view: window }))
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50, clientY: 100, view: window }))
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 50, clientY: 100, view: window }))

    // Two 90 degree steps land in the same place as one 180 degree step.
    expect(boxes()).toEqual([
      { top: 90, left: 90 },
      { top: 0, left: 0 }
    ])
    expect(rotationOf(select(<never>document.querySelector('rect')))).toBe(180)
  })

  it('leaves shapes alone when the angle does not change', () => {
    pair()
    dragHandleTo(50, -100)
    expect(boxes()).toEqual([
      { top: 0, left: 0 },
      { top: 90, left: 90 }
    ])
  })
})

describe('SelectTool rotation with a scrolled canvas', () => {
  afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)))

  /** jsdom has no layout, so scroll offsets have to be stubbed onto the node. */
  const scrollBy = (left: number, top: number): void => {
    const container = <HTMLElement>document.querySelector('#ngx-container')
    Object.defineProperty(container, 'scrollLeft', { value: left, configurable: true })
    Object.defineProperty(container, 'scrollTop', { value: top, configurable: true })
  }

  it('measures the angle in the scrolled content frame', () => {
    canvas()
    scrollBy(200, 0)

    // The pointer sits 200px right of the container's visible edge, which after
    // the scroll is the box centre — straight below it once y is past centre.
    dragHandleTo(-100, 50)

    // Regression: without the scroll offset this read as 270 rather than 90.
    expect(rotationOf(shape())).toBe(90)
  })

  it('is unaffected by scroll when the canvas is at the origin', () => {
    canvas()
    scrollBy(0, 0)
    dragHandleTo(100, 50)
    expect(rotationOf(shape())).toBe(90)
  })
})
