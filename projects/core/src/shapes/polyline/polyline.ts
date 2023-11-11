import { Point } from '../../utilities'
import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'

export class Polyline extends Shape {
  readonly type: string = 'polyline'

  public points: Point[] = []

  constructor(args?: POLYLINE) {
    super(args)
    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply(parent: Selection) {
    this.el = parent.append('polyline')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: POLYLINE) {
    if (config) Object.assign(this, config)
    this.position.fromPoints(this.points)
    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('points', this.points.map(o => [o.x, o.y].join(',')).join(' '))
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }
}

interface POLYLINE extends SHAPE {
  points?: Point[]
}
