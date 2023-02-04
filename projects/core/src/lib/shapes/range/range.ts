import { SHAPE, Shape } from '../shape/shape';

export class Range extends Shape {

  public min: number = 0;
  public max: number = 100;
  public type: string = 'range';
  public step: number = 1;
  public value: number = 0;

  constructor(args?: RANGE) {
    super(args);
    Object.assign(this, args);
  };

  apply(parent: any) {
    this.el = parent.append('foreignObject')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5 - 2)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('id', this.id)
      .attr('name', this.name)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .append('xhtml:input')
      .attr('min', this.min)
      .attr('max', this.max)
      .attr('type', 'range')
      .attr('step', this.step)
      .attr('value', this.value)
      .style('width', this.position.width - 2 + 'px')
      .style('height', this.position.height + 'px')
    // .style('color', color(this.font.color, this.font.opacity))
    // .style('width', this.position.width + 'px')
    // .style('height', this.position.height + 'px')
    // .style('display', 'flex')
    // .style('font-size', this.font.size + 'px')
    // .style('font-style', this.font.style.includes('italic') ? 'italic' : null)
    // .style('font-family', this.font.family)
    // .style('font-weight', this.font.style.includes('bold') ? 'bold' : 'normal')
    // .style('align-items', this.font.alignment)
    // .style('border-width', this.stroke.width + 'px')
    // .style('border-color', color(this.stroke.color, this.stroke.opacity))
    // .style('border-style', this.stroke.style)
    // .style('border-radius', this.position.radius + 'px')
    // .style('stroke-linecap', this.stroke.cap)
    // .style('text-decoration', this.font.style.includes('underline') ? 'underline' : null)
    // .style('justify-content', this.font.baseline)
    // .style('background-color', color(this.fill.color, this.fill.opacity))
    // .html(this.value)
  };

}

interface RANGE extends SHAPE {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}