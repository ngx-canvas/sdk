import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Text {

    readonly type = 'text';

    public id:              string      = ObjectId();
    public data:            any         = {};
    public name:            string      = '';
    public value:           string      = '';
    public position:        POSITION    = POSITION_DEFAULTS;
    public selected:        boolean     = false;
    public dragging:        boolean     = false;
    public fontSize:        number      = 14;
    public lineWidth:       number      = 0;
    public textAlign:       string      = 'center';
    public fontColor:       string      = 'rgba(0, 0, 0, 0.5)';
    public fontFamily:      string      = 'sans-serif';
    public textBaseline:    string      = 'middle';
    
    constructor(text?: TEXT, skip?: boolean) {
        if (typeof(text) != 'undefined') {
            if (typeof(text.data) != "undefined") {
                this.data = text.data;
            };
            if (typeof(text.name) == 'string') {
                this.name = text.name;
            };
            if (typeof(text.value) != 'undefined') {
                this.value = text.value;
            };
            if (typeof(text.fontSize) == 'number') {
                this.fontSize = text.fontSize;
            };
            if (typeof(text.position) != 'undefined') {
                this.position = new Position(text.position);
            };
            if (typeof(text.fontColor) != 'undefined') {
                this.fontColor = text.fontColor;
            };
            if (typeof(text.textAlign) != 'undefined') {
                this.textAlign = text.textAlign;
            };
            if (typeof(text.textBaseline) != 'undefined') {
                this.textBaseline = text.textBaseline;
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

export interface TEXT {
    'id'?:              string;
    'data'?:            any;
    'name'?:            string;
    'value'?:           string;
    'position':         POSITION;
    'selected'?:        boolean;
    'dragging'?:        boolean;
    'fontSize'?:        number;
    'fontColor'?:       string;
    'lineWidth'?:       number;
    'textAlign'?:       string;
    'fontFamily'?:      string;
    'textBaseline'?:    string;
}