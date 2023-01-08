import { SHAPE, Shape } from './_shape';

export class CubicBezierCurve extends Shape {

  public type: string = 'cubic-bezier-curve';

  constructor(args?: CUBIC_BEZIER_CURVE) {
    super(args);
  };

}

interface CUBIC_BEZIER_CURVE extends SHAPE { }