import { Point } from '../point/point';

export class Position {

    public x: number = 0;
    public y: number = 0;
    public top: number = 0;
    public left: number = 0;
    public right: number = 0;
    public width: number = 0;
    public center: Point = new Point();
    public radius: number = 0;
    public height: number = 0;
    public bottom: number = 0;
    public rotation: number = 0;

    constructor(args?: POSITION) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.x) != 'undefined' && args.x != null) {
                this.x = Math.floor(args.x);
            };
            if (typeof (args.y) != 'undefined' && args.y != null) {
                this.y = Math.floor(args.y);
            };
            if (typeof (args.top) != 'undefined' && args.top != null) {
                this.top = Math.floor(args.top);
            };
            if (typeof (args.left) != 'undefined' && args.left != null) {
                this.left = Math.floor(args.left);
            };
            if (typeof (args.right) != 'undefined' && args.right != null) {
                this.right = Math.floor(args.right);
            };
            if (typeof (args.width) != 'undefined' && args.width != null) {
                this.width = Math.floor(args.width);
            };
            if (typeof (args.radius) != 'undefined' && args.radius != null) {
                this.radius = Math.floor(args.radius);
            };
            if (typeof (args.center) != 'undefined' && args.center != null) {
                this.center = new Point(args.center);
            };
            if (typeof (args.height) != 'undefined' && args.height != null) {
                this.height = Math.floor(args.height);
            };
            if (typeof (args.bottom) != 'undefined' && args.bottom != null) {
                this.bottom = Math.floor(args.bottom);
            };
            if (typeof (args.rotation) != 'undefined' && args.rotation != null) {
                this.rotation = Math.floor(args.rotation);
            };
        };

        this.bounds();
    };

    public bounds() {
        this.top = this.y;
        this.left = this.x;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        this.center = new Point({
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        });
    };

}

export interface POSITION {
    x?: number;
    y?: number;
    top?: number;
    left?: number;
    width?: number;
    right?: number;
    height?: number;
    radius?: number;
    center?: Point;
    bottom?: number;
    rotation?: number;
}