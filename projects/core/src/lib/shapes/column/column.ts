/* --- SHAPES --- */
import { Row } from '../row/row';
import { Text } from '../text/text';
import { Line } from '../line/line';
import { Chart } from '../chart/chart';
import { Group } from '../group/group';
import { Table } from '../table/table';
import { Vector } from '../vector/vector';
import { Button } from '../button/button';
import { Circle } from '../circle/circle';
import { Ellipse } from '../ellipse/ellipse';
import { Polygon } from '../polygon/polygon';
import { Polyline } from '../polyline/polyline';
import { Rectangle } from '../rectangle/rectangle';
import { EllipticalCurve } from '../elliptical-curve/elliptical-curve';
import { CubicBezierCurve } from '../cubic-bezier-curve/cubic-bezier-curve';
import { QuadraticBezierCurve } from '../quadratic-bezier-curve/quadratic-bezier-curve';
import { SHAPE, Shape } from '../shape/shape';

export class Column extends Shape {

  public type: string = 'column';
  public children: any[] = [];

  constructor(args?: COLUMN) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.children) != 'undefined' && args.children != null) {
        const shapes = {
          'row': (args: any) => new Row(args),
          'text': (args: any) => new Text(args),
          'line': (args: any) => new Line(args),
          'chart': (args: any) => new Chart(args),
          'group': (args: any) => new Group(args),
          'table': (args: any) => new Table(args),
          'vector': (args: any) => new Vector(args),
          'column': (args: any) => new Column(args),
          'button': (args: any) => new Button(args),
          'circle': (args: any) => new Circle(args),
          'ellipse': (args: any) => new Ellipse(args),
          'polygon': (args: any) => new Polygon(args),
          'polyline': (args: any) => new Polyline(args),
          'rectangle': (args: any) => new Rectangle(args),
          'elliptical-curve': (args: any) => new EllipticalCurve(args),
          'cubic-bezier-curve': (args: any) => new CubicBezierCurve(args),
          'quadratic-bezier-curve': (args: any) => new QuadraticBezierCurve(args)
        };
        this.children = args.children.filter(o => (<any>shapes)[o.type] instanceof Function).map(o => (<any>shapes)[o.type](o));
      };
    };

    this.position.bounds = () => {
      this.position.top = this.children.map(o => o.position.top).reduce((a, b) => Math.min(a, b), Infinity);
      this.position.left = this.children.map(o => o.position.left).reduce((a, b) => Math.min(a, b), Infinity);
      this.position.right = this.children.map(o => o.position.right).reduce((a, b) => Math.max(a, b), 0);
      this.position.bottom = this.children.map(o => o.position.bottom).reduce((a, b) => Math.max(a, b), 0);

      this.position.width = this.children.map(o => o.position.width).reduce((a, b) => a + b, 0);
      this.position.height = this.children.map(o => o.position.height).reduce((a, b) => Math.max(a, b), 0);
    };
    this.position.bounds();
  };

  apply(parent: any) {
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)

    this.children.map(o => o.apply(this.el))
  }
}

interface COLUMN extends SHAPE {
  children?: any[];
}