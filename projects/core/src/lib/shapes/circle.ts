import { data } from '../data';
import { STATE } from '../utilities/states';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Circle {
    
    readonly type = 'circle';

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
    
    constructor(circle?: CIRCLE, skip?: boolean) {
        this.set(circle);
      
        if (!skip) {
            data.push(this);
        };
        
        this.bounds();
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

    public bounds() {
        this.position.center    = new Point({
            'x': this.position.x + this.position.radius,
            'y': this.position.y + this.position.radius
        });

        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.width     = this.position.radius * 2;
        this.position.right     = this.position.left + this.position.width;
        this.position.height    = this.position.width;
        this.position.bottom    = this.position.top + this.position.height;

        window.requestAnimationFrame(() => this.bounds());
    };

    public set(circle: CIRCLE) {
        if (typeof(circle) != 'undefined') {
            if (typeof(circle.data) != "undefined") {
                this.data = circle.data;
            };
            if (typeof(circle.name) == "string") {
                this.name = circle.name;
            };
            if (Array.isArray(circle.states)) {
                this.states = circle.states;
            };
            if (typeof(circle.hidden) != "undefined") {
                this.hidden = circle.hidden;
            };
            if (typeof(circle.position) != "undefined") {
                this.position = new Position(circle.position);
            };
            if (typeof(circle.lineWidth) == "number") {
                this.lineWidth = circle.lineWidth;
            };
            if (typeof(circle.fillColor) != "undefined") {
                this.fillColor = circle.fillColor;
            };
            if (typeof(circle.strokeColor) != "undefined") {
                this.strokeColor = circle.strokeColor;
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        if (typeof(radius) != "undefined") {
            radius = 0;
        };
        if (Math.sqrt((point.x - this.position.center.x) ** 2 + (point.y - this.position.center.y) ** 2) < this.position.radius + radius) {
            return true;
        };
        return false;
    };

    public near(point: POINT, radius?: number) {
        if (typeof(radius) == "undefined") {
            radius = 0;
        };
        if (this.position.center.x - radius <= point.x && this.position.center.x + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.center.x,
                'y': this.position.top
            });
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.center.y - radius <= point.y && this.position.center.y + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.center.y
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.center.y - radius <= point.y && this.position.center.y + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.center.y
            });
        };
        if (this.position.center.x - radius <= point.x && this.position.center.x + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.center.x,
                'y': this.position.bottom
            });
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        let diff = {
            'x': point.x - current.x,
            'y': point.y - current.y
        };
        this.position.x         = this.position.x + (diff.x / 2);
        this.position.y         = this.position.y + (diff.x / 2);
        this.position.radius    = this.position.radius - diff.x;

        this.position.center    = new Point({
            'x': this.position.x + this.position.radius,
            'y': this.position.y + this.position.radius
        });

        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.width     = this.position.radius * 2;
        this.position.right     = this.position.left + this.position.width;
        this.position.height    = this.position.width;
        this.position.bottom    = this.position.top + this.position.height;
    };

}

export interface CIRCLE {
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