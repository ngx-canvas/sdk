import * as d3 from 'd3'

export class RulerTool {

  public margin: number = 0
  private width: number = 0
  private height: number = 0
  private clientX: number = 0
  private clientY: number = 0

  constructor(args?: RULER) {
    if (args?.width) this.width = args?.width
    if (args?.height) this.height = args?.height
    if (args?.margin) this.margin = args?.margin
    const selection: any = d3.select('#demo')

    selection.append('button')
      .style('top', '0px')
      .style('left', '0px')
      .style('width', '16px')
      .style('border', '1px solid #000')
      .style('height', '16px')
      .style('z-index', '200')
      .style('position', 'absolute')
      .style('border-radius', '0px')
      .style('background-color', 'orange')
      .on('click', () => {
        document.getElementById('ngx-container')?.scrollTo(0, 0)
      })

    /* --- X AXIS --- */
    const xAxisContainer = selection.append('svg').attr('width', this.width + (2 * this.margin)).attr('height', 16)
    xAxisContainer.style('top', '0px')
    xAxisContainer.style('left', '15px')
    xAxisContainer.style('right', '0px')
    xAxisContainer.style('z-index', '100')
    xAxisContainer.style('position', 'absolute')
    const xAxis = xAxisContainer.append('g')
      .attr('stroke', '#000')
      .attr('font-size', 10)
      .attr('font-family', 'Arial')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)
      .style('cursor', 'pointer')
      .style('user-select', 'none')
      .style('-ms-user-select', 'none')
      .style('-moz-user-select', 'none')
      .style('-webkit-user-select', 'none')
    xAxis.append('rect')
      .attr('x', 0.5)
      .attr('y', 0.5)
      .attr('fill', '#FFF')
      .attr('width', xAxisContainer.attr('width'))
      .attr('height', 15)
      .attr('stroke', '#000')
      .attr('stroke-width', 1)

