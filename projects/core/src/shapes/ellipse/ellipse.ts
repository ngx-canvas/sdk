import { SHAPE, Shape } from '../shape/shape'

export class Ellipse extends Shape {
  public type: string = 'ellipse'

  constructor (args?: ELLIPSE) {
    super(args)
  }

  apply (parent: any) {
    this.el = parent.append('ellipse')
      .attr('id', this.id)
      .attr('class', 'shape')
    this.update()
  }

  update (config?: ELLIPSE) {
    if (config) Object.assign(this, config)
    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('rx', this.position.width > 0 ? this.position.width / 2 : 0)
      .attr('ry', this.position.height > 0 ? this.position.height / 2 : 0)
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('fill', this.fill.color)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }
}

interface ELLIPSE extends SHAPE { }
