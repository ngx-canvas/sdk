import { Point } from '../../utilities/point/point';
import { SHAPE, Shape } from '../shape/shape';

export class Polygon extends Shape {

  public type: string = 'polygon';
  public points: Point[] = [];

  constructor(args?: POLYGON) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (Array.isArray(args.points)) {
        this.points = args.points;
      };
    };
  };

}

interface POLYGON extends SHAPE {
  points?: Point[];
}