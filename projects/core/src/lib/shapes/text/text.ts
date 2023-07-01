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
    function color(hex: string, opacity: number) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return (result != null) ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100}` : null
    }
    this.el = parent.append('g')
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('id', this.id)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('name', this.name)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y}) translate(${this.position.x}, ${this.position.y})`)

    this.el.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('width', this.position.width)
      .attr('right', this.position.right)
      .attr('bottom', this.position.bottom)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)

    this.el.append('foreignObject')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .append('xhtml:p')
      .style('color', color(this.font.color, this.font.opacity))
      .style('width', this.position.width + 'px')
      .style('height', this.position.height + 'px')
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
