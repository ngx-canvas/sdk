import { Fill } from '../utilities/fill';
import { Point } from '../utilities/point';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../id';
import { Position } from '../utilities/position';

export class Line {

    public id: string = ObjectId();
    public type: string = 'line';
    public data: any = {};
    public name: string = '';
    public fill: Fill = new Fill();
    public hidden: boolean = false;
    public points: Point[] = [];
    public stroke: Stroke = new Stroke();
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: LINE) {
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

interface LINE {
    id?: string;
    data?: any;
    fill?: Fill;
    name?: string;
    hidden?: boolean;
    points?: Point[];
    stroke?: Stroke;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}