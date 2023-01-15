import * as d3 from 'd3'
import { EventEmitter } from 'events'

import { Fill } from './utilities/fill'

/* --- SHAPES --- */
import { Row } from './shapes/row'
import { Text } from './shapes/text'
import { Line } from './shapes/line'
import { Group } from './shapes/group'
import { Chart } from './shapes/chart'
import { Table } from './shapes/table'
import { Column } from './shapes/column'
import { Vector } from './shapes/vector'
import { Button } from './shapes/button'
import { Circle } from './shapes/circle'
import { Ellipse } from './shapes/ellipse'
import { Polygon } from './shapes/polygon'
import { Polyline } from './shapes/polyline'
import { Rectangle } from './shapes/rectangle'
import { EllipticalCurve } from './shapes/elliptical-curve'
import { CubicBezierCurve } from './shapes/cubic-bezier-curve'
import { QuadraticBezierCurve } from './shapes/quadratic-bezier-curve'

/* --- GLOBALS --- */
import { globals } from './globals'

export class Project extends EventEmitter {

  public fill: Fill = new Fill()
  public width: number = 600
  public height: number = 600

  private data: any[] = []

  constructor(reference: string) {
    super()
    this.initialize(reference)
  }

  private draw() {
    this.data.map(o => o.apply(globals.svg))
  }

  public reset() {
    this.import([])
  }

  public export() {
    return JSON.parse(JSON.stringify(this.data))
  }

  public destroy() {
    this.data.splice(0, this.data.length)
  }

  public deselect() {
    this.data.map(item => {
      item.selected = false
    })
  }

  public download() {
    var source = new XMLSerializer().serializeToString(globals.svg.node())
    var blob = new Blob([source], { type: 'text/xmlcharset=utf-8' })
    var link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', 'image.svg')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  public updatePage(reference: string) {
    d3.select(reference).style('overflow', 'hidden').style('position', 'relative')
    globals.svg.attr('width', this.width).attr('height', this.height)
  }

  public async import(args: any[]) {
    this.data.map(item => d3.select(['#', item.id].join('')).remove())

    this.data = []

    const shapes = {
      'text': (args: any) => new Text(args),
      'line': (args: any) => new Line(args),
      'chart': (args: any) => new Chart(args),
      'group': (args: any) => new Group(args),
      'table': (args: any) => new Table(args),
      'vector': (args: any) => new Vector(args),
      'button': (args: any) => new Button(args),
      'circle': (args: any) => new Circle(args),
      'ellipse': (args: any) => new Ellipse(args),
      'polygon': (args: any) => new Polygon(args),
      'polyline': (args: any) => new Polyline(args),
      'rectangle': (args: any) => new Rectangle(args),
      'elliptical-curve': (args: any) => new EllipticalCurve(args),
      'cubic-bezier-curve': (args: any) => new CubicBezierCurve(args),
      'quadratic-bezier-curve': (args: any) => new QuadraticBezierCurve(args)
    }

    this.data = args.filter(o => (<any>shapes)[o.type] instanceof Function).map(o => (<any>shapes)[o.type](o))

    this.draw()

    return true
  }

  private async initialize(reference: string) {
    globals.svg = await d3.select(reference)
      .append('div')
      .attr('id', 'ngx-container')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto')
      .style('position', 'relative')
      .attr('background-color', '#e0e0e0')
      .append('svg')
      .attr('class', 'ngx-canvas')
      .style('margin-top', '15px')
      .style('margin-left', '15px')

    await this.updatePage(reference)

    this.emit('ready')
  }

  private row(args: Row, parent?: any) {
    const shape = (parent || globals.svg).append('g')
      .attr('id', args.id)
      .attr('type', args.type)

    args.columns.map(o => this.column(o, shape))
  }

