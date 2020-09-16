import { ObjectId } from '../id';
import { FILL, Fill } from './fill';
import { STROKE, Stroke } from './stroke';

export class Series {

    public id: string = ObjectId();
    public type: string;
    public fill: FILL = new Fill();
    public data: any = {};
    public title: string = '';
    public value: number[] = [];
    public stroke: STROKE = new Stroke();

    constructor(series?: SERIES) {
        if (typeof (series) != 'undefined' && series != null) {
            if (Array.isArray(series.value)) {
                this.value = series.value;
            };
            if (typeof (series.id) != 'string') {
                this.id = series.id;
            };
            if (typeof (series.type) == 'string') {
                this.type = series.type;
            };
            if (typeof (series.title) == 'string') {
                this.title = series.title;
            };
            if (typeof (series.data) != 'undefined' && series.data != null) {
                this.data = series.data;
            };
            if (typeof (series.fill) != 'undefined' && series.fill != null) {
                this.fill = new Fill(series.fill);
            };
            if (typeof (series.stroke) != 'undefined' && series.stroke != null) {
                this.stroke = new Stroke(series.stroke);
            };
        };
    };

}

export interface SERIES {
    'id'?: string;
    'data'?: any;
    'type'?: string;
    'fill'?: FILL;
    'title'?: string;
    'value'?: number[];
    'stroke'?: STROKE;
}