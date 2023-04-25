import { SHAPE, Shape } from '../shape/shape';

export class QuadraticBezierCurve extends Shape {

  public type: string = 'quadratic-bezier-curve';

  constructor(args?: QUADRATIC_BEZIER_CURVE) {
    super(args);
  };

  apply(parent: any) {
    this.el = parent.append('path')
      .attr('d', 'M100,200 Q250,100 400,200 T600 200')
      .attr('id', this.id)
      .attr('fill', this.fill.color)
      .attr('class', 'shape')
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }

}

interface QUADRATIC_BEZIER_CURVE extends SHAPE { }