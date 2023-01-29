import { SHAPE, Shape } from '../shape/shape';

export class CubicBezierCurve extends Shape {

  public type: string = 'cubic-bezier-curve';

  constructor(args?: CUBIC_BEZIER_CURVE) {
    super(args);
  };

  apply(parent: any) {
    this.el = parent.append('path')
      .attr('d', 'M100,200 C100,100  400,100  400,200')
      .attr('id', this.id)
      .attr('fill', this.fill.color)
      .attr('stroke', this.stroke.color)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }

}

interface CUBIC_BEZIER_CURVE extends SHAPE { }