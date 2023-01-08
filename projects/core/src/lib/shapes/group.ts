/* --- SHAPES --- */
import { Row } from './row';
import { Text } from './text';
import { Line } from './line';
import { Table } from './table';
import { Chart } from './chart';
import { Column } from './column';
import { Vector } from './vector';
import { Button } from './button';
import { Circle } from './circle';
import { Ellipse } from './ellipse';
import { Polygon } from './polygon';
import { Polyline } from './polyline';
import { Rectangle } from './rectangle';
import { EllipticalCurve } from './elliptical-curve';
import { CubicBezierCurve } from './cubic-bezier-curve';
import { QuadraticBezierCurve } from './quadratic-bezier-curve';
import { SHAPE, Shape } from './_shape';

export class Group extends Shape {

  public type: string = 'group';
  public children: any[] = [];

  constructor(args?: GROUP) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (Array.isArray(args.children)) {
        this.children = args.children;
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

}

interface GROUP extends SHAPE {
  children?: any[];
}