import * as d3 from 'd3'
import { Point } from '../../utilities'
import { SHAPE, Shape } from '../shape/shape'

export class EllipticalCurve extends Shape {
  public type: string = 'elliptical-curve'
  public points: Point[] = []

  constructor(args?: ELLIPTICAL_CURVE) {
    super(args)

    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply(parent: any) {
    const arc = d3.arc()
      .endAngle(2 * 180)
      .startAngle(100)
      .innerRadius(40)
      .outerRadius(45)
      .cornerRadius(10)

    this.el = parent.append('path')
      .attr('d', arc)
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('bottom', this.position.bottom)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }
}

interface ELLIPTICAL_CURVE extends SHAPE {
  points: Point[]
}
