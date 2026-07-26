import { color as parse } from 'd3-color'

/**
 * Parses a CSS colour into an `rgba(...)` string at the given opacity.
 *
 * Accepts anything `d3-color` understands — `#rgb`, `#rrggbb`, `#rrggbbaa`,
 * `rgb()`, `hsl()` and the CSS named colours — plus bare hex without the
 * leading `#`, which this class has always allowed.
 */
export class Color {
  public hex: string
  public rgba?: string
  public opacity = 100

  constructor (hex: string, opacity: number) {
    this.hex = hex
    this.opacity = opacity

    // Retry with a '#' so bare hex keeps working: 'ff8800' on its own is not a
    // valid CSS colour, so d3-color rejects it.
    const parsed = parse(hex) ?? parse(`#${hex}`)

    // Built from the channels rather than `formatRgb()`, which drops to `rgb()`
    // at full opacity — callers rely on the alpha always being present.
    if (parsed) {
      const { r, g, b } = parsed.rgb()
      this.rgba = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    }
  }
}
