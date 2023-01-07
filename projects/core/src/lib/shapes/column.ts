import { Fill } from '../utilities/fill';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

/* --- SHAPES --- */
import { Row } from './row';
import { Text } from './text';
import { Line } from './line';
import { Chart } from './chart';
import { Group } from './group';
import { Table } from './table';
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

export class Column {

    public id: string = ObjectId();
    public fill: Fill = new Fill();
    public data: any = {};
    public name: string = '';
    public type: string = 'column';
    public hidden: boolean = false;
    public stroke: Stroke = new Stroke();
    public selected: boolean = false;
    public dragging: boolean = false;
    public children: any[] = [];
    public position: Position = new Position();

    constructor(args?: COLUMN) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.name) != 'undefined' && args.name != null) {
                this.name = args.name;
            };
            if (typeof (args.data) != 'undefined' && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.fill) != 'undefined' && args.fill != null) {
                this.fill = new Fill(args.fill);
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.stroke = new Stroke(args.stroke);
            };
            if (typeof (args.hidden) != 'undefined' && args.hidden != null) {
                this.hidden = args.hidden;
            };
            if (typeof (args.children) != 'undefined' && args.children != null) {
                const shapes = {
                    'row': (args) => new Row(args),
                    'text': (args) => new Text(args),
                    'line': (args) => new Line(args),
                    'chart': (args) => new Chart(args),
                    'group': (args) => new Group(args),
                    'table': (args) => new Table(args),
                    'vector': (args) => new Vector(args),
                    'column': (args) => new Column(args),
                    'button': (args) => new Button(args),
                    'circle': (args) => new Circle(args),
                    'ellipse': (args) => new Ellipse(args),
                    'polygon': (args) => new Polygon(args),
                    'polyline': (args) => new Polyline(args),
                    'rectangle': (args) => new Rectangle(args),
                    'elliptical-curve': (args) => new EllipticalCurve(args),
                    'cubic-bezier-curve': (args) => new CubicBezierCurve(args),
                    'quadratic-bezier-curve': (args) => new QuadraticBezierCurve(args)
                };
                this.children = args.children.filter(o => shapes[o.type] instanceof Function).map(o => shapes[o.type](o));
            };
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
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

interface COLUMN {
    id?: string;
    fill?: Fill;
    data?: any;
    name?: string;
    type?: string;
    hidden?: boolean;
    stroke?: Stroke;
    children?: any[];
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}