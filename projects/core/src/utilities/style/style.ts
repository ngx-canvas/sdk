import { Fill } from '../../utilities/fill/fill'
import { Font } from '../../utilities/font/font'
import { Point } from '../point/point'
import { Stroke } from '../../utilities/stroke/stroke'
import { Position } from '../../utilities/position/position'

export class Style {

  public fill = new Fill()
  public font = new Font()
  public name = ''
  public stroke = new Stroke()
  public position = new Position()

  constructor(_el: any) {
    this.fill = new Fill({
      color: _el.attr('fill'),
      opacity: _el.attr('fill-opacity'),
      gradient: _el.attr('gradient')
    })

    this.font = new Font({
      size: _el.style('font-size').replace('px', ''),
      color: _el.style('color'),
      style: [], // _el.style('font-style'),
      family: _el.style('font-family'),
      opacity: _el.style('opacity'),
      baseline: _el.style('justify-content'),
      alignment: _el.style('align-items')
    })

    this.stroke = new Stroke({
      cap: _el.attr('stroke-linecap'),
      color: _el.attr('stroke'),
      width: _el.attr('stroke-width'),
      style: _el.attr('stroke-style'),
      opacity: _el.attr('stroke-opacity'),
      gradient: _el.attr('gradient')
    })

    this.position = new Position({
      center: new Point({
        x: _el.attr('cx'),
        y: _el.attr('cy')
      }),
      x: _el.attr('x'),
      y: _el.attr('y'),
      top: _el.attr('top'),
      left: _el.attr('left'),
      right: _el.attr('right'),
      width: _el.attr('width'),
      radius: _el.attr('radius'),
      height: _el.attr('height'),
      bottom: _el.attr('bottom'),
      rotation: _el.attr('rotation')
    })
  }

}
