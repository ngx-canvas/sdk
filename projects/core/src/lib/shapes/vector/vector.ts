import { SHAPE, Shape } from '../shape/shape';

export class Vector extends Shape {

  public src?: string;
  public type: string = 'vector';

  constructor(args?: VECTOR) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.src) != 'undefined' && args.src != null) {
        this.src = args.src;
      };
    };
  };

  apply(parent: any) {
    this.el = parent.append('image')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('id', this.id)
      .attr('href', this.src)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
  }

}

interface VECTOR extends SHAPE {
  src?: string;
}