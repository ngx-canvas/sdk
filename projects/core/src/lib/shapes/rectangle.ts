import { data } from '../data';
import { STATE } from '../utilities/states';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Rectangle {

    readonly type = 'rectangle';

    public id:          string      = ObjectId();
    public data:        any         = {};
    public name:        string      = '';
    public states:      STATE[]     = [];
    public hidden:      boolean     = false;
    public position:    POSITION    = POSITION_DEFAULTS;
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    public lineWidth:   number      = 1;
    public fillColor:   string      = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';
    
    constructor(rectangle?: RECTANGLE, skip?: boolean) {
        this.set(rectangle);
      
        if (!skip) {
            data.push(this);
        };
      
        this.bounds();
    };

    public bounds() {
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = this.position.left + this.position.width;
        this.position.bottom    = this.position.top + this.position.height;
        this.position.center    = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        })

        window.requestAnimationFrame(() => this.bounds());
    };

    public move(point: POINT) {
        this.position.x         = point.x - (this.position.width / 2);
        this.position.y         = point.y - (this.position.height / 2);
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = point.x + (this.position.width / 2);
        this.position.center    = point;
        this.position.bottom    = point.y + (this.position.height / 2);
    };

    public set(rectangle: RECTANGLE) {
        if (typeof(rectangle) != 'undefined') {
            if (typeof(rectangle.data) != "undefined") {
                this.data = rectangle.data;
            };
            if (typeof(rectangle.name) == 'string') {
                this.name = rectangle.name;
            };
            if (typeof(rectangle.hidden) != "undefined") {
                this.hidden = rectangle.hidden;
            };
            if (Array.isArray(rectangle.states)) {
                this.states = rectangle.states;
            };
            if (typeof(rectangle.position) != 'undefined') {
                this.position = new Position(rectangle.position);
            };
            if (typeof(rectangle.lineWidth) == 'number') {
                this.lineWidth = rectangle.lineWidth;
            };
            if (typeof(rectangle.fillColor) != 'undefined') {
                this.fillColor = rectangle.fillColor;
            };
            if (typeof(rectangle.strokeColor) != 'undefined') {
                this.strokeColor = rectangle.strokeColor;
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        if (typeof(radius) != "undefined") {
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
        if (typeof(radius) == "undefined") {
            radius = 0;
        };
        if (this.position.x - radius <= point.x && this.position.x + radius >= point.x && this.position.y - radius <= point.y && this.position.y + radius >= point.y) {
            return new Point({
                'x': this.position.x,
                'y': this.position.y
            });
        };
        if (this.position.x + this.position.width - radius <= point.x && this.position.x + this.position.width + radius >= point.x && this.position.y - radius <= point.y && this.position.y + radius >= point.y) {
            return new Point({
                'x': this.position.x + this.position.width,
                'y': this.position.y
            });
        };
        if (this.position.x - radius <= point.x && this.position.x + radius >= point.x && this.position.y + this.position.height - radius <= point.y && this.position.y + this.position.height + radius >= point.y) {
            return new Point({
                'x': this.position.x,
                'y': this.position.y + this.position.height
            });
        };
        if (this.position.x + this.position.width - radius <= point.x && this.position.x + this.position.width + radius >= point.x && this.position.y + this.position.height - radius <= point.y && this.position.y + this.position.height + radius >= point.y) {
            return new Point({
                'x': this.position.x + this.position.width,
                'y': this.position.y + this.position.height
            });
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        if (this.position.x == point.x && this.position.y == point.y) {
            this.position.x         = this.position.x - (point.x - current.x);
            this.position.y         = this.position.y - (point.y - current.y);
            this.position.width     = this.position.width + (point.x - current.x);
            this.position.height    = this.position.height + (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
            this.position.y         = this.position.y - (point.y - current.y);
            this.position.width     = this.position.width - (point.x - current.x);
            this.position.height    = this.position.height + (point.y - current.y);
        };
        if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
            this.position.x         = this.position.x - (point.x - current.x);
            this.position.width     = this.position.width + (point.x - current.x);
            this.position.height    = this.position.height - (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
            this.position.width     = this.position.width - (point.x - current.x);
            this.position.height    = this.position.height - (point.y - current.y);
        };
    };

}

export interface RECTANGLE {
    'id'?:          string;
    'data'?:        any;
    'name'?:        string;
    'states'?:      STATE[];
    'hidden'?:      boolean;
    'position':     POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}