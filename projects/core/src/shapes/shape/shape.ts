import { DragBehavior, drag } from 'd3-drag'

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

  /**
   * The one drag behavior bound to this shape.
   *
   * d3-drag attaches itself as `mousedown.drag`, so applying a second behavior
   * to the same element silently replaces the first. Sharing one behavior lets
   * `start`, `drag` and `end` all be registered instead of overwriting.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dragBehavior?: DragBehavior<any, unknown, unknown>

  constructor(args?: SHAPE) {
    Object.assign(this, args)
    this.font = new Font(this.font)
    this.fill = new Fill(this.fill)
    this.stroke = new Stroke(this.stroke)
    this.position = new Position(this.position)
  }

  /**
   * The drag behavior for this shape, created and bound on first use.
   *
   * Binding once is what keeps the three drag events independent — see
   * {@link Shape.dragBehavior}.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dragBinding(): DragBehavior<any, unknown, unknown> {
    if (!this.dragBehavior) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.dragBehavior = drag<any, unknown>()
      this.el.call(<never>this.dragBehavior)
    }
    return this.dragBehavior
  }

  /** Attach a pointer or drag handler to this shape's element. */
  on(event: ShapeEvent, callback: ShapeEventHandler): void {
    switch (event) {
    case ('drag'):
      this.dragBinding().on('drag', (event: DragEvent) => callback(event))
      break
    case ('click'):
      this.el.on('click', (event: MouseEvent) => callback(event))
      break
    case ('drag-end'):
      this.dragBinding().on('end', (event: DragEvent) => callback(event))
      break
    case ('mouse-up'):
      this.el.on('mouseup', (event: MouseEvent) => callback(event))
      break
    case ('drag-start'):
      this.dragBinding().on('start', (event: DragEvent) => callback(event))
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
