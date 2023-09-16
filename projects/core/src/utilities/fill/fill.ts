import { Gradient, GRADIENT } from '../gradient/gradient'

export class Fill {
  public color: string = '#FFFFFF'
  public opacity: number = 100
  public gradient: Gradient = new Gradient()

  constructor (args?: FILL) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.color) !== 'undefined' && args.color !== null) this.color = args.color
      if (typeof (args.opacity) !== 'undefined' && args.opacity !== null) this.opacity = args.opacity
      if (typeof (args.gradient) !== 'undefined' && args.gradient !== null) this.gradient = new Gradient(args.gradient)
    }
  }
}

export interface FILL {
  color?: string
  opacity?: number
  gradient?: Gradient | GRADIENT
}
