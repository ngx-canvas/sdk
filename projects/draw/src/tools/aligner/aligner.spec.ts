/**
 * @jest-environment jsdom
 */
import { select } from 'd3-selection'
import { AlignerTool } from './aligner'

const SVG = 'http://www.w3.org/2000/svg'

interface Box {
  top: number
  left: number
  width: number
  height: number
}

/** A canvas shaped like the one `Project` builds. */
const canvas = (): SVGSVGElement => {
  document.body.innerHTML = '<div id="canvas"><svg class="ngx-canvas"></svg></div>'
  return <SVGSVGElement>document.querySelector('svg.ngx-canvas')
}

/** Append a selected shape carrying the bookkeeping box every SDK shape writes. */
const shape = (svg: SVGSVGElement, tag: string, box: Box, attrs: Record<string, string> = {}): Element => {
  const node = document.createElementNS(SVG, tag)
  svg.appendChild(node)

  const el = select(<never>node)
  el.attr('class', 'shape selected')
    .attr('x', box.left)
    .attr('y', box.top)
    .attr('top', box.top)
    .attr('left', box.left)
    .attr('right', box.left + box.width)
    .attr('width', box.width)
    .attr('height', box.height)
    .attr('bottom', box.top + box.height)
    .attr('cx', box.left + box.width / 2)
    .attr('cy', box.top + box.height / 2)
  for (const [name, value] of Object.entries(attrs)) el.attr(name, value)
  return node
}

const box = (node: Element): Box => ({
  top: Number(node.getAttribute('top')),
  left: Number(node.getAttribute('left')),
  width: Number(node.getAttribute('width')),
  height: Number(node.getAttribute('height'))
})

