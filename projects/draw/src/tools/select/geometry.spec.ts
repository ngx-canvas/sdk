/**
 * @jest-environment jsdom
 */
import { select } from 'd3-selection'
import { Selection } from '@libs/common'
import { boundsOf, resize, rotatePoint, rotateShape, rotationOf, transformShape, transformation, translation } from './geometry'

const SVG = 'http://www.w3.org/2000/svg'

/** Append a shape carrying the bookkeeping box every SDK shape writes. */
const shape = (
  tag: string,
  box: { top: number; left: number; width: number; height: number },
  attrs: Record<string, string> = {}
): Selection => {
  const svg = document.createElementNS(SVG, 'svg')
  document.body.appendChild(svg)
  const node = document.createElementNS(SVG, tag)
  svg.appendChild(node)

  const el = select(<never>node)
  el.attr('class', 'shape')
    .attr('x', box.left)
    .attr('y', box.top)
    .attr('top', box.top)
    .attr('left', box.left)
    .attr('right', box.left + box.width)
    .attr('width', box.width)
    .attr('height', box.height)
    .attr('bottom', box.top + box.height)
  for (const [name, value] of Object.entries(attrs)) el.attr(name, value)
  return el
}

const box = (el: Selection) => ({
  top: Number(el.attr('top')),
  left: Number(el.attr('left')),
  width: Number(el.attr('width')),
  height: Number(el.attr('height'))
})

describe('transformation', () => {
  it('maps a rectangle onto another', () => {
    const t = transformation({ top: 0, left: 0, width: 100, height: 100 }, { top: 10, left: 20, width: 200, height: 50 })
    expect(t).toEqual({ ox: 0, oy: 0, nx: 20, ny: 10, kx: 2, ky: 0.5 })
  })

  it('falls back to a pure move when the source has no size', () => {
    const t = transformation({ top: 0, left: 0, width: 0, height: 0 }, { top: 5, left: 5, width: 0, height: 0 })
    expect(t.kx).toBe(1)
    expect(t.ky).toBe(1)
  })
})

describe('resize', () => {
  const rect = { top: 100, left: 100, width: 200, height: 100 }

  it('moves the box when dragged by the body', () => {
    expect(resize(rect, 'body', 10, -20)).toEqual({ top: 80, left: 110, width: 200, height: 100 })
  })

  it('drags the west edge without moving the east one', () => {
    const next = resize(rect, 'w', 50, 0)
    expect(next.left).toBe(150)
    expect(next.left + next.width).toBe(rect.left + rect.width)
  })

  it('drags a corner on both axes', () => {
    expect(resize(rect, 'se', 20, 30)).toEqual({ top: 100, left: 100, width: 220, height: 130 })
  })

  it('will not let an edge cross its opposite', () => {
    const next = resize(rect, 'w', 500, 0)
    expect(next.width).toBe(1)
    expect(next.left).toBe(299)
  })

  it('will not produce a negative size', () => {
    expect(resize(rect, 'e', -900, 0).width).toBe(1)
    expect(resize(rect, 's', 0, -900).height).toBe(1)
  })
})

