import { view } from '../view';
import { POINT } from '../utilities/point';

export class SnapPoint {

    public x: number;
    public y: number;
    public radius: number = 4;
    public lineWidth: number = 1;
    public fillColor: string = 'rgba(0, 0, 0, 0.5)';
    public strokeColor: string = 'rgba(0, 0, 0, 1)';

    constructor(point: POINT) {
        this.x = point.x;
        this.y = point.y;

        this.draw();
    };

    public hit(point: POINT) {
        if (Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2) < this.radius) {
            return true;
        };
        return false;
    };

    public draw() {
        view.context.beginPath();

        view.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        view.context.fillStyle = this.fillColor;
        view.context.lineWidth = this.lineWidth;
        view.context.strokeStyle = this.strokeColor;

        view.context.fill();
        view.context.stroke();

        view.context.closePath();

        window.requestAnimationFrame(() => this.draw());
    };

}