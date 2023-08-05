import { Point } from '../../utilities'
import { SHAPE, Shape } from '../shape/shape'

export class QuadraticBezierCurve extends Shape {
  public type: string = 'quadratic-bezier-curve'
  public points: Point[] = []

  constructor (args?: QUADRATIC_BEZIER_CURVE) {
    super(args)

    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply (parent: any) {
    let d = 'M'
    this.points.forEach((point, index) => {
      d = d + ' '
      switch(index) {
        case 0:
          d = d + `${point.x} ${point.y}`
          break
        case 1:
          d = d + `Q ${point.x} ${point.y},`
          break
        case 2:
          d = d + `${point.x} ${point.y}`
          break
      }
    })

    this.el = parent.append('path')
      .attr('d', 'M100,200 Q250,100 400,200 T600 200')
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('class', 'shape')
      .attr('bottom', this.position.bottom)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }
}

interface QUADRATIC_BEZIER_CURVE extends SHAPE {
  points: Point[]
}
