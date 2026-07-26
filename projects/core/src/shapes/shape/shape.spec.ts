/**
 * @jest-environment jsdom
 */
import { select } from 'd3-selection'
import { Rectangle } from '../rectangle/rectangle'

const SVG = 'http://www.w3.org/2000/svg'

/** A rendered rectangle, bound to a real element so d3-drag can attach to it. */
const rendered = (): Rectangle => {
  const svg = document.createElementNS(SVG, 'svg')
  document.body.appendChild(svg)

  const shape = new Rectangle({ position: { x: 0, y: 0, width: 10, height: 10 } })
  shape.apply(select(<never>svg))
  return shape
}

/** Press, move and release over `node`, the gesture d3-drag listens for. */
const dragOver = (node: Element): void => {
  node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0, view: window }))
  window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 5, clientY: 5, view: window }))
  window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 5, clientY: 5, view: window }))
}

describe('Shape.on', () => {
  // After a drag that moved, d3-drag installs a capturing `click` suppressor on
  // the window so the gesture does not also read as a click, and clears it on the
  // next macrotask. Let that fire, or it swallows the next test's clicks.
  afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)))

  it('delivers start, drag and end when all three are registered', () => {
    const shape = rendered()
    const seen: string[] = []

    // Registering these used to build a fresh d3-drag behavior each time, and
    // since d3-drag binds as `mousedown.drag` the last one silently won.
    shape.on('drag-start', () => seen.push('start'))
    shape.on('drag', () => seen.push('drag'))
    shape.on('drag-end', () => seen.push('end'))

    dragOver(<Element>shape.el.node())

    expect(seen).toEqual(['start', 'drag', 'end'])
  })

  it('delivers a lone drag handler regardless of registration order', () => {
    const shape = rendered()
    const seen: string[] = []

    shape.on('drag', () => seen.push('drag'))
    shape.on('drag-start', () => seen.push('start'))

    dragOver(<Element>shape.el.node())

    expect(seen).toEqual(['start', 'drag'])
  })

  it('replaces a handler when the same event is registered twice', () => {
    const shape = rendered()
    const seen: string[] = []

    shape.on('drag', () => seen.push('first'))
    shape.on('drag', () => seen.push('second'))

    dragOver(<Element>shape.el.node())

    expect(seen).toEqual(['second'])
  })

  it('still routes plain pointer events to the element', () => {
    const shape = rendered()
    const seen: string[] = []

    shape.on('click', () => seen.push('click'))
    shape.on('mouse-enter', () => seen.push('enter'))

    const node = <Element>shape.el.node()
    node.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(seen).toEqual(['enter', 'click'])
  })
})
