import { drag } from 'd3-drag'

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

/** Pointer/drag events a {@link Shape} can be bound to via {@link Shape.on}. */
export type ShapeEvent =
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

/** Callback invoked for a {@link Shape} event. */
export type ShapeEventHandler = (event: MouseEvent | DragEvent) => void

/**
 * Anything the {@link Project} scene can render. Every concrete shape satisfies
 * this structurally, so no `implements` clause is required.
 */
export interface Renderable {
  type?: string
  apply(parent: Selection): void
  update?(config?: SHAPE): void
}

/**
 * Base class for every drawable shape. Holds common geometry and styling plus
 * the DOM binding (`el`); concrete shapes implement `apply`/`update` to render
 * themselves into a d3 selection.
 */
export class Shape {
  /** The d3 selection backing this shape once it has been rendered. */
  public el!: Selection
  public id: string = ObjectId()
  public fill: Fill = new Fill()
  public font: Font = new Font()
  /** Arbitrary consumer metadata carried with the shape. */
  public data: unknown = {}
  public name = ''
  public class = ''
  public stroke: Stroke = new Stroke()
  public hidden = false
  public position: Position = new Position()
  public selected = false
  public dragging = false
  public conditions: unknown[] = []

  constructor(args?: SHAPE) {
    Object.assign(this, args)
    this.font = new Font(this.font)
    this.fill = new Fill(this.fill)
    this.stroke = new Stroke(this.stroke)
    this.position = new Position(this.position)
  }

  /** Attach a pointer or drag handler to this shape's element. */
  on(event: ShapeEvent, callback: ShapeEventHandler): void {
    switch (event) {
    case ('drag'):
      drag().on('drag', (event: DragEvent) => callback(event))(this.el)
      break
    case ('click'):
      this.el.on('click', (event: MouseEvent) => callback(event))
      break
    case ('drag-end'):
      drag().on('end', (event: DragEvent) => callback(event))(this.el)
      break
    case ('mouse-up'):
      this.el.on('mouseup', (event: MouseEvent) => callback(event))
      break
    case ('drag-start'):
      drag().on('start', (event: DragEvent) => callback(event))(this.el)
      break
    case ('mouse-move'):
      this.el.on('mousemove', (event: MouseEvent) => callback(event))
      break
    case ('mouse-down'):
      this.el.on('mousedown', (event: MouseEvent) => callback(event))
      break
    case ('mouse-enter'):
      this.el.on('mouseenter', (event: MouseEvent) => callback(event))
      break
    case ('mouse-leave'):
      this.el.on('mouseleave', (event: MouseEvent) => callback(event))
      break
    case ('double-click'):
      this.el.on('dblclick', (event: MouseEvent) => callback(event))
      break
    }
  }

  /** Bind this shape to an existing d3 selection. */
  fromSelection(selection: Selection): void {
    this.el = selection
  }

  /** Remove this shape's element from the DOM, if it has been rendered. */
  remove = (): void => {
    if (this.el) this.el.remove()
  }
}

export interface SHAPE {
  id?: string
  fill?: Fill | FILL
  font?: Font | FONT
  data?: unknown
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

/** Preferred, camelCase alias for {@link SHAPE}. */
export type ShapeOptions = SHAPE

/** A concrete shape instance: the base {@link Shape} plus the {@link Renderable} contract. */
export type AnyShape = Shape & Renderable
