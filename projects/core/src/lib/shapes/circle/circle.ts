import { SHAPE, Shape } from '../shape/shape';

export class Circle extends Shape {

  public type: string = 'circle';

  constructor(args?: CIRCLE) {
    super(args)
  }

}

interface CIRCLE extends SHAPE { }