describe('AlignerTool', () => {
  it('aligns top edges', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 10, left: 0, width: 10, height: 10 })
    const b = shape(svg, 'rect', { top: 40, left: 30, width: 10, height: 10 })

    new AlignerTool('canvas').tops()

    expect(box(a).top).toBe(10)
    expect(box(b).top).toBe(10)
  })

  it('aligns bottom edges', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 10, left: 0, width: 10, height: 10 })
    const b = shape(svg, 'rect', { top: 40, left: 30, width: 10, height: 20 })

    new AlignerTool('canvas').bottoms()

    expect(box(a).top + box(a).height).toBe(60)
    expect(box(b).top + box(b).height).toBe(60)
  })

  it('aligns left edges', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 0, left: 5, width: 10, height: 10 })
    const b = shape(svg, 'rect', { top: 0, left: 40, width: 20, height: 10 })

    new AlignerTool('canvas').lefts()

    expect([box(a).left, box(b).left]).toEqual([5, 5])
  })

  it('aligns right edges, which differing widths make distinct from left', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 0, left: 5, width: 10, height: 10 })
    const b = shape(svg, 'rect', { top: 0, left: 40, width: 20, height: 10 })

    new AlignerTool('canvas').rights()

    // Rightmost edge is b's, at 60; a moves to end there without resizing.
    expect([box(a).left, box(b).left]).toEqual([50, 40])
    expect([box(a).width, box(b).width]).toEqual([10, 20])
  })

  it('centres shapes on the selection mean', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 })
    const b = shape(svg, 'rect', { top: 100, left: 100, width: 10, height: 10 })

    new AlignerTool('canvas').absoluteCenters()

    // Both centres converge on (55, 55).
    for (const node of [a, b]) {
      expect(box(node).left + box(node).width / 2).toBe(55)
      expect(box(node).top + box(node).height / 2).toBe(55)
    }
  })

  it('moves a polyline through its points, not just its box', () => {
    const svg = canvas()
    shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 })
    const line = shape(svg, 'polyline', { top: 50, left: 0, width: 10, height: 10 }, { points: '0,50 10,60' })

    new AlignerTool('canvas').tops()

    // Regression: the box used to move while the rendered points stayed put.
    expect(line.getAttribute('points')).toBe('0,0 10,10')
    expect(box(line).top).toBe(0)
  })

  it('moves a path through its bound points', () => {
    const svg = canvas()
    shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 })
    const path = shape(svg, 'path', { top: 50, left: 0, width: 10, height: 10 }, { d: 'M0,50L10,60' })
    select(<never>path).datum([
      { x: 0, y: 50 },
      { x: 10, y: 60 }
    ])

    new AlignerTool('canvas').tops()

    expect(path.getAttribute('d')).toBe('M0,0L10,10')
  })

  it('moves an ellipse through cx/cy', () => {
    const svg = canvas()
    shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 })
    const ellipse = shape(svg, 'ellipse', { top: 50, left: 0, width: 10, height: 10 }, { rx: '5', ry: '5' })

    new AlignerTool('canvas').tops()

    expect(ellipse.getAttribute('cy')).toBe('5')
  })

  it('moves a group by moving its children', () => {
    const svg = canvas()
    shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 })
    const group = shape(svg, 'g', { top: 50, left: 0, width: 10, height: 10 })
    const child = document.createElementNS(SVG, 'rect')
    group.appendChild(child)
    select(<never>child)
      .attr('class', 'shape')
      .attr('x', 0)
      .attr('y', 50)
      .attr('top', 50)
      .attr('left', 0)
      .attr('right', 10)
      .attr('width', 10)
      .attr('height', 10)
      .attr('bottom', 60)

    new AlignerTool('canvas').tops()

    // Regression: a g renders nothing itself, so only the children moving counts.
    expect(child.getAttribute('y')).toBe('0')
    expect(box(group).top).toBe(0)
  })

  describe('paint order', () => {
    /** Two canvases, so cross-project leakage is observable. */
    const twoCanvases = (): { mine: SVGSVGElement, other: SVGSVGElement } => {
      document.body.innerHTML = `
        <div id="canvas"><svg class="ngx-canvas"></svg></div>
        <div id="other"><svg class="ngx-canvas"></svg></div>`
      const [mine, other] = <SVGSVGElement[]>Array.from(document.querySelectorAll('svg.ngx-canvas'))
      return { mine: <SVGSVGElement>mine, other: <SVGSVGElement>other }
    }

    const ids = (svg: SVGSVGElement): (string | null)[] =>
      Array.from(svg.children).map((node) => node.getAttribute('id'))

    it('brings a shape forward one step', () => {
      const svg = canvas()
      for (const id of ['a', 'b', 'c']) {
        shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 }).setAttribute('id', id)
      }
      svg.querySelector('#a')?.setAttribute('class', 'shape selected')
      svg.querySelector('#b')?.setAttribute('class', 'shape')
      svg.querySelector('#c')?.setAttribute('class', 'shape')

      new AlignerTool('canvas').bringForward()

      expect(ids(svg)).toEqual(['b', 'a', 'c'])
    })

    it('sends a shape backward one step', () => {
      const svg = canvas()
      for (const id of ['a', 'b', 'c']) {
        shape(svg, 'rect', { top: 0, left: 0, width: 10, height: 10 }).setAttribute('id', id)
      }
      svg.querySelector('#a')?.setAttribute('class', 'shape')
      svg.querySelector('#b')?.setAttribute('class', 'shape')
      svg.querySelector('#c')?.setAttribute('class', 'shape selected')

      new AlignerTool('canvas').sendBackward()

      expect(ids(svg)).toEqual(['a', 'c', 'b'])
    })

    it('does not reorder shapes in another project', () => {
      const { mine, other } = twoCanvases()
      for (const id of ['a', 'b']) {
        shape(mine, 'rect', { top: 0, left: 0, width: 10, height: 10 }).setAttribute('id', id)
        shape(other, 'rect', { top: 0, left: 0, width: 10, height: 10 }).setAttribute('id', `other-${id}`)
      }
      mine.querySelector('#b')?.setAttribute('class', 'shape')
      // Selected, with an unselected neighbour ahead of it — so a global
      // selector would genuinely swap this pair.
      other.querySelector('#other-b')?.setAttribute('class', 'shape')

      new AlignerTool('canvas').bringForward()

      // Regression: this ran off a global selector, so it shuffled every canvas.
      expect(ids(other)).toEqual(['other-a', 'other-b'])
      expect(ids(mine)).toEqual(['b', 'a'])
    })

    it('does not reorder shapes nested inside a group', () => {
      const svg = canvas()
      const group = shape(svg, 'g', { top: 0, left: 0, width: 30, height: 10 })
      group.setAttribute('class', 'shape')
      for (const [id, className] of [
        ['child-a', 'shape selected'],
        ['child-b', 'shape']
      ]) {
        const child = document.createElementNS(SVG, 'rect')
        child.setAttribute('id', <string>id)
        child.setAttribute('class', <string>className)
        group.appendChild(child)
      }

      new AlignerTool('canvas').bringForward()

      // Group children are not top-level shapes, so they are not the tool's
      // business; a global selector would have swapped them.
      expect(Array.from(group.children).map((n) => n.getAttribute('id'))).toEqual(['child-a', 'child-b'])
    })
  })

  it('is a no-op when nothing is selected', () => {
    const svg = canvas()
    const a = shape(svg, 'rect', { top: 10, left: 0, width: 10, height: 10 })
    a.setAttribute('class', 'shape')

    expect(() => new AlignerTool('canvas').tops()).not.toThrow()
    expect(box(a).top).toBe(10)
  })
})
