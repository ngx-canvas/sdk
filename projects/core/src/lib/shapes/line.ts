import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Line {
    
    readonly type = 'line';

    public id:          string      = ObjectId();
    public name:        string      = '';
    public points:      Point[]     = [];
    public position:    POSITION    = POSITION_DEFAULTS;
    public selected:    boolean     = false;
    public lineWidth:   number      = 0;
    public fillColor:   string      = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string      = 'rgba(0, 0, 0, 1)';

    constructor(line?: LINE, skip?: boolean) {
        if (typeof(line) != 'undefined') {
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
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = this.position.left + this.position.width;
        this.position.bottom    = this.position.top + this.position.height;
        this.position.center    = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        })

        window.requestAnimationFrame(() => this.bounds());
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
        this.position.x         = point.x - (this.position.width / 2);
        this.position.y         = point.y - (this.position.height / 2);
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = point.x + (this.position.width / 2);
        this.position.center    = point;
        this.position.bottom    = point.y + (this.position.height / 2);
    };

}

export interface LINE {
    'id'?:          string;
    'name'?:        string;
    'points':       POINT[];
    'position':     POSITION;
    'selected'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}