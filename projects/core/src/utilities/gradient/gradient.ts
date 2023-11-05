export class Gradient {
  public end = {
    x: 0,
    y: 0
  }

  public start = {
    x: 0,
    y: 0
  }

  public center = {
    x: 0,
    y: 0
  }

  public type = 'none'
  public angle = 0
  public colors: GradientColorStop[] = []
  public stretch = false

  constructor(args?: GRADIENT) {
    if (args?.end?.x) this.end.x = args.end.x
    if (args?.end?.y) this.end.y = args.end.y
    if (args?.start?.x) this.start.x = args.start.x
    if (args?.start?.y) this.start.y = args.start.y
    if (args?.center?.x) this.center.x = args.center.x
    if (args?.center?.y) this.center.y = args.center.y
    if (args?.type) this.type = args.type
    if (args?.angle) this.angle = args.angle
    if (args?.colors) this.colors = args.colors.map(o => new GradientColorStop(o))
    if (args?.stretch) this.stretch = args.stretch
  }
}

export interface GRADIENT {
  end: {
    x: number
    y: number
  }
  start: {
    x: number
    y: number
  }
  center: {
    x: number
    y: number
  }
  type: string
  angle: number
  colors: GradientColorStop[]
  stretch: boolean
}

export class GradientColorStop {
  public point?: number
  public color?: string

  constructor(args?: GRADIENT_COLOR_STOP) {
    if (args?.point) this.point = args.point
    if (args?.color) this.color = args.color
  }
}

export interface GRADIENT_COLOR_STOP {
  point?: number
  color?: string
}
