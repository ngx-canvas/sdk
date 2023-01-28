import { SHAPE, Shape } from '../shape/shape';

export class Ellipse extends Shape {

  public type: string = 'ellipse';

  constructor(args?: ELLIPSE) {
    super(args);
  };

}

interface ELLIPSE extends SHAPE { }