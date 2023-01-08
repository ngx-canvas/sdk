import { SHAPE, Shape } from './_shape';

export class EllipticalCurve extends Shape {

  public type: string = 'elliptical-curve';

  constructor(args?: ELLIPTICAL_CURVE) {
    super(args);
  };

}

interface ELLIPTICAL_CURVE extends SHAPE { }