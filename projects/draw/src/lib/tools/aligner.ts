// import * as d3 from 'd3'

export class AlignerTool {
  constructor () {
    console.log('Aligner is loaded')
    // const selection = d3.selectAll('svg.ngx-canvas .shape')
    // var dragHandler = d3.drag()
    //   .on('drag', function (event, d: any) {
    //     const shape = d3.select(this)
    //     const pos = {
    //       center: {
    //         x: parseFloat(shape.attr('center-x')) + event.dx,
    //         y: parseFloat(shape.attr('center-y')) + event.dy
    //       },
    //       x: parseFloat(shape.attr('x')) + event.dx,
    //       y: parseFloat(shape.attr('y')) + event.dy,
    //       top: parseFloat(shape.attr('top')) + event.dy,
    //       left: parseFloat(shape.attr('left')) + event.dx,
    //       right: parseFloat(shape.attr('right')) + event.dx,
    //       bottom: parseFloat(shape.attr('bottom')) + event.dy
    //     }
    //     shape.attr('x', pos.x)
    //     shape.attr('y', pos.y)
    //     shape.attr('top', pos.top)
    //     shape.attr('left', pos.left)
    //     shape.attr('right', pos.right)
    //     shape.attr('bottom', pos.bottom)
    //     shape.attr('center-x', pos.center.x)
    //     shape.attr('center-y', pos.center.y)
    //     aligner({
    //       center: {
    //         x: parseFloat(shape.attr('center-x')),
    //         y: parseFloat(shape.attr('center-y'))
    //       },
    //       top: parseFloat(shape.attr('top')),
    //       left: parseFloat(shape.attr('left')),
    //       right: parseFloat(shape.attr('right')),
    //       bottom: parseFloat(shape.attr('bottom'))
    //     })
    //     // const foundX = globals.svg.selectAll(`.shape[x='${x}']`)
    //     // if (foundX._groups[0].length > 1)  {
    //     //   globals.svg.append('line')
    //     //   .attr('class', 'align-horizontal')
    //     //   .attr('x1', x + 0.5)
    //     //   .attr('y1', 0)
    //     //   .attr('x2', x + 0.5)
    //     //   .attr('y2', globals.svg.attr('height'))
    //     //   .attr('fill', 'red')
    //     //   .attr('stroke', 'red')
    //     //   .attr('fill-opacity', 1)
    //     //   .attr('stroke-width', 1)
    //     // } else {
    //     //   d3.selectAll('.align-horizontal').remove()
    //     // }
    //     // const foundY = globals.svg.selectAll(`.shape[y='${y}']`)
    //     // if (foundY._groups[0].length > 1)  {
    //     //   globals.svg.append('line')
    //     //   .attr('class', 'align-vertical')
    //     //   .attr('x1', 0)
    //     //   .attr('y1', y + 0.5)
    //     //   .attr('x2', globals.svg.attr('width'))
    //     //   .attr('y2', y + 0.5)
    //     //   .attr('fill', 'red')
    //     //   .attr('stroke', 'red')
    //     //   .attr('fill-opacity', 1)
    //     //   .attr('stroke-width', 1)
    //     // } else {
    //     //   d3.selectAll('.align-vertical').remove()
    //     // }
    //   });

    // dragHandler(shape);
  }

  public tops (): void {}

  public lefts (): void {}

  public rights (): void {}

  public bottoms (): void {}

  public sendToBack (): void {}

  public bringForward (): void {}

  public sendBackward (): void {}

  public bringToFront (): void {}

  public absoluteCenters (): void {}

  public verticalCenters (): void {}

  public horizontalCenters (): void {}
}
