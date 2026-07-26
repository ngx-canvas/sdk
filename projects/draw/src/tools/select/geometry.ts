import { line } from 'd3-shape'
import { select } from 'd3-selection'
import { CurveMode, CurveModes, Point, Rect, Selection, boundsOf, num } from '@libs/common'

// `Rect` and `boundsOf` live in `@libs/common` so the select box, the group tool
// and `Position` share one definition of "the box around these shapes". They are
// re-exported here because they are part of `@ngx-canvas/draw`'s public surface.
export { boundsOf } from '@libs/common'
export type { Rect } from '@libs/common'

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

/**
 * A pure move by `dx`/`dy`.
 *
 * Translating through {@link transformShape} rather than by writing the
 * bookkeeping box directly is what makes a move apply to a `polyline`'s points or
 * a `path`'s `d` as well as to a `rect`'s `x`/`y`.
 */
export const translation = (dx: number, dy: number): Transformation => ({
  ox: 0,
  oy: 0,
  nx: dx,
  ny: dy,
  kx: 1,
  ky: 1
})

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

/**
 * Matches an SVG `rotate(angle)` or `rotate(angle, cx, cy)`, capturing the angle.
 *
 * Read as a string rather than through `DOMMatrix` or `transform.baseVal`: jsdom
 * implements neither, so the parsed route would be untestable here. Separators are
 * `,` and/or whitespace, per the SVG transform grammar.
 */
const ROTATE = /rotate\(\s*([-\d.eE+]+)\s*(?:[,\s][^)]*)?\)/

/** Matches `translate(tx, ty)`, capturing both components. */
const TRANSLATE = /translate\(\s*([-\d.eE+]+)\s*[,\s]\s*([-\d.eE+]+)\s*\)/

/** Matches `scale(k)` or `scale(kx, ky)`; `ky` defaults to `kx` per the SVG spec. */
const SCALE = /scale\(\s*([-\d.eE+]+)(?:\s*[,\s]\s*([-\d.eE+]+))?\s*\)/

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
  if (transform && ROTATE.test(transform)) {
    shape.attr('transform', transform.replace(ROTATE, `rotate($1,${left + width / 2},${top + height / 2})`))
  }
}

/**
 * Rotate a point about a pivot, in SVG user units.
 *
 * Used to carry a shape's centre around the selection's centre so a
 * multi-shape rotation is rigid: the selection turns as one piece rather than
 * each shape spinning in place.
 */
export const rotatePoint = (point: Point, pivot: Point, degrees: number): Point => {
  const radians = (degrees * Math.PI) / 180
  const sin = Math.sin(radians)
  const cos = Math.cos(radians)
  const dx = point.x - pivot.x
  const dy = point.y - pivot.y

  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos
  }
}

/** The shape's current rotation in degrees, or 0 if it carries none. */
export const rotationOf = (shape: Selection): number => {
  const [, angle] = ROTATE.exec(shape.attr('transform') ?? '') ?? []
  const value = Number(angle)
  return Number.isFinite(value) ? value : 0
}

/**
 * Rotate a shape to `degrees` about its own centre.
 *
 * The angle is absolute, not a delta, so a drag can be tracked from the pointer's
 * bearing without accumulating error. Only the `rotate()` term is touched — any
 * other transform on the element (a `translate()`, as `Chart` writes) survives.
 *
 * Rotating about the shape's own centre leaves the axis-aligned bookkeeping box
 * untouched, which is what keeps `byBounds` selection and the aligner consistent.
 */
export const rotateShape = (shape: Selection, degrees: number): void => {
  const node = <Element | null>shape.node()
  if (!node) return

  const cx = num(shape, 'left') + num(shape, 'width') / 2
  const cy = num(shape, 'top') + num(shape, 'height') / 2
  const rotate = `rotate(${degrees},${cx},${cy})`

  const transform = shape.attr('transform')
  if (transform && ROTATE.test(transform)) {
    shape.attr('transform', transform.replace(ROTATE, rotate))
  } else if (transform) {
    // Prepend, so the rotation is applied about the untranslated centre.
    shape.attr('transform', `${rotate} ${transform}`)
  } else {
    shape.attr('transform', rotate)
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
 * Move and resize a `g` that draws its own content.
 *
 * `Chart` and `Table` render into a `g.shape` whose children carry no `.shape`
 * class, so there is nothing to recurse into. Both draw in local coordinates from
 * the origin and place the result with a `translate()` in their own transform, so
 * moving means rewriting that translate and resizing means composing a `scale()`.
 *
 * The scale is cumulative — multiplied into whatever is already there — because
 * the content keeps whatever size it was last rendered at by `update()`.
 *
 * Term order matters: SVG applies a transform list right to left, so
 * `rotate() translate() scale()` scales the content about its own origin, then
 * positions it, then rotates it about the pivot.
 */
const transformLeafGroup = (shape: Selection, t: Transformation, bounds: Rect): void => {
  const transform = shape.attr('transform') ?? ''

  const [, kx, ky] = SCALE.exec(transform) ?? []
  // `scale(k)` means `scale(k, k)`; absent means no scaling yet.
  const scaleX = Number.isFinite(Number(kx)) ? Number(kx) : 1
  const scaleY = Number.isFinite(Number(ky)) ? Number(ky) : scaleX

  const moved = `translate(${bounds.left},${bounds.top})`
  const scaled = `scale(${scaleX * t.kx},${scaleY * t.ky})`

  let next = TRANSLATE.test(transform) ? transform.replace(TRANSLATE, moved) : `${transform} ${moved}`.trim()
  next = SCALE.test(next) ? next.replace(SCALE, scaled) : `${next} ${scaled}`

  shape.attr('transform', next.trim())
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

  const bounds: Rect = {
    top: mapY(t, num(shape, 'top')),
    left: mapX(t, num(shape, 'left')),
    // Measured from the edges, not the `width`/`height` attributes: `Polygon`
    // never writes those, so reading them collapses its box to nothing.
    width: (num(shape, 'right') - num(shape, 'left')) * t.kx,
    height: (num(shape, 'bottom') - num(shape, 'top')) * t.ky
  }

  if (tag === 'g') {
    const children = shape.selectChildren<Element, unknown>('.shape')
    if (children.empty()) {
      // A leaf group renders its own content (`Chart`, `Table`), so there is
      // nothing to recurse into — move the group itself.
      transformLeafGroup(shape, t, bounds)
      writeBounds(shape, bounds)
      return
    }

    // A grouping `g` has no geometry of its own: transform the children and let
    // the group's box follow from theirs.
    children.each(function () {
      transformShape(select(this), t)
    })
    writeBounds(shape, boundsOf(children))
    return
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
