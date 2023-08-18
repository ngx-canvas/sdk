import { SHAPE, Shape } from '../shape/shape'

export class Text extends Shape {
  public type: string = 'text'
  public value: string = ''

  constructor(args?: TEXT) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.value) !== 'undefined' && args.value != null) {
        this.value = args.value
      }
    }
  }

  apply(parent: any) {
    this.el = parent.append('foreignObject')
      .attr('id', this.id)
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
      .attr('right', this.position.right)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
    let text = this.el.select('p')
    if (text.empty()) text = this.el.append('xhtml:p')
    text
      .style('color', color(this.font.color, this.font.opacity))
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('font-size', this.font.size + 'px')
      .style('font-style', this.font.style.includes('italic') ? 'italic' : null)
      .style('font-family', this.font.family)
      .style('font-weight', this.font.style.includes('bold') ? 'bold' : 'normal')
      .style('align-items', this.font.alignment)
      .style('border-width', this.stroke.width + 'px')
      .style('border-color', color(this.stroke.color, this.stroke.opacity))
      .style('border-style', this.stroke.style)
      .style('border-radius', this.position.radius + 'px')
      .style('stroke-linecap', this.stroke.cap)
      .style('text-decoration', this.font.style.includes('underline') ? 'underline' : null)
      .style('justify-content', this.font.baseline)
      .style('background-color', color(this.fill.color, this.fill.opacity))
      .html(this.value)
  }
}

interface TEXT extends SHAPE {
  value?: string
}

function color(hex: string, opacity: number) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (result != null) ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100}` : null
}
