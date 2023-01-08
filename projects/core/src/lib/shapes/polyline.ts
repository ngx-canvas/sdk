import { Point } from '../utilities/point';
import { SHAPE, Shape } from './_shape';

export class Polyline extends Shape {

  public type: string = 'polyline';
  public points: Point[] = [];

  constructor(args?: POLYLINE) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (Array.isArray(args.points)) {
        this.points = args.points;
      };
    };
  };

}

interface POLYLINE extends SHAPE {
  points?: Point[];
}