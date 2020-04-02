import { POINT } from './point';
import { ObjectId } from '../id';
import { POSITION, POSITION_DEFAULTS } from './position';

export class Properties {

    public id:          string;
    public type:        string;
    public name:        string;
    public selected:    boolean;
    public children:    any[]       = [];
    public position:    POSITION    = POSITION_DEFAULTS;
    public lineWidth:   number      = 0;
    public fillColor:   string      = 'rgba(0, 0, 0, 0)';
    public strokeColor: string      = 'rgba(0, 0, 0, 0)';

    constructor() {
        this.id = ObjectId();
    };

}