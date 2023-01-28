import { Column } from '../column/column';
import { SHAPE, Shape } from '../shape/shape';

export class Row extends Shape {

  public type: string = 'row';
  public columns: Column[] = [];

  constructor(args?: ROW) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.columns) != 'undefined' && args.columns != null) {
        this.columns = args.columns.map(o => new Column(o));
      };
    };

    let x = this.position.x;
    this.columns.map(column => {
      column.position.x = x;
      column.position.bounds();
      x += column.position.right;
    });

    this.position.bounds = () => {
      this.position.top = this.columns.map(o => o.position.top).reduce((a, b) => Math.min(a, b), Infinity);
      this.position.left = this.columns.map(o => o.position.left).reduce((a, b) => Math.min(a, b), Infinity);
      this.position.right = this.columns.map(o => o.position.right).reduce((a, b) => Math.max(a, b), 0);
      this.position.bottom = this.columns.map(o => o.position.bottom).reduce((a, b) => Math.max(a, b), 0);

      this.position.width = this.columns.map(o => o.position.width).reduce((a, b) => a + b, 0);
      this.position.height = this.columns.map(o => o.position.height).reduce((a, b) => Math.max(a, b), 0);
    };
    this.position.bounds();
  };
}

interface ROW extends SHAPE {
  columns?: Column[];
}