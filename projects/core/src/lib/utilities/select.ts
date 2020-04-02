import { view } from '../view';
import { Circle } from '../shapes/circle';

export class Select {

    public color: string = '#2196F3';
    
    constructor(item) {
        if (item instanceof Circle) {
            view.context.beginPath();
            
            view.context.lineWidth      = 1;
            view.context.strokeStyle    = this.color;
            view.context.arc(item.position.x + item.position.radius, item.position.y + item.position.radius, item.position.radius, 0, 2 * Math.PI);
            view.context.stroke();
            /* --- T --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.center.x - 3, item.position.top - 3, 6, 6);

            /* --- B --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.center.x - 3, item.position.bottom - 3, 6, 6);
            /* --- L --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.left - 3, item.position.center.y - 3, 6, 6);

            /* --- R --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.right - 3, item.position.center.y - 3, 6, 6);

            view.context.closePath();
        } else {
            view.context.beginPath();
            
            view.context.lineWidth      = 1;
            view.context.strokeStyle    = this.color;
            view.context.strokeRect(item.position.x, item.position.y, item.position.width, item.position.height);

            /* --- TL --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.x - 3, item.position.y - 3, 6, 6);

            /* --- TR --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.right - 3, item.position.y - 3, 6, 6);
            /* --- BL --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.x - 3, item.position.bottom - 3, 6, 6);

            /* --- BR --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(item.position.right - 3, item.position.bottom - 3, 6, 6);

            view.context.closePath();
        };
    };

}