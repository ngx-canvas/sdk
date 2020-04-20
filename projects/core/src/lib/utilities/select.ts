import { view } from '../view';
import { Circle } from '../shapes/circle';

export class Select {

    public color: string = '#2196F3';
    
    constructor(item) {
        view.context.beginPath();
        
        view.context.lineWidth      = 1;
        view.context.fillStyle      = this.color;
        view.context.strokeStyle    = this.color;

        if (item instanceof Circle) {
            view.context.ellipse(item.position.x + (item.position.width / 2), item.position.y + (item.position.height / 2), item.position.width / 2, item.position.height / 2, 0, 0, 2 * Math.PI);
            view.context.stroke();
            /* --- T --- */
            view.context.fillRect(item.position.center.x - 3, item.position.top - 3, 6, 6);
            /* --- B --- */
            view.context.fillRect(item.position.center.x - 3, item.position.bottom - 3, 6, 6);
            /* --- L --- */
            view.context.fillRect(item.position.left - 3, item.position.center.y - 3, 6, 6);
            /* --- R --- */
            view.context.fillRect(item.position.right - 3, item.position.center.y - 3, 6, 6);
        } else {
            view.context.strokeRect(item.position.x, item.position.y, item.position.width, item.position.height);

            /* --- TL --- */
            view.context.fillRect(item.position.x - 3, item.position.y - 3, 6, 6);
            /* --- TR --- */
            view.context.fillRect(item.position.right - 3, item.position.y - 3, 6, 6);
            /* --- BL --- */
            view.context.fillRect(item.position.x - 3, item.position.bottom - 3, 6, 6);
            /* --- BR --- */
            view.context.fillRect(item.position.right - 3, item.position.bottom - 3, 6, 6);
        };

        view.context.closePath();
    };

}