import { Fill } from '../../utilities/fill/fill'
import { Font } from '../../utilities/font/font'
import { Point } from '../point/point'
import { Position } from '../../utilities/position/position'
import { Selection } from '@libs/common'
import { Stroke, StrokeStyle } from '../../utilities/stroke/stroke'

export class Style {

  public fill = new Fill()
  public font = new Font()
  public name = ''
  public stroke = new Stroke()
  public position = new Position()

  fromJson(json: any) {
    if (json.fill) this.fill = new Fill(json.fill)
    if (json.font) this.font = new Font(json.font)
    if (json.name) this.name = json.name
    if (json.stroke) this.stroke = new Stroke(json.stroke)
    if (json.position) this.position = new Position(json.position)
    return this
  }

  toSelection(_el: Selection) {
    _el.attr('fill', this.fill.color)
    _el.attr('fill-opacity', this.fill.opacity)

    _el.style('font-size', this.font.size)
    _el.style('color', this.font.color)
    // _el.style('font-style', this.font.style)
    _el.style('font-family', this.font.family)
    _el.style('opacity', this.font.opacity)
    _el.style('justify-content', this.font.baseline)
    _el.style('align-items', this.font.alignment)

    _el.attr('stroke-linecap', this.stroke.cap)
    _el.attr('stroke', this.stroke.color)
    _el.attr('stroke-width', this.stroke.width)
    _el.attr('stroke-style', this.stroke.style)
    _el.attr('stroke-opacity', this.stroke.opacity)

    return this
  }

  fromSelection(_el: Selection) {
    this.fill = new Fill({
      color: _el.attr('fill'),
      opacity: Number(_el.attr('fill-opacity'))
    })

    this.font = new Font({
      size: Number(_el.style('font-size').replace('px', '')),
      color: _el.style('color'),
      style: [], // _el.style('font-style'),
      family: _el.style('font-family'),
      opacity: Number(_el.style('opacity')),
      baseline: <CanvasTextBaseline>_el.style('justify-content'),
      alignment: <CanvasTextAlign>_el.style('align-items')
    })

    this.stroke = new Stroke({
      cap: <CanvasLineCap>_el.attr('stroke-linecap'),
      color: _el.attr('stroke'),
      width: Number(_el.attr('stroke-width')),
      style: <StrokeStyle>_el.attr('stroke-style'),
      opacity: Number(_el.attr('stroke-opacity'))
    })

    this.position = new Position({
      center: new Point({
        x: Number(_el.attr('cx')),
        y: Number(_el.attr('cy'))
      }),
      x: Number(_el.attr('x')),
      y: Number(_el.attr('y')),
      top: Number(_el.attr('top')),
      left: Number(_el.attr('left')),
      right: Number(_el.attr('right')),
      width: Number(_el.attr('width')),
      radius: Number(_el.attr('radius')),
      height: Number(_el.attr('height')),
      bottom: Number(_el.attr('bottom')),
      rotation: Number(_el.attr('rotation'))
    })

    return this
  }

}
