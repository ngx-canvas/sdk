import * as d3 from 'd3'

export class SelectTool {
  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public enabled: boolean = true
  public destination: { x: number, y: number } = { x: 0, y: 0 }

  private dragging: boolean = false
  private readonly color: string = '#2196F3'

  constructor(args?: SELECT) {
    const selection: any = d3.select('svg.ngx-canvas')
    let selector: any
    const drag = d3.drag()
    drag.on('start', (event: any) => {
      if (this.enabled) {
        this.origin.x = event.x - 15
        this.origin.y = event.y - 15
        selector = selection.append('rect')
        selector.attr('x', this.origin.x + 0.5)
        selector.attr('y', this.origin.y + 0.5)
        selector.attr('width', 0)
        selector.attr('height', 0)
        selector.style('fill', this.color)
        selector.style('stroke', this.color)
        selector.style('stroke-width', 1)
        selector.style('fill-opacity', 0.1)
        selector.style('stroke-opacity', 1)
        const selected = d3.select('svg.ngx-canvas').selectAll('.shape')
        selected.attr('selected', false)
        selected.each(function () {
          const shape = d3.select(this)
          const classes = shape.attr('class').split(' ')
          shape.attr('class', classes.filter(c => c !== 'selected').join(' '))
        })
        d3.select('svg.ngx-canvas > .select-tool').remove()
      }
    })
    drag.on('drag', (event: any) => {
      if (this.enabled) {
        this.destination.x = event.x - 15
        this.destination.y = event.y - 15
        if (this.origin.x < this.destination.x) selector.attr('width', this.destination.x - this.origin.x)
        if (this.origin.y < this.destination.y) selector.attr('height', this.destination.y - this.origin.y)
        if (this.origin.x > this.destination.x) selector.attr('x', this.destination.x + 0.5).attr('width', this.origin.x - this.destination.x)
        if (this.origin.y > this.destination.y) selector.attr('y', this.destination.y + 0.5).attr('height', this.origin.y - this.destination.y)
        this.dragging = true
      }
    })
    drag.on('end', (event: any) => {
      if (this.enabled && this.dragging) {
        const area = {
          top: Number(selector.attr('y')),
          left: Number(selector.attr('x')),
          right: Number(selector.attr('x')) + Number(selector.attr('width')),
          bottom: Number(selector.attr('y')) + Number(selector.attr('height'))
        }
        selector.remove()
        this.selectArea(area)
        this.dragging = false
        console.log('end')
      }
    })
    selection.call(drag)

    selection.on('click', (event: PointerEvent) => {
      const target = (<Element>event.target)
      if (target.classList.contains('shape')) this.selectAt(target.id)
    })
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
      .attr('class', 'select-tool')
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
        .attr('class', 'select-tool')
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
  }

  disable(): void {
    this.enabled = false
    d3.select('svg.ngx-canvas .select-tool').remove()
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

interface SELECT {
  enabled: boolean
}
