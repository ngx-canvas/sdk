import { FILL, Fill } from './fill';
import { STROKE, Stroke } from './stroke';

export class Series {

    public type: string;
    public fill: FILL = new Fill();
    public title: string = '';
    public value: number[] = [];
    public stroke: STROKE = new Stroke();

    constructor(series?: SERIES) {
        if (typeof (series) != 'undefined' && series != null) {
            if (Array.isArray(series.value)) {
                this.value = series.value;
            };
            if (typeof (series.type) == 'string') {
                this.type = series.type;
            };
            if (typeof (series.title) == 'string') {
                this.title = series.title;
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
    'type'?: string;
    'fill'?: FILL;
    'title'?: string;
    'value'?: number[];
    'stroke'?: STROKE;
}