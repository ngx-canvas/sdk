import { data } from '../data';
import { ObjectId } from '../id';
import { FILL, Fill } from '../utilities/fill';
import { Font, FONT } from '../utilities/font';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { EVENTS, Events } from '../utilities/events';
import { Position, POSITION } from '../utilities/position';

export class Button extends Events {

    readonly id: string = ObjectId();
    readonly type: string = 'button';

    public fill: FILL = new Fill();
    public font: FONT = new Font();
    public data: any = {};
    public name: string = '';
    public value: string = '';
    public stroke: STROKE = new Stroke();
    public hidden: boolean = false;
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(button?: BUTTON, skip?: boolean) {
        super();

        this.set(button);

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

    public move(point: POINT) {
        this.position.x = point.x - (this.position.width / 2);
        this.position.y = point.y - (this.position.height / 2);
        this.position.top = this.position.y;
        this.position.left = this.position.x;
        this.position.right = point.x + (this.position.width / 2);
        this.position.center = point;
        this.position.bottom = point.y + (this.position.height / 2);
        this.position.center = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });
    };

    public set(button: BUTTON) {
        if (typeof (button) != 'undefined') {
            if (typeof (button.name) == 'string') {
                this.name = button.name;
            };
            if (typeof (button.data) != 'undefined' && button.data != null) {
                this.data = button.data;
            };
            if (typeof (button.font) != 'undefined' && button.font != null) {
                this.font = new Font(button.font);
            };
            if (typeof (button.fill) != 'undefined' && button.fill != null) {
                this.fill = new Fill(button.fill);
            };
            if (typeof (button.value) == 'string' || typeof (button.value) == 'number') {
                this.value = button.value;
            };
            if (typeof (button.hidden) != 'undefined') {
                this.hidden = button.hidden;
            };
            if (typeof (button.stroke) != 'undefined' && button.stroke != null) {
                this.stroke = new Stroke(button.stroke);
            };
            if (typeof (button.position) != 'undefined' && button.position != null) {
                this.position = new Position(button.position);
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        if (typeof (radius) != 'undefined') {
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
        if (typeof (radius) == 'undefined') {
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

export interface BUTTON extends EVENTS {
    'id'?: string;
    'fill'?: FILL;
    'font'?: FONT;
    'data'?: any;
    'name'?: string;
    'value'?: string;
    'stroke'?: STROKE;
    'hidden'?: boolean;
    'position'?: POSITION;
    'selected'?: boolean;
    'dragging'?: boolean;
}