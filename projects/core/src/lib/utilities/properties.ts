import { ObjectId } from '../id';
import { Position, POSITION } from './position';

import { Font, FONT } from './font';
import { Fill, FILL } from './fill';
import { Stroke, STROKE } from './stroke';

/* --- SHAPES --- */
import { LINE } from '../shapes/line';
import { TEXT } from '../shapes/text';
import { GROUP } from '../shapes/group';
import { BUTTON } from '../shapes/button';
import { VECTOR } from '../shapes/vector';
import { CIRCLE } from '../shapes/circle';
import { POLYGON } from '../shapes/polygon';
import { RECTANGLE } from '../shapes/rectangle';

export class Properties {

    public id:          string      = null;
    public type:        string      = null;
    public name:        string      = '';
    public fill:        FILL        = new Fill();
    public font:        FONT        = new Font();
    public stroke:      STROKE      = new Stroke();
    public selected:    boolean     = false;
    public children:    any[]       = [];
    public position:    POSITION    = new Position();

    constructor() {
        this.id = ObjectId();
    };

}

export interface PROPERTIES {
    'id'?:          string;
    'type'?:        string;
    'name'?:        string;
    'font'?:        FONT;
    'fill'?:        FILL;
    'stroke'?:      STROKE;
    'locked'?:      boolean;
    'selected'?:    boolean;
    'position'?:    POSITION;
    'children'?:    LINE | TEXT | GROUP | BUTTON | CIRCLE | VECTOR | POLYGON | RECTANGLE [];
}