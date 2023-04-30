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
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('fill', this.fill.color)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('class', 'shape')
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }

}

interface CIRCLE extends SHAPE { }