/**
 * Parses a hex color (`#rrggbb`, with or without the leading `#`) into an
 * `rgba(...)` string at the given opacity.
 */
export class Color {
  public hex: string
  public rgba?: string
  public opacity = 100

  constructor (hex: string, opacity: number) {
    this.hex = hex
    this.opacity = opacity
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result != null) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      this.rgba = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    } else {
      this.rgba = undefined
    }
  }
}
