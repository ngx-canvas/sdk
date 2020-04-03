import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

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
        // this.position.top       = this.position.y;
        // this.position.left      = this.position.x;
        // this.position.right     = this.position.left + this.position.width;
        // this.position.bottom    = this.position.top + this.position.height;
        // this.position.center    = new Point({
        //     'x': this.position.x + (this.position.width / 2),
        //     'y': this.position.y + (this.position.height / 2)
        // })

        window.requestAnimationFrame(() => this.bounds());
    };

    public hit(point: POINT) {
        let hit = false;

        this.points.map(pt => {
            if (pt.x) {};
        });

        return hit;
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