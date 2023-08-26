import * as d3 from 'd3'
import { Subject } from 'rxjs'

export class SelectTool {
  private _projectId: string = ''
  private _selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = d3.select('reset')

  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public enabled: boolean = true
  public destination: { x: number, y: number } = { x: 0, y: 0 }

  private _box: SelectBox
  private readonly color: string = '#2196F3'

  constructor(projectId: string) {
    this._box = new SelectBox()
    this._projectId = projectId
  }

  all(): void {
    const main = d3.select('svg.ngx-canvas')
    this.selectArea({
      top: 0,
      left: 0,
      right: Number(main.attr('width')),
      bottom: Number(main.attr('height'))
    })
  }

  byId(id: string, position: any) {
    this._selection = d3.select(`#${id}`)
    // this._box.show(position)
    return this.selection()
  }
  
  clear() {
    this._selection = d3.select('reset')
  }

  selection() {
    return this._selection
  }

  selectAt(id: string): void {
    const shape = d3.select('#' + id)
    d3.select('svg.ngx-canvas .select-tool').remove()
    const bounds: { top: number, left: number, right: number, bottom: number } = { top: Number(shape.attr('top')), left: Number(shape.attr('left')), right: Number(shape.attr('right')), bottom: Number(shape.attr('bottom')) }
    shape.attr('selected', true)
    const classes = shape.attr('class').split(' ')
    classes.push('selected')
    shape.attr('class', classes.join(' '))

    const container = d3.select('svg.ngx-canvas')
      .append('g')
      .attr('class', 'tool select-tool')
      .attr('transform', `translate(${bounds.left}, ${bounds.top})`)
    container.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', bounds.right - bounds.left)
      .attr('height', bounds.bottom - bounds.top)
      .style('fill', this.color)
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 0.1)
      .style('stroke-opacity', 1)
    // NW
    container.append('rect')
      .attr('x', -3)
      .attr('y', -3)
      .attr('width', 6)
      .attr('height', 6)
      .style('fill', this.color)
      .style('cursor', 'nw-resize')
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
    // NE
    container.append('rect')
      .attr('x', (bounds.right - bounds.left) - 3)
      .attr('y', -3)
      .attr('width', 6)
      .attr('height', 6)
      .style('fill', this.color)
      .style('cursor', 'ne-resize')
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
    // SW
    container.append('rect')
      .attr('x', -3)
      .attr('y', (bounds.bottom - bounds.top) - 3)
      .attr('width', 6)
      .attr('height', 6)
      .style('fill', this.color)
      .style('cursor', 'sw-resize')
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
    // SE
    container.append('rect')
      .attr('x', (bounds.right - bounds.left) - 3)
      .attr('y', (bounds.bottom - bounds.top) - 3)
      .attr('width', 6)
      .attr('height', 6)
      .style('fill', this.color)
      .style('cursor', 'se-resize')
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
    container.append('line')
      .attr('x1', (bounds.right - bounds.left) / 2)
      .attr('y1', -20)
      .attr('x2', (bounds.right - bounds.left) / 2)
      .attr('y2', 0)
      .style('fill', this.color)
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
    container.append('circle')
      .attr('r', 5)
      .attr('cx', (bounds.right - bounds.left) / 2)
      .attr('cy', -25)
      .style('fill', this.color)
      .style('cursor', 'grab')
      .style('stroke', this.color)
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
  }

  selectArea(area: { top: number, left: number, right: number, bottom: number }): void {
    d3.select('svg.ngx-canvas .select-tool').remove()
    const bounds: { top: number, left: number, right: number, bottom: number } = { top: Infinity, left: Infinity, right: -Infinity, bottom: -Infinity }
    const shapes = d3.selectAll('svg.ngx-canvas > .shape')
    let selection = 0
    shapes.each(function () {
      const shape = d3.select(this)
      const top = Number(shape.attr('top'))
      const left = Number(shape.attr('left'))
      const right = Number(shape.attr('right'))
      const bottom = Number(shape.attr('bottom'))
      if (top >= area.top && left >= area.left && right <= area.right && bottom <= area.bottom) {
        shape.attr('selected', true)
        const classes = shape.attr('class').split(' ')
        classes.push('selected')
        shape.attr('class', classes.join(' '))
        if (top <= bounds.top) bounds.top = top
        if (left <= bounds.left) bounds.left = left
        if (right >= bounds.right) bounds.right = right
        if (bottom >= bounds.bottom) bounds.bottom = bottom
        selection += 1
      }
    })
    if (selection > 0) {
      const container = d3.select('svg.ngx-canvas')
        .append('g')
        .attr('class', 'tool select-tool')
        .attr('transform', `translate(${bounds.left}, ${bounds.top})`)
      container.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bounds.right - bounds.left)
        .attr('height', bounds.bottom - bounds.top)
        .style('fill', this.color)
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 0.1)
        .style('stroke-opacity', 1)
      // NW
      container.append('rect')
        .attr('x', -3)
        .attr('y', -3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('cursor', 'nw-resize')
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      // NE
      container.append('rect')
        .attr('x', (bounds.right - bounds.left) - 3)
        .attr('y', -3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('cursor', 'ne-resize')
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      // SW
      container.append('rect')
        .attr('x', -3)
        .attr('y', (bounds.bottom - bounds.top) - 3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('cursor', 'sw-resize')
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      // SE
      container.append('rect')
        .attr('x', (bounds.right - bounds.left) - 3)
        .attr('y', (bounds.bottom - bounds.top) - 3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('cursor', 'se-resize')
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      if (selection === 1) {
        container.append('line')
          .attr('x1', (bounds.right - bounds.left) / 2)
          .attr('y1', -20)
          .attr('x2', (bounds.right - bounds.left) / 2)
          .attr('y2', 0)
          .style('fill', this.color)
          .style('stroke', this.color)
          .style('stroke-width', 2)
          .style('fill-opacity', 1)
          .style('stroke-opacity', 1)
        container.append('circle')
          .attr('r', 5)
          .attr('cx', (bounds.right - bounds.left) / 2)
          .attr('cy', -25)
          .style('fill', this.color)
          .style('cursor', 'grab')
          .style('stroke', this.color)
          .style('stroke-width', 2)
          .style('fill-opacity', 1)
          .style('stroke-opacity', 1)
      }
    }
  }

  enable(): void {
    this.enabled = true
    d3.select('svg.ngx-canvas .select-tool').remove()
    this._box.show({ x: 100, y: 100 })
  }

  disable(): void {
    this.enabled = false
    d3.select('svg.ngx-canvas .select-tool').remove()
    d3.select('svg.ngx-canvas').on('drag', null)
  }

  unselect(): void {
    d3.select('svg.ngx-canvas .select-tool').remove()
    const selection = d3.selectAll('svg.ngx-canvas > .shape')
    selection.attr('selected', false)
    selection.each(function () {
      const shape = d3.select(this)
      const classes = shape.attr('class').split(' ')
      shape.attr('class', classes.filter(c => c !== 'selected').join(' '))
    })
  }
}

class SelectBox {

  public end: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public drag: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public start: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>()
  public changes: Subject<SelectBoxEvent> = new Subject<SelectBoxEvent>()

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
    drag.on('end', (event: DragEvent) => this.end.next({ by: 'body', event }))
    drag.on('drag', (event: DragEvent) => this.drag.next({ by: 'body', event }))
    drag.on('start', (event: DragEvent) => {
      const top = Number(this._element.style('top').replace('px', ''))
      const left = Number(this._element.style('left').replace('px', ''))
      offset.y = (<any>event).sourceEvent.pageY - top
      offset.x = (<any>event).sourceEvent.pageX - left
      this.start.next({ by: 'body', event })
    })
    this._element.call(<any>drag)

    this.ordinance(this._element, 'r')
    this.ordinance(this._element, 'n')
    this.ordinance(this._element, 'e')
    this.ordinance(this._element, 's')
    this.ordinance(this._element, 'w')
    this.ordinance(this._element, 'ne')
    this.ordinance(this._element, 'nw')
    this.ordinance(this._element, 'se')
    this.ordinance(this._element, 'sw')

    this.drag.subscribe(({ by, event }: any) => {
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
        this._element.style('top', `${event.sourceEvent.pageY}px`)
        this._element.style('height', `${height + (top - event.sourceEvent.pageY)}px`)
        break
      case 'e':
        this._element.style('width', `${width + event.dx}px`)
        break
      case 's':
        this._element.style('height', `${height + event.dy}px`)
        break
      case 'w':
        this._element.style('left', `${event.sourceEvent.pageX}px`)
        this._element.style('width', `${width + (left - event.sourceEvent.pageX)}px`)
        break
      case 'ne':
        this._element.style('top', `${event.sourceEvent.pageY}px`)
        this._element.style('width', `${width + event.dx}px`)
        this._element.style('height', `${height + (top - event.sourceEvent.pageY)}px`)
        break
      case 'nw':
        this._element.style('top', `${event.sourceEvent.pageY}px`)
        this._element.style('left', `${event.sourceEvent.pageX}px`)
        this._element.style('width', `${width + (left - event.sourceEvent.pageX)}px`)
        this._element.style('height', `${height + (top - event.sourceEvent.pageY)}px`)
        break
      case 'se':
        this._element.style('width', `${width + event.dx}px`)
        this._element.style('height', `${height + event.dy}px`)
        break
      case 'sw':
        this._element.style('left', `${event.sourceEvent.pageX}px`)
        this._element.style('width', `${width + (left - event.sourceEvent.pageX)}px`)
        this._element.style('height', `${height + event.dy}px`)
        break
      case 'body':
        this._element.style('top', `${event.sourceEvent.pageY - offset.y}px`)
        this._element.style('left', `${event.sourceEvent.pageX - offset.x}px`)
        break
      }
      this.changes.next({ top, left, right: left + width, bottom: top + height })
    })
  }

  private ordinance(parent: any, classed: 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body') {
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
        .style('cursor', 'wait')
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
    const drag = d3.drag()
    drag.on('end', (event: DragEvent) => this.end.next({ by: classed, event }))
    drag.on('drag', (event: DragEvent) => this.drag.next({ by: classed, event }))
    drag.on('start', (event: DragEvent) => this.start.next({ by: classed, event }))
    ordinance.call(drag)
  }

  public show({ x, y, width, height }: any) {
    this._element
      .style('top', `${x}px`)
      .style('left', `${y}px`)
      .style('width', `${width + 1}px`)
      .style('height', `${height + 1}px`)
      .style('display', 'block')
  }

}

interface SelectBoxEvent {
  top: number
  left: number
  right: number
  bottom: number
}

interface OrdinanceEvent {
  by: 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body'
  event: DragEvent
}