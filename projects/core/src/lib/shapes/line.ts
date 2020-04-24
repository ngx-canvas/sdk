import { view } from '../view';
import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Line {
    
    readonly type = 'line';

    public id:          string      = ObjectId();
    public data:        any         = {};
    public name:        string      = '';
    public points:      Point[]     = [];
    public states:      any[]       = [];
    public hidden:      boolean     = false;
    public lineCap:     string      = 'round';
    public position:    POSITION    = POSITION_DEFAULTS;
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    public lineWidth:   number      = 1;
    public fillColor:   string      = 'rgba(0, 0, 0, 0)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';

    constructor(line?: LINE, skip?: boolean) {
        this.set(line);
      
        if (!skip) {
            data.push(this);
        };

        this.bounds();
    };

    public bounds() {
        let minX = 10000000;
        let maxX = 0;
        let minY = 10000000;
        let maxY = 0;

        this.points.map(point => {
            if (point.x < minX) {
                minX = point.x;
            };
            if (point.x > maxX) {
                maxX = point.x;
            };
            if (point.y < minY) {
                minY = point.y;
            };
            if (point.y > maxY) {
                maxY = point.y;
            };
        });
        this.position.x         = minX;
        this.position.y         = minY;
        this.position.top       = minY;
        this.position.left      = minX;
        this.position.right     = maxX;
        this.position.width     = maxX - minX;
        this.position.height    = maxY - minY;
        this.position.bottom    = maxY;
        this.position.center    = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });
    };

    public move(point: POINT) {
        let difference = {
            'x': this.position.center.x - point.x,
            'y': this.position.center.y - point.y
        };
        this.points.map(pt => {
            pt.x = pt.x - difference.x;
            pt.y = pt.y - difference.y;
        });
        this.bounds();
    };

    public set(line: LINE) {
        if (typeof(line) != 'undefined') {
            if (typeof(line.data) != "undefined") {
                this.data = line.data;
            };
            if (typeof(line.name) == "string") {
                this.name = line.name;
            };
            if (Array.isArray(line.states)) {
                this.states = line.states;
            };
            if (Array.isArray(line.points)) {
                this.points = line.points;
            };
            if (typeof(line.hidden) != "undefined") {
                this.hidden = line.hidden;
            };
            if (typeof(line.position) != "undefined") {
                this.position = new Position(line.position);
            };
            if (typeof(line.lineWidth) == "number") {
                this.lineWidth = line.lineWidth;
            };
            if (typeof(line.fillColor) != "undefined") {
                this.fillColor = line.fillColor;
            };
            if (typeof(line.strokeColor) != "undefined") {
                this.strokeColor = line.strokeColor;
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        var m, b, y, minx, maxx, miny, maxy = 0;

        /*
            y = mx + b
        */

        for (let i = 0; i < this.points.length; i++) {
            if (i + 1 < this.points.length) {
                m = (this.points[i + 1].y - this.points[i].y)/(this.points[i + 1].x - this.points[i].x);
                b = m * this.points[i].x - this.points[i].y;
                y = m * point.x + b;
                miny = m * (point.x - this.lineWidth / 2) + b;
                maxy = m * (point.x + this.lineWidth / 2) + b;
                if (miny <= point.y && maxy >= point.y) {
                    return true;
                };
            };
        };

        console.log('m: ', m);

        return false;
    };

    public near(point: POINT, radius?: number) {
        if (typeof(radius) == "undefined") {
            radius = 0;
        };
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].x - radius <= point.x && this.points[i].x + radius >= point.x && this.points[i].y - radius <= point.y && this.points[i].y + radius >= point.y) {
                return new Point({
                    'x': this.points[i].x,
                    'y': this.points[i].y
                });
            };
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].x == point.x && this.points[i].y == point.y) {
                this.points[i].x = current.x;
                this.points[i].y = current.y;
                break;
            };
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

export interface LINE {
    'id'?:          string;
    'data'?:        any;
    'name'?:        string;
    'states'?:      any[];
    'hidden'?:      boolean;
    'points':       POINT[];
    'lineCap'?:     string;
    'position':     POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}