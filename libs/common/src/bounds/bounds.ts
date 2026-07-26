import { max, min } from 'd3-array'
import { select } from 'd3-selection'
import { Selection } from '../selection/selection'

/** An axis-aligned rectangle in SVG user units. */
export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/** An empty rectangle, used whenever there is nothing to measure. */
export const EMPTY_RECT: Rect = { top: 0, left: 0, width: 0, height: 0 }

/** Read a numeric attribute, treating anything unparseable as 0. */
export const num = (shape: Selection, name: string): number => {
  const value = Number(shape.attr(name))
  return Number.isFinite(value) ? value : 0
}

/**
 * The union of a list of edge boxes.
 *
 * `min`/`max` return `undefined` for an empty input, which is what lets the
 * empty case fall out without `Infinity` sentinels.
 */
export const unionOf = (edges: Edges[]): Rect => {
  const top = min(edges, (d) => d.top)
  const left = min(edges, (d) => d.left)
  const right = max(edges, (d) => d.right)
  const bottom = max(edges, (d) => d.bottom)

  if (top === undefined || left === undefined || right === undefined || bottom === undefined) {
    return { ...EMPTY_RECT }
  }

  return { top, left, width: right - left, height: bottom - top }
}

/**
 * The union of the bookkeeping boxes (`top`/`left`/`right`/`bottom`) across a
 * selection.
 *
 * This is the one place that reduces many shapes to a single box: the select
 * box, the group tool and `Position.fromSelection` all read it, so they agree by
 * construction.
 */
export const boundsOf = (selection: Selection): Rect => {
  const edges: Edges[] = []
  selection.each(function () {
    const shape = select(this)
    edges.push({
      top: num(shape, 'top'),
      left: num(shape, 'left'),
      right: num(shape, 'right'),
      bottom: num(shape, 'bottom')
    })
  })

  return unionOf(edges)
}

/** The four edges of an axis-aligned box. */
export interface Edges {
  top: number
  left: number
  right: number
  bottom: number
}
