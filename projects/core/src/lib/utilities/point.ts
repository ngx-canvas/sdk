export class Point {

    public x: number = 0;
    public y: number = 0;

    constructor(point?: POINT) {
        if (typeof (point) != 'undefined' && point != null) {
            if (typeof (point.x) == 'number') {
                this.x = point.x;
            };
            if (typeof (point.y) == 'number') {
                this.y = point.y;
            };
        };
    };

}

export interface POINT {
    'x'?: number;
    'y'?: number;
}