import { data } from '../data';
import { view } from '../view';
import { ObjectId } from '../id';
import { Fill, FILL } from '../utilities/fill';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { Position, POSITION } from '../utilities/position';

export class Circle {

    readonly id:       string      = ObjectId();
    readonly type:      string      = 'circle';

    public data:        any         = {};
    public name:        string      = '';
    public fill:        FILL        = new Fill();
    public stroke:      STROKE      = new Stroke();
    public hidden:      boolean     = false;
    public position:    POSITION    = new Position();
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    
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
    };

    public set(circle: CIRCLE) {
        if (typeof(circle) != 'undefined' && circle != null) {
            if (typeof(circle.data) != "undefined" && circle.data != null) {
                this.data = circle.data;
            };
            if (typeof(circle.name) == "string") {
                this.name = circle.name;
            };
            if (typeof(circle.hidden) != "undefined") {
                this.hidden = circle.hidden;
            };
            if (typeof(circle.fill) != "undefined" && circle.fill != null) {
                this.fill = new Fill(circle.fill);
            };
            if (typeof(circle.stroke) != "undefined" && circle.stroke != null) {
                this.stroke = new Stroke(circle.stroke);
            };
            if (typeof(circle.position) != "undefined" && circle.position != null) {
                this.position = new Position(circle.position);
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        if (typeof(radius) != "undefined") {
            radius = 0;
        };
        view.context.beginPath();
        
        view.context.fillStyle      = this.fill.color;
        view.context.lineWidth      = this.stroke.width;
        view.context.strokeStyle    = this.stroke.color;
        
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
        if (this.position.y - radius <= point.y && this.position.y + radius >= point.y && this.position.x <= point.x && this.position.x + this.position.width >= point.x) {
            return new Point({
                'x': this.position.center.x,
                'y': this.position.y
            });
        };
        if (this.position.x - radius <= point.x && this.position.x + radius >= point.x && this.position.y <= point.y && this.position.y + this.position.width >= point.y) {
            return new Point({
                'x': this.position.x,
                'y': this.position.center.y
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.y <= point.y && this.position.y + this.position.width >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.center.y
            });
        };
        if (this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y && this.position.x <= point.x && this.position.x + this.position.width >= point.x) {
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
        if (this.position.width < 0) {
            this.position.width = 0;
        };
        if (this.position.height < 0) {
            this.position.height = 0;
        };
        this.bounds();
    };

}

export interface CIRCLE {
    'id'?:          string;
    'data'?:        any;
    'name'?:        string;
    'fill'?:        FILL;
    'stroke'?:      STROKE;
    'hidden'?:      boolean;
    'position'?:    POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
}