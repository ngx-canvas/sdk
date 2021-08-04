import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../id';
import { Position } from '../utilities/position';

export class Vector {

    public id: string = ObjectId();
    public src: string = null;
    public data: any = {};
    public type: string = 'vector';
    public name: string = '';
    public hidden: boolean = false;
    public stroke: Stroke = new Stroke();
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: VECTOR) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.src) == 'string') {
                this.src = args.src;
            };
            if (typeof (args.name) == 'string') {
                this.name = args.name;
            };
            if (typeof (args.hidden) != 'undefined') {
                this.hidden = args.hidden;
            };
            if (typeof (args.data) != 'undefined' && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.data = new Stroke(args.stroke);
            };
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
        };
    };

}

interface VECTOR {
    id?: string;
    src?: string;
    data?: any;
    type?: string;
    name?: string;
    hidden?: boolean;
    stroke?: Stroke;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}