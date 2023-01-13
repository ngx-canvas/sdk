import * as d3 from 'd3'

export class RulerTool {

  public margin: number = 0
  private clientX: number = 0
  private clientY: number = 0

  constructor(args?: RULER) {
    if (args?.margin) this.margin = args?.margin
    const selection: any = d3.selectAll('svg.ngx-canvas')

    /* --- X AXIS --- */
    const x = d3.scaleLinear()
      .domain([0, parseInt(selection.attr('width')) - this.margin])
      .range([this.margin, parseInt(selection.attr('width'))]);
    const xAxis = selection
      .append('g')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisBottom(x));
    xAxis.selectAll('.tick text')
      .attr('y', 4)
      .attr('x', 4)
      .style('text-anchor', 'start');
    xAxis.selectAll('.tick line')
      .attr('y2', 15.5)
    const xLine = selection.append('line')
      .attr('x1', 0)
      .attr('y1', 15.5)
      .attr('x2', 0)
      .attr('y2', selection.attr('height'))
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('fill-opacity', 1)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)
      .style('visibility', 'hidden')
    const xHandle = xAxis.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'transparent')
      .attr('width', '100%')
      .attr('height', 15.5)
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
    const xLabel = xAxis.append('text')
      .attr('x', 0)
      .attr('y', 30)
      .attr('fill', 'red')
      .style('visibility', 'hidden')
      .style('text-anchor', 'start');
    xHandle.on('mouseleave', () => {
      xLine.style('visibility', 'hidden');
      xLabel.style('visibility', 'hidden');
    });
    xHandle.on('mouseenter', () => {
      xLine.style('visibility', 'visible');
      xLabel.style('visibility', 'visible');
    });
    xHandle.on('mousemove', (event: any) => {
      const x = event.clientX + window.scrollX
      this.clientX = event.clientX
      xLine.attr('x1', x + 0.5).attr('x2', x + 0.5);
      xLabel.attr('x', x + 10).text(x - this.margin);
    });

    /* --- Y AXIS --- */
    const y = d3.scaleLinear()
      .domain([0, parseInt(selection.attr('height')) - this.margin])
      .range([this.margin, parseInt(selection.attr('height'))]);
    const yAxis = selection
      .append('g')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisRight(y));
    yAxis.selectAll('.tick line')
      .attr('x2', 15.5);
    yAxis.selectAll('text')
      .attr('y', 8)
      .attr('x', 4)
      .attr('transform', 'rotate(270)')
      .style('text-anchor', 'start');
    const yLine = selection.append('line')
      .attr('x1', 15.5)
      .attr('y1', 0)
      .attr('x2', selection.attr('width'))
      .attr('y2', 0)
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('fill-opacity', 1)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)
      .style('visibility', 'hidden')
    const yHandle = yAxis.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'transparent')
      .attr('width', 15.5)
      .attr('height', '100%')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
    const yLabel = yAxis.append('text')
      .attr('x', 25)
      .attr('y', 0)
      .attr('fill', 'red')
      .style('visibility', 'hidden')
      .style('text-anchor', 'start');
    yHandle.on('mouseleave', () => {
      yLine.style('visibility', 'hidden');
      yLabel.style('visibility', 'hidden');
    });
    yHandle.on('mouseenter', () => {
      yLine.style('visibility', 'visible');
      yLabel.style('visibility', 'visible');
    });
    yHandle.on('mousemove', (event: any) => {
      const y = window.scrollY + event.clientY
      this.clientY = event.clientY
      yLine.attr('y1', y + 0.5).attr('y2', y + 0.5);
      yLabel.attr('y', y + 15).text(y - this.margin);
    });

    window.addEventListener('scroll', event => {
      xAxis.attr('transform', `translate(0, ${window.scrollY})`)
      yAxis.attr('transform', `translate(${window.scrollX}, 0)`)
      const x = window.scrollX + this.clientX
      xLine.attr('x1', x + 0.5).attr('x2', x + 0.5);
      xLabel.attr('x', x + 10).text(x - this.margin);
      const y = window.scrollY + this.clientY
      yLine.attr('y1', y + 0.5).attr('y2', y + 0.5);
      yLabel.attr('y', y + 15).text(y - this.margin);
    })
  }

}

interface RULER {
  margin?: number;
}