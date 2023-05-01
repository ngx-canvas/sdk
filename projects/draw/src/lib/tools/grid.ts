import * as d3 from 'd3'

export class GridTool {
  constructor () {
    const selection = d3.selectAll('svg.ngx-canvas')
    const defs = selection.append('defs').attr('class', 'tool')
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

    selection.append('rect')
      .attr('id', 'page-grid')
      .attr('class', 'tool')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill-opacity', 0.5)
      .attr('fill', 'url(#page-grid-large)')
  }

  public enable () {
    d3.selectAll('svg.ngx-canvas #page-grid').attr('opacity', 1)
  }

  public disable () {
    d3.selectAll('svg.ngx-canvas #page-grid').attr('opacity', 0)
  }
}