describe('transformShape', () => {
  const move = transformation({ top: 0, left: 0, width: 10, height: 10 }, { top: 5, left: 5, width: 10, height: 10 })
  const double = transformation({ top: 0, left: 0, width: 10, height: 10 }, { top: 0, left: 0, width: 20, height: 20 })

  it('resizes a rect through its rendered attributes', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 })
    transformShape(el, double)
    expect(box(el)).toEqual({ top: 0, left: 0, width: 20, height: 20 })
    expect(el.attr('x')).toBe('0')
    expect(el.attr('width')).toBe('20')
  })

  it('resizes an ellipse through cx/cy/rx/ry', () => {
    const el = shape('ellipse', { top: 0, left: 0, width: 10, height: 10 }, { cx: '5', cy: '5', rx: '5', ry: '5' })
    transformShape(el, double)
    expect(el.attr('rx')).toBe('10')
    expect(el.attr('ry')).toBe('10')
    expect(el.attr('cx')).toBe('10')
    expect(el.attr('cy')).toBe('10')
  })

  it('moves a polyline through its points', () => {
    const el = shape('polyline', { top: 0, left: 0, width: 10, height: 10 }, { points: '0,0 10,10' })
    transformShape(el, move)
    expect(el.attr('points')).toBe('5,5 15,15')
    expect(box(el)).toEqual({ top: 5, left: 5, width: 10, height: 10 })
  })

  it('scales a polygon through its points', () => {
    const el = shape('polygon', { top: 0, left: 0, width: 10, height: 10 }, { points: '0,0 10,0 10,10' })
    transformShape(el, double)
    expect(el.attr('points')).toBe('0,0 20,0 20,20')
  })

  it('regenerates a path from its bound points', () => {
    const el = shape('path', { top: 0, left: 0, width: 10, height: 10 }, { d: 'M0,0L10,10' })
    el.datum([
      { x: 0, y: 0 },
      { x: 10, y: 10 }
    ])
    transformShape(el, double)
    expect(el.attr('d')).toBe('M0,0L20,20')
  })

  it('scales text rather than stretching a box it does not have', () => {
    const el = shape('text', { top: 0, left: 0, width: 10, height: 10 })
    el.style('font-size', '12px')
    transformShape(el, double)
    expect(el.style('font-size')).toBe('24px')
    expect(el.attr('y')).toBe('0')
  })

  it('keeps the rotation pivot on the new centre', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(45,5,5)' })
    transformShape(el, move)
    expect(el.attr('transform')).toBe('rotate(45,10,10)')
  })

  it('moves a polygon, which writes no width or height attributes', () => {
    // Regression: sizing from the `width`/`height` attributes collapsed a
    // polygon's box to nothing, after which it could not be re-selected.
    const svg = document.createElementNS(SVG, 'svg')
    document.body.appendChild(svg)
    const node = document.createElementNS(SVG, 'polygon')
    svg.appendChild(node)
    const el = select(<never>node)
    el.attr('class', 'shape')
      .attr('top', 0)
      .attr('left', 0)
      .attr('right', 10)
      .attr('bottom', 10)
      .attr('points', '0,0 10,0 10,10')

    transformShape(el, move)

    expect(el.attr('points')).toBe('5,5 15,5 15,15')
    expect(box(el)).toEqual({ top: 5, left: 5, width: 10, height: 10 })
  })

  describe('leaf groups', () => {
    /** A `g.shape` that draws its own content, as `Chart` and `Table` do. */
    const chart = (transform = 'rotate(0,15,10) translate(10,5)') => {
      const svg = document.createElementNS(SVG, 'svg')
      document.body.appendChild(svg)
      const g = document.createElementNS(SVG, 'g')
      svg.appendChild(g)
      // Its children are bars and axes, not shapes: nothing to recurse into.
      g.appendChild(document.createElementNS(SVG, 'rect')).setAttribute('class', 'bar')

      return select(<never>g)
        .attr('class', 'shape')
        .attr('top', 5)
        .attr('left', 10)
        .attr('right', 30)
        .attr('width', 20)
        .attr('height', 10)
        .attr('bottom', 15)
        .attr('transform', transform)
    }

    it('moves through its translate rather than being wiped', () => {
      const el = chart()
      transformShape(el, translation(5, 5))

      // Regression: the box used to be overwritten with an empty rect and the
      // translate left untouched, so the chart never moved.
      expect(box(el)).toEqual({ top: 10, left: 15, width: 20, height: 10 })
      expect(el.attr('transform')).toContain('translate(15,10)')
    })

    it('keeps its rotation pivot on the new centre', () => {
      const el = chart()
      transformShape(el, translation(5, 5))
      expect(el.attr('transform')).toContain('rotate(0,25,15)')
    })

    it('resizes by composing a scale', () => {
      const el = chart()
      transformShape(el, transformation({ top: 5, left: 10, width: 20, height: 10 }, { top: 5, left: 10, width: 40, height: 20 }))

      expect(box(el)).toEqual({ top: 5, left: 10, width: 40, height: 20 })
      expect(el.attr('transform')).toContain('scale(2,2)')
    })

    it('accumulates successive scales rather than resetting them', () => {
      const el = chart()
      const double = transformation({ top: 5, left: 10, width: 20, height: 10 }, { top: 5, left: 10, width: 40, height: 20 })
      transformShape(el, double)
      transformShape(el, transformation({ top: 5, left: 10, width: 40, height: 20 }, { top: 5, left: 10, width: 80, height: 40 }))

      expect(el.attr('transform')).toContain('scale(4,4)')
      expect(box(el)).toEqual({ top: 5, left: 10, width: 80, height: 40 })
    })

    it('adds a translate to a group that had none', () => {
      const el = chart('rotate(0,15,10)')
      transformShape(el, translation(5, 5))
      expect(el.attr('transform')).toContain('translate(15,10)')
    })

    it('orders the terms so content scales about its own origin', () => {
      const el = chart()
      transformShape(el, transformation({ top: 5, left: 10, width: 20, height: 10 }, { top: 0, left: 0, width: 40, height: 20 }))

      // rotate, then translate, then scale: SVG applies these right to left.
      expect(el.attr('transform')).toMatch(/^rotate\([^)]*\) translate\([^)]*\) scale\([^)]*\)$/)
    })
  })

  describe('groups', () => {
    /** A `g.shape` wrapping two rects, as GroupTool builds it. */
    const group = () => {
      const svg = document.createElementNS(SVG, 'svg')
      document.body.appendChild(svg)
      const g = document.createElementNS(SVG, 'g')
      svg.appendChild(g)
      const el = select(<never>g)
      el.attr('class', 'shape')
        .attr('top', 0)
        .attr('left', 0)
        .attr('right', 30)
        .attr('width', 30)
        .attr('height', 10)
        .attr('bottom', 10)

      for (const left of [0, 20]) {
        const child = document.createElementNS(SVG, 'rect')
        g.appendChild(child)
        select(<never>child)
          .attr('class', 'shape')
          .attr('x', left)
          .attr('y', 0)
          .attr('top', 0)
          .attr('left', left)
          .attr('right', left + 10)
          .attr('width', 10)
          .attr('height', 10)
          .attr('bottom', 10)
      }
      return el
    }

    it('moves every child, since a g renders nothing itself', () => {
      const el = group()
      transformShape(el, move)

      const children = el.selectChildren('.shape')
      const lefts: string[] = []
      children.each(function () {
        lefts.push(select(<never>this).attr('x'))
      })
      expect(lefts).toEqual(['5', '25'])
      expect(box(el)).toEqual({ top: 5, left: 5, width: 30, height: 10 })
    })

    it('resizes children and recomputes its own box from them', () => {
      const el = group()
      transformShape(el, transformation({ top: 0, left: 0, width: 30, height: 10 }, { top: 0, left: 0, width: 60, height: 20 }))

      const widths: string[] = []
      const lefts: string[] = []
      el.selectChildren('.shape').each(function () {
        widths.push(select(<never>this).attr('width'))
        lefts.push(select(<never>this).attr('x'))
      })
      expect(widths).toEqual(['20', '20'])
      expect(lefts).toEqual(['0', '40'])
      expect(box(el)).toEqual({ top: 0, left: 0, width: 60, height: 20 })
    })
  })
})

