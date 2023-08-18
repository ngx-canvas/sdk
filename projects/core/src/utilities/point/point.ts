export class Point {
  public x: number = 0
  public y: number = 0

  constructor (args?: POINT) {
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.x) !== 'undefined' && args.x != null && args.x > 0) this.x = args.x
      if (typeof (args.y) !== 'undefined' && args.y != null && args.y > 0) this.y = args.y
    }
  }
}

export interface POINT {
  x?: number
  y?: number
}
