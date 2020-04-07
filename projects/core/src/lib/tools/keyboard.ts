import { Subject } from 'rxjs';

export class KeyboardTool {

    public keyup:   Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    public keydown: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    
    constructor() {
        document.addEventListener('keyup', (event) => this.keyup.next(event));
        document.addEventListener('keydown', (event) => this.keydown.next(event));
    };

}