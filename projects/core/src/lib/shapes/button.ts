import { data } from '../data';
import { ObjectId } from '../id';
import { Point, POINT } from '../utilities/point';
import { Position, POSITION, POSITION_DEFAULTS } from '../utilities/position';

export class Button {

    readonly type = 'button';

    public id:              string      = ObjectId();
    public data:            any         = {};
    public name:            string      = '';
    public value:           string      = '';
    public states:          any[]       = [];
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
        this.set(button);
      
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
        });
    };

    public move(point: POINT) {
        this.position.x         = point.x - (this.position.width / 2);
        this.position.y         = point.y - (this.position.height / 2);
        this.position.top       = this.position.y;
        this.position.left      = this.position.x;
        this.position.right     = point.x + (this.position.width / 2);
        this.position.center    = point;
        this.position.bottom    = point.y + (this.position.height / 2);
        this.position.center    = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });
    };

    public set(button: BUTTON) {
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
            if (typeof(button.fontSize) == "number") {
                this.fontSize = button.fontSize;
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
        if (this.position.width < 0) {
            this.position.width = 0;
        };
        if (this.position.height < 0) {
            this.position.height = 0;
        };
        this.bounds();
    };

}

export interface BUTTON {
    'id'?:              string;
    'data'?:            any;
    'name'?:            string;
    'value':            string;
    'states'?:          any[];
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