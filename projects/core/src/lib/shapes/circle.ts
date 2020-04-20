import { data } from '../data';
import { view } from '../view';
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
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });

        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = this.position.x + this.position.width;
        this.position.bottom    = this.position.y + this.position.height;

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
        view.context.beginPath();
        
        view.context.fillStyle      = this.fillColor;
        view.context.lineWidth      = this.lineWidth;
        view.context.strokeStyle    = this.strokeColor;
        
        view.context.ellipse(this.position.x + (this.position.width / 2) - radius, this.position.y + (this.position.height / 2) - radius, (this.position.width + radius) / 2, (this.position.height + radius) / 2, 0, 0, 2 * Math.PI);

        view.context.fill();
        view.context.stroke();
        
        view.context.closePath();

        let hit = view.context.isPointInPath(point.x, point.y);
        return hit;
    };

    public near(point: POINT, radius?: number) {
        if (typeof(radius) == "undefined") {
            radius = 0;
        };
        if (this.position.y - radius <= point.y && this.position.y + radius >= point.y) {
            return new Point({
                'x': this.position.center.x,
                'y': this.position.y
            });
        };
        if (this.position.x - radius <= point.x && this.position.x + radius >= point.x) {
            return new Point({
                'x': this.position.x,
                'y': this.position.center.y
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x) {
            return new Point({
                'x': this.position.right,
                'y': this.position.center.y
            });
        };
        if (this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
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
        
        // TOP
        if (point.y == this.position.y) {
            this.position.y         = this.position.y - diff.y;
            this.position.top       = this.position.top + diff.y;
            this.position.height    = this.position.height + diff.y;
        };
        // LEFT
        if (point.x == this.position.x) {
            this.position.x     = this.position.x - diff.x;
            this.position.left  = this.position.left + diff.x;
            this.position.width = this.position.width + diff.x;
        };
        // RIGHT
        if (point.x == this.position.right) {
            this.position.width = this.position.width - diff.x;
            this.position.right = this.position.right - diff.x;
        };
        // BOTTOM
        if (point.y == this.position.bottom) {
            this.position.height = this.position.height - diff.y;
            this.position.bottom = this.position.bottom - diff.y;
        };
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