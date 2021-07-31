import { view } from '../view';
import { data } from '../data';
import { ObjectId } from '../id';
import { Fill, FILL } from '../utilities/fill';
import { Point, POINT } from '../utilities/point';
import { Stroke, STROKE } from '../utilities/stroke';
import { EVENTS, Events } from '../utilities/events';
import { Position, POSITION } from '../utilities/position';

export class Polyline extends Events {

    readonly id: string = ObjectId();
    readonly type: string = 'polyline';

    public data: any = {};
    public name: string = '';
    public fill: FILL = new Fill();
    public stroke: STROKE = new Stroke();
    public points: POINT[] = [];
    public hidden: boolean = false;
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(polyline?: POLYLINE, skip?: boolean) {
        super();

        this.set(polyline);

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

    public set(polyline: POLYLINE) {
        if (typeof (polyline) != 'undefined' && polyline != null) {
            if (typeof (polyline.data) != "undefined" && polyline.data != null) {
                this.data = polyline.data;
            };
            if (typeof (polyline.name) == "string") {
                this.name = polyline.name;
            };
            if (Array.isArray(polyline.points)) {
                this.points = polyline.points;
            };
            if (typeof (polyline.hidden) != "undefined") {
                this.hidden = polyline.hidden;
            };
            if (typeof (polyline.fill) != "undefined" && polyline.fill != null) {
                this.fill = new Fill(polyline.fill);
            };
            if (typeof (polyline.stroke) != "undefined" && polyline.stroke != null) {
                this.stroke = new Stroke(polyline.stroke);
            };
            if (typeof (polyline.position) != "undefined" && polyline.position != null) {
                this.position = new Position(polyline.position);
            };
        };
    };

    public hit(point: POINT, radius?: number) {
        view.context.beginPath();

        view.context.fillStyle = this.fill.color;
        view.context.lineWidth = this.stroke.width;
        view.context.strokeStyle = this.stroke.color;

        if (Array.isArray(this.points)) {
            let index = 0;
            this.points.map(point => {
                if (index == 0) {
                    view.context.moveTo(point.x, point.y);
                } else {
                    view.context.lineTo(point.x, point.y);
                };
                index++;
            });
        };

        view.context.fill();
        view.context.stroke();

        view.context.closePath();

        let hit = view.context.isPointInPath(point.x, point.y);

        return hit;
    };

    public near(point: POINT, radius?: number) {
        if (typeof (radius) == "undefined") {
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
                if ((i == 0 || i == this.points.length - 1) && this.points.length > 1) {
                    if (this.points[0].x == this.points[this.points.length - 1].x && this.points[0].y == this.points[this.points.length - 1].y) {
                        this.points[0].x = current.x;
                        this.points[0].y = current.y;
                        this.points[this.points.length - 1].x = current.x;
                        this.points[this.points.length - 1].y = current.y;
                        break;
                    };
                };
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

export interface POLYLINE extends EVENTS {
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