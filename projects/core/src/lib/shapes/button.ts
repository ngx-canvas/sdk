import { Fill } from '../utilities/fill';
import { Font } from '../utilities/font';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

export class Button {

    public id: string = ObjectId();
    public type: string = 'button';
    public fill: Fill = new Fill();
    public font: Font = new Font();
    public data: any = {};
    public name: string = '';
    public value: string = '';
    public stroke: Stroke = new Stroke();
    public hidden: boolean = false;
    public position: Position = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(args?: BUTTON) {
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
            if (typeof (args.fill) != 'undefined' && args.fill != null) {
                this.fill = new Fill(args.fill);
            };
            if (typeof (args.value) != 'undefined' && args.value != null) {
                this.value = args.value;
            };
            if (typeof (args.hidden) != 'undefined' && args.hidden != null) {
                this.hidden = args.hidden;
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.stroke = new Stroke(args.stroke);
            };
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
        };
    };

}

interface BUTTON {
    id?: string;
    fill?: Fill;
    font?: Font;
    data?: any;
    name?: string;
    value?: string;
    stroke?: Stroke;
    hidden?: boolean;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}