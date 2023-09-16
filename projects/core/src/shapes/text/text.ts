import { Selection } from '../../project'
import { SHAPE, Shape } from '../shape/shape'

export class Text extends Shape {
  readonly type: string = 'text'
  
  public value: string = ''

  constructor(args?: TEXT) {
    super(args)
    if (args?.value) this.value = args.value
  }

  apply(parent: Selection) {
    this.el = parent.append('text')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: TEXT) {
    if (config) Object.assign(this, config)
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
  }
}

interface TEXT extends SHAPE {
  value?: string
}

// function color(hex: string, opacity: number) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
//   return (result != null) ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100}` : null
// }
