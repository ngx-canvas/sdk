import { Properties } from '../utilities/properties';
import { Position, POSITION } from '../utilities/position';
import { data } from '../data';
import { POINT } from '../utilities/point';
import { Point } from 'core/lib/core';

export class Polygon extends Properties {
    
    readonly type = 'polygon';
    
    public points: Point[] = []
    
    constructor(polygon?: POLYGON, skip?: boolean) {
        super();

        if (typeof(polygon) != 'undefined') {
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
    'position':     POSITION;
    'selected'?:    boolean;
    'lineWidth'?:   number;
    'fillColor'?:   string;
    'strokeColor'?: string;
}