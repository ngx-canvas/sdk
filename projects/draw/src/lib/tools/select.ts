import * as d3 from 'd3'

export class SelectTool {

  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public destination: { x: number, y: number } = { x: 0, y: 0 }

  private color: string = '#2196F3'

  constructor(args?: SELECT) {
    const selection: any = d3.select('svg.ngx-canvas')
    let selector: any
    const drag = d3.drag()
    drag.on('start', (event: any) => {
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
      d3.select('svg.ngx-canvas').selectAll('.shape').attr('selected', false)
      d3.select('svg.ngx-canvas > .select-tool').remove()
    })
    drag.on('drag', (event: any) => {
      this.destination.x = event.x - 15
      this.destination.y = event.y - 15
      if (this.origin.x < this.destination.x) selector.attr('width', this.destination.x - this.origin.x)
      if (this.origin.y < this.destination.y) selector.attr('height', this.destination.y - this.origin.y)
      if (this.origin.x > this.destination.x) selector.attr('x', this.destination.x + 0.5).attr('width', this.origin.x - this.destination.x)
      if (this.origin.y > this.destination.y) selector.attr('y', this.destination.y + 0.5).attr('height', this.origin.y - this.destination.y)
    })
    drag.on('end', (event: any) => {
      const area = {
        top: Number(selector.attr('y')),
        left: Number(selector.attr('x')),
        right: Number(selector.attr('x')) + Number(selector.attr('width')),
        bottom: Number(selector.attr('y')) + Number(selector.attr('height'))
      }
      selector.remove()
      this.select(area)
    })
    selection.call(drag)
  }

  select(area: { top: number, left: number, right: number, bottom: number }) {
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
      container.append('rect')
        .attr('x', -3)
        .attr('y', -3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      container.append('rect')
        .attr('x', (bounds.right - bounds.left) - 3)
        .attr('y', -3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      container.append('rect')
        .attr('x', -3)
        .attr('y', (bounds.bottom - bounds.top) - 3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
        .style('stroke', this.color)
        .style('stroke-width', 2)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
      container.append('rect')
        .attr('x', (bounds.right - bounds.left) - 3)
        .attr('y', (bounds.bottom - bounds.top) - 3)
        .attr('width', 6)
        .attr('height', 6)
        .style('fill', this.color)
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

}

interface SELECT {

}