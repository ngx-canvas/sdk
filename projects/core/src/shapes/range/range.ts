import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'

export class Range extends Shape {
  readonly type: string = 'range'

  public min = 0
  public max = 100
  public step = 1
  public value = 0

  constructor(args?: RANGE) {
    super(args)
    if (args?.min) this.min = args.min
    if (args?.max) this.max = args.max
    if (args?.step) this.step = args.step
    if (args?.value) this.value = args.value
  }

  override apply(parent: Selection) {
    this.el = parent.append('foreignObject')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  override update(config?: RANGE) {
    if (config) Object.assign(this, config)
    if (!this.el) return
    this.el
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5 - 2)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('name', this.name)
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('width', this.position.width)
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('height', this.position.height)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .classed('selected', this.selected)
    let range = this.el.select('input')
    if (range.empty()) range = this.el.append('xhtml:input')
    range
      .attr('min', this.min)
      .attr('max', this.max)
      .attr('type', 'range')
      .attr('step', this.step)
      .attr('value', this.value)
      .style('width', this.position.width - 2 + 'px')
      .style('height', this.position.height + 'px')
      .style('outline', 'none')
  }
}

interface RANGE extends SHAPE {
  min?: number
  max?: number
  step?: number
  value?: number
}
