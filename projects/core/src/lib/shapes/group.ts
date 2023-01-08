import { Fill } from '../utilities/fill';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

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

export class Group {

    public id: string = ObjectId();
    public type: string = 'group';
    public data: any = {};
    public name: string = '';
    public fill: Fill = new Fill();
    public stroke: Stroke = new Stroke();
    public hidden: boolean = false;
    public selected: boolean = false;
    public dragging: boolean = false;
    public children: any[] = [];
    public position: Position = new Position();

    constructor(args?: GROUP) {
        if (typeof (args) != 'undefined' && args != null) {
            if (Array.isArray(args.children)) {
                this.children = args.children;
            };
            if (typeof (args.name) != 'undefined' && args.name != null) {
                this.name = args.name;
            };
            if (typeof (args.data) != 'undefined' && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.fill) != 'undefined' && args.fill != null) {
                this.fill = new Fill(args.fill);
            };
            if (typeof (args.hidden) != 'undefined' && args.hidden != null) {
                this.hidden = args.hidden;
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.stroke = new Stroke(args.stroke);
            };
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

}

interface GROUP {
    id?: string;
    data?: any;
    name?: string;
    fill?: Fill;
    stroke?: Stroke;
    hidden?: boolean;
    selected?: boolean;
    dragging?: boolean;
    children?: any[];
    position?: Position;
}