import { ObjectId } from '../id';

export class States {

    public value: STATE[] = [];

    constructor(value?: STATE[]) {
        if (Array.isArray(value)) {
            this.value = value;
        };
    };

    public get(id: string) {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].id == id) {
                return this.value[i];
            };
        };

        return false;
    };
    
    public add(state: STATE) {
        state.id = ObjectId();
    };

    public remove(id: string) {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].id == id) {
                this.value.splice(i, 1);
                break;
            };
        };
    };
    
    public update(state: STATE) {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].id == state.id) {
                this.value[i] = state;
                break;
            };
        };
    };

}

export interface STATE {
    'id':               string;
    'min':              number;
    'max':              number;
    'value'?:           string;
    'hidden'?:          boolean;
    'fontSize'?:        number;
    'textAlign'?:       string;
    'fontColor'?:       string;
    'lineWidth'?:       number;
    'fillColor'?:       string;
    'fontFamily'?:      string;
    'strokeColor'?:     string;
    'textBaseline'?:    string;
}