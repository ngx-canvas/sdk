import { Fill } from '../utilities/fill';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

export class Ellipse {

    public id: string = ObjectId();
    public type: string = 'ellipse';
    public data: any = {};
    public name: string = '';
    public fill: Fill = new Fill();
    public stroke: Stroke = new Stroke();
    public hidden: boolean = false;
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: ELLIPSE) {
        if (typeof (args) != 'undefined' && args != null) {
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

interface ELLIPSE {
    id?: string;
    data?: any;
    name?: string;
    fill?: Fill;
    stroke?: Stroke;
    hidden?: boolean;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}