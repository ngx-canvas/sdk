import { data } from '../data';
import { ObjectId } from '../id';
import { Font, FONT } from '../utilities/font';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { Position, POSITION } from '../utilities/position';

export class Text {

    readonly id: string = ObjectId();
    readonly type: string = 'text';

    public data: any = {};
    public name: string = '';
    public font: FONT = new Font();
    public value: string|number = '';
    public hidden: boolean = false;
    public stroke: STROKE = new Stroke();
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(text?: TEXT, skip?: boolean) {
        this.set(text);

        if (!skip) {
            data.push(this);
        };

        this.bounds();
    };

    public bounds() {
        this.position.top = this.position.y;
        this.position.left = this.position.x;
        this.position.right = this.position.left + this.position.width;
        this.position.bottom = this.position.top + this.position.height;
        this.position.center = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });
    };

    public set(text: TEXT) {
        if (typeof (text) != 'undefined' && text != null) {
            if (typeof (text.name) == 'string') {
                this.name = text.name;
            };
            if (typeof (text.value) != 'undefined') {
                this.value = text.value;
            };
            if (typeof (text.hidden) != "undefined") {
                this.hidden = text.hidden;
            };
            if (typeof (text.data) != "undefined" && text.data != null) {
                this.data = text.data;
            };
            if (typeof (text.font) != 'undefined' && text.font != null) {
                this.font = new Font(text.font);
            };
            if (typeof (text.stroke) != 'undefined' && text.stroke != null) {
                this.stroke = new Stroke(text.stroke);
            };
            if (typeof (text.position) != 'undefined' && text.position != null) {
                this.position = new Position(text.position);
            };
        };
    };

    public move(point: POINT) {
        this.position.x = point.x - (this.position.width / 2);
        this.position.y = point.y - (this.position.height / 2);
        this.position.top = this.position.y;
        this.position.left = this.position.x;
        this.position.right = point.x + (this.position.width / 2);
        this.position.center = point;
        this.position.bottom = point.y + (this.position.height / 2);
    };

    public hit(point: POINT, radius?: number) {
        if (typeof (radius) != "undefined") {
            radius = 0;
        };
        let hit: boolean = true;
        if (point.x < this.position.x - radius) {
            hit = false;
        };
        if (point.x > this.position.x + this.position.width + radius) {
            hit = false;
        };
        if (point.y < this.position.y - radius) {
            hit = false;
        };
        if (point.y > this.position.y + this.position.height + radius) {
            hit = false;
        };
        return hit;
    };

    public near(point: POINT, radius?: number) {
        if (typeof (radius) == "undefined") {
            radius = 0;
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.top
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.top
            });
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.bottom
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.bottom
            });
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        if (this.position.x == point.x && this.position.y == point.y) {
            this.position.x = this.position.x - (point.x - current.x);
            this.position.y = this.position.y - (point.y - current.y);
            this.position.width = this.position.width + (point.x - current.x);
            this.position.height = this.position.height + (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
            this.position.y = this.position.y - (point.y - current.y);
            this.position.width = this.position.width - (point.x - current.x);
            this.position.height = this.position.height + (point.y - current.y);
        };
        if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
            this.position.x = this.position.x - (point.x - current.x);
            this.position.width = this.position.width + (point.x - current.x);
            this.position.height = this.position.height - (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
            this.position.width = this.position.width - (point.x - current.x);
            this.position.height = this.position.height - (point.y - current.y);
        };
        if (this.position.width < 0) {
            this.position.width = 0;
        };
        if (this.position.height < 0) {
            this.position.height = 0;
        };
        this.bounds();
    };

}

export interface TEXT {
    'id'?: string;
    'data'?: any;
    'name'?: string;
    'font'?: FONT;
    'value'?: string | number;
    'states'?: any[];
    'hidden'?: boolean;
    'stroke'?: STROKE;
    'position'?: POSITION;
    'selected'?: boolean;
    'dragging'?: boolean;
}