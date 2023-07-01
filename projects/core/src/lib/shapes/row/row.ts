import { Column } from '../column/column'
import { SHAPE, Shape } from '../shape/shape'

export class Row extends Shape {
  public type: string = 'row'
  public columns: Column[] = []

  constructor (args?: ROW) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.columns) !== 'undefined' && args.columns != null) {
        this.columns = args.columns.map(o => new Column(o))
      };
    };

    let x = this.position.x
    this.columns.map(column => {
      column.position.x = x
      column.position.bounds()
      x += column.position.right
    })

    this.position.bounds = () => {
      this.position.top = this.columns.map(o => o.position.top).reduce((a, b) => Math.min(a, b), Infinity)
      this.position.left = this.columns.map(o => o.position.left).reduce((a, b) => Math.min(a, b), Infinity)
      this.position.right = this.columns.map(o => o.position.right).reduce((a, b) => Math.max(a, b), 0)
      this.position.bottom = this.columns.map(o => o.position.bottom).reduce((a, b) => Math.max(a, b), 0)

      this.position.width = this.columns.map(o => o.position.width).reduce((a, b) => a + b, 0)
      this.position.height = this.columns.map(o => o.position.height).reduce((a, b) => Math.max(a, b), 0)
    }
    this.position.bounds()
  };

  apply (parent: any) {
    this.el = parent.append('g')
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('id', this.id)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('type', this.type)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('class', 'shape')
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)

    // this.columns.map(o => this.column(o, this.el))
  }
}

interface ROW extends SHAPE {
  columns?: Column[]
}
