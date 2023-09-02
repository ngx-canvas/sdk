import * as d3 from 'd3'
import { Subject } from 'rxjs'

import {
  GridTool,
  ZoomTool,
  GroupTool,
  RulerTool,
  SelectTool,
  AlignerTool,
  MomentoTool
} from './tools'

interface MouseEventBounded extends MouseEvent {
  end: {
    x: number
    y: number
  }
  diff: {
    x: number
    y: number
  }
  start: {
    x: number
    y: number
  }
  isContext: boolean
}

class DrawEvents {

  private _end = {
    x: 0,
    y: 0
  }
  private _diff = {
    x: 0,
    y: 0
  }
  private _start = {
    x: 0,
    y: 0
  }
  private _scale: number = 1

  constructor(projectId: string) {
    const canvas = d3.select(`#${projectId} .ngx-canvas`)
    canvas.style('cursor', 'crosshair')
    canvas.on('click', (event) => this.click.next(event))
    canvas.on('wheel', (event) => this.wheel.next(event))
    canvas.on('mouseup', (event: MouseEvent) => {
      this._end.x = event.offsetX / this._scale
      this._end.y = event.offsetY / this._scale
      this._diff.x = this._end.x - this._start.x
      this._diff.y = this._end.y - this._start.y
      this.mouseup.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start,
        isContext: event.which === 3
      })
    })
    canvas.on('dblclick', (event) => this.dblclick.next(event))
    canvas.on('mousemove', (event: MouseEvent) => {
      this._end.x = event.offsetX / this._scale
      this._end.y = event.offsetY / this._scale
      this._diff.x = this._end.x - this._start.x
      this._diff.y = this._end.y - this._start.y
      this.mousemove.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start,
        isContext: event.which === 3
      })
    })
    canvas.on('mousedown', (event: MouseEvent) => {
      this._end.x = 0
      this._end.y = 0
      this._diff.x = 0
      this._diff.y = 0
      this._start.x = event.offsetX / this._scale
      this._start.y = event.offsetY / this._scale
      this.mousedown.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start,
        isContext: event.which === 3
      })
    })
    canvas.on('contextmenu', (event) => this.contextmenu.next(event))
  }
  
  public click: Subject<MouseEvent> = new Subject<MouseEvent>()
  public wheel: Subject<WheelEvent> = new Subject<WheelEvent>()
  public mouseup: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public dblclick: Subject<MouseEvent> = new Subject<MouseEvent>()
  public mousemove: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public mousedown: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public contextmenu: Subject<MouseEvent> = new Subject<MouseEvent>()
  
  public scale(scale: number): void {
    if (scale <= 0.4 || scale >= 2.6) return
    this._scale = scale
  }

  public reset() {
    this._end = {
      x: 0,
      y: 0
    }
    this._diff = {
      x: 0,
      y: 0
    }
    this._start = {
      x: 0,
      y: 0
    }
  }

}

export class Draw extends DrawEvents {

  private _mode: Modes = 'select'
  private _projectId: string = ''

  public grid!: GridTool
  public zoom!: ZoomTool
  public group!: GroupTool
  public ruler!: RulerTool
  public select!: SelectTool
  public aligner!: AlignerTool
  public momento!: MomentoTool

  constructor(projectId: string) {
    super(projectId)

    this._projectId = projectId

    this.grid = new GridTool(projectId)
    this.zoom = new ZoomTool(projectId)
    this.group = new GroupTool(projectId)
    this.ruler = new RulerTool(projectId)
    this.select = new SelectTool(projectId)
    this.aligner = new AlignerTool(projectId)
    this.momento = new MomentoTool(projectId)
  }

  public mode() {
    return this._mode
  }

  public setMode(mode: Modes): void {
    this._mode = mode
  }
}

type Modes = 'chart' | 'curve' | 'ellipse' | 'free' | 'line' | 'polygon' | 'polyline' | 'range' | 'select' | 'iframe' | 'rectangle' | 'table' | 'text' | 'vector'