import { Point } from '../../utilities/point/point'
import { SHAPE, Shape } from '../shape/shape'

export class Polygon extends Shape {
  public type: string = 'polygon'
  public points: Point[] = []

  constructor (args?: POLYGON) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (Array.isArray(args.points)) {
        this.points = args.points
      };
    };
  };

  apply (parent: any) {
    this.el = parent.append('polygon')
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('class', 'shape')
      .attr('bottom', this.position.bottom)
      .attr('points', this.points.map(o => [o.x, o.y].join(',')).join(' '))
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }
}

interface POLYGON extends SHAPE {
  points?: Point[]
}
