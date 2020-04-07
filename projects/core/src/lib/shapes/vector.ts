import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Vector {

    readonly type = 'vector';

    public id:              string      = ObjectId();
    public src:             string;
    public name:            string      = '';
    public image:           HTMLImageElement;
    public position:        POSITION    = POSITION_DEFAULTS;
    public selected:        boolean     = false;
    public dragging:        boolean     = false;
    
    constructor(vector?: VECTOR, skip?: boolean) {
        if (typeof(vector) != 'undefined') {
            if (typeof(vector.src) == 'string') {
                this.src = vector.src;
            };
            if (typeof(vector.name) == 'string') {
                this.name = vector.name;
            };
            if (typeof(vector.position) != 'undefined') {
                this.position = new Position(vector.position);
            };
        };

        this.image      = new Image();
        this.image.src  = this.src;
      
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

export interface VECTOR {
    'id'?:          string;
    'src':          string;
    'name'?:        string;
    'position':     POSITION;
    'selected'?:    boolean;
    'dragging'?:    boolean;
}