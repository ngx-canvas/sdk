import { Fill } from '../utilities/fill';
import { Column } from './column';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

export class Row {

    public id: string = ObjectId();
    public fill: Fill = new Fill();
    public data: any = {};
    public name: string = '';
    public type: string = 'row';
    public hidden: boolean = false;
    public stroke: Stroke = new Stroke();
    public columns: Column[] = [];
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: ROW) {
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
            if (typeof (args.columns) != 'undefined' && args.columns != null) {
                this.columns = args.columns.map(o => new Column(o));
            };
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
        };

        this.position.bounds = () => {
            this.position.top = this.columns.map(o => o.position.top).reduce((a, b) => Math.min(a, b), Infinity);
            this.position.left = this.columns.map(o => o.position.left).reduce((a, b) => Math.min(a, b), Infinity);
            this.position.right = this.columns.map(o => o.position.right).reduce((a, b) => Math.max(a, b), 0);
            this.position.bottom = this.columns.map(o => o.position.bottom).reduce((a, b) => Math.max(a, b), 0);
            
            this.position.width = this.columns.map(o => o.position.width).reduce((a, b) => a + b, 0);
            this.position.height = this.columns.map(o => o.position.height).reduce((a, b) => Math.max(a, b), 0);
        };
    };
}

interface ROW {
    id?: string;
    fill?: Fill;
    data?: any;
    name?: string;
    type?: string;
    hidden?: boolean;
    stroke?: Stroke;
    columns?: Column[];
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}