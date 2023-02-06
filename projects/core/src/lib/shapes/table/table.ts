/* --- SHAPES --- */
import { Row } from '../row/row';
import { SHAPE, Shape } from '../shape/shape';

export class Table extends Shape {

  public type: string = 'table';
  public rows: Row[] = [];
  public header: Row = new Row();
  public footer: Row = new Row();

  constructor(args?: TABLE) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.rows) != 'undefined' && args.rows != null) {
        this.rows = args.rows.map(o => new Row(o));
      };
      if (typeof (args.value) != 'undefined' && args.value != null) {
        this.value = args.value;
      };
      if (typeof (args.header) != 'undefined' && args.header != null) {
        this.header = new Row(args.header);
      };
      if (typeof (args.footer) != 'undefined' && args.footer != null) {
        this.footer = new Row(args.footer);
      };
      let top = this.header.position.bottom;
      this.rows.map(row => {
        row.columns.map(column => {
          column.position.y = top;
          column.position.top = top;
          column.position.bounds();
        });
        row.position.bounds();
        top += row.position.height;
      });
    };
  };

  apply(parent: any) {
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('class', 'shape')
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('center-x', !(this.stroke.width % 2) ? this.position.center.x : this.position.center.x + 0.5)
      .attr('center-y', !(this.stroke.width % 2) ? this.position.center.y : this.position.center.y + 0.5)

      this.el.append('rect')
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('fill', this.fill.color)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('stroke', this.stroke.color)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-opacity', this.stroke.opacity)

    // this.row(this.header, this.el)

    // this.rows.map(o => this.row(o, this.el))

    // this.row(this.footer, this.el)
  }

}

interface TABLE extends SHAPE {
  rows?: Row[];
  header?: Row;
  footer?: Row;
}