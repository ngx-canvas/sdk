import * as d3 from 'd3'

export class ZoomTool {
  private projectId: string = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public value(): number {
    const scale = Number(d3.select('.ngx-canvas').attr('current-scale')) || 1
    return Math.abs(parseFloat((scale).toFixed(1)))
  }

  public scale(scale: number): void {
    if (scale <= 0.4 || scale >= 2.6) return
    
    const svg = d3.select('.ngx-canvas')
    if (svg.empty()) throw new Error('No svg found!')

    const viewBox = svg.attr('viewBox').split(' ')
    const viewBoxWidth = Number(viewBox[viewBox.length - 2])
    const viewBoxHeight = Number(viewBox[viewBox.length - 1])

    const container = d3.select('#demo')
    if (container.empty()) throw new Error('No container found!')

    const curWidth = Number(svg.attr('width'))
    const minWidth = (<any>container.node())?.offsetWidth
    const curHeight = Number(svg.attr('height'))
    const minHeight = (<any>container.node())?.offsetHeight
    if (curWidth * scale < minWidth || curHeight * scale < minHeight) return
    svg
      .style('width', viewBoxWidth * scale)
      .style('height', viewBoxHeight * scale)
      .attr('current-scale', scale)
  }
}