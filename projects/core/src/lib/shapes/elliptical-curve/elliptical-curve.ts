import { SHAPE, Shape } from '../shape/shape'

export class EllipticalCurve extends Shape {
  public type: string = 'elliptical-curve'

  constructor (args?: ELLIPTICAL_CURVE) {
    super(args)
  };

  apply (parent: any) {
    this.el = parent.append('path')
      .attr('d', 'M250,100  A120,80 0 0,0 250,200')
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

interface ELLIPTICAL_CURVE extends SHAPE { }
