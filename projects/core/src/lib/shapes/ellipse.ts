import { SHAPE, Shape } from './_shape';

export class Ellipse extends Shape {

  public type: string = 'ellipse';

  constructor(args?: ELLIPSE) {
    super(args);
  };

}

interface ELLIPSE extends SHAPE { }