import { ObjectId } from '../id';
import { data } from '../data';
import { STATE } from '../utilities/states';
import { Polygon } from '../shapes/polygon';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS} from '../utilities/position';

export class Group {
    
    readonly type = 'group';

    public id:          string      = ObjectId();
    public data:        any         = {};
    public name:        string      = '';
    public states:      STATE[]     = [];
    public hidden:      boolean     = false;
    public children:    any[]       = [];
    public position:    POSITION    = new Position(POSITION_DEFAULTS);
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    public lineWidth:   number      = 1;
    public fillColor:   string      = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';
    
    constructor(group?: GROUP, skip?: boolean) {
        if (typeof(group) != 'undefined') {
            if (typeof(group.data) != "undefined") {
                this.data = group.data;
            };
            if (typeof(group.name) == 'string') {
                this.name = group.name;
            };
            if (typeof(group.hidden) != "undefined") {
                this.hidden = group.hidden;
            };
            if (Array.isArray(group.states)) {
                this.states = group.states;
            };
            if (Array.isArray(group.children)) {
                this.children = group.children;
            };
            if (typeof(group.position) != 'undefined') {
                this.position = new Position(group.position);
            };
            if (typeof(group.lineWidth) == 'number') {
                this.lineWidth = group.lineWidth;
            };
            if (typeof(group.fillColor) != 'undefined') {
                this.fillColor = group.fillColor;
            };
            if (typeof(group.strokeColor) != 'undefined') {
                this.strokeColor = group.strokeColor;
            };
        };
      
        if (!skip) {
            data.push(this);
        };

        this.bounds();

        this.position.center    = new Point({
            'x': (this.position.right / 2),
            'y': (this.position.bottom / 2)
        });
    };

    public hit(point: POINT) {
        let hit: boolean = true;
        if (point.x < this.position.x) {
            hit = false;
        };
        if (point.x > this.position.x + this.position.width) {
            hit = false;
        };
        if (point.y < this.position.y) {
            hit = false;
        };
        if (point.y > this.position.y + this.position.height) {
            hit = false;
        };
        return hit;
    };

    public move(point: POINT) {
        let difference = {
            'x': this.position.center.x - point.x,
            'y': this.position.center.y - point.y
        };
        this.position.top       = point.y - (this.position.height / 2);
        this.position.left      = point.x - (this.position.width / 2);
        this.position.right     = point.x + (this.position.width / 2);
        this.position.center    = point;
        this.position.bottom    = point.y + (this.position.height / 2);

        this.children.map(child => {
            let position    = child.position.center;
            position.x      = position.x - difference.x;
            position.y      = position.y - difference.y;
            if (child instanceof Polygon) {
                child.points.map(pt => {
                    pt.x = pt.x - difference.x;
                    pt.y = pt.y - difference.y;
                })
            } else if (child instanceof Group) {
                child.moveBy(difference);
            } else {
                child.move(position);
            };
        });
    };

    public bounds() {
        this.position.top   = 100000;
        this.position.left  = 100000;
        if (typeof(this.position.right) == 'undefined') {
            this.position.right = 0;
        };
        if (typeof(this.position.bottom) == 'undefined') {
            this.position.bottom = 0;
        };

        this.children.map(child => {
            if (this.position.left > child.position.left) {
                this.position.x     = child.position.left;
                this.position.left  = this.position.x;
            };
            if (this.position.top > child.position.top) {
                this.position.y     = child.position.top;
                this.position.top   = this.position.y;
            };
            if (this.position.right < child.position.right) {
                this.position.right = child.position.right;
            };
            if (this.position.bottom < child.position.bottom) {
                this.position.bottom = child.position.bottom;
            };
        });

        this.position.width     = this.position.right - this.position.left;
        this.position.height    = this.position.bottom - this.position.top;

        window.requestAnimationFrame(() => this.bounds());
    };

    public moveBy(point: POINT) {
        console.log(point);
        this.position.top       -= point.y;
        this.position.left      -= point.x;
        this.position.right     -= point.x;
        this.position.bottom    -= point.y;
        this.position.center.x  -= point.x;
        this.position.center.y  -= point.y;

        this.children.map(child => {
            let position    = child.position.center;
            position.x      = position.x - point.x;
            position.y      = position.y - point.y;
            if (child instanceof Polygon) {
                child.points.map(pt => {
                    pt.x = pt.x - point.x;
                    pt.y = pt.y - point.y;
                })
            } else if (child instanceof Group) {
                child.moveBy(point);
            } else {
                child.move(position);
            };
        });
    };

}

export interface GROUP {
    'id'?:          string;
    'data'?:        any;
    'name'?:        string;
    'states'?:      STATE[];
    'hidden'?:      boolean;
    'children'?:    any[];
    'position'?:    POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}