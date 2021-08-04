import { Fill } from '../utilities/fill';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../id';
import { Position } from '../utilities/position';

export class Rectangle {

    public id: string = ObjectId();
    public fill: Fill = new Fill();
    public data: any = {};
    public name: string = '';
    public type: string = 'rectangle';
    public hidden: boolean = false;
    public stroke: Stroke = new Stroke();
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: RECTANGLE) {
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
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
        };
    };
}

interface RECTANGLE {
    id?: string;
    fill?: Fill;
    data?: any;
    name?: string;
    type?: string;
    hidden?: boolean;
    stroke?: Stroke;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}