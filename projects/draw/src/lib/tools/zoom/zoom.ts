import * as d3 from 'd3'

export class ZoomTool {
  private projectId: string = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public value(): number {
    const svg = d3.select('.ngx-canvas')
    if (svg.style('transform') === 'none') svg.style('transform', 'scale(1)')
    const scale = Number(svg.style('transform').replace('scale(', '').replace(')', ''))
    return Math.abs(parseFloat((scale).toFixed(1)))
  }

  public scale(scale: number): void {
    if (scale <= 0.4 || scale >= 2.6) return
    const svg = d3.select('.ngx-canvas')
    const curWidth = Number(svg.attr('width'))
    const minWidth = (<any>d3.select('#demo').node())?.offsetWidth
    const curHeight = Number(svg.attr('height'))
    const minHeight = (<any>d3.select('#demo').node())?.offsetHeight
    if (curWidth * scale < minWidth || curHeight * scale < minHeight) return
    svg
      .style('transform', `scale(${scale})`)
      .style('transform-origin', 'top left')
  }
}