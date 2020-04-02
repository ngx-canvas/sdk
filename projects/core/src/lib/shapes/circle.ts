import { Properties } from '../utilities/properties';
import { Position, POSITION } from '../utilities/position';
import { Point, POINT } from '../utilities/point';
import { data } from '../data';

export class Circle extends Properties {
    
    readonly type = 'circle';
    
    constructor(circle?: CIRCLE, skip?: boolean) {
        super();

        if (typeof(circle) != 'undefined') {
            if (typeof(circle.position) != 'undefined') {
                this.position = new Position(circle.position);
            };
            if (typeof(circle.lineWidth) == 'number') {
                this.lineWidth = circle.lineWidth;
            };
            if (typeof(circle.fillColor) != 'undefined') {
                this.fillColor = circle.fillColor;
            };
            if (typeof(circle.strokeColor) != 'undefined') {
                this.strokeColor = circle.strokeColor;
            };
        };
      
        if (!skip) {
            data.push(this);
        };
        
        this.bounds();
    };

    public hit(point: POINT) {
        if (Math.sqrt((point.x - this.position.center.x) ** 2 + (point.y - this.position.center.y) ** 2) < this.position.radius) {
            return true;
        };
        return false;
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

    public bounds() {
        this.position.center        = new Point({
            'x': this.position.x + this.position.radius,
            'y': this.position.y + this.position.radius
        });

        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.width     = this.position.radius * 2;
        this.position.right     = this.position.left + this.position.width;
        this.position.height    = this.position.width;
        this.position.bottom    = this.position.top + this.position.height;

        window.requestAnimationFrame(() => this.bounds());
    };

}

export interface CIRCLE {
    'id'?:          string;
    'name'?:        string;
    'position':     POSITION;
    'selected'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}