  private text(args: Text, parent?: any) {
    (parent || globals.svg).append('rect')
      .attr('x', !(args.stroke.width % 2) ? args.position.x : args.position.x + 0.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .text(args.value)
      .attr('fill', '#Fafafa')
      .attr('width', args.position.width)
      .attr('stroke', args.stroke.color)
      .attr('height', args.position.height)
    // .attr('font-weight', args.font.weigth)

    const shape = (parent || globals.svg).append('text')
      .attr('x', !(args.stroke.width % 2) ? args.position.x + 1 : args.position.x + 1.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .attr('id', args.id)
      .text(args.value)
      .attr('fill', args.font.color)
      .attr('font-size', args.font.size)
      .attr('font-style', args.font.style)
      .attr('font-family', args.font.family)
      .attr('fill-opacity', args.font.opacity)
    // .attr('font-weight', args.font.weigth)
    let width = shape.node().getComputedTextLength()
    let height = args.font.size / args.position.height
    let bounds = {
      top: 0,
      left: 0
    }
    switch (args.font.alignment) {
      case ('left'):
        bounds.left = args.position.left + 1
        break
      case ('right'):
        bounds.left = args.position.right - width - 1
        break
      case ('center'):
        bounds.left = args.position.left + (args.position.width - width) / 2
        break
    }
    shape.attr('x', !(args.stroke.width % 2) ? bounds.left : bounds.left + 0.5)
    switch (args.font.baseline) {
      case ('top'):
        bounds.top = args.position.top + args.font.size
        break
      case ('middle'):
        bounds.top = args.position.top + (args.position.height * height)
        break
      case ('bottom'):
        bounds.top = args.position.top + (args.position.height - args.font.size) + args.font.size
        break
    }
    shape.attr('y', !(args.stroke.width % 2) ? bounds.top : bounds.top + 0.5)
  }

  private line(args: Line, parent?: any) {
    const shape = (parent || globals.svg).append('line')
      .attr('id', args.id)
      .attr('x1', !(args.stroke.width % 2) ? args.points[0].x : args.points[0].x + 0.5)
      .attr('y1', !(args.stroke.width % 2) ? args.points[0].y : args.points[0].y + 0.5)
      .attr('x2', !(args.stroke.width % 2) ? args.points[1].x : args.points[1].x + 0.5)
      .attr('y2', !(args.stroke.width % 2) ? args.points[1].y : args.points[1].y + 0.5)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

  private chart(args: Chart, parent?: any) {
    // const shape = (parent || globals.svg).append('circle')
    //     .attr('r', args.position.radius)
    //     .attr('id', args.id)
    //     .attr('cx', args.position.center.x)
    //     .attr('cy', args.position.center.y)
    //     .attr('fill', args.fill.color)
    //     .attr('stroke', args.stroke.color)
    //     .attr('fill-opacity', args.fill.opacity)
    //     .attr('stroke-width', args.stroke.width)
    //     .attr('stroke-linecap', args.stroke.cap)
    //     .attr('stroke-opacity', args.stroke.opacity)
    // .attr('stroke-dasharray', args.stroke.style)
  }

  private group(args: Group, parent?: any) {
    const shape = (parent || globals.svg).append('g')
      .attr('id', args.id)

    args.children.map(o => {
      if (o instanceof Row) {
        this.row(o, shape)
      }
      if (o instanceof Text) {
        this.text(o, shape)
      }
      if (o instanceof Line) {
        this.line(o, shape)
      }
      if (o instanceof Chart) {
        this.chart(o, shape)
      }
      if (o instanceof Group) {
        this.group(o, shape)
      }
      if (o instanceof Table) {
        this.table(o, shape)
      }
      if (o instanceof Vector) {
        this.vector(o, shape)
      }
      if (o instanceof Button) {
        this.button(o, shape)
      }
      if (o instanceof Column) {
        this.column(o, shape)
      }
      if (o instanceof Circle) {
        this.circle(o, shape)
      }
      if (o instanceof Ellipse) {
        this.ellipse(o, shape)
      }
      if (o instanceof Polygon) {
        this.polygon(o, shape)
      }
      if (o instanceof Polyline) {
        this.polyline(o, shape)
      }
      if (o instanceof Rectangle) {
        o.apply(shape)
      }
      if (o instanceof EllipticalCurve) {
        this.ellipticalCurve(o, shape)
      }
      if (o instanceof CubicBezierCurve) {
        this.cubicBezierCurve(o, shape)
      }
      if (o instanceof QuadraticBezierCurve) {
        this.quadraticBezierCurve(o, shape)
      }
    })
  }

  private table(args: Table, parent?: any) {
    const shape = (parent || globals.svg).append('g')
      .attr('id', args.id)
      .attr('x', !(args.stroke.width % 2) ? args.position.x : args.position.x + 0.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .attr('top', !(args.stroke.width % 2) ? args.position.top : args.position.top + 0.5)
      .attr('left', !(args.stroke.width % 2) ? args.position.left : args.position.left + 0.5)
      .attr('class', 'shape')
      .attr('right', !(args.stroke.width % 2) ? args.position.right : args.position.right + 0.5)
      .attr('bottom', !(args.stroke.width % 2) ? args.position.bottom : args.position.bottom + 0.5)
      .attr('center-x', !(args.stroke.width % 2) ? args.position.center.x : args.position.center.x + 0.5)
      .attr('center-y', !(args.stroke.width % 2) ? args.position.center.y : args.position.center.y + 0.5)

    console.log('left', !(args.stroke.width % 2) ? args.position.left : args.position.left + 0.5)

    shape.append('rect')
      .attr('x', !(args.stroke.width % 2) ? args.position.x : args.position.x + 0.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .attr('fill', args.fill.color)
      .attr('width', args.position.width)
      .attr('height', args.position.height)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-opacity', args.stroke.opacity)

    this.row(args.header, shape)

    args.rows.map(o => this.row(o, shape))

    this.row(args.footer, shape)
  }

  private vector(args: Vector, parent?: any) {
    const shape = (parent || globals.svg).append('image')
      .attr('x', !(args.stroke.width % 2) ? args.position.x : args.position.x + 0.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .attr('id', args.id)
      .attr('href', args.src)
      .attr('width', args.position.width)
      .attr('height', args.position.height)
  }

  private button(args: Button, parent?: any) {
    const shape = (parent || globals.svg).append('rect')
      .attr('x', !(args.stroke.width % 2) ? args.position.x : args.position.x + 0.5)
      .attr('y', !(args.stroke.width % 2) ? args.position.y : args.position.y + 0.5)
      .attr('id', args.id)
      .attr('rx', args.position.radius)
      .attr('fill', args.fill.color)
      .attr('width', args.position.width)
      .attr('stroke', args.stroke.color)
      .attr('height', args.position.height)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
    // .attr('stroke-dasharray', item.stroke.style)
  }

  private circle(args: Circle, parent?: any) {
    const shape = (parent || globals.svg).append('circle')
      .attr('r', args.position.radius)
      .attr('id', args.id)
      .attr('cx', args.position.center.x)
      .attr('cy', args.position.center.y)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
    // .attr('stroke-dasharray', args.stroke.style)
  }

  private column(args: Column, parent?: any) {
    const shape = (parent || globals.svg).append('g')
      .attr('id', args.id)
      .attr('type', args.type)

    args.children.map(o => {
      if (o instanceof Row) {
        this.row(o, shape)
      }
      if (o instanceof Text) {
        this.text(o, shape)
      }
      if (o instanceof Line) {
        this.line(o, shape)
      }
      if (o instanceof Chart) {
        this.chart(o, shape)
      }
      if (o instanceof Group) {
        this.group(o, shape)
      }
      if (o instanceof Table) {
        this.table(o, shape)
      }
      if (o instanceof Vector) {
        this.vector(o, shape)
      }
      if (o instanceof Button) {
        this.button(o, shape)
      }
      if (o instanceof Column) {
        this.column(o, shape)
      }
      if (o instanceof Circle) {
        this.circle(o, shape)
      }
      if (o instanceof Ellipse) {
        this.ellipse(o, shape)
      }
      if (o instanceof Polygon) {
        this.polygon(o, shape)
      }
      if (o instanceof Polyline) {
        this.polyline(o, shape)
      }
      if (o instanceof Rectangle) {
        o.apply(shape)
      }
      if (o instanceof EllipticalCurve) {
        this.ellipticalCurve(o, shape)
      }
      if (o instanceof CubicBezierCurve) {
        this.cubicBezierCurve(o, shape)
      }
      if (o instanceof QuadraticBezierCurve) {
        this.quadraticBezierCurve(o, shape)
      }
    })
  }

  private ellipse(args: Ellipse, parent?: any) {
    const shape = (parent || globals.svg).append('ellipse')
      .attr('cx', args.position.center.x)
      .attr('cy', args.position.center.y)
      .attr('rx', args.position.width / 2)
      .attr('ry', args.position.height / 2)
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
    // .attr('stroke-dasharray', args.stroke.style)
  }

  private polygon(args: Polygon, parent?: any) {
    const shape = (parent || globals.svg).append('polygon')
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('points', args.points.map(o => [o.x, o.y].join(',')).join(' '))
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

  private polyline(args: Polyline, parent?: any) {
    const shape = (parent || globals.svg).append('polyline')
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('points', args.points.map(o => [o.x, o.y].join(',')).join(' '))
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

  private ellipticalCurve(args: EllipticalCurve, parent?: any) {
    // A rx ry  x-axis-rotation  large-arc-flag  sweep-flag  x y
    const shape = (parent || globals.svg).append('path')
      .attr('d', 'M250,100  A120,80 0 0,0 250,200')
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

  private cubicBezierCurve(args: CubicBezierCurve, parent?: any) {
    // C (or c) x1,y1 x2,y2 x,y
    const shape = (parent || globals.svg).append('path')
      .attr('d', 'M100,200 C100,100  400,100  400,200')
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

  private quadraticBezierCurve(args: QuadraticBezierCurve, parent?: any) {
    const shape = (parent || globals.svg).append('path')
      .attr('d', 'M100,200 Q250,100 400,200 T600 200')
      .attr('id', args.id)
      .attr('fill', args.fill.color)
      .attr('stroke', args.stroke.color)
      .attr('fill-opacity', args.fill.opacity)
      .attr('stroke-width', args.stroke.width)
      .attr('stroke-linecap', args.stroke.cap)
      .attr('stroke-opacity', args.stroke.opacity)
  }

}