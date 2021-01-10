import { data } from '../data';
import { view } from '../view';
import { ObjectId } from '../id';
import { Fill, FILL } from '../utilities/fill';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { Position, POSITION } from '../utilities/position';

export class Arc {

    readonly id: string = ObjectId();
    readonly type: string = 'arc';

    public data: any = {};
    public name: string = '';
    public fill: FILL = new Fill();
    public hidden: boolean = false;
    public stroke: STROKE = new Stroke();
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(arc?: ARC, skip?: boolean) {
        this.set(arc);

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

    public set(arc: ARC) {
        if (typeof(arc) != 'undefined' && arc != null) {
            if (typeof(arc.data) != "undefined" && arc.data != null) {
                this.data = arc.data;
            };
            if (typeof(arc.name) == "string") {
                this.name = arc.name;
            };
            if (typeof(arc.hidden) != "undefined") {
                this.hidden = arc.hidden;
            };
            if (typeof(arc.fill) != "undefined" && arc.fill != null) {
                this.fill = new Fill(arc.fill);
            };
            if (typeof(arc.stroke) != "undefined" && arc.stroke != null) {
                this.stroke = new Stroke(arc.stroke);
            };
            if (typeof(arc.position) != "undefined" && arc.position != null) {
                this.position = new Position(arc.position);
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

export interface ARC {
    'id'?: string;
    'data'?: any;
    'name'?: string;
    'fill'?: FILL;
    'hidden'?: boolean;
    'stroke'?: STROKE;
    'position'?: POSITION;
    'selected'?: boolean;
    'dragging'?: boolean;
}