describe('translation', () => {
  it('is a pure move', () => {
    expect(translation(5, -3)).toEqual({ ox: 0, oy: 0, nx: 5, ny: -3, kx: 1, ky: 1 })
  })

  it('moves a shape without resizing it', () => {
    const el = shape('rect', { top: 10, left: 10, width: 30, height: 20 })
    transformShape(el, translation(5, -5))
    expect(box(el)).toEqual({ top: 5, left: 15, width: 30, height: 20 })
  })
})

describe('rotationOf', () => {
  it('reads a bare angle', () => {
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(45)' }))).toBe(45)
  })

  it('reads an angle with a pivot', () => {
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(30,5,5)' }))).toBe(30)
  })

  it('tolerates whitespace after the separators', () => {
    // The old Transform parser split on ' ' and mis-read exactly this form.
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(30, 5, 5)' }))).toBe(30)
  })

  it('reads a negative and a fractional angle', () => {
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(-12.5,1,1)' }))).toBe(-12.5)
  })

  it('is 0 when the shape carries no rotation', () => {
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }))).toBe(0)
    expect(rotationOf(shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'translate(4,4)' }))).toBe(0)
  })
})

describe('rotateShape', () => {
  it('rotates about the shape centre', () => {
    const el = shape('rect', { top: 10, left: 20, width: 40, height: 20 })
    rotateShape(el, 45)
    expect(el.attr('transform')).toBe('rotate(45,40,20)')
  })

  it('replaces an existing rotation rather than compounding it', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(30,5,5)' })
    rotateShape(el, 90)
    expect(el.attr('transform')).toBe('rotate(90,5,5)')
  })

  it('keeps any other transform on the element', () => {
    // Chart writes `rotate(...) translate(...)`; the translate must survive.
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'rotate(0,5,5) translate(7,8)' })
    rotateShape(el, 15)
    expect(el.attr('transform')).toBe('rotate(15,5,5) translate(7,8)')
  })

  it('prepends a rotation onto a transform that had none', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 }, { transform: 'translate(7,8)' })
    rotateShape(el, 15)
    expect(el.attr('transform')).toBe('rotate(15,5,5) translate(7,8)')
  })

  it('leaves the axis-aligned box untouched, so selection stays consistent', () => {
    const el = shape('rect', { top: 10, left: 20, width: 40, height: 20 })
    rotateShape(el, 33)
    expect(box(el)).toEqual({ top: 10, left: 20, width: 40, height: 20 })
  })

  it('round-trips through rotationOf', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 })
    rotateShape(el, -72.5)
    expect(rotationOf(el)).toBe(-72.5)
  })

  it('survives a resize, which re-pivots on the new centre', () => {
    const el = shape('rect', { top: 0, left: 0, width: 10, height: 10 })
    rotateShape(el, 45)
    transformShape(el, transformation({ top: 0, left: 0, width: 10, height: 10 }, { top: 0, left: 0, width: 20, height: 20 }))
    expect(el.attr('transform')).toBe('rotate(45,10,10)')
    expect(rotationOf(el)).toBe(45)
  })
})

