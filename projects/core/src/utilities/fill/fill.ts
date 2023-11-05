import { Gradient, GRADIENT } from '../gradient/gradient'

export class Fill {
  public color = '#FFFFFF'
  public opacity = 100
  public gradient: Gradient = new Gradient()

  constructor (args?: FILL) {
    if (typeof(args?.color) !== 'undefined') this.color = args.color
    if (typeof(args?.opacity) !== 'undefined') this.opacity = args.opacity
    if (typeof(args?.gradient) !== 'undefined') this.gradient = new Gradient(args.gradient)
  }
}

export interface FILL {
  color?: string
  opacity?: number
  gradient?: Gradient | GRADIENT
}
