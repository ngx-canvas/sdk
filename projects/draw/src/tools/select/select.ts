import { drag as d3Drag } from 'd3-drag'
import { select } from 'd3-selection'
import { Emitter, Selection } from '@libs/common'
import { Rect, Transformation, boundsOf, resize, transformShape, transformation } from './geometry'

/**
 * This will initialise the select tool. This will allow users to select shapes on the canvas
 *
 * @example
 * ```ts
 * import { SelectTool } from '@ngx-canvas/draw';
 *
 * const select = new SelectTool('canvas');
 * ```
 */
export class SelectTool {

  private _projectId = ''
  private _selection: Selection = select('reset')

  public count = 0
  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public changes: Emitter<SelectBoxEvent> = new Emitter<SelectBoxEvent>()
  public context: Emitter<MouseEvent> = new Emitter<MouseEvent>()
  public enabled = true
  public destination: { x: number, y: number } = { x: 0, y: 0 }

  private _box: SelectBox
  private readonly color: string = '#2196F3'

  constructor(projectId: string) {
    this._projectId = projectId
    this._box = new SelectBox(projectId)

    this._box.context.subscribe((event) => this.context.next(event))

    this._box.changes.subscribe((event) => {
      // Every selected shape follows the same rectangle-to-rectangle mapping, so
      // dragging the body and dragging a resize handle share one code path.
      this.selected().each(function () {
        transformShape(select(this), event.transform)
      })
      // Forward only once the geometry has settled, so subscribers reading the
      // selection back out of the DOM see the result of this change.
      this.changes.next(event)
    })
  }

  /** Every shape at the top level of this project's canvas. */
  private shapes(): Selection {
    return select(`#${this._projectId}`).selectAll('svg.ngx-canvas > .shape')
  }

  /** Every currently selected shape. Children of a selected group are excluded. */
  private selected(): Selection {
    return select(`#${this._projectId}`).selectAll('svg.ngx-canvas > .shape.selected')
  }

