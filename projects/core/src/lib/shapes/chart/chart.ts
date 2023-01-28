import { SHAPE, Shape } from '../shape/shape';

export class Chart extends Shape {

    public type: string = 'chart';

    constructor(args?: CHART) {
        super(args);
    };
}

interface CHART extends SHAPE { }