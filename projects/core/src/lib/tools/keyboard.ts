import { Subject } from 'rxjs';

export class KeyboardTool {

    public alt:     boolean = false;
    public ctrl:    boolean = false;
    public shift:   boolean = false;

    public keyup:   Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    public keydown: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    
    constructor() {
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.alt    = event.altKey;
            this.ctrl   = event.ctrlKey;
            this.shift  = event.shiftKey;
            this.keyup.next(event);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.alt    = event.altKey;
            this.ctrl   = event.ctrlKey;
            this.shift  = event.shiftKey;
            this.keydown.next(event);
        });
    };

}