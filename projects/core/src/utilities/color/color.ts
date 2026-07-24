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
    const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? []
    this.rgba =
      r && g && b
        ? `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${opacity / 100})`
        : undefined
  }
}
