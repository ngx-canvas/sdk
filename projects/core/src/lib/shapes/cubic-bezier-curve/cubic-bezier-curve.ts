import { SHAPE, Shape } from '../shape/shape'

export class CubicBezierCurve extends Shape {
  public type: string = 'cubic-bezier-curve'

  constructor (args?: CUBIC_BEZIER_CURVE) {
    super(args)
  };

  apply (parent: any) {
    this.el = parent.append('path')
      .attr('d', 'M100,200 C100,100  400,100  400,200')
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

interface CUBIC_BEZIER_CURVE extends SHAPE { }
