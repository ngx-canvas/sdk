import { Font } from '../utilities/font';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

export class Text {

    public id: string = ObjectId();
    public font: Font = new Font();
    public data: any = {};
    public name: string = '';
    public type: string = 'text';
    public value: string = '';
    public hidden: boolean = false;
    public stroke: Stroke = new Stroke();
    public selected: boolean = false;
    public dragging: boolean = false;
    public position: Position = new Position();

    constructor(args?: TEXT) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.name) != 'undefined' && args.name != null) {
                this.name = args.name;
            };
            if (typeof (args.data) != 'undefined' && args.data != null) {
                this.data = args.data;
            };
            if (typeof (args.font) != 'undefined' && args.font != null) {
                this.font = new Font(args.font);
            };
            if (typeof (args.value) != 'undefined' && args.value != null) {
                this.value = args.value;
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

interface TEXT {
    id?: string;
    font?: Font;
    data?: any;
    name?: string;
    type?: string;
    value?: string;
    hidden?: boolean;
    stroke?: Stroke;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}