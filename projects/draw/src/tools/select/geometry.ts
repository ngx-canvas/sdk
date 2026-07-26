import { line } from 'd3-shape'
import { select } from 'd3-selection'
import { CurveMode, CurveModes, Point, Selection } from '@libs/common'

/** An axis-aligned rectangle in SVG user units. */
export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * The affine mapping that takes one axis-aligned rectangle onto another, in SVG
 * user units:
 *
 * ```
 * x' = nx + (x - ox) * kx
 * y' = ny + (y - oy) * ky
 * ```
 *
 * A drag of the selection body is just the case where `kx` and `ky` are 1, so
 * moving and resizing share a single code path.
 */
export interface Transformation {
  /** Origin of the source rectangle. */
  ox: number
  oy: number
  /** Origin of the destination rectangle. */
  nx: number
  ny: number
  /** Scale factors about the source origin. */
  kx: number
  ky: number
}

/** A transformation that leaves geometry untouched. */
export const IDENTITY: Transformation = { ox: 0, oy: 0, nx: 0, ny: 0, kx: 1, ky: 1 }

/** Build the mapping that takes `from` onto `to`. */
export const transformation = (from: Rect, to: Rect): Transformation => ({
  ox: from.left,
  oy: from.top,
  nx: to.left,
  ny: to.top,
  // A zero-sized source cannot be scaled from, so fall back to a pure move.
  kx: from.width === 0 ? 1 : to.width / from.width,
  ky: from.height === 0 ? 1 : to.height / from.height
})

const mapX = (t: Transformation, x: number): number => t.nx + (x - t.ox) * t.kx
const mapY = (t: Transformation, y: number): number => t.ny + (y - t.oy) * t.ky

const num = (shape: Selection, name: string): number => {
  const value = Number(shape.attr(name))
  return Number.isFinite(value) ? value : 0
}

/**
 * The bookkeeping box every shape carries. It mirrors the rendered geometry and
 * is what {@link Position.fromSelection}, the aligner and the select box all
 * read, so it has to be rewritten alongside the element's own attributes.
 */
const writeBounds = (shape: Selection, { top, left, width, height }: Rect): void => {
  shape
    .attr('x', left)
    .attr('y', top)
    .attr('top', top)
    .attr('left', left)
    .attr('right', left + width)
    .attr('width', width)
    .attr('height', height)
    .attr('bottom', top + height)
    .attr('cx', left + width / 2)
    .attr('cy', top + height / 2)

  // Keep the rotation pivot on the shape's new centre.
  const transform = shape.attr('transform')
  if (transform?.includes('rotate(')) {
    shape.attr(
      'transform',
      transform.replace(/rotate\(([^,)]+)[^)]*\)/, `rotate($1,${left + width / 2},${top + height / 2})`)
    )
  }
}

/** Read the point list a `polyline`, `polygon`, `path` or `curve` renders from. */
const readPoints = (shape: Selection): Point[] => {
  // `Line` and `Curve` bind their points as datum; `Curve`, `Polyline` and
  // `Polygon` additionally serialize them to a `points` attribute.
  const datum = shape.datum()
  if (Array.isArray(datum) && datum.every((o) => typeof o?.x === 'number' && typeof o?.y === 'number')) {
    return datum as Point[]
  }

  const attr = shape.attr('points')
  if (!attr) return []
  return attr
    .trim()
    .split(/\s+/)
    .filter((pair) => pair.length > 0)
    .map((pair) => {
      const [x, y] = pair.split(',')
      return { x: Number(x), y: Number(y) }
    })
}

/** Write a point list back in whichever forms the shape was rendered from. */
const writePoints = (shape: Selection, points: Point[]): void => {
  shape.datum(points)

  if (shape.attr('points') !== null) {
    shape.attr('points', points.map((o) => [o.x, o.y].join(',')).join(' '))
  }

  if (shape.attr('d') !== null) {
    const mode = <CurveModes>shape.attr('curve-mode')
    const generator = line<Point>()
      .x((d) => d.x)
      .y((d) => d.y)
    if (mode && CurveMode[mode]) generator.curve(CurveMode[mode])
    shape.attr('d', generator(points))
  }
}

/**
 * Apply `t` to a single shape, rewriting the attributes that element type
 * actually renders from as well as its bookkeeping box.
 *
 * Every shape in the SDK renders from a different set of attributes — a `rect`
 * from `x`/`y`/`width`/`height`, an `ellipse` from `cx`/`cy`/`rx`/`ry`, a
 * `polyline` from `points`, a `path` from `d`, and a `g` from nothing at all.
 * Writing only the bookkeeping box (which is what the tool used to do) moves and
 * resizes a `rect` and nothing else.
 */