  all() {
    return this.byBounds({
      x: 0,
      y: 0,
      top: -Infinity,
      left: -Infinity,
      width: Infinity,
      right: Infinity,
      height: Infinity,
      bottom: Infinity
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  byId(id: string, fn: any, _scale: number) {
    this._selection = select(`#${id}`)
    const style = new fn(this._selection)
    this._box.show(style.position)
    this._box.scale(_scale)
    this._count()
    return this.selection()
  }

  hideBox() {
    return this._box.hide()
  }

  private _count() {
    this.count = this.selected().size()
  }

  showBox(args: SelectionBounds) {
    args.y = args.top
    args.x = args.left
    this._box.show(args)
    this._box.scale(args.scale || 1)
  }

  enable() {
    this.enabled = true
    return this.enabled
  }

  disable() {
    this.enabled = false
    return this.enabled
  }

  byBounds(area: SelectionBounds) {
    this.shapes().each(function () {
      const shape = select(this)
      const top = Number(shape.attr('top'))
      const left = Number(shape.attr('left'))
      const right = Number(shape.attr('right'))
      const bottom = Number(shape.attr('bottom'))
      if (top >= area.top && left >= area.left && right <= area.right && bottom <= area.bottom) {
        if (!shape.classed('selected')) shape.classed('selected', true)
      }
    })

    this._selection = this.selected()

    const { top, left, width, height } = boundsOf(this._selection)
    const bounds: SelectionBounds = {
      x: left,
      y: top,
      top,
      left,
      width,
      right: left + width,
      height,
      bottom: top + height
    }

    this._count()

    return {
      bounds,
      selection: this._selection
    }
  }

  unselect(): void {
    this.shapes().classed('selected', false)
    this._selection = select('reset')
    this.count = 0
  }

  scale(_scale: number) {
    this._box.scale(_scale)
  }

  selection() {
    return this.selected()
  }
}

class SelectBox {

  public end: Emitter<OrdinanceEvent> = new Emitter<OrdinanceEvent>()
  public drag: Emitter<OrdinanceEvent> = new Emitter<OrdinanceEvent>()
  public start: Emitter<OrdinanceEvent> = new Emitter<OrdinanceEvent>()
  public changes: Emitter<SelectBoxEvent> = new Emitter<SelectBoxEvent>()
  public context: Emitter<MouseEvent> = new Emitter<MouseEvent>()

  private _element: Selection
  /** The box in SVG user units. The rendered element is this scaled by `_scale`. */
  private _rect: Rect = { top: 0, left: 0, width: 0, height: 0 }
  private _scale = 1

  constructor(projectId: string) {
    const container = <HTMLElement>select(`#${projectId} #ngx-container`).node()

    this._element = select(`#${projectId} #ngx-container`)
      .append('div')
      .attr('class', 'tool select')
      .style('top', '0px')
      .style('left', '0px')
      .style('width', '0px')
      .style('height', '0px')
      .style('z-index', '1')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('transform', 'rotate(0deg)')
    this._element.append('div')
      .attr('class', 'r-line')
      .style('top', '-20px')
      .style('left', '50%')
      .style('width', '1px')
      .style('height', '20px')
      .style('position', 'absolute')
      .style('background-color', '#2196F3')

    this._element.append('div')
      .attr('class', 'border')
      .style('top', '0px')
      .style('left', '0px')
      .style('right', '0px')
      .style('bottom', '0px')
      .style('cursor', 'move')
      .style('border', '1px solid #2196F3')
      .style('z-index', '0')
      .style('position', 'absolute')
      .style('background-color', 'rgba(33, 150, 243, 0.1)')

    const drag = d3Drag<HTMLElement, unknown>()
      // Measure against the canvas container rather than the box itself.
      // d3-drag defaults to the dragged element's parent, so a box that moves
      // under the cursor feeds its own movement back into the next delta.
      .container(() => container)
    drag.on('end', (event) => this.end.next({ by: 'body', event }))
    drag.on('drag', (event) => this.drag.next({ by: 'body', event }))
    drag.on('start', (event) => this.start.next({ by: 'body', event }))
    this._element.call(<never>drag)

    this._element.on('contextmenu', (event: MouseEvent) => this.context.next(event))

    this.ordinance(this._element, 'r', container)
    this.ordinance(this._element, 'n', container)
    this.ordinance(this._element, 'e', container)
    this.ordinance(this._element, 's', container)
    this.ordinance(this._element, 'w', container)
    this.ordinance(this._element, 'ne', container)
    this.ordinance(this._element, 'nw', container)
    this.ordinance(this._element, 'se', container)
    this.ordinance(this._element, 'sw', container)

    this.drag.subscribe(({ by, event }: OrdinanceEvent) => {
      // The handles live in an HTML overlay measured in CSS pixels while shapes
      // live in SVG user units; convert once, here, so everything downstream
      // works in a single space and behaves the same at any zoom level.
      const dx = event.dx / this._scale
      const dy = event.dy / this._scale

      if (by === 'r') return

      const from = this._rect
      const to = resize(from, by, dx, dy)

      this._rect = to
      this.render()

      this.changes.next({
        dx,
        dy,
        top: from.top,
        left: from.left,
        from: by,
        right: from.left + from.width,
        scale: this._scale,
        bottom: from.top + from.height,
        transform: transformation(from, to)
      })
    })
  }

  private ordinance(parent: Selection, classed: OrdinancePoint, container: HTMLElement) {
    const ordinance = parent.append('div')
      .attr('class', classed)
      .style('width', '7px')
      .style('height', '7px')
      .style('z-index', '1')
      .style('border', '1px solid #FFFFFF')
      .style('position', 'absolute')
      .style('background-color', '#2196F3')
    switch (classed) {
      case 'r':
        ordinance
          .style('top', '-25px')
          .style('left', 'calc(50% - 4px)')
          .style('cursor', 'ew-resize')
          .style('border-radius', '100%')
        break
      case 'n':
        ordinance
          .style('top', '-4px')
          .style('left', 'calc(50% - 4px)')
          .style('cursor', 'n-resize')
        break
      case 'e':
        ordinance
          .style('top', 'calc(50% - 4px)')
          .style('right', '-4px')
          .style('cursor', 'e-resize')
        break
      case 's':
        ordinance
          .style('left', 'calc(50% - 4px)')
          .style('bottom', '-4px')
          .style('cursor', 's-resize')
        break
      case 'w':
        ordinance
          .style('top', 'calc(50% - 4px)')
          .style('left', '-4px')
          .style('cursor', 'w-resize')
        break
      case 'ne':
        ordinance
          .style('top', '-4px')
          .style('right', '-4px')
          .style('cursor', 'ne-resize')
        break
      case 'nw':
        ordinance
          .style('top', '-4px')
          .style('left', '-4px')
          .style('cursor', 'nw-resize')
        break
      case 'se':
        ordinance
          .style('right', '-4px')
          .style('bottom', '-4px')
          .style('cursor', 'se-resize')
        break
      case 'sw':
        ordinance
          .style('left', '-4px')
          .style('bottom', '-4px')
          .style('cursor', 'sw-resize')
        break
    }

    const drag = d3Drag<HTMLElement, unknown>().container(() => container)
    drag.on('end', (event) => this.end.next({ by: classed, event }))
    drag.on('drag', (event) => this.drag.next({ by: classed, event }))
    drag.on('start', (event) => this.start.next({ by: classed, event }))
    ordinance.call(<never>drag)
  }

  /** Paint the box, converting its user-unit rectangle into CSS pixels. */
  private render(): void {
    const { top, left, width, height } = this._rect
    this._element
      .attr('top', top)
      .attr('left', left)
      .attr('width', width)
      .attr('height', height)
      .style('top', `${top * this._scale}px`)
      .style('left', `${left * this._scale}px`)
      .style('width', `${width * this._scale + 1}px`)
      .style('height', `${height * this._scale + 1}px`)
  }

  public show({ x, y, width, height }: SelectionBounds) {
    this._rect = { top: y, left: x, width, height }
    this.render()
    this._element.style('display', 'block')
  }

  hide() {
    this._element.style('display', 'none')
  }

  scale(_scale: number) {
    if (_scale > 0) this._scale = _scale
    this.render()
  }

}

export interface SelectBoxEvent {
  dx: number
  dy: number
  top: number
  left: number
  from: OrdinancePoint
  right: number
  /** The canvas zoom the drag was measured at. */
  scale: number
  bottom: number
  /** The mapping applied to every selected shape, in SVG user units. */
  transform: Transformation
}

type OrdinancePoint = 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body'

interface OrdinanceEvent {
  by: OrdinancePoint
  event: DragSourceEvent
}

interface DragSourceEvent {
  x: number
  y: number
  dx: number
  dy: number
  sourceEvent: MouseEvent
}

export interface SelectionBounds {
  x: number
  y: number
  top: number
  left: number
  width: number
  right: number
  scale?: number
  height: number
  bottom: number
}
