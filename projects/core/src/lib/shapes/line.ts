import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';
import { view } from '../view';

export class Line {
    
    readonly type = 'line';

    public id:          string      = ObjectId();
    public data:        any         = {};
    public name:        string      = '';
    public points:      Point[]     = [];
    public lineCap:     string      = 'round';
    public position:    POSITION    = POSITION_DEFAULTS;
    public selected:    boolean     = false;
    public dragging:    boolean     = false;
    public lineWidth:   number      = 1;
    public fillColor:   string      = 'rgba(0, 0, 0, 0)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';

    constructor(line?: LINE, skip?: boolean) {
        if (typeof(line) != 'undefined') {
            if (typeof(line.data) != "undefined") {
                this.data = line.data;
            };
            if (typeof(line.name) == 'string') {
                this.name = line.name;
            };
            if (typeof(line.points) != 'undefined') {
                this.points = line.points;
            };
            if (typeof(line.position) != 'undefined') {
                this.position = new Position(line.position);
            };
            if (typeof(line.lineWidth) == 'number') {
                this.lineWidth = line.lineWidth;
            };
            if (typeof(line.fillColor) != 'undefined') {
                this.fillColor = line.fillColor;
            };
            if (typeof(line.strokeColor) != 'undefined') {
                this.strokeColor = line.strokeColor;
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

export interface LINE {
    'id'?:          string;
    'data'?:            any;
    'name'?:        string;
    'points':       POINT[];
    'lineCap'?:     string;
    'position':     POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}