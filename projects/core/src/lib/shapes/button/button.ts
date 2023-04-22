import { SHAPE, Shape } from '../shape/shape';

export class Button extends Shape {

  public type: string = 'button';
  public value: string = '';

  constructor(args?: BUTTON) {
    super(args);
    if (typeof(args) !== 'undefined') {
      if (typeof(args.value) !== 'undefined') this.value = args.value
    }
  };

  apply(parent: any) {
    function color(hex: string, opacity: number) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity / 100}` : null;
    }
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('name', this.name)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y}) translate(${this.position.x}, ${this.position.y})`)

    this.el.append('foreignObject')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .append('xhtml:button')
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
  };

}

interface BUTTON extends SHAPE {
  value?: string;
}