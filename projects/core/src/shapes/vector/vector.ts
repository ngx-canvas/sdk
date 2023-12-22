import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'

export class Vector extends Shape {
  public src?: string
  public type = 'vector'

  constructor (args?: VECTOR) {
    super(args)
    if (typeof (args?.src) !== 'undefined' && args?.src != null) this.src = args.src
  }

  apply (parent: Selection) {
    this.el = parent.append('image')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update (config?: VECTOR) {
    if (config) Object.assign(this, config)
    this.el
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('left', this.position.left)
      .attr('href', this.src)
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .classed('selected', this.selected)
  }
}

interface VECTOR extends SHAPE {
  src?: string
}
