import * as d3 from 'd3'
import { Point } from '../point/point'
import { Selection } from '@libs/common'

export class Position {
  public x = 0
  public y = 0
  public top = 0
  public left = 0
  public right = 0
  public width = 0
  public center: Point = new Point()
  public radius = 0
  public height = 0
  public bottom = 0
  public rotation = 0

  constructor(args?: POSITION) {
    if (args != null) {
      if (typeof args.x === 'number' && !isNaN(args.x)) this.x = Math.floor(args.x)
      if (typeof args.y === 'number' && !isNaN(args.y)) this.y = Math.floor(args.y)
      if (typeof args.top === 'number' && !isNaN(args.top)) this.top = Math.floor(args.top)
      if (typeof args.left === 'number' && !isNaN(args.left)) this.left = Math.floor(args.left)
      if (typeof args.right === 'number' && !isNaN(args.right)) this.right = Math.floor(args.right)
      if (typeof args.width === 'number' && !isNaN(args.width) && args.width > 0) this.width = Math.floor(args.width)
      if (typeof args.radius === 'number' && !isNaN(args.radius) && args.radius > 0) this.radius = Math.floor(args.radius)
      if (args.center != null) this.center = new Point(args.center)
      if (typeof args.height === 'number' && !isNaN(args.height) && args.height > 0) this.height = Math.floor(args.height)
      if (typeof args.bottom === 'number' && !isNaN(args.bottom)) this.bottom = Math.floor(args.bottom)
      if (typeof args.rotation === 'number' && !isNaN(args.rotation)) this.rotation = Math.floor(args.rotation)
    }

    this.bounds()
  }

  bounds() {
    this.top = this.y
    this.left = this.x
    this.right = this.left + this.width
    this.bottom = this.top + this.height
    this.center = new Point({
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2)
    })
  }

  fromPoints(points: Point[]) {
    const x = points.map((pt) => pt.x)
    const y = points.map((pt) => pt.y)

    const top = d3.min(y) || 0
    const left = d3.min(x) || 0
    const right = d3.max(x) || 0
    const bottom = d3.max(y) || 0

    this.x = left
    this.y = top
    this.top = top
    this.left = left
    this.right = right
    this.width = right - left
    this.height = bottom - top
    this.bottom = bottom
    this.bounds()
    return this
  }

  fromSelection(selection: Selection) {
    const items: POSITION[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push({
        top: Number(shape.attr('top')),
        left: Number(shape.attr('left')),
        right: Number(shape.attr('right')),
        bottom: Number(shape.attr('bottom'))
      })
    })
    const top: number = d3.min(items, (d: POSITION) => d.top) || 0
    const left: number = d3.min(items, (d: POSITION) => d.left) || 0
    const right: number = d3.max(items, (d: POSITION) => d.right) || 0
    const bottom: number = d3.max(items, (d: POSITION) => d.bottom) || 0

    this.x = left
    this.y = top
    this.top = top
    this.left = left
    this.right = right
    this.width = right - left
    this.height = bottom - top
    this.bottom = bottom
    this.bounds()
    return this
  }
}

export interface POSITION {
  x?: number
  y?: number
  top?: number
  left?: number
  width?: number
  right?: number
  height?: number
  radius?: number
  center?: Point
  bottom?: number
  rotation?: number
}
