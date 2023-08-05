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


class DrawEvents {

  constructor(projectId: string) {
    d3.select(`#${projectId} .ngx-canvas`).on('click', (event) => this.click.next(event))
    d3.select(`#${projectId} .ngx-canvas`).on('wheel', (event) => this.wheel.next(event))
    d3.select(`#${projectId} .ngx-canvas`).on('dblclick', (event) => this.dblclick.next(event))
    d3.select(`#${projectId} .ngx-canvas`).on('contextmenu', (event) => this.contextmenu.next(event))
  }

  public click: Subject<MouseEvent> = new Subject<MouseEvent>()
  public wheel: Subject<WheelEvent> = new Subject<WheelEvent>()
  public dblclick: Subject<MouseEvent> = new Subject<MouseEvent>()
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
  }
}
