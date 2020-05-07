import { Line } from './line';
import { data } from '../data';
import { Polygon } from './polygon';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS} from '../utilities/position';

export class Group {
    
    readonly type = 'group';

    public id:          string      = ObjectId();
    public data:        any         = {};
    public name:        string      = '';
    public states:      any[]       = [];
    public hidden:      boolean     = false;
    public children:    any[]       = [];
    public position:    POSITION    = new Position(POSITION_DEFAULTS);
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    public lineWidth:   number      = 1;
    public fillColor:   string      = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';
    
    constructor(group?: GROUP, skip?: boolean) {
        this.position = new Position(POSITION_DEFAULTS);
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
        this.position.center.x  = this.position.x + (this.position.width / 2);
        this.position.center.y  = this.position.y + (this.position.height / 2);
    };

    public set(params: any) {
        this.children.map(child => child.set(params));
    };

    public move(point: POINT) {
        let difference = {
            'x': this.position.center.x - point.x,
            'y': this.position.center.y - point.y
        };
        this.position.x         = this.position.x - difference.x;
        this.position.y         = this.position.y - difference.y;
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = this.position.x + this.position.width;
        this.position.bottom    = this.position.y + this.position.height;
        this.position.center.x  = this.position.x + (this.position.width / 2);
        this.position.center.y  = this.position.y + (this.position.height / 2);

        this.children.map(child => {
            let position    = child.position.center;
            position.x      = position.x - difference.x;
            position.y      = position.y - difference.y;
            if (child instanceof Line || child instanceof Polygon) {
                child.points.map(pt => {
                    pt.x = pt.x - difference.x;
                    pt.y = pt.y - difference.y;
                });
                child.bounds();
            } else if (child instanceof Group) {
                child.moveBy(difference);
            } else {
                child.move(position);
            };
        });

        this.bounds();
    };

    public moveBy(point: POINT) {
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
        let diff = {
            'x': point.x - current.x,
            'y': point.y - current.y
        };
        this.children.map(child => {
            if (child instanceof Group) {} else {
                if (this.position.x == point.x && this.position.y == point.y) {
            
                };
                if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
                    
                };
                if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
                    
                };
                if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
                    child.position.x        = child.position.x - (diff.x / 4);
                    child.position.y        = child.position.y - (diff.y / 4);
                    child.position.width    = child.position.width - (diff.x / 2);
                    child.position.height   = child.position.height - (diff.y / 2);
                };
            };
        });
        //     if (child instanceof Group) {
        //         let ratio = {
        //             'x': child.position.width / this.position.width,
        //             'y': child.position.height / this.position.height
        //         };
        //         if (this.position.x == point.x && this.position.y == point.y) {
        //             child.resize({
        //                 'x': child.position.x,
        //                 'y': child.position.y
        //             }, {
        //                 'x': child.position.x - (diff.x * ratio.x),
        //                 'y': child.position.y - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
        //             child.resize({
        //                 'x': child.position.x + child.position.width,
        //                 'y': child.position.y
        //             }, {
        //                 'x': child.position.x + child.position.width - (diff.x * ratio.x),
        //                 'y': child.position.y - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
        //             child.resize({
        //                 'x': child.position.x,
        //                 'y': child.position.y + child.position.height
        //             }, {
        //                 'x': child.position.x - (diff.x * ratio.x),
        //                 'y': child.position.y + child.position.height - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
        //             child.resize({
        //                 'x': child.position.x + child.position.width,
        //                 'y': child.position.y + child.position.height
        //             }, {
        //                 'x': child.position.x + child.position.width - (diff.x * ratio.x),
        //                 'y': child.position.y + child.position.height - (diff.y * ratio.y)
        //             });
        //         };
        //     } else {
        //         let ratio = {
        //             'x': child.position.width / this.position.width,
        //             'y': child.position.height / this.position.height
        //         };
        //         if (this.position.x == point.x && this.position.y == point.y) {
        //             child.resize({
        //                 'x': child.position.x,
        //                 'y': child.position.y
        //             }, {
        //                 'x': child.position.x - (diff.x * ratio.x),
        //                 'y': child.position.y - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
        //             child.resize({
        //                 'x': child.position.x + child.position.width,
        //                 'y': child.position.y
        //             }, {
        //                 'x': child.position.x + child.position.width - (diff.x * ratio.x),
        //                 'y': child.position.y - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
        //             child.resize({
        //                 'x': child.position.x,
        //                 'y': child.position.y + child.position.height
        //             }, {
        //                 'x': child.position.x - (diff.x * ratio.x),
        //                 'y': child.position.y + child.position.height - (diff.y * ratio.y)
        //             });
        //         };
        //         if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
        //             child.resize({
        //                 'x': child.position.x + child.position.width,
        //                 'y': child.position.y + child.position.height
        //             }, {
        //                 'x': child.position.x + child.position.width - (diff.x * ratio.x),
        //                 'y': child.position.y + child.position.height - (diff.y * ratio.y)
        //             });
        //         };
        //     };
        // });

        if (this.position.x == point.x && this.position.y == point.y) {
            this.position.x         = this.position.x - diff.x;
            this.position.y         = this.position.y - diff.y;
            this.position.top       = this.position.y;
            this.position.left      = this.position.x;
            this.position.width     = this.position.width + diff.x;
            this.position.height    = this.position.height + diff.y;
        };
        if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
            this.position.y         = this.position.y - diff.y;
            this.position.top       = this.position.y;
            this.position.right     = this.position.right - diff.x;
            this.position.width     = this.position.width - diff.x;
            this.position.height    = this.position.height + diff.y;
        };
        if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
            this.position.x         = this.position.x - diff.x;
            this.position.left      = this.position.x;
            this.position.width     = this.position.width + diff.x;
            this.position.height    = this.position.height - diff.y;
            this.position.bottom    = this.position.bottom - diff.y;
        };
        if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
            this.position.width     = this.position.width - diff.x;
            this.position.right     = this.position.right - diff.x;
            this.position.height    = this.position.height - diff.y;
            this.position.bottom    = this.position.bottom - diff.y;
        };
        if (this.position.width < 0) {
            this.position.width = 0;
        };
        if (this.position.height < 0) {
            this.position.height = 0;
        };
        // this.bounds();
    };

}

export interface GROUP {
    'id'?:          string;
    'data'?:        any;
    'name'?:        string;
    'states'?:      any[];
    'hidden'?:      boolean;
    'children'?:    any[];
    'position'?:    POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}