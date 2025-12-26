import { Selection } from '@libs/common'
import { Shape, SHAPE } from '../shape/shape'
import { Position } from '../../utilities/position/position'
import { Fill } from '../../utilities/fill/fill'
import { Stroke } from '../../utilities/stroke/stroke'
import { Font } from '../../utilities/font/font'

export class Rectangle extends Shape {
  readonly type: string = 'rectangle'

  constructor (args?: RECTANGLE) {
    super(args)
  }

  override apply (parent: Selection) {
    this.el = parent.append('rect')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  override update(config?: RECTANGLE) {
    if (config) {
      // Apply Object.assign first, then override with proper class instances
      const { position, fill, stroke, font, ...rest } = config
      Object.assign(this, rest)
      if (position) this.position = new Position(position)
      if (fill) this.fill = new Fill(fill)
      if (stroke) this.stroke = new Stroke(stroke)
      if (font) this.font = new Font(font)
    }

    if (!this.el) return

    const classes = this.className.split(' ').filter((value, index, self) => self.indexOf(value) === index)
    if (!classes.includes('shape')) classes.push('shape')

    this.el
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('rx', this.position.radius)
      .attr('top', !(this.stroke.width % 2) ? this.position.top : this.position.top + 0.5)
      .attr('fill', this.fill.color)
      .attr('left', !(this.stroke.width % 2) ? this.position.left : this.position.left + 0.5)
      .attr('class', classes.join(' '))
      .attr('right', !(this.stroke.width % 2) ? this.position.right : this.position.right + 0.5)
      .attr('width', this.position.width)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)
      .attr('bottom', !(this.stroke.width % 2) ? this.position.bottom : this.position.bottom + 0.5)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
      .attr('stroke-dasharray', this.stroke.dasharray())
      .classed('selected', this.selected)
  }
}

type RECTANGLE = SHAPE
