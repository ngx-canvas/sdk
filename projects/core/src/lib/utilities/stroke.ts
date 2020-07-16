export class Stroke {
    
    public cap:     string  = 'round';
    public width:   number  = 1;
    public style:   string  = 'solid';
    public color:   string  = 'rgba(0, 0, 0, 1)';

    constructor(stroke?: STROKE) {
        if (typeof(stroke) != 'undefined' && stroke != null) {
            if (typeof(stroke.cap) == 'string') {
                this.cap = stroke.cap;
            };
            if (typeof(stroke.width) == 'number') {
                this.width = stroke.width;
            };
            if (typeof(stroke.style) == 'string') {
                this.style = stroke.style;
            };
            if (typeof(stroke.color) == 'string') {
                this.color = stroke.color;
            };
        };
    };

}

export interface STROKE {
    'cap'?:     string;
    'width'?:   number;
    'style'?:   string;
    'color'?:   string;
}