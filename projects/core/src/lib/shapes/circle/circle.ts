import { SHAPE, Shape } from '../shape/shape';

export class Circle extends Shape {

  public type: string = 'circle';

  constructor(args?: CIRCLE) {
    super(args)
  }

  apply(parent: any) {
    this.el = parent.append('circle')
      .attr('r', this.position.radius)
      .attr('id', this.id)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('fill', this.fill.color)
      .attr('stroke', this.stroke.color)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }

}

interface CIRCLE extends SHAPE { }