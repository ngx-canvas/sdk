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
import { Shape, SHAPE } from '../shape/shape'

export class Group extends Shape {
  public type: string = 'group'
  public children: any[] = []

  constructor (args?: GROUP) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (Array.isArray(args.children)) {
        this.children = args.children
        const shapes = {
          text: (args: any) => new Text(args),
          line: (args: any) => new Line(args),
          chart: (args: any) => new Chart(args),
          group: (args: any) => new Group(args),
          table: (args: any) => new Table(args),
          curve: (args: any) => new Curve(args),
          vector: (args: any) => new Vector(args),
          iframe: (args: any) => new Iframe(args),
          ellipse: (args: any) => new Ellipse(args),
          polygon: (args: any) => new Polygon(args),
          polyline: (args: any) => new Polyline(args),
          rectangle: (args: any) => new Rectangle(args),
        }
        this.children = args.children.filter(o => (shapes as any)[o.type] instanceof Function).map(o => (shapes as any)[o.type](o))
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

  apply (parent: any) {
    this.el = parent.append('g')
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('id', this.id)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
    this.children.map(o => o.apply(this.el))
  }
}

interface GROUP extends SHAPE {
  children?: any[]
}
