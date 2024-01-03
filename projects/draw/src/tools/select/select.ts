import * as d3 from 'd3'
import { Subject } from 'rxjs'
import {
  Points,
  Position,
  Transform,
  Selection,
  CurveMode,
  CurveModes
} from '@libs/common'

export class SelectTool {

  private _projectId = ''
  private _selection: Selection = d3.select('reset')

  public count = 0
  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public changes: Subject<SelectBoxEvent> = new Subject<SelectBoxEvent>()
  public context: Subject<MouseEvent> = new Subject<MouseEvent>()
  public enabled = true
  public destination: { x: number, y: number } = { x: 0, y: 0 }

  private _box: SelectBox
  private readonly color: string = '#2196F3'

  constructor(projectId: string) {
    this._box = new SelectBox()

    this._box.changes.subscribe((event) => this.changes.next(event))
    this._box.context.subscribe((event) => this.context.next(event))

    this._box.changes.subscribe((event) => {
      const shapes = d3.selectAll('.shape.selected')
      shapes.each(function () {
        const shape = d3.select(this)
        const position = new Position().fromSelection(shape as any)
        switch (event.from) {
          case 'body': {
            position.x += event.dx
            position.y += event.dy
            position.top += event.dy
            position.left += event.dx
            position.right += event.dx
            position.bottom += event.dy

            shape.attr('x', position.x)
            shape.attr('y', position.y)
            shape.attr('top', position.top)
            shape.attr('left', position.left)
            shape.attr('right', position.right)
            shape.attr('bottom', position.bottom)

            const points = new Points().fromString(shape)
            if (points.exists) {
              points.value = points.value.map((o) => {
                return {
                  x: o.x + event.dx,
                  y: o.y + event.dy
                }
              })
              shape.attr('points', points.toString())
              if (shape.attr('d')) shape.datum(points.value).attr('d', <any>d3.line().x((d: any) => d.x).y((d: any) => d.y).curve(CurveMode[<CurveModes>shape.attr('curve-mode')]))
            }

            const transform = new Transform().fromString(shape)
            if (transform.exists) {
              transform.rotate.x += event.dx
              transform.rotate.y += event.dy
              transform.translate.x += event.dx
              transform.translate.y += event.dy
              shape.attr('transform', transform.toString())
            }
            break
          }
          case 'r': {
            break
          }
          case 'n': {
            position.y += event.dy
            position.top += event.dy
            position.height -= event.dy

            shape.attr('y', position.y)
            shape.attr('top', position.top)
            shape.attr('height', position.height)
            break
          }
          case 'e': {
            position.width += event.dx
            position.right += event.dx

            shape.attr('width', position.width)
            shape.attr('right', position.right)
            break
          }
          case 's': {
            position.height += event.dy
            position.bottom += event.dy

            shape.attr('height', position.height)
            shape.attr('bottom', position.bottom)
            break
          }
          case 'w': {
            position.x += event.dx
            position.left += event.dx
            position.width -= event.dx

            shape.attr('x', position.x)
            shape.attr('left', position.left)
            shape.attr('width', position.width)
            break
          }
          case 'ne': {
            position.y += event.dy
            position.top += event.dy
            position.width += event.dx
            position.right += event.dx
            position.height -= event.dy

            shape.attr('y', position.y)
            shape.attr('top', position.top)
            shape.attr('width', position.width)
            shape.attr('right', position.right)
            shape.attr('height', position.height)
            break
          }
          case 'nw': {
            position.x += event.dx
            position.y += event.dy
            position.top += event.dy
            position.left += event.dx
            position.width -= event.dx
            position.height -= event.dy

            shape.attr('y', position.y)
            shape.attr('x', position.x)
            shape.attr('top', position.top)
            shape.attr('left', position.left)
            shape.attr('width', position.width)
            shape.attr('height', position.height)
            break
          }
          case 'se': {
            position.width += event.dx
            position.right += event.dx
            position.height += event.dy
            position.bottom += event.dy

            shape.attr('width', position.width)
            shape.attr('right', position.right)
            shape.attr('height', position.height)
            shape.attr('bottom', position.bottom)
            break
          }
          case 'sw': {
            position.x += event.dx
            position.left += event.dx
            position.width -= event.dx
            position.height += event.dy
            position.bottom += event.dy

            shape.attr('x', position.x)
            shape.attr('left', position.left)
            shape.attr('width', position.width)
            shape.attr('height', position.height)
            shape.attr('bottom', position.bottom)
            break
          }
        }
        shape.attr('cx', position.x + (position.width / 2))
        shape.attr('cy', position.y + (position.height / 2))
      })
    })

    this._projectId = projectId
  }

