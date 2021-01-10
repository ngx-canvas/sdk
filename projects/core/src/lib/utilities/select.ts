import { view } from '../view';

export class Select {

    constructor(item) {
        view.context.beginPath();
        
        view.context.lineWidth = 7;
        view.context.fillStyle = 'rgba(33, 150, 243, 1)';
        view.context.strokeStyle = 'rgba(33, 150, 243, 0.25)';

        if (1 == item.stroke.width % 2) {
            view.context.strokeRect(Math.floor(item.position.x) - 0.5, Math.floor(item.position.y) - 0.5, Math.floor(item.position.width), Math.floor(item.position.height));
            view.context.fillRect(Math.floor(item.position.left) - 4, Math.floor(item.position.top) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.right) - 4, Math.floor(item.position.top) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.left) - 4, Math.floor(item.position.bottom) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.right) - 4, Math.floor(item.position.bottom) - 4, 7, 7);
            
            view.context.fillRect(Math.floor(item.position.center.x) - 4, Math.floor(item.position.top) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.center.x) - 4, Math.floor(item.position.bottom) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.left) - 4, Math.floor(item.position.center.y) - 4, 7, 7);
            view.context.fillRect(Math.floor(item.position.right) - 4, Math.floor(item.position.center.y) - 4, 7, 7);
            
            view.context.ellipse(Math.floor(item.position.center.x) - 0.5, Math.floor(item.position.top - 30) - 0.5, 8 / 2, 8 / 2, 0, 0, 2 * Math.PI);
            view.context.fill();

            view.context.moveTo(Math.floor(item.position.center.x) - 0.5, Math.floor(item.position.top));
            view.context.lineTo(Math.floor(item.position.center.x) - 0.5, Math.floor(item.position.top - 30));
            view.context.stroke();
        } else {
            view.context.strokeRect(item.position.x - 0.5, item.position.y - 0.5, item.position.width, item.position.height);
            view.context.fillRect(item.position.left - 4, item.position.top - 4, 7, 7);
            view.context.fillRect(item.position.right - 3, item.position.top - 4, 7, 7);
            view.context.fillRect(item.position.left - 4, item.position.bottom - 3, 7, 7);
            view.context.fillRect(item.position.right - 3, item.position.bottom - 3, 7, 7);
            
            view.context.fillRect(item.position.center.x - 4, item.position.top - 4, 7, 7);
            view.context.fillRect(item.position.center.x - 4, item.position.bottom - 4, 7, 7);
            view.context.fillRect(item.position.left - 4, item.position.center.y - 4, 7, 7);
            view.context.fillRect(item.position.right - 4, item.position.center.y - 4, 7, 7);
        };

        view.context.closePath();
    };

}