/* --- SHAPES --- */
import { Text } from '../text/text'
import { Line } from '../line/line'
import { Table } from '../table/table'
import { Chart } from '../chart/chart'
import { Curve } from '../curve/curve'
import { Vector } from '../vector/vector'
import { Iframe } from '../iframe/iframe'
import { Ellipse } from '../ellipse/ellipse'
import { Polygon } from '../polygon/polygon'
import { Polyline } from '../polyline/polyline'
import { Rectangle } from '../rectangle/rectangle'
import { AnyShape, Shape, SHAPE } from '../shape/shape'
import { Selection } from '@libs/common'

/** A serialized child shape of a {@link Group}. */
type GroupChild = SHAPE & { type: string }

/**
 * This will add a group to the canvas
 *
 * @example
 * ```ts
 * import { Group } from '@ngx-canvas/core';
 *
 * const shape = new Group();
 * ```
 */
export class Group extends Shape {
  readonly type: string = 'group'

  public children: AnyShape[] = []

  constructor (args?: GROUP) {
    super(args)
    if (args != null && Array.isArray(args.children)) {
      const factories: Record<string, (child: GroupChild) => AnyShape> = {
        text: (child) => new Text(child),
        line: (child) => new Line(child),
        chart: (child) => new Chart(child),
        group: (child) => new Group(child),
        table: (child) => new Table(child),
        curve: (child) => new Curve(child),
        vector: (child) => new Vector(child),
        iframe: (child) => new Iframe(child),
        ellipse: (child) => new Ellipse(child),
        polygon: (child) => new Polygon(child),
        polyline: (child) => new Polyline(child),
        rectangle: (child) => new Rectangle(child),
      }
      for (const child of args.children) {
        if (!Object.prototype.hasOwnProperty.call(factories, child.type)) continue
        const factory = factories[child.type]
        if (factory) this.children.push(factory(child))
      }
    }

    this.position.bounds = () => {
      this.position.top = this.children.map(o => o.position.top).reduce((a, b) => Math.min(a, b), Infinity)
      this.position.left = this.children.map(o => o.position.left).reduce((a, b) => Math.min(a, b), Infinity)
      this.position.right = this.children.map(o => o.position.right).reduce((a, b) => Math.max(a, b), 0)
      this.position.bottom = this.children.map(o => o.position.bottom).reduce((a, b) => Math.max(a, b), 0)

      this.position.width = this.children.map(o => o.position.width).reduce((a, b) => a + b, 0)
      this.position.height = this.children.map(o => o.position.height).reduce((a, b) => Math.max(a, b), 0)
    }
    this.position.bounds()
  }

  apply (parent: Selection) {
    this.el = parent.append('g')
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('id', this.id)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('type', this.type)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y})`)
      .classed('selected', this.selected)
    this.children.map(o => o.apply(this.el))
  }
}

interface GROUP extends SHAPE {
  children?: GroupChild[]
}
