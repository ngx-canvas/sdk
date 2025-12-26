import * as d3 from 'd3'
import { Selection } from '@libs/common'

export class GridTool {
  private _enabled = true
  private _snapping = false
  private readonly projectId: string
  private initialized = false
  
  constructor(projectId: string) {
    this.projectId = projectId
    // Initialize grid when SVG is available
    this.initialize()
  }

  private initialize(): void {
    // Try to initialize, retry if SVG not ready
    const svg = d3.select(`#${this.projectId} svg.ngx-canvas`)
    
    if (svg.empty()) {
      // SVG not ready yet, retry after a short delay
      setTimeout(() => this.initialize(), 100)
      return
    }

    if (this.initialized) return
    this.initialized = true

    // Check if defs already exist
    let defs: d3.Selection<any, unknown, HTMLElement, any> = svg.select('defs.tool')
    if (defs.empty()) {
      defs = svg.append('defs').attr('class', 'tool')
    }

    // Check if patterns already exist
    if (defs.select('#page-grid-small').empty()) {
      defs.append('pattern')
        .attr('id', 'page-grid-small')
        .attr('width', 10)
        .attr('height', 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append('path')
        .attr('d', ['M', 10, 0, 'L', 0, 0, 0, 10].join(' '))
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('stroke-width', 0.5)
    }

    if (defs.select('#page-grid-large').empty()) {
      const pattern = defs.append('pattern')
        .attr('id', 'page-grid-large')
        .attr('width', 10 * 10)
        .attr('height', 10 * 10)
        .attr('patternUnits', 'userSpaceOnUse')

      pattern.append('rect')
        .attr('width', 10 * 10)
        .attr('height', 10 * 10)
        .attr('fill', 'url(#page-grid-small)')

      pattern.append('path')
        .attr('d', ['M', 100, 0, 'L', 0, 0, 0, 100].join(' '))
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('stroke-width', 1)
    }

    // Check if grid rect already exists
    if (svg.select('#page-grid').empty()) {
      const width = Number(svg.attr('width')) || 800
      const height = Number(svg.attr('height')) || 600
      
      svg.append('rect')
        .attr('id', 'page-grid')
        .attr('class', 'tool')
        .attr('width', width + 200)
        .attr('height', height + 200)
        .attr('fill-opacity', 0.5)
        .attr('fill', 'url(#page-grid-large)')
        .attr('opacity', this._enabled ? 1 : 0)
    }
  }

  public snap (): void {
    this._snapping = true
  }

  public unsnap (): void {
    this._snapping = false
  }

  public enable(): void {
    this._enabled = true
    this.initialize() // Ensure initialized
    d3.select(`#${this.projectId} svg.ngx-canvas #page-grid`).attr('opacity', 1)
  }

  public disable(): void {
    this._enabled = false
    d3.select(`#${this.projectId} svg.ngx-canvas #page-grid`).attr('opacity', 0)
  }

  public enabled(): boolean {
    return this._enabled
  }

  public snapping (): boolean {
    return this._snapping
  }
}
