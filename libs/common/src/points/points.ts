import { Point } from '../point/point'

export class Points {

  public value: Point[] = []
  public exists = false

  toString() {
    return this.value.map((o) => [o.x, o.y].join(',')).join(' ')
  }

  fromString(el: any) {
    const points = el.attr('points')?.split(' ') || []
    this.exists = points.length > 0
    if (this.exists) {
      this.value = points.map((o: string) => {
        const [x, y] = o.split(',')
        return {
          x: Number(x),
          y: Number(y)
        }
      })
    }
    return this
  }

}
