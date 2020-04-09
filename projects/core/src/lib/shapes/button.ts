import { data } from '../data';
import { STATE } from '../utilities/states';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Button {

    readonly type = 'button';

    public id:              string      = ObjectId();
    public data:            any         = {};
    public name:            string      = '';
    public value:           string      = '';
    public states:          STATE[]     = [];
    public hidden:          boolean     = false;
    public position:        POSITION    = POSITION_DEFAULTS;
    public selected:        boolean     = false;
    public fontSize:        number      = 20;
    public dragging:        boolean     = false;
    public lineWidth:       number      = 1;
    public fillColor:       string      = 'rgba(0, 0, 0, 0.5)';
    public fontColor:       string      = 'rgba(255, 255, 255, 1)';
    public textAlign:       string      = 'center';
    public fontFamily:      string      = 'sans-serif';
    public strokeColor:     string      = 'rgba(0, 0, 0, 1)';
    public textBaseline:    string      = 'middle';
    
    constructor(button?: BUTTON, skip?: boolean) {
        if (typeof(button) != 'undefined') {
            if (typeof(button.data) != "undefined") {
                this.data = button.data;
            };
            if (typeof(button.name) == "string") {
                this.name = button.name;
            };
            if (Array.isArray(button.states)) {
                this.states = button.states;
            };
            if (typeof(button.value) == "string") {
                this.value = button.value;
            };
            if (typeof(button.hidden) != "undefined") {
                this.hidden = button.hidden;
            };
            if (typeof(button.selected) != "undefined") {
                this.selected = button.selected;
            };
            if (typeof(button.fontSize) == "number") {
                this.fontSize = button.fontSize;
            };
            if (typeof(button.dragging) != "undefined") {
                this.dragging = button.dragging;
            };
            if (typeof(button.position) != "undefined") {
                this.position = new Position(button.position);
            };
            if (typeof(button.lineWidth) == "number") {
                this.lineWidth = button.lineWidth;
            };
            if (typeof(button.fillColor) != "undefined") {
                this.fillColor = button.fillColor;
            };
            if (typeof(button.fontColor) != "undefined") {
                this.fontColor = button.fontColor;
            };
            if (typeof(button.textAlign) != "undefined") {
                this.textAlign = button.textAlign;
            };
            if (typeof(button.fontFamily) != "undefined") {
                this.fontFamily = button.fontFamily;
            };
            if (typeof(button.strokeColor) != "undefined") {
                this.strokeColor = button.strokeColor;
            };
            if (typeof(this.textBaseline) != "undefined") {
                this.textBaseline = button.textBaseline;
            };
        };
      
        if (!skip) {
            data.push(this);
        };
      
        this.bounds();
    };

    public bounds() {
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = this.position.left + this.position.width;
        this.position.bottom    = this.position.top + this.position.height;
        this.position.center    = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        })

        window.requestAnimationFrame(() => this.bounds());
    };

    public hit(point: POINT) {
        let hit: boolean = true;
        if (point.x < this.position.x) {
            hit = false;
        };
        if (point.x > this.position.x + this.position.width) {
            hit = false;
        };
        if (point.y < this.position.y) {
            hit = false;
        };
        if (point.y > this.position.y + this.position.height) {
            hit = false;
        };
        return hit;
    };

    public move(point: POINT) {
        this.position.x         = point.x - (this.position.width / 2);
        this.position.y         = point.y - (this.position.height / 2);
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = point.x + (this.position.width / 2);
        this.position.center    = point;
        this.position.bottom    = point.y + (this.position.height / 2);
    };

}

export interface BUTTON {
    'id'?:              string;
    'data'?:            any;
    'name'?:            string;
    'value':            string;
    'states'?:          STATE[];
    'hidden'?:          boolean;
    'position':         POSITION;
    'selected'?:        boolean;
    'dragging'?:        boolean;
    'fontSize'?:        number;
    'textAlign'?:       string;
    'fontColor'?:       string;
    'lineWidth'?:       number;
    'fillColor'?:       string;
    'fontFamily'?:      string;
    'strokeColor'?:     string;
    'textBaseline'?:    string;
}