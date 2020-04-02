import { data } from '../data';
import { Properties } from '../utilities/properties';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION } from '../utilities/position';

export class Rectangle extends Properties {

    readonly type = 'rectangle';
    
    constructor(rectangle?: RECTANGLE, skip?: boolean) {
        super();

        if (typeof(rectangle) != 'undefined') {
            if (typeof(rectangle.position) != 'undefined') {
                this.position = new Position(rectangle.position);
            };
            if (typeof(rectangle.lineWidth) == 'number') {
                this.lineWidth = rectangle.lineWidth;
            };
            if (typeof(rectangle.fillColor) != 'undefined') {
                this.fillColor = rectangle.fillColor;
            };
            if (typeof(rectangle.strokeColor) != 'undefined') {
                this.strokeColor = rectangle.strokeColor;
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

export interface RECTANGLE {
    'id'?:          string;
    'name'?:        string;
    'position':     POSITION;
    'selected'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}