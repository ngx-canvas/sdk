import * as d3 from 'd3'

export class ZoomTool {
  private projectId: string = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public in(): void {
    const svg = d3.select('.ngx-canvas')
    if (svg.style('transform') === 'none') svg.style('transform', 'scale(1)')
    const scale = parseFloat((Number(svg.style('transform').replace('scale(', '').replace(')', '')) + 0.1).toFixed(1))
    if (scale === 2.1) return
    svg.style('transform', `scale(${scale})`)
    svg.style('transform-origin', 'top left')
  }

  public out(): void {
    const svg = d3.select('.ngx-canvas')
    if (svg.style('transform') === 'none') svg.style('transform', 'scale(1)')
    const scale = parseFloat((Number(svg.style('transform').replace('scale(', '').replace(')', '')) - 0.1).toFixed(1))
    if (scale === 0) return
    svg.style('transform', `scale(${scale})`)
    svg.style('transform-origin', 'top left')
  }

  public value(): number {
    const svg = d3.select('.ngx-canvas')
    if (svg.style('transform') === 'none') svg.style('transform', 'scale(1)')
    const scale = Number(svg.style('transform').replace('scale(', '').replace(')', ''))
    return Math.abs(parseFloat((scale * 100).toFixed(1)))
  }
}