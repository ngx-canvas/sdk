import { SHAPE, Shape } from './_shape';

export class Vector extends Shape {

  public src?: string;
  public type: string = 'vector';

  constructor(args?: VECTOR) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.src) != 'undefined' && args.src != null) {
        this.src = args.src;
      };
    };
  };

}

interface VECTOR extends SHAPE {
  src?: string;
}