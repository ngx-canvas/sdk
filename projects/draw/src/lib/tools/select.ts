import * as d3 from 'd3'

export class SelectTool {

  public origin: { x: number, y: number } = { x: 0, y: 0 }
  public destination: { x: number, y: number } = { x: 0, y: 0 }

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
      selector.style('fill', '#2196F3')
      selector.style('stroke', '#2196F3')
      selector.style('stroke-width', '1')
      selector.style('fill-opacity', '0.1')
      selector.style('stroke-opacity', '1')
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
      console.log(area)
    })
    selection.call(drag)
  }

}

interface SELECT {

}