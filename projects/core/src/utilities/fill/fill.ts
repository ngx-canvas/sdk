import { Gradient, GRADIENT } from '../gradient/gradient'

export class Fill {
  public color: string = '#FFFFFF'
  public opacity: number = 100
  public gradient: Gradient = new Gradient()

  constructor (args?: FILL) {
    if (args?.color) this.color = args.color
    if (args?.opacity) this.opacity = args.opacity
    if (args?.gradient) this.gradient = new Gradient(args.gradient)
  }
}

export interface FILL {
  color?: string
  opacity?: number
  gradient?: Gradient | GRADIENT
}
