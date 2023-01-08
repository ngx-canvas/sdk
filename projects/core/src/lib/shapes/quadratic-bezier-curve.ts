import { SHAPE, Shape } from './_shape';

export class QuadraticBezierCurve extends Shape {

  public type: string = 'quadratic-bezier-curve';

  constructor(args?: QUADRATIC_BEZIER_CURVE) {
    super(args);
  };

}

interface QUADRATIC_BEZIER_CURVE extends SHAPE { }