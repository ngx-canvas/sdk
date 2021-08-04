import { Fill } from '../utilities/fill';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../id';
import { Position } from '../utilities/position';

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
            if (typeof (args.name) != "undefined" && args.name != null) {
                this.name = args.name;
            };
            if (typeof (args.data) != "undefined" && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.fill) != 'undefined' && args.fill != null) {
                this.fill = new Fill(args.fill);
            };
            if (typeof (args.hidden) != "undefined" && args.hidden != null) {
                this.hidden = args.hidden;
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.stroke = new Stroke(args.stroke);
            };
        };
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