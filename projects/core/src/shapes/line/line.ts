import * as d3 from 'd3'
import { Point } from '../../utilities'
import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'

export class Line extends Shape {
  readonly type: string = 'line'

  public points: Point[] = []

  constructor (args?: LINE) {
    super(args)
    
    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  override apply (parent: Selection) {
    this.el = parent.append('path')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  override update (config?: LINE) {
    if (config) Object.assign(this, config)
    this.position.fromPoints(this.points)
    if (!this.el) return
    this.el
      .datum(this.points)
      .attr('d', d3.line<Point>().x(d => d.x).y(d => d.y)(this.points))
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
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
      .classed('selected', this.selected)
  }
}

interface LINE extends SHAPE {
  points?: Point[]
}
