export class Transform {

  public exists = false
  public rotate: Rotate = {
    r: 0,
    x: 0,
    y: 0,
    exists: false
  }
  public translate: Translate = {
    x: 0,
    y: 0,
    exists: false
  }
  
  toString() {
    const result: string[] = []
    if (this.rotate.exists) result.push(`rotate(${this.rotate.r},${this.rotate.x},${this.rotate.y})`)
    if (this.translate.exists) result.push(`translate(${this.translate.x},${this.translate.y})`)
    return result.join(' ')
  }

  fromString(el: any) {
    const attr = el.attr('transform').split(' ') || []
    this.exists = attr.length > 0
    const rotate = attr.find((o: string) => o.includes('rotate'))
    this.rotate.exists = !!rotate
    if (rotate) {
      const [r, x, y] = rotate.replace('rotate(', '').replace(')', '').split(',')
      this.rotate.r = Number(r)
      this.rotate.x = Number(x)
      this.rotate.y = Number(y)
    }
    const translate = attr.find((o: string) => o.includes('translate'))
    this.translate.exists = !!translate
    if (translate) {
      const [x, y] = translate.replace('translate(', '').replace(')', '').split(',')
      this.translate.x = Number(x)
      this.translate.y = Number(y)
    }
    return this
  }
}

interface Rotate {
  r: number
  x: number
  y: number
  exists: boolean
}

interface Translate {
  x: number
  y: number
  exists: boolean
}
