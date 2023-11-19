import * as d3 from 'd3'
import { Point } from '../../utilities'
import { Shape, SHAPE } from '../shape/shape'
import { Selection, CurveMode, CurveModes } from '@libs/common'

export class Curve extends Shape {
  readonly type: string = 'curve'
  
  public mode: CurveModes = 'basis'
  public points: Point[] = []

  constructor(args?: CURVE) {
    super(args)

    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply(parent: Selection) {
    this.el = parent.append('path')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: CURVE) {
    if (config) Object.assign(this, config)
    this.position.fromPoints(this.points)
    this.el
      .datum(this.points)
      .attr('d', d3.line().x((d: any) => d.x).y((d: any) => d.y).curve(CurveMode[this.mode]))
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
      .attr('points', this.points.map(o => [o.x, o.y].join(',')).join(' '))
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .attr('curve-mode', this.mode)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }

}

interface CURVE extends SHAPE {
  mode: CurveModes
  points: Point[]
}
