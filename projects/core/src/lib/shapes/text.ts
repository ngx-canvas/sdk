import { data } from '../data';
import { STATE } from '../utilities/states';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Text {

    readonly type = 'text';

    public id:              string      = ObjectId();
    public data:            any         = {};
    public name:            string      = '';
    public value:           string      = '';
    public states:          STATE[]     = [];
    public hidden:          boolean     = false;
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
        this.set(text);
      
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

    public set(text: TEXT) {
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
            if (typeof(text.hidden) != "undefined") {
                this.hidden = text.hidden;
            };
            if (Array.isArray(text.states)) {
                this.states = text.states;
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

    public hit(point: POINT, radius?: number) {
        if (typeof(radius) != "undefined") {
            radius = 0;
        };
        let hit: boolean = true;
        if (point.x < this.position.x - radius) {
            hit = false;
        };
        if (point.x > this.position.x + this.position.width + radius) {
            hit = false;
        };
        if (point.y < this.position.y - radius) {
            hit = false;
        };
        if (point.y > this.position.y + this.position.height + radius) {
            hit = false;
        };
        return hit;
    };

    public near(point: POINT, radius?: number) {
        if (typeof(radius) == "undefined") {
            radius = 0;
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.top
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.top
            });
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.bottom
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.bottom
            });
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        if (this.position.x == point.x && this.position.y == point.y) {
            this.position.x         = this.position.x - (point.x - current.x);
            this.position.y         = this.position.y - (point.y - current.y);
            this.position.width     = this.position.width + (point.x - current.x);
            this.position.height    = this.position.height + (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
            this.position.y         = this.position.y - (point.y - current.y);
            this.position.width     = this.position.width - (point.x - current.x);
            this.position.height    = this.position.height + (point.y - current.y);
        };
        if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
            this.position.x         = this.position.x - (point.x - current.x);
            this.position.width     = this.position.width + (point.x - current.x);
            this.position.height    = this.position.height - (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
            this.position.width     = this.position.width - (point.x - current.x);
            this.position.height    = this.position.height - (point.y - current.y);
        };
    };

}

export interface TEXT {
    'id'?:              string;
    'data'?:            any;
    'name'?:            string;
    'value'?:           string;
    'states'?:          STATE[];
    'hidden'?:          boolean;
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