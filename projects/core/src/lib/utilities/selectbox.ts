import { view } from '../view';
import { POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class SelectBox {

    public color:       string = '#2196F3';
    public active:      boolean;
    public position:    POSITION = POSITION_DEFAULTS;
    
    constructor() {
        this.draw();
    };

    public draw() {
        if (this.active) {
            view.context.beginPath();

            view.context.lineWidth      = 1;
            view.context.fillStyle      = 'rgba(33, 150, 243, 0.05)';
            view.context.strokeStyle    = this.color;
            view.context.rect(this.position.x, this.position.y, this.position.width, this.position.height);
            
            view.context.fill();
            
            view.context.stroke();

            /* --- TL --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(this.position.x - 3, this.position.y - 3, 6, 6);

            /* --- TR --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(this.position.x + this.position.width - 3, this.position.y - 3, 6, 6);
            /* --- BL --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(this.position.x - 3, this.position.y + this.position.height - 3, 6, 6);

            /* --- BR --- */
            view.context.fillStyle = this.color;
            view.context.fillRect(this.position.x + this.position.width - 3, this.position.y + this.position.height - 3, 6, 6);

            view.context.closePath();
        };

        window.requestAnimationFrame(() => this.draw());
    };

    public reset() {
        this.active             = false;
        this.position.x         = 0;
        this.position.y         = 0;
        this.position.width     = 0;
        this.position.height    = 0;
    };

    public bounds() {

        if (this.position.width > 0) {
            return {
                'x':        this.position.x,
                'y':        this.position.y,
                'top':      this.position.y,
                'left':     this.position.x,
                'right':    this.position.x + this.position.width,
                'width':    this.position.width,
                'bottom':   this.position.y + this.position.height,
                'height':   this.position.height
            };
        } else {
            return {
                'x':        this.position.x + this.position.width,
                'y':        this.position.y + this.position.height,
                'top':      this.position.y + this.position.height,
                'left':     this.position.x + this.position.width,
                'right':    this.position.x,
                'width':    -this.position.width,
                'bottom':   this.position.y,
                'height':   -this.position.height
            };
        };
    };

}