describe('rotatePoint', () => {
  const pivot = { x: 10, y: 10 }

  it('leaves the pivot itself alone', () => {
    expect(rotatePoint(pivot, pivot, 90)).toEqual(pivot)
  })

  it('turns a quarter circle clockwise', () => {
    const { x, y } = rotatePoint({ x: 20, y: 10 }, pivot, 90)
    expect(x).toBeCloseTo(10)
    expect(y).toBeCloseTo(20)
  })

  it('turns a half circle', () => {
    const { x, y } = rotatePoint({ x: 20, y: 10 }, pivot, 180)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(10)
  })

  it('is the identity at 0 and 360 degrees', () => {
    for (const degrees of [0, 360]) {
      const { x, y } = rotatePoint({ x: 3, y: 7 }, pivot, degrees)
      expect(x).toBeCloseTo(3)
      expect(y).toBeCloseTo(7)
    }
  })

  it('composes: two rotations equal their sum', () => {
    const once = rotatePoint(rotatePoint({ x: 20, y: 10 }, pivot, 30), pivot, 60)
    const direct = rotatePoint({ x: 20, y: 10 }, pivot, 90)
    expect(once.x).toBeCloseTo(direct.x)
    expect(once.y).toBeCloseTo(direct.y)
  })
})

describe('boundsOf', () => {
  it('unions the boxes across a selection', () => {
    const svg = document.createElementNS(SVG, 'svg')
    document.body.appendChild(svg)
    const positions: Array<[number, number]> = [
      [0, 0],
      [40, 20]
    ]
    for (const [left, top] of positions) {
      const node = document.createElementNS(SVG, 'rect')
      svg.appendChild(node)
      select(<never>node)
        .attr('class', 'shape')
        .attr('top', top)
        .attr('left', left)
        .attr('right', left + 10)
        .attr('bottom', top + 10)
    }

    expect(boundsOf(select(<never>svg).selectAll('.shape'))).toEqual({ top: 0, left: 0, width: 50, height: 30 })
  })

  it('returns an empty box for an empty selection', () => {
    expect(boundsOf(select('nothing').selectAll('.shape'))).toEqual({ top: 0, left: 0, width: 0, height: 0 })
  })
})
