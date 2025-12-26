import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'
import { Position } from '../../utilities/position/position'
import { Fill } from '../../utilities/fill/fill'
import { Stroke } from '../../utilities/stroke/stroke'
import { Font } from '../../utilities/font/font'

export class Text extends Shape {
  readonly type: string = 'text'
  
  public value = ''

  constructor(args?: TEXT) {
    super(args)
    if (args?.value) this.value = args.value
  }

  override apply(parent: Selection) {
    this.el = parent.append('text')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  override update(config?: TEXT) {
    if (config) {
      if (config.position) this.position = new Position(config.position)
      if (config.fill) this.fill = new Fill(config.fill)
      if (config.stroke) this.stroke = new Stroke(config.stroke)
      if (config.font) this.font = new Font(config.font)
      if (config.value !== undefined) this.value = config.value
      Object.assign(this, config)
    }

    if (!this.el) return

    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('name', this.name)
      .attr('left', this.position.left)
      .attr('width', this.position.width)
      .attr('right', this.position.right)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .text(this.value)
      .classed('selected', this.selected)
  }
}

interface TEXT extends SHAPE {
  value?: string
}

// function color(hex: string, opacity: number) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
//   return (result != null) ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100}` : null
// }
