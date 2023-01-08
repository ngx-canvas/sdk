/* --- BASE --- */
import { Shape, SHAPE } from './_shape';

export class Rectangle extends Shape {

  public type: string = 'rectangle';

  constructor(args?: RECTANGLE) {
    super(args)
  };

  apply(parent: any) {
    this.el = parent.append('rect')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('id', this.id)
      .attr('rx', this.position.radius)
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('fill', this.fill.color)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('class', 'shape')
      .attr('width', this.position.width)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }
}

interface RECTANGLE extends SHAPE {
  type?: string;
}