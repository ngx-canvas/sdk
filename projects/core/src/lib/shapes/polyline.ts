import { Fill } from '../utilities/fill';
import { Point } from '../utilities/point';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../id';
import { Position } from '../utilities/position';

export class Polyline {

    public id: string = ObjectId();
    public data: any = {};
    public fill: Fill = new Fill();
    public name: string = '';
    public type: string = 'polyline';
    public stroke: Stroke = new Stroke();
    public points: Point[] = [];
    public hidden: boolean = false;
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: POLYLINE) {
        if (typeof (args) != 'undefined' && args != null) {
            if (Array.isArray(args.points)) {
                this.points = args.points;
            };
            if (typeof (args.data) != 'undefined' && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.name) != 'undefined' && args.name != null) {
                this.name = args.name;
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
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
        };
    };

}

interface POLYLINE {
    id?: string;
    data?: any;
    name?: string;
    fill?: Fill;
    hidden?: boolean;
    points?: Point[];
    stroke?: Stroke;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}