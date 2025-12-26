import * as d3 from 'd3'

import {
  Fill,
  FILL,
  Font,
  FONT,
  Stroke,
  STROKE,
  ObjectId,
  Position,
  POSITION
} from '../../utilities'
import { Selection } from '@libs/common'

/**
 * Shape event types
 */
export type ShapeEventType = 
  | 'drag' 
  | 'click' 
  | 'drag-end' 
  | 'mouse-up' 
  | 'drag-start' 
  | 'mouse-move' 
  | 'mouse-down' 
  | 'mouse-enter' 
  | 'mouse-leave' 
  | 'double-click'

/**
 * Event callback types
 */
export type DragEventCallback = (event: d3.D3DragEvent<Element, unknown, unknown>) => void
export type MouseEventCallback = (event: MouseEvent) => void

export class Shape {
  public el: Selection | null = null
  public readonly id: string
  public fill: Fill
  public font: Font
  public data: Record<string, unknown> = {}
  public name = ''
  public className = ''
  public stroke: Stroke
  public hidden = false
  public position: Position
  public selected = false
  public dragging = false
  public conditions: unknown[] = []

  constructor(args?: SHAPE) {
    this.id = args?.id || ObjectId()
    this.fill = new Fill(args?.fill)
    this.font = new Font(args?.font)
    this.stroke = new Stroke(args?.stroke)
    this.position = new Position(args?.position)
    
    if (args?.data) this.data = args.data
    if (args?.name) this.name = args.name
    if (args?.class) this.className = args.class
    if (args?.hidden !== undefined) this.hidden = args.hidden
    if (args?.selected !== undefined) this.selected = args.selected
    if (args?.dragging !== undefined) this.dragging = args.dragging
    if (args?.conditions) this.conditions = args.conditions
  }

  /**
   * Register an event handler on the shape
   * @param event The event type to listen for
   * @param callback The callback function
   */
  on(event: 'drag' | 'drag-start' | 'drag-end', callback: DragEventCallback): void
  on(event: Exclude<ShapeEventType, 'drag' | 'drag-start' | 'drag-end'>, callback: MouseEventCallback): void
  on(event: ShapeEventType, callback: DragEventCallback | MouseEventCallback): void {
    if (!this.el) {
      console.warn(`Cannot attach event handler: shape element not initialized`)
      return
    }

    switch (event) {
      case 'drag':
        d3.drag<Element, unknown>()
          .on('drag', (event) => (callback as DragEventCallback)(event))(this.el as any)
        break
      case 'drag-start':
        d3.drag<Element, unknown>()
          .on('start', (event) => (callback as DragEventCallback)(event))(this.el as any)
        break
      case 'drag-end':
        d3.drag<Element, unknown>()
          .on('end', (event) => (callback as DragEventCallback)(event))(this.el as any)
        break
      case 'click':
        this.el.on('click', (event) => (callback as MouseEventCallback)(event))
        break
      case 'mouse-up':
        this.el.on('mouseup', (event) => (callback as MouseEventCallback)(event))
        break
      case 'mouse-move':
        this.el.on('mousemove', (event) => (callback as MouseEventCallback)(event))
        break
      case 'mouse-down':
        this.el.on('mousedown', (event) => (callback as MouseEventCallback)(event))
        break
      case 'mouse-enter':
        this.el.on('mouseenter', (event) => (callback as MouseEventCallback)(event))
        break
      case 'mouse-leave':
        this.el.on('mouseleave', (event) => (callback as MouseEventCallback)(event))
        break
      case 'double-click':
        this.el.on('dblclick', (event) => (callback as MouseEventCallback)(event))
        break
    }
  }

  /**
   * Set the shape element from a selection
   * @param selection The D3 selection
   */
  fromSelection(selection: Selection): void {
    this.el = selection
  }

  /**
   * Remove the shape from the DOM
   */
  remove(): void {
    if (this.el) {
      this.el.remove()
      this.el = null
    }
  }

  /**
   * Apply the shape to a parent selection (must be implemented by subclasses)
   * @param parent The parent selection to append to
   */
  apply(parent: Selection): void {
    throw new Error('apply() must be implemented by subclass')
  }

  /**
   * Update the shape's visual representation (must be implemented by subclasses)
   * @param config Optional configuration to update
   */
  update(config?: unknown): void {
    throw new Error('update() must be implemented by subclass')
  }
}

export interface SHAPE {
  id?: string
  fill?: Fill | FILL
  font?: Font | FONT
  data?: Record<string, unknown>
  type?: string
  name?: string
  class?: string
  stroke?: Stroke | STROKE
  hidden?: boolean
  selected?: boolean
  dragging?: boolean
  position?: Position | POSITION
  conditions?: unknown[]
}
