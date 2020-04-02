export class Point {
    
    public x: number;
    public y: number;

    constructor(point: POINT) {
        this.x = point.x;
        this.y = point.y;
    };

}

export interface POINT {
    'x': number;
    'y': number;
}