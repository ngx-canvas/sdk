import { SHAPE, Shape } from './_shape';

export class Button extends Shape {

  public type: string = 'button';
  public value: string = '';

  constructor(args?: BUTTON) {
    super(args);
    if (typeof (args) != 'undefined' && args != null) {
      if (typeof (args.value) != 'undefined' && args.value != null) {
        this.value = args.value;
      };
    };
  };

}

interface BUTTON extends SHAPE {
  value?: string;
}