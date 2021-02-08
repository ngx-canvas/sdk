import { data } from '../data';
import { ObjectId } from '../id';
import { Fill, FILL } from '../utilities/fill';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { EVENTS, Events } from '../utilities/events';
import { Position, POSITION } from '../utilities/position';

export class Line extends Events {

    readonly id: string = ObjectId();
    readonly type: string = 'line';

    public data: any = {};
    public name: string = '';
    public fill: FILL = new Fill();
    public hidden: boolean = false;
    public points: POINT[] = [];
    public stroke: STROKE = new Stroke();
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(line?: LINE, skip?: boolean) {
        super();

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
        this.position.x = minX;
        this.position.y = minY;
        this.position.top = minY;
        this.position.left = minX;
        this.position.right = maxX;
        this.position.width = maxX - minX;
        this.position.height = maxY - minY;
        this.position.bottom = maxY;
        this.position.center = new Point({
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
        if (typeof (line) != 'undefined' && line != null) {
            if (typeof (line.data) != 'undefined' && line.data != null) {
                this.data = line.data;
            };
            if (typeof (line.name) == 'string') {
                this.name = line.name;
            };
            if (Array.isArray(line.points)) {
                this.points = line.points;
            };
            if (typeof (line.hidden) != 'undefined') {
                this.hidden = line.hidden;
            };
            if (typeof (line.fill) != 'undefined' && line.fill != null) {
                this.fill = new Fill(line.fill);
            };
            if (typeof (line.stroke) != 'undefined' && line.stroke != null) {
                this.stroke = new Stroke(line.stroke);
            };
            if (typeof (line.position) != 'undefined' && line.position != null) {
                this.position = new Position(line.position);
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
                m = (this.points[i + 1].y - this.points[i].y) / (this.points[i + 1].x - this.points[i].x);
                b = m * this.points[i].x - this.points[i].y;
                y = m * point.x + b;
                miny = m * (point.x - this.stroke.width / 2) + b;
                maxy = m * (point.x + this.stroke.width / 2) + b;
                if (miny <= point.y && maxy >= point.y) {
                    return true;
                };
            };
        };

        console.log('m: ', m);

        return false;
    };

    public near(point: POINT, radius?: number) {
        if (typeof (radius) == 'undefined') {
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

export interface LINE extends EVENTS {
    'id'?: string;
    'data'?: any;
    'name'?: string;
    'fill'?: FILL;
    'hidden'?: boolean;
    'points'?: POINT[];
    'stroke'?: STROKE;
    'position'?: POSITION;
    'selected'?: boolean;
    'dragging'?: boolean;
}