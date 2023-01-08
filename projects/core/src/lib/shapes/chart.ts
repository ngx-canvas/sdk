import { SHAPE, Shape } from './_shape';

export class Chart extends Shape {

    public type: string = 'chart';

    constructor(args?: CHART) {
        super(args);
    };
}

interface CHART extends SHAPE { }