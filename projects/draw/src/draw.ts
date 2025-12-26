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
import { Mode } from '@libs/common'

/**
 * Extended mouse event with position tracking
 */
export interface MouseEventBounded extends MouseEvent {
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

/**
 * Constants for zoom limits
 */
const MIN_SCALE = 0.4
const MAX_SCALE = 2.6

class DrawEvents {
  private _end = { x: 0, y: 0 }
  private _diff = { x: 0, y: 0 }
  private _start = { x: 0, y: 0 }
  private _scale = 1
  private readonly projectId: string

  public readonly click: Subject<MouseEvent> = new Subject<MouseEvent>()
  public readonly wheel: Subject<WheelEvent> = new Subject<WheelEvent>()
  public readonly mouseup: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public readonly dblclick: Subject<MouseEvent> = new Subject<MouseEvent>()
  public readonly mousemove: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public readonly mousedown: Subject<MouseEventBounded> = new Subject<MouseEventBounded>()
  public readonly contextmenu: Subject<MouseEvent> = new Subject<MouseEvent>()

  constructor(projectId: string) {
    this.projectId = projectId
    this.initializeEventHandlers()
  }

  private initializeEventHandlers(): void {
    const canvas = d3.select(`#${this.projectId} .ngx-canvas`)
    
    if (canvas.empty()) {
      console.warn(`Canvas element not found for project: ${this.projectId}`)
      return
    }

    canvas.style('cursor', 'crosshair')
    canvas.on('click', (event) => this.click.next(event))
    canvas.on('wheel', (event) => this.wheel.next(event))
    canvas.on('dblclick', (event) => this.dblclick.next(event))
    canvas.on('contextmenu', (event) => {
      event.preventDefault()
      this.contextmenu.next(event)
    })

    canvas.on('mouseup', (event: MouseEvent) => {
      this.updateMousePosition(event)
      this.mouseup.next(this.createBoundedEvent(event))
    })

    canvas.on('mousemove', (event: MouseEvent) => {
      this.updateMousePosition(event)
      this.mousemove.next(this.createBoundedEvent(event))
    })

    canvas.on('mousedown', (event: MouseEvent) => {
      this._end = { x: 0, y: 0 }
      this._diff = { x: 0, y: 0 }
      this._start = {
        x: event.offsetX / this._scale,
        y: event.offsetY / this._scale
      }
      this.mousedown.next(this.createBoundedEvent(event))
    })
  }

  private updateMousePosition(event: MouseEvent): void {
    this._end = {
      x: event.offsetX / this._scale,
      y: event.offsetY / this._scale
    }
    this._diff = {
      x: this._end.x - this._start.x,
      y: this._end.y - this._start.y
    }
  }

  private createBoundedEvent(event: MouseEvent): MouseEventBounded {
    return {
      ...event,
      end: { ...this._end },
      diff: { ...this._diff },
      start: { ...this._start },
      isContext: event.button === 2 || event.which === 3
    }
  }

  /**
   * Set the scale factor for coordinate calculations
   * @param scale The scale factor (must be between MIN_SCALE and MAX_SCALE)
   */
  public scale(scale: number): void {
    if (scale < MIN_SCALE || scale > MAX_SCALE) {
      console.warn(`Scale ${scale} is out of bounds [${MIN_SCALE}, ${MAX_SCALE}]`)
      return
    }
    this._scale = scale
  }

  /**
   * Get the current scale factor
   */
  public getScale(): number {
    return this._scale
  }

  /**
   * Reset mouse position tracking
   */
  public reset(): void {
    this._end = { x: 0, y: 0 }
    this._diff = { x: 0, y: 0 }
    this._start = { x: 0, y: 0 }
  }

  /**
   * Clean up event handlers
   */
  public destroy(): void {
    this.click.complete()
    this.wheel.complete()
    this.mouseup.complete()
    this.dblclick.complete()
    this.mousemove.complete()
    this.mousedown.complete()
    this.contextmenu.complete()
  }
}

export class Draw extends DrawEvents {
  private _mode: Mode = Mode.Select

  public readonly grid: GridTool
  public readonly zoom: ZoomTool
  public readonly group: GroupTool
  public readonly ruler: RulerTool
  public readonly select: SelectTool
  public readonly aligner: AlignerTool
  public readonly momento: MomentoTool

  constructor(projectId: string) {
    super(projectId)

    // Initialize all tools
    this.grid = new GridTool(projectId)
    this.zoom = new ZoomTool(projectId)
    this.group = new GroupTool(projectId)
    this.ruler = new RulerTool(projectId)
    this.select = new SelectTool(projectId)
    this.aligner = new AlignerTool(projectId)
    this.momento = new MomentoTool(projectId)
  }

  /**
   * Get the current drawing mode
   */
  public mode(): Mode {
    return this._mode
  }

  /**
   * Set the drawing mode
   * @param mode The mode to set
   */
  public setMode(mode: Mode | string): void {
    if (typeof mode === 'string') {
      const modeValue = Object.values(Mode).find(m => m === mode || String(m) === mode)
      if (modeValue) {
        this._mode = modeValue
      } else {
        console.warn(`Invalid mode: ${mode}. Using default: ${Mode.Select}`)
        this._mode = Mode.Select
      }
    } else {
      this._mode = mode
    }
  }

  /**
   * Clean up resources
   */
  public override destroy(): void {
    super.destroy()
    // Tools should clean themselves up if needed
  }
}
