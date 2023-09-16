import { Selection } from '../../project'
import { SHAPE, Shape } from '../shape/shape'

export class Iframe extends Shape {
  public src: string = ''
  public type: string = 'iframe'
  public title: string = ''
  
  constructor(args?: IFRAME) {
    super(args)
    if (typeof (args) !== 'undefined') {
      if (typeof (args.src) !== 'undefined') this.src = args.src
      if (typeof (args.title) !== 'undefined') this.title = args.title
    }
  }

  apply(parent: Selection) {
    this.el = parent.append('foreignObject')
    this.update()
  }

  update(config?: IFRAME) {
    if (config) Object.assign(this, config)
    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('left', this.position.left)
      .attr('name', this.name)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
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
