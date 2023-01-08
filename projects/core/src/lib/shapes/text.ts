import { SHAPE, Shape } from './_shape';

export class Text extends Shape {

  public type: string = 'text';
  public value: string = '';

  constructor(args?: TEXT) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.value) != 'undefined' && args.value != null) {
        this.value = args.value;
      };
    };
  };

}

interface TEXT extends SHAPE {
  value?: string;
}