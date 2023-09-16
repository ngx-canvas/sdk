import { Gradient } from '../gradient/gradient'

export type StrokeStyle = 'solid' | 'dashed' | 'dotted'

export class Stroke {
  public cap: CanvasLineCap = 'round'
  public width: number = 1
  public style: StrokeStyle = 'solid'
  public color: string = '#000000'
  public opacity: number = 100
  public gradient: Gradient = new Gradient()

  constructor(args?: STROKE) {
    if (args?.cap) this.cap = args.cap
    if (args?.width) this.width = args.width
    if (args?.style) this.style = args.style
    if (args?.color) this.color = args.color
    if (args?.opacity) this.opacity = args.opacity
    if (args?.gradient) this.gradient = new Gradient(args.gradient)
  }

  dasharray() {
    switch (this.style) {
    case 'solid':
      return 'none'
    case 'dashed':
      return `${this.width * 4},${this.width * 4}`
    case 'dotted':
      return `${this.width},${this.width * 2}`
    }
  }
}

export interface STROKE {
  cap?: CanvasLineCap
  width?: number
  style?: StrokeStyle
  color?: string
  opacity?: number
  gradient?: Gradient
}
