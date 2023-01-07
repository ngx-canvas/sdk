import { Fill } from '../utilities/fill';
import { Font } from '../utilities/font';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

/* --- SHAPES --- */
import { Row } from './row';

export class Table {

    public id: string = ObjectId();
    public type: string = 'table';
    public fill: Fill = new Fill();
    public font: Font = new Font();
    public data: any = {};
    public name: string = '';
    public rows: Row[] = [];
    public value: string = '';
    public header: Row = new Row();
    public footer: Row = new Row();
    public stroke: Stroke = new Stroke();
    public hidden: boolean = false;
    public position: Position = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(args?: TABLE) {
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
            if (typeof (args.rows) != 'undefined' && args.rows != null) {
                this.rows = args.rows.map(o => new Row(o));
            };
            if (typeof (args.value) != 'undefined' && args.value != null) {
                this.value = args.value;
            };
            if (typeof (args.hidden) != 'undefined' && args.hidden != null) {
                this.hidden = args.hidden;
            };
            if (typeof (args.header) != 'undefined' && args.header != null) {
                this.header = new Row(args.header);
            };
            if (typeof (args.footer) != 'undefined' && args.footer != null) {
                this.footer = new Row(args.footer);
            };
            if (typeof (args.stroke) != 'undefined' && args.stroke != null) {
                this.stroke = new Stroke(args.stroke);
            };
            if (typeof (args.position) != 'undefined' && args.position != null) {
                this.position = new Position(args.position);
            };
            let top = this.header.position.bottom;
            this.rows.map(row => {
                row.columns.map(column => {
                    column.position.y = top;
                    column.position.top = top;
                    column.position.bounds();
                });
                row.position.bounds();
                top += row.position.height;
            });
        };
    };

}

interface TABLE {
    id?: string;
    fill?: Fill;
    font?: Font;
    data?: any;
    name?: string;
    rows?: Row[];
    value?: string;
    stroke?: Stroke;
    hidden?: boolean;
    header?: Row;
    footer?: Row;
    selected?: boolean;
    dragging?: boolean;
    position?: Position;
}