import * as d3 from 'd3'
import { Point } from '../point/point'

export class Position {
  public x: number = 0
  public y: number = 0
  public top: number = 0
  public left: number = 0
  public right: number = 0
  public width: number = 0
  public center: Point = new Point()
  public radius: number = 0
  public height: number = 0
  public bottom: number = 0
  public rotation: number = 0

  constructor (args?: POSITION) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.x) !== 'undefined' && args.x != null && args.x > 0) this.x = Math.floor(args.x)
      if (typeof (args.y) !== 'undefined' && args.y != null && args.y > 0) this.y = Math.floor(args.y)
      if (typeof (args.top) !== 'undefined' && args.top != null && args.top > 0) this.top = Math.floor(args.top)
      if (typeof (args.left) !== 'undefined' && args.left != null && args.left > 0) this.left = Math.floor(args.left)
      if (typeof (args.right) !== 'undefined' && args.right != null && args.right > 0) this.right = Math.floor(args.right)
      if (typeof (args.width) !== 'undefined' && args.width != null && args.width > 0) this.width = Math.floor(args.width)
      if (typeof (args.radius) !== 'undefined' && args.radius != null && args.radius > 0) this.radius = Math.floor(args.radius)
      if (typeof (args.center) !== 'undefined' && args.center != null) this.center = new Point(args.center)
      if (typeof (args.height) !== 'undefined' && args.height != null && args.height > 0) this.height = Math.floor(args.height)
      if (typeof (args.bottom) !== 'undefined' && args.bottom != null && args.bottom > 0) this.bottom = Math.floor(args.bottom)
      if (typeof (args.rotation) !== 'undefined' && args.rotation != null && args.rotation > 0) this.rotation = Math.floor(args.rotation)
    }

    this.bounds()
  }

  bounds () {
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
