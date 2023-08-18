export class Gradient {
  public end: any = {
    x: null,
    y: null
  }

  public start: any = {
    x: null,
    y: null
  }

  public center: any = {
    x: null,
    y: null
  }

  public type: string = 'none'
  public angle: number = 0
  public colors: GradientColorStop[] = []
  public stretch: boolean = false

  constructor (args?: GRADIENT) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.end) !== 'undefined' && args.end !== null) {
        if (typeof (args.end.x) !== 'undefined' && args.end.x !== null) {
          this.end.x = args.end.x
        };
        if (typeof (args.end.y) !== 'undefined' && args.end.y !== null) {
          this.end.y = args.end.y
        };
      };
      if (typeof (args.start) !== 'undefined' && args.start !== null) {
        if (typeof (args.start.x) !== 'undefined' && args.start.x !== null) {
          this.start.x = args.start.x
        };
        if (typeof (args.start.y) !== 'undefined' && args.start.y !== null) {
          this.start.y = args.start.y
        };
      };
      if (typeof (args.center) !== 'undefined' && args.center !== null) {
        if (typeof (args.center.x) !== 'undefined' && args.center.x !== null) {
          this.center.x = args.center.x
        };
        if (typeof (args.center.y) !== 'undefined' && args.center.y !== null) {
          this.center.y = args.center.y
        };
      };
      if (typeof (args.type) !== 'undefined' && args.type !== null) {
        this.type = args.type
      };
      if (typeof (args.angle) !== 'undefined' && args.angle !== null) {
        this.angle = args.angle
      };
      if (typeof (args.colors) !== 'undefined' && args.colors !== null) {
        this.colors = args.colors.map(o => new GradientColorStop(o))
      };
      if (typeof (args.stretch) !== 'undefined' && args.stretch !== null) {
        this.stretch = args.stretch
      };
    };
  };
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

  constructor (args?: GRADIENT_COLOR_STOP) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.point) !== 'undefined' && args.point !== null) {
        this.point = args.point
      };
      if (typeof (args.color) !== 'undefined' && args.color !== null) {
        this.color = args.color
      };
    };
  };
}

export interface GRADIENT_COLOR_STOP {
  point?: number
  color?: string
}
