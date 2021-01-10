import { Point, POINT } from './point';

export class Position {

    public x: number = 0;
    public y: number = 0;
    public top: number = 0;
    public left: number = 0;
    public right: number = 0;
    public width: number = 0;
    public center: POINT = new Point();
    public radius: number = 0;
    public height: number = 0;
    public bottom: number = 0;
    public rotation: number = 0;

    constructor(position?: POSITION) {
        if (typeof (position) != 'undefined' && position != null) {
            if (typeof (position.x) == 'number') {
                this.x = Math.floor(position.x);
            };
            if (typeof (position.y) == 'number') {
                this.y = Math.floor(position.y);
            };
            if (typeof (position.top) == 'number') {
                this.top = Math.floor(position.top);
            };
            if (typeof (position.left) == 'number') {
                this.left = Math.floor(position.left);
            };
            if (typeof (position.right) == 'number') {
                this.right = Math.floor(position.right);
            };
            if (typeof (position.width) == 'number') {
                this.width = Math.floor(position.width);
            };
            if (typeof (position.radius) == 'number') {
                this.radius = Math.floor(position.radius);
            };
            if (typeof (position.center) != 'undefined' && position.center != null) {
                this.center = new Point(position.center);
            };
            if (typeof (position.height) == 'number') {
                this.height = Math.floor(position.height);
            };
            if (typeof (position.bottom) == 'number') {
                this.bottom = Math.floor(position.bottom);
            };
            if (typeof (position.rotation) == 'number') {
                this.rotation = Math.floor(position.rotation);
            };
        };
    };

}

export interface POSITION {
    'x'?: number;
    'y'?: number;
    'top'?: number;
    'left'?: number;
    'width'?: number;
    'right'?: number;
    'height'?: number;
    'radius'?: number;
    'center'?: POINT;
    'bottom'?: number;
    'rotation'?: number;
}