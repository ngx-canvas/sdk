import { Selection } from '@libs/common'
import { SHAPE, Shape } from '../shape/shape'

export class Iframe extends Shape {
  readonly type: string = 'iframe'

  public src = ''
  public title = ''
  
  constructor(args?: IFRAME) {
    super(args)
    if (typeof (args) !== 'undefined') {
      if (typeof (args.src) !== 'undefined') this.src = args.src
      if (typeof (args.title) !== 'undefined') this.title = args.title
    }
  }

  override apply(parent: Selection) {
    this.el = parent.append('foreignObject')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  override update(config?: IFRAME) {
    if (config) Object.assign(this, config)
    if (!this.el) return
    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('top', this.position.top)
      .attr('left', this.position.left)
      .attr('name', this.name)
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .classed('selected', this.selected)
    let iframe = this.el.select('iframe')
    if (iframe.empty()) iframe = this.el.append('xhtml:iframe')
    iframe
      .attr('src', this.src)
      .attr('title', this.title)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('border', 'none')
  }
}


interface IFRAME extends SHAPE {
  src?: string
  title?: string
}
