export class Color {
  public hex: string
  public rgba?: string
  public opacity = 100

  constructor (hex: string, opacity: number) {
    this.hex = hex
    this.opacity = opacity
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result != null) {
      this.rgba = ['rgba(', parseInt(result[1], 16), ', ', parseInt(result[2], 16), ', ', parseInt(result[3], 16), ', ', opacity / 100].join('')
    } else {
      this.rgba = undefined
    }
  }
}
