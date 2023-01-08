/* --- SHAPES --- */
import { Row } from './row';
import { SHAPE, Shape } from './_shape';

export class Table extends Shape {

  public type: string = 'table';
  public rows: Row[] = [];
  public value: string = '';
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

}

interface TABLE extends SHAPE {
  rows?: Row[];
  value?: string;
  header?: Row;
  footer?: Row;
}