export const transformShape = (shape: Selection, t: Transformation): void => {
  const node = <Element | null>shape.node()
  if (!node) return

  const tag = node.tagName.toLowerCase()

  if (tag === 'g') {
    // A `g` has no geometry of its own: transform the children and let the
    // group's box follow from theirs.
    const children = shape.selectChildren<Element, unknown>('.shape')
    children.each(function () {
      transformShape(select(this), t)
    })
    writeBounds(shape, boundsOf(children))
    return
  }

  const bounds: Rect = {
    top: mapY(t, num(shape, 'top')),
    left: mapX(t, num(shape, 'left')),
    width: num(shape, 'width') * t.kx,
    height: num(shape, 'height') * t.ky
  }

  switch (tag) {
    case 'polyline':
    case 'polygon':
    case 'path': {
      const points = readPoints(shape)
      if (points.length > 0) {
        writePoints(
          shape,
          points.map((o) => ({ x: mapX(t, o.x), y: mapY(t, o.y) }))
        )
      }
      break
    }
    case 'ellipse':
      shape
        .attr('cx', bounds.left + bounds.width / 2)
        .attr('cy', bounds.top + bounds.height / 2)
        .attr('rx', Math.max(bounds.width / 2, 0))
        .attr('ry', Math.max(bounds.height / 2, 0))
      break
    case 'circle':
      shape
        .attr('cx', bounds.left + bounds.width / 2)
        .attr('cy', bounds.top + bounds.height / 2)
        .attr('r', Math.max(Math.min(bounds.width, bounds.height) / 2, 0))
      break
    case 'line':
      shape
        .attr('x1', mapX(t, num(shape, 'x1')))
        .attr('y1', mapY(t, num(shape, 'y1')))
        .attr('x2', mapX(t, num(shape, 'x2')))
        .attr('y2', mapY(t, num(shape, 'y2')))
      break
    case 'text': {
      // Text has no width or height of its own, so a vertical resize scales the
      // type rather than stretching a box.
      const size = parseFloat(shape.style('font-size') || shape.attr('font-size') || '')
      if (Number.isFinite(size) && t.ky !== 1) shape.style('font-size', `${Math.max(size * t.ky, 1)}px`)
      break
    }
    default:
      // `rect`, `image`, `foreignObject` and anything else that renders from the
      // same x/y/width/height as the bookkeeping box.
      break
  }

  writeBounds(shape, bounds)
}

/** The union of the bookkeeping boxes across a selection. */
export const boundsOf = (selection: Selection): Rect => {
  let top = Infinity
  let left = Infinity
  let right = -Infinity
  let bottom = -Infinity

  selection.each(function () {
    const shape = select(this)
    top = Math.min(top, num(shape, 'top'))
    left = Math.min(left, num(shape, 'left'))
    right = Math.max(right, num(shape, 'right'))
    bottom = Math.max(bottom, num(shape, 'bottom'))
  })

  if (!Number.isFinite(top) || !Number.isFinite(left)) return { top: 0, left: 0, width: 0, height: 0 }

  return { top, left, width: right - left, height: bottom - top }
}

/** The smallest edge length a selection may be resized to, in user units. */
export const MINIMUM_SIZE = 1

/**
 * Resize `rect` by dragging the handle named by `from`, clamped so an edge can
 * never be dragged through its opposite one.
 */
export const resize = (rect: Rect, from: string, dx: number, dy: number): Rect => {
  const next: Rect = { ...rect }

  const west = () => {
    const delta = Math.min(dx, next.width - MINIMUM_SIZE)
    next.left += delta
    next.width -= delta
  }
  const north = () => {
    const delta = Math.min(dy, next.height - MINIMUM_SIZE)
    next.top += delta
    next.height -= delta
  }
  const east = () => {
    next.width = Math.max(next.width + dx, MINIMUM_SIZE)
  }
  const south = () => {
    next.height = Math.max(next.height + dy, MINIMUM_SIZE)
  }

  switch (from) {
    case 'body':
      next.left += dx
      next.top += dy
      break
    case 'n':
      north()
      break
    case 's':
      south()
      break
    case 'e':
      east()
      break
    case 'w':
      west()
      break
    case 'ne':
      north()
      east()
      break
    case 'nw':
      north()
      west()
      break
    case 'se':
      south()
      east()
      break
    case 'sw':
      south()
      west()
      break
  }

  return next
}
