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

interface SuperMouse extends MouseEvent {
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

  constructor(projectId: string) {
    const canvas = d3.select(`#${projectId} .ngx-canvas`)
    canvas.style('cursor', 'crosshair')
    canvas.on('click', (event) => this.click.next(event))
    canvas.on('wheel', (event) => this.wheel.next(event))
    canvas.on('mouseup', (event: MouseEvent) => {
      this._end.x = event.offsetX
      this._end.y = event.offsetY
      this._diff.x = this._end.x - this._start.x
      this._diff.y = this._end.y - this._start.y
      this.mouseup.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start
      })
    })
    canvas.on('dblclick', (event) => this.dblclick.next(event))
    canvas.on('mousemove', (event: MouseEvent) => {
      this._end.x = event.offsetX
      this._end.y = event.offsetY
      this._diff.x = this._end.x - this._start.x
      this._diff.y = this._end.y - this._start.y
      this.mousemove.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start
      })
    })
    canvas.on('mousedown', (event: MouseEvent) => {
      this._end.x = 0
      this._end.y = 0
      this._diff.x = 0
      this._diff.y = 0
      this._start.x = event.offsetX
      this._start.y = event.offsetY
      this.mousedown.next({
        ...event,
        end: this._end,
        diff: this._diff,
        start: this._start
      })
    })
    canvas.on('contextmenu', (event) => this.contextmenu.next(event))
  }

  public click: Subject<MouseEvent> = new Subject<MouseEvent>()
  public wheel: Subject<WheelEvent> = new Subject<WheelEvent>()
  public mouseup: Subject<SuperMouse> = new Subject<SuperMouse>()
  public dblclick: Subject<MouseEvent> = new Subject<MouseEvent>()
  public mousemove: Subject<SuperMouse> = new Subject<SuperMouse>()
  public mousedown: Subject<SuperMouse> = new Subject<SuperMouse>()
  public contextmenu: Subject<MouseEvent> = new Subject<MouseEvent>()

}

export class Draw extends DrawEvents {

  private _mode: 'button' | 'chart' | 'circle' | 'column' | 'cubic-bezier-curve' | 'ellipse' | 'elliptical-curve' | 'free' | 'line' | 'polygon' | 'polyline' | 'quadratic-bezier-curve' | 'range' | 'select' | 'rectangle' | 'table' | 'text' | 'vector' = 'select'
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

  public setMode(mode: 'button' | 'chart' | 'circle' | 'column' | 'cubic-bezier-curve' | 'ellipse' | 'elliptical-curve' | 'free' | 'line' | 'polygon' | 'polyline' | 'quadratic-bezier-curve' | 'range' | 'select' | 'rectangle' | 'table' | 'text' | 'vector'): void {
    this._mode = mode
    // this.select.disable()
    switch(mode) {
      case 'select':
        // this.select.enable()
        break
      default:
        break
    }
  }
}
