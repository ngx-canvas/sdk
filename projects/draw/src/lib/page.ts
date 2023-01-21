import * as d3 from 'd3'

export class Page {

  public index: number = 0;
  public width: number = 0;
  public height: number = 0;
  public margin: number = 0;

  constructor(args?: PAGE) {
    Object.assign(this, args)
    const selection = d3.selectAll('svg.ngx-canvas')

    selection.append('rect')
      .attr('x', this.margin)
      .attr('y', this.margin + (this.index * this.height) + (this.index * this.margin))
      .attr('id', 'background')
      .attr('fill', '#FFFFFF')
      .attr('width', this.width - (2 * this.margin))
      .attr('height', this.height - (2 * this.margin))
  }

}

interface PAGE {
  index?: number;
  width?: number;
  height?: number;
  margin?: number; 
}