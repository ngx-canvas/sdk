export class Events {

    public events: EVENTS = {};

    constructor() { };

    public on(event: string, dispatcher: Function) {
        const allowed = ['click', 'mouseup', 'mousedown', 'mousemove', 'mousedrag', 'mouseenter', 'mouseleave'];
        if (allowed.includes(event)) {
            this.events[event] = dispatcher;
            return true;
        } else {
            return false;
        };
    };

    public off(event: string) {
        delete this.events[event];
    };

}

export interface EVENTS {
    click?: Function;
    ready?: Function;
    mouseup?: Function;
    mousedown?: Function;
    mousemove?: Function;
    mousedrag?: Function;
    mouseenter?: Function;
    mouseleave?: Function;
}