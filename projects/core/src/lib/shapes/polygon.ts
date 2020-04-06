import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';
import { view } from '../view';

export class Polygon {
    
    readonly type = 'polygon';

    public id:          string      = ObjectId();
    public name:        string      = '';
    public points:      Point[] = [];
    public position:    POSITION    = POSITION_DEFAULTS;
    public selected:    boolean     = false;
    public lineWidth:   number      = 0;
    public fillColor:   string      = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';
    
    constructor(polygon?: POLYGON, skip?: boolean) {
        if (typeof(polygon) != 'undefined') {
            if (typeof(polygon.name) == 'string') {
                this.name = polygon.name;
            };
            if (typeof(polygon.points) != 'undefined') {
                this.points = polygon.points;
            };
            if (typeof(polygon.position) != 'undefined') {
                this.position = new Position(polygon.position);
            };
            if (typeof(polygon.lineWidth) == 'number') {
                this.lineWidth = polygon.lineWidth;
            };
            if (typeof(polygon.fillColor) != 'undefined') {
                this.fillColor = polygon.fillColor;
            };
            if (typeof(polygon.strokeColor) != 'undefined') {
                this.strokeColor = polygon.strokeColor;
            };
        };
      
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
        })

        window.requestAnimationFrame(() => this.bounds());
    };

    public hit(point: POINT) {
        view.context.beginPath();
        
        view.context.fillStyle      = this.fillColor;
        view.context.lineWidth      = this.lineWidth;
        view.context.strokeStyle    = this.strokeColor;
        
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
        
        this.points.map(pt => {
            pt.x = pt.x - difference.x;
            pt.y = pt.y - difference.y;
        });
    };

}

export interface POLYGON {
    'id'?:          string;
    'name'?:        string;
    'points':       POINT[];
    'position':     POSITION;
    'selected'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}