    const bgTickRangeX = d3.range(0, xAxisContainer.attr('width'), 100)
    bgTickRangeX.map(x => {
      const bgTick = xAxis.append('g').attr('transform', `translate(${x + 0.5},0)`)
      bgTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 15)
      bgTick.append('text')
        .attr('x', 2)
        .attr('y', 13)
        .text(x - this.margin)
        .attr('stroke-width', 0)
    })
    const mdTickRangeX = d3.range(0, xAxisContainer.attr('width'), 50).filter(x => !bgTickRangeX.includes(x))
    mdTickRangeX.map(x => {
      const mdTick = xAxis.append('g').attr('transform', `translate(${x + 0.5},0)`)
      mdTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 8)
    })
    const smTickRangeX = d3.range(0, xAxisContainer.attr('width'), 10).filter(x => !mdTickRangeX.includes(x) && !bgTickRangeX.includes(x))
    smTickRangeX.map(x => {
      const smTick = xAxis.append('g').attr('transform', `translate(${x + 0.5},0)`)
      smTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 4)
    })
    xAxisContainer.on('mouseleave', () => {
      selection.select('#x-fix').remove()
      selection.select('#x-fix-label').remove()
    });
    xAxisContainer.on('mouseenter', (event: any) => {
      selection.append('div')
        .attr('id', 'x-fix')
        .style('top', '16px')
        .style('left', `${event.clientX}px`)
        .style('width', '1px')
        .style('height', `${(<Element>document.getElementById('demo')).clientHeight - 31}px`)
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('label')
        .attr('id', 'x-fix-label')
        .style('top', '24px')
        .style('left', `${event.clientX + 10}px`)
        .style('color', 'red')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('font-size', '12px')
        .style('font-family', 'Arial')
    });
    xAxisContainer.on('mousemove', (event: any) => {
      const xFix = selection.select('#x-fix')
      const xFixLabel = selection.select('#x-fix-label')
      if (!xFix.empty()) xFix.style('left', `${event.clientX}px`)
      if (!xFixLabel.empty()) xFixLabel.style('left', `${event.clientX + 10}px`).text(event.clientX + this.clientX - this.margin - 15)
    });
    xAxisContainer.on('click', (event: any) => {
      if (!d3.select(`#x-fix-${event.clientX}`).empty()) return
      selection.append('div')
        .attr('id', `x-fix-${event.clientX}`)
        .attr('class', `x-fix`)
        .style('top', '16px')
        .style('left', `${event.clientX}px`)
        .style('width', '1px')
        .style('height', `${(<Element>document.getElementById('demo')).clientHeight - 31}px`)
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('div')
        .attr('id', `x-fix-button-${event.clientX}`)
        .attr('class', `x-fix`)
        .style('top', '18px')
        .style('left', `${event.clientX + 3}px`)
        .style('color', '#FFF')
        .style('width', '14px')
        .style('height', '14px')
        .style('cursor', 'pointer')
        .style('z-index', '50')
        .style('display', 'flex')
        .style('position', 'absolute')
        .style('font-size', '8px')
        .style('align-items', 'center')
        .style('user-select', 'none')
        .style('border-radius', '100%')
        .style('justify-content', 'center')
        .style('-ms-user-select', 'none')
        .style('background-color', 'red')
        .style('-moz-user-select', 'none')
        .style('-webkit-user-select', 'none')
        .text('⨉')
        .on('click', () => {
          d3.select(`#x-fix-${event.clientX}`).remove()
          d3.select(`#x-fix-button-${event.clientX}`).remove()
        })
    });

    /* --- Y AXIS --- */
    const yAxisContainer = selection.append('svg').attr('width', 16).attr('height', this.height + (2 * this.margin))
    yAxisContainer.style('top', '15px')
    yAxisContainer.style('left', '0px')
    yAxisContainer.style('bottom', '0px')
    yAxisContainer.style('z-index', '100')
    yAxisContainer.style('position', 'absolute')
    const yAxis = yAxisContainer.append('g')
      .attr('stroke', '#000')
      .attr('font-size', 10)
      .attr('font-family', 'Arial')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 1)
      .style('cursor', 'pointer')
      .style('user-select', 'none')
      .style('-ms-user-select', 'none')
      .style('-moz-user-select', 'none')
      .style('-webkit-user-select', 'none')
    yAxis.append('rect')
      .attr('x', 0.5)
      .attr('y', 0.5)
      .attr('fill', '#FFF')
      .attr('width', 15)
      .attr('height', yAxisContainer.attr('height'))
      .attr('stroke', '#000')
      .attr('stroke-width', 1)

    const bgTickRangeY = d3.range(0, yAxisContainer.attr('height'), 100)
    bgTickRangeY.map(y => {
      const bgTick = yAxis.append('g').attr('transform', `translate(0,${y + 0.5})`)
      bgTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 15)
        .attr('y2', 0)
      bgTick.append('text')
        .attr('x', 2)
        .attr('y', 13)
        .text(y - this.margin)
        .attr('stroke-width', 0)
        .attr('transform', 'rotate(270)')
    })
    const mdTickRangeY = d3.range(0, yAxisContainer.attr('height'), 50).filter(x => !bgTickRangeY.includes(x))
    mdTickRangeY.map(y => {
      const mdTick = yAxis.append('g').attr('transform', `translate(0,${y + 0.5})`)
      mdTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 8)
        .attr('y2', 0)
    })
    const smTickRangeY = d3.range(0, yAxisContainer.attr('height'), 10).filter(x => !mdTickRangeY.includes(x) && !bgTickRangeY.includes(x))
    smTickRangeY.map(y => {
      const smTick = yAxis.append('g').attr('transform', `translate(0,${y + 0.5})`)
      smTick.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 4)
        .attr('y2', 0)
    })
    yAxisContainer.on('mouseleave', () => {
      selection.select('#y-fix').remove()
      selection.select('#y-fix-label').remove()
    });
    yAxisContainer.on('mouseenter', (event: any) => {
      selection.append('div')
        .attr('id', 'y-fix')
        .style('top', `${event.clientY}px`)
        .style('left', '16px')
        .style('width', `${(<Element>document.getElementById('demo')).clientWidth - 31}px`)
        .style('height', '1px')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('label')
        .attr('id', 'y-fix-label')
        .style('top', `${event.clientY + 8}px`)
        .style('left', '24px')
        .style('color', 'red')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('font-size', '12px')
        .style('font-family', 'Arial')
    });
    yAxisContainer.on('mousemove', (event: any) => {
      const yFix = selection.select('#y-fix')
      const yFixLabel = selection.select('#y-fix-label')
      if (!yFix.empty()) yFix.style('top', `${event.clientY}px`)
      if (!yFixLabel.empty()) yFixLabel.style('top', `${event.clientY + 8}px`).text(event.clientY + this.clientY - this.margin - 15)
    });
    yAxisContainer.on('click', (event: any) => {
      if (!d3.select(`#y-fix-${event.clientY}`).empty()) return
      selection.append('div')
        .attr('id', `y-fix-${event.clientY}`)
        .attr('class', `y-fix`)
        .style('top', `${event.clientY}px`)
        .style('left', '16px')
        .style('width', `${(<Element>document.getElementById('demo')).clientWidth - 31}px`)
        .style('height', '1px')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('div')
        .attr('id', `y-fix-button-${event.clientY}`)
        .attr('class', `y-fix`)
        .style('top', `${event.clientY - 16}px`)
        .style('left', '18px')
        .style('color', '#FFF')
        .style('width', '14px')
        .style('height', '14px')
        .style('cursor', 'pointer')
        .style('z-index', '50')
        .style('display', 'flex')
        .style('position', 'absolute')
        .style('font-size', '8px')
        .style('align-items', 'center')
        .style('user-select', 'none')
        .style('border-radius', '100%')
        .style('justify-content', 'center')
        .style('-ms-user-select', 'none')
        .style('background-color', 'red')
        .style('-moz-user-select', 'none')
        .style('-webkit-user-select', 'none')
        .text('⨉')
        .on('click', () => {
          d3.select(`#y-fix-${event.clientY}`).remove()
          d3.select(`#y-fix-button-${event.clientY}`).remove()
        })
    });

    /* --- AXES SCROLL SPY --- */
    d3.select('#ngx-container').on('scroll', (event) => {
      const scrollTop = (<Element>document.getElementById('ngx-container')).scrollTop
      const scrollLeft = (<Element>document.getElementById('ngx-container')).scrollLeft
      let changeX = 0
      let changeY = 0
      if (scrollTop != this.clientY) changeY = this.clientY - scrollTop
      if (scrollLeft != this.clientX) changeX = this.clientX - scrollLeft
      this.clientY = scrollTop
      this.clientX = scrollLeft
      xAxis.attr('transform', `translate(${-this.clientX},0)`)
      yAxis.attr('transform', `translate(0,${-this.clientY})`)
      if (changeX !== 0) {
        d3.selectAll('.x-fix').each(function(d, i) {
          const fix = d3.select(this)
          fix.style('left', parseInt(fix.style('left').replace('px', '')) + changeX + 'px')
        });
      }
      if (changeY !== 0) {
        d3.selectAll('.y-fix').each(function(d, i) {
          const fix = d3.select(this)
          fix.style('top', parseInt(fix.style('top').replace('px', '')) + changeY + 'px')
        });
      }
    })
  }

}

interface RULER {
  width?: number;
  height?: number;
  margin?: number;
}