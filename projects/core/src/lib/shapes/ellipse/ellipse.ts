import { SHAPE, Shape } from '../shape/shape';

export class Ellipse extends Shape {

  public type: string = 'ellipse';

  constructor(args?: ELLIPSE) {
    super(args);
  };

  apply(parent: any) {
    this.el = parent.append('ellipse')
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('rx', this.position.width / 2)
      .attr('ry', this.position.height / 2)
      .attr('id', this.id)
      .attr('fill', this.fill.color)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }

}

interface ELLIPSE extends SHAPE { }