import { select } from 'd3-selection'
import { Emitter, Selection } from '@libs/common'

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
import { Renderable, SHAPE } from './shapes/shape/shape'

/* --- UTILITIES --- */
import { Fill } from './utilities'

class ProjectEvents {
  /** Fires once the SVG surface has been created and sized. */
  public readonly ready = new Emitter<void>()
  /** Fires while a shape is being dragged. */
  public readonly dragging = new Emitter<unknown>()
}

export interface ProjectOptions {
  width?: number
  height?: number
}

/** A single serialized shape as accepted by {@link Project.import}. */
export type ShapeData = SHAPE & { type: string }

/** Factory signature used to hydrate a serialized shape into a {@link Renderable}. */
type ShapeFactory = (args: ShapeData) => Renderable

export class Project extends ProjectEvents {
  public fill: Fill = new Fill()
  public width = 600
  public height = 600

  private data: Renderable[] = []
  private projectId = ''
  private svg!: Selection

  constructor(reference: string, { width, height }: ProjectOptions = {}) {
    super()

    if (width) this.width = width
    if (height) this.height = height

    this.initialize(reference)
  }

  /** The root SVG selection for this project. */
  public element(): Selection {
    return this.svg
  }

  private draw(): void {
    for (const shape of this.data) shape.apply(this.svg)
  }

  public reset(): void {
    this.svg.selectAll('.shape').remove()
  }

  public export(type: 'svg'): string {
    if (type !== 'svg') throw new Error(`No such export type: ${String(type)}`)

    const svg = select(`#${this.projectId} svg`).clone(true)
    svg.attr('style', null)
    svg.attr('class', null)
    svg.attr('current-scale', null)
    svg.selectAll('.tool').remove()

    return new XMLSerializer().serializeToString(svg.node() as Node)
  }

  public destroy(): void {
    this.data.splice(0, this.data.length)
    this.svg.selectAll('.shape').remove()
  }

  public download(): void {
    const source = new XMLSerializer().serializeToString(this.svg.node() as Node)
    const blob = new Blob([source], { type: 'text/xml;charset=utf-8' })
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', 'image.svg')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  public async import(options: ImportAsSvg | ImportAsJson): Promise<boolean> {
    const { mode, replace = true } = options
    if (replace) this.svg.selectAll('.shape').remove()

    switch (mode) {
    case 'svg': {
      // @todo: extract canvas config from xml
      const xml = new DOMParser().parseFromString(options.data, 'application/xml')
      // Snapshot into an array first: getElementsByClassName returns a *live*
      // collection, and appending each node moves it out of `xml`, which would
      // shift the collection's indices and skip shapes mid-loop.
      const elements = Array.from(xml.documentElement.getElementsByClassName('shape'))
      if (elements.length === 0) throw new Error('No shapes were supplied!')
      for (const element of elements) {
        this.svg.append(() => element)
      }
      break
    }
    case 'json': {
      const factories: Record<string, ShapeFactory> = {
        text: (args) => new Text(args),
        line: (args) => new Line(args),
        chart: (args) => new Chart(args),
        group: (args) => new Group(args),
        table: (args) => new Table(args),
        curve: (args) => new Curve(args),
        range: (args) => new Range(args),
        vector: (args) => new Vector(args),
        iframe: (args) => new Iframe(args),
        ellipse: (args) => new Ellipse(args),
        polygon: (args) => new Polygon(args),
        polyline: (args) => new Polyline(args),
        rectangle: (args) => new Rectangle(args),
      }

      const created: Renderable[] = []
      for (const shape of options.data) {
        // Guard against inherited members (e.g. a shape with type 'toString' or
        // 'constructor') resolving to an Object.prototype function and passing
        // the factory check.
        if (!Object.prototype.hasOwnProperty.call(factories, shape.type)) continue
        const factory = factories[shape.type]
        if (typeof factory === 'function') created.push(factory(shape))
      }
      this.data = created

      this.draw()
      break
    }
    }

    return true
  }

  public updatePage(reference: string): void {
    select(`#${reference}`).style('overflow', 'hidden').style('position', 'relative')
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('margin-bottom', '-10px')
      .style('background-color', this.fill.color)
  }

  private initialize(reference: string): void {
    this.projectId = reference
    this.svg = select(`#${reference}`)
      .append('div')
      .attr('id', 'ngx-container')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto')
      .style('position', 'relative')
      .attr('background-color', '#e0e0e0')
      .append('svg')
      .attr('class', 'ngx-canvas')

    this.updatePage(reference)

    // Defer the emit so a subscriber attached synchronously right after
    // `new Project(...)` — the documented quick-start usage — still receives it.
    // `Emitter`, like an RxJS Subject, does not replay to late subscribers.
    queueMicrotask(() => this.ready.next())
  }
}

interface ImportAsSvg {
  mode: 'svg'
  data: string
  replace?: boolean
}

interface ImportAsJson {
  mode: 'json'
  data: ShapeData[]
  replace?: boolean
}
