import { POINT } from './point';

export class Position {
    
    public x:           number;
    public y:           number;
    public top:         number;
    public left:        number;
    public right:       number;
    public width:       number;
    public center:      POINT;
    public radius:      number = 0;
    public height:      number;
    public bottom:      number;
    public rotation:    number = 0;

    constructor(position: POSITION) {
        this.x          = position.x;
        this.y          = position.y;
        this.top        = position.top;
        this.left       = position.left;
        this.right      = position.right;
        this.width      = position.width;
        this.radius     = position.radius;
        this.center     = position.center;
        this.height     = position.height;
        this.bottom     = position.bottom;
        this.rotation   = position.rotation;
    };

}

export interface POSITION {
    'x':            number;
    'y':            number;
    'top'?:         number;
    'left'?:        number;
    'width':        number;
    'right'?:       number;
    'height':       number;
    'radius'?:      number;
    'center'?:      POINT;
    'bottom'?:      number;
    'rotation'?:    number;
}

export const POSITION_DEFAULTS = {
    'center': {
        'x': 0,
        'y': 0
    },
    'x':        0,
    'y':        0,
    'top':      0,
    'left':     0,
    'width':    0,
    'right':    0,
    'radius':   0,
    'height':   0,
    'bottom':   0,
    'rotation': 0
}