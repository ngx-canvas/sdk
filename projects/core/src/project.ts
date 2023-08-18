import * as d3 from 'd3'
import { Subject } from 'rxjs'

/* --- SHAPES --- */
import {
  Text,
  Line,
  Curve,
  Group,
  Chart,
  Table,
  Range,
  Vector,
  Iframe,
  Ellipse,
  Polygon,
  Polyline,
  Rectangle,
} from './shapes'

/* --- GLOBALS --- */
import { globals } from './globals'

/* --- UTILITIES --- */
import { Fill } from './utilities'

class ProjectEvents {

  constructor() {}
  
  public ready: Subject<any> = new Subject<any>()
  public dragging: Subject<any> = new Subject<any>()

}

interface PROJECT_OPTIONS {
  width?: number
  height?: number
}

export class Project extends ProjectEvents {
  public fill: Fill = new Fill()
  public width: number = 600
  public height: number = 600

  private data: any[] = []
  private projectId: string = ''

  constructor(reference: string, { width, height }: PROJECT_OPTIONS) {
    super()
    
    if (width) this.width = width
    if (height) this.height = height

    this.initialize(reference)
  }

  public element() {
    return globals.svg
  }

  private draw(): void {
    this.data.map(o => o.apply(globals.svg))
  }

  public reset(): void {
    d3.selectAll('.shape').remove()
  }

  public export(type: 'svg'): string | [] {
    const svg = d3.select(`#${this.projectId} svg`).clone(true)
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
    d3.select(`#${reference}`).style('overflow', 'hidden').style('position', 'relative')
    globals.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('margin-bottom', '-10px')
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
          text: (args: any) => new Text(args),
          line: (args: any) => new Line(args),
          chart: (args: any) => new Chart(args),
          group: (args: any) => new Group(args),
          table: (args: any) => new Table(args),
          curve: (args: any) => new Curve(args),
          range: (args: any) => new Range(args),
          vector: (args: any) => new Vector(args),
          iframe: (args: any) => new Iframe(args),
          ellipse: (args: any) => new Ellipse(args),
          polygon: (args: any) => new Polygon(args),
          polyline: (args: any) => new Polyline(args),
          rectangle: (args: any) => new Rectangle(args),
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
    globals.svg = await d3.select(`#${reference}`)
      .append('div')
      .attr('id', 'ngx-container')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto')
      .style('position', 'relative')
      .attr('background-color', '#e0e0e0')
      .append('svg')
      .attr('class', 'ngx-canvas')

    await this.updatePage(reference)

    this.ready.next(null)
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