  all() {
    return this.byBounds({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      width: Infinity,
      right: Infinity,
      height: Infinity,
      bottom: Infinity
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  byId(id: string, fn: any, _scale: number) {
    this._selection = d3.select(`#${id}`)
    const style = new fn(this._selection)
    this._box.show(style.position)
    this._box.scale(_scale)
    return this.selection()
  }

  hideBox() {
    return this._box.hide()
  }

  private _count() {
    this.count = d3.selectAll('.shape.selected').filter(function () {
      return d3.select(this).classed('selected')
    }).size()
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
    const bounds: SelectionBounds = { x: Infinity, y: Infinity, top: Infinity, left: Infinity, width: -Infinity, right: -Infinity, height: -Infinity, bottom: -Infinity }

    d3.selectAll('svg.ngx-canvas > .shape').each(function () {
      const shape = d3.select(this)
      const top = Number(shape.attr('top'))
      const left = Number(shape.attr('left'))
      const right = Number(shape.attr('right'))
      const bottom = Number(shape.attr('bottom'))
      if (top >= area.top && left >= area.left && right <= area.right && bottom <= area.bottom) {
        if (!shape.classed('selected')) shape.classed('selected', true)
        if (top <= bounds.top) bounds.top = top
        if (left <= bounds.left) bounds.left = left
        if (right >= bounds.right) bounds.right = right
        if (bottom >= bounds.bottom) bounds.bottom = bottom
      }
    })

    this._selection = d3.selectAll('svg.ngx-canvas > .shape').filter(function () {
      return d3.select(this).classed('selected')
    })

    bounds.y = bounds.top
    bounds.x = bounds.left
    bounds.width = bounds.right - bounds.left
    bounds.height = bounds.bottom - bounds.top

    this._count()

    return {
      bounds,
      selection: this._selection
    }
  }

  unselect(): void {
    const shapes = d3.selectAll('svg.ngx-canvas > .shape')
    shapes.classed('selected', false)
    this._selection = d3.select('reset')
  }

  scale(_scale: number) {
    this._box.scale(_scale)
  }

  selection() {
    return d3.selectAll('.shape.selected')
  }
}

class SelectBox {

  public end: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public drag: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public start: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public changes: Subject<SelectBoxEvent> = new Subject<SelectBoxEvent>()
  public context: Subject<MouseEvent> = new Subject<MouseEvent>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _element: any

  constructor() {
    this._element = d3.select('#ngx-container')
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
      .style('background-color', 'rgba(33, 150, 243, 0.1')

    const offset = {
      x: 0,
      y: 0
    }

    const drag = d3.drag()
    drag.on('end', (event) => this.end.next({ by: 'body', event }))
    drag.on('drag', (event) => this.drag.next({ by: 'body', event }))
    drag.on('start', (event) => {
      const top = Number(this._element.style('top').replace('px', ''))
      const left = Number(this._element.style('left').replace('px', ''))
      offset.y = event.sourceEvent.pageY - top
      offset.x = event.sourceEvent.pageX - left
      this.start.next({ by: 'body', event })
    })
    this._element.call(drag)

    this._element.on('contextmenu', (event: MouseEvent) => this.context.next(event))

    this.ordinance(this._element, 'r')
    this.ordinance(this._element, 'n')
    this.ordinance(this._element, 'e')
    this.ordinance(this._element, 's')
    this.ordinance(this._element, 'w')
    this.ordinance(this._element, 'ne')
    this.ordinance(this._element, 'nw')
    this.ordinance(this._element, 'se')
    this.ordinance(this._element, 'sw')

    this.drag.subscribe(({ by, event }: OrdinanceEvent) => {
      const top = Number(this._element.style('top').replace('px', ''))
      const left = Number(this._element.style('left').replace('px', ''))
      const width = Number(this._element.style('width').replace('px', ''))
      const height = Number(this._element.style('height').replace('px', ''))
      const rotate = Number(this._element.style('transform').replace('rotate(', '').replace('deg)', ''))
      switch (by) {
        case 'r':
          this._element.style('transform', `rotate(${rotate}deg)`)
          break
        case 'n':
          this._element.style('top', `${top + event.y}px`)
          this._element.style('height', `${height - event.y}px`)
          this.changes.next({ dx: event.x, dy: event.y, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'e':
          this._element.style('width', `${width + event.dx}px`)
          this.changes.next({ dx: event.dx, dy: event.dy, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 's':
          this._element.style('height', `${height + event.dy}px`)
          this.changes.next({ dx: event.dx, dy: event.dy, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'w':
          this._element.style('left', `${left + event.x}px`)
          this._element.style('width', `${width - event.x}px`)
          this.changes.next({ dx: event.x, dy: event.y, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'ne':
          this._element.style('top', `${top + event.y}px`)
          this._element.style('width', `${width + event.dx}px`)
          this._element.style('height', `${height - event.y}px`)
          this.changes.next({ dx: event.dx, dy: event.y, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'nw':
          this._element.style('top', `${top + event.y}px`)
          this._element.style('left', `${left + event.x}px`)
          this._element.style('width', `${width - event.x}px`)
          this._element.style('height', `${height - event.y}px`)
          this.changes.next({ dx: event.x, dy: event.y, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'se':
          this._element.style('width', `${width + event.dx}px`)
          this._element.style('height', `${height + event.dy}px`)
          this.changes.next({ dx: event.dx, dy: event.dy, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'sw':
          this._element.style('left', `${left + event.x}px`)
          this._element.style('width', `${width - event.x}px`)
          this._element.style('height', `${height + event.dy}px`)
          this.changes.next({ dx: event.x, dy: event.dy, top, left, from: by, right: left + width, bottom: top + height })
          break
        case 'body':
          this._element.style('top', `${event.sourceEvent.pageY - offset.y}px`)
          this._element.style('left', `${event.sourceEvent.pageX - offset.x}px`)
          this.changes.next({ dx: event.dx, dy: event.dy, top, left, from: by, right: left + width, bottom: top + height })
          break
      }
    })
  }

  private ordinance(parent: Selection, classed: OrdinancePoint) {
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

    // const offset = {
    //   x: 0,
    //   y: 0
    // }

    const drag = d3.drag()
    drag.on('end', (event) => this.end.next({ by: classed, event }))
    drag.on('drag', (event) => {
      console.log(event)
      this.drag.next({ by: classed, event })
    })
    drag.on('start', (event) => {
      // const top = Number(this._element.style('top').replace('px', ''))
      // const left = Number(this._element.style('left').replace('px', ''))
      // offset.y = event.sourceEvent.pageY - top
      // offset.x = event.sourceEvent.pageX - left
      this.start.next({ by: classed, event })
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ordinance.call(<any>drag)
  }

  public show({ x, y, width, height }: SelectionBounds) {
    this._element
      .attr('top', y)
      .attr('left', x)
      .attr('width', width)
      .attr('height', height)
      .style('top', `${y}px`)
      .style('left', `${x}px`)
      .style('width', `${width + 1}px`)
      .style('height', `${height + 1}px`)
      .style('display', 'block')
  }

  hide() {
    this._element.style('display', 'none')
  }

  scale(_scale: number) {
    const top = Number(this._element.attr('top')) * _scale
    const left = Number(this._element.attr('left')) * _scale
    const width = Number(this._element.attr('width')) * _scale
    const height = Number(this._element.attr('height')) * _scale
    this._element
      .style('top', `${top}px`)
      .style('left', `${left}px`)
      .style('width', `${width + 1}px`)
      .style('height', `${height + 1}px`)
  }

}

interface SelectBoxEvent {
  dx: number
  dy: number
  top: number
  left: number
  from: OrdinancePoint
  right: number
  bottom: number
}

type OrdinancePoint = 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body'

interface OrdinanceEvent {
  by: 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body'
  event: DragSourceEvent
}

interface DragSourceEvent extends DragEvent {
  dx: number
  dy: number
  sourceEvent: MouseEvent
}

interface SelectionBounds {
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
