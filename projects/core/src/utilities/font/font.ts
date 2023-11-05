export class Font {
  public size = 14
  public color = '#000000'
  public style: string[] = []
  public family = 'sans-serif'
  public opacity = 100
  public baseline: CanvasTextBaseline = 'middle'
  public alignment: CanvasTextAlign = 'center'

  constructor (args?: FONT) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.size) !== 'undefined' && args.size !== null) this.size = args.size
      if (typeof (args.color) !== 'undefined' && args.color !== null) this.color = args.color
      if (typeof (args.style) !== 'undefined' && args.style !== null) this.style = args.style
      if (typeof (args.family) !== 'undefined' && args.family !== null) this.family = args.family
      if (typeof (args.opacity) !== 'undefined' && args.opacity !== null) this.opacity = args.opacity
      if (typeof (args.baseline) !== 'undefined' && args.baseline !== null) this.baseline = args.baseline
      if (typeof (args.alignment) !== 'undefined' && args.alignment !== null) this.alignment = args.alignment
    }
  }
}

export interface FONT {
  size?: number
  color?: string
  style?: string[]
  family?: string
  opacity?: number
  baseline?: CanvasTextBaseline
  alignment?: CanvasTextAlign
}
