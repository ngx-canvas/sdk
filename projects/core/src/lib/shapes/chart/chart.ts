import { SHAPE, Shape } from '../shape/shape';

export class Chart extends Shape {

  public type: string = 'chart';

  constructor(args?: CHART) {
    super(args);
  };

  apply(parent: any) {
    this.el = parent.append('rect')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('id', this.id)
      .attr('rx', this.position.radius)
      .attr('fill', this.fill.color)
      .attr('width', this.position.width)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }
}

interface CHART extends SHAPE { }