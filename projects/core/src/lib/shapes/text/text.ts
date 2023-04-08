import { SHAPE, Shape } from '../shape/shape';

export class Text extends Shape {

  public type: string = 'text';
  public value: string = '';

  constructor(args?: TEXT) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.value) != 'undefined' && args.value != null) {
        this.value = args.value;
      };
    };
  };

  apply(parent: any) {
    this.el = parent.append('rect')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .text(this.value)
      .attr('fill', '#Fafafa')
      .attr('width', this.position.width)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)
    // .attr('font-weight', this.font.weigth)

    this.el = parent.append('text')
      .attr('x', !(this.stroke.width % 2) ? this.position.x + 1 : this.position.x + 1.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('id', this.id)
      .text(this.value)
      .attr('fill', this.font.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('font-size', this.font.size)
      .attr('font-style', this.font.style)
      .attr('font-family', this.font.family)
      .attr('fill-opacity', this.font.opacity)
    // .attr('font-weight', this.font.weigth)
    let width = this.el.node().getComputedTextLength()
    let height = this.font.size / this.position.height
    let bounds = {
      top: 0,
      left: 0
    }
    switch (this.font.alignment) {
      case ('left'):
        bounds.left = this.position.left + 1
        break
      case ('right'):
        bounds.left = this.position.right - width - 1
        break
      case ('center'):
        bounds.left = this.position.left + (this.position.width - width) / 2
        break
    }
    this.el.attr('x', !(this.stroke.width % 2) ? bounds.left : bounds.left + 0.5)
    switch (this.font.baseline) {
      case ('top'):
        bounds.top = this.position.top + this.font.size
        break
      case ('middle'):
        bounds.top = this.position.top + (this.position.height * height)
        break
      case ('bottom'):
        bounds.top = this.position.top + (this.position.height - this.font.size) + this.font.size
        break
    }
    this.el.attr('y', !(this.stroke.width % 2) ? bounds.top : bounds.top + 0.5)
  }


}

interface TEXT extends SHAPE {
  value?: string;
}