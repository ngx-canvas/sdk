import * as d3 from 'd3'
import { EventEmitter } from 'events'

import { Fill } from './utilities/fill/fill'

/* --- SHAPES --- */
import {
  Row,
  Text,
  Line,
  Group,
  Chart,
  Table,
  Range,
  Column,
  Vector,
  Button,
  Circle,
  Ellipse,
  Polygon,
  Polyline,
  Rectangle,
  EllipticalCurve,
  CubicBezierCurve,
  QuadraticBezierCurve
} from './shapes'

/* --- GLOBALS --- */
import { globals } from './globals'

export class Project extends EventEmitter {
  public fill: Fill = new Fill()
  public width: number = 600
  public height: number = 600

  private data: any[] = []
  private projectId: string = ''

  constructor(reference: string) {
    super()
    this.initialize(reference)
  }

  private draw(): void {
    this.data.map(o => o.apply(globals.svg))
  }

  public reset(): void {
    d3.selectAll('.shape').remove()
  }

  public export(type: 'svg'): string | [] {
    const svg = d3.select(`${this.projectId} svg`).clone(true)
    svg.attr('style', null)
    svg.attr('class', null)
    svg.attr('current-scale', null)
    svg.selectAll('.tool').remove()

    switch (type) {
      case ('svg'): {
        return new XMLSerializer().serializeToString(<any>svg.node())
      }
      default: {
        throw new Error(`No such type called ${type}!`)
      }
    }
  }

  public destroy(): void {
    this.data.splice(0, this.data.length)
    globals.svg.selectAll('.shape').remove()
  }

  public deselect(): void {
    this.data.map(item => {
      item.selected = false
    })
  }

  public download(): void {
    const source = new XMLSerializer().serializeToString(globals.svg.node())
    const blob = new Blob([source], { type: 'text/xmlcharset=utf-8' })
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', 'image.svg')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  public updatePage(reference: string): void {
    d3.select(reference).style('overflow', 'hidden').style('position', 'relative')
    globals.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('margin-bottom', '-2px')
      .style('background-color', '#FFFFFF')
  }

  public async import({ mode, data, replace = true }: IMPORT_AS_SVG | IMPORT_AS_JSON) {
    if (replace) d3.selectAll('.shape').remove()

    switch (mode) {
      case ('svg'): {
        // @todo: extart canvas config from xml
        const xml = new DOMParser().parseFromString(data, 'application/xml')
        const elements = xml.documentElement.getElementsByClassName('shape')
        if (elements.length === 0) throw new Error('No shapes were supplied!')
        for (let i = 0; i < elements.length; i++) {
          globals.svg.append(() => elements[i])
        }
        break
      }
      case ('json'): {
        this.data = []

        const shapes = {
          row: (args: any) => new Row(args),
          text: (args: any) => new Text(args),
          line: (args: any) => new Line(args),
          chart: (args: any) => new Chart(args),
          group: (args: any) => new Group(args),
          table: (args: any) => new Table(args),
          range: (args: any) => new Range(args),
          vector: (args: any) => new Vector(args),
          button: (args: any) => new Button(args),
          circle: (args: any) => new Circle(args),
          column: (args: any) => new Column(args),
          ellipse: (args: any) => new Ellipse(args),
          polygon: (args: any) => new Polygon(args),
          polyline: (args: any) => new Polyline(args),
          rectangle: (args: any) => new Rectangle(args),
          'elliptical-curve': (args: any) => new EllipticalCurve(args),
          'cubic-bezier-curve': (args: any) => new CubicBezierCurve(args),
          'quadratic-bezier-curve': (args: any) => new QuadraticBezierCurve(args)
        }

        this.data = data.filter(o => (shapes as any)[o.type] instanceof Function).map(o => (shapes as any)[o.type](o))

        this.draw()
        break
      }
    }

    return true
  }

  private async initialize(reference: string) {
    this.projectId = reference
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
}

type IMPORT_AS_SVG = {
  mode: 'svg'
  data: string
  replace?: boolean
}

type IMPORT_AS_JSON = {
  mode: 'json'
  data: any[]
  replace?: boolean
}