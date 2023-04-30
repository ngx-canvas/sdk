import * as d3 from 'd3'

export class RulerTool {

  public xFixes = <{
    max?: number;
    enabled?: boolean;
  }>{
      max: 100,
      enabled: true
    };
  public yFixes = <{
    max?: number;
    enabled?: boolean;
  }>{
      max: 100,
      enabled: true
    };
  public margin: number = 0
  private width: number = 0
  private height: number = 0
  private clientX: number = 0
  private clientY: number = 0

  constructor(args?: RULER) {
    if (args?.width) this.width = args?.width
    if (args?.height) this.height = args?.height
    if (args?.margin) this.margin = args?.margin
    if (args?.xFixes?.max) this.xFixes.max = args?.xFixes?.max
    if (args?.yFixes?.max) this.yFixes.max = args?.yFixes?.max
    if (args?.xFixes?.enabled) this.xFixes.enabled = args?.xFixes?.enabled
    if (args?.yFixes?.enabled) this.yFixes.enabled = args?.yFixes?.enabled

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
      const x = event.layerX + 15
      selection.append('div')
        .attr('id', 'x-fix')
        .style('top', '16px')
        .style('left', `${x}px`)
        .style('width', '1px')
        .style('height', `${(<Element>document.getElementById('demo')).clientHeight - 31}px`)
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('label')
        .attr('id', 'x-fix-label')
        .style('top', '24px')
        .style('left', `${x + 10}px`)
        .style('color', 'red')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('font-size', '12px')
        .style('font-family', 'Arial')
    });
    xAxisContainer.on('mousemove', (event: any) => {
      const x = event.layerX + 15
      const xFix = selection.select('#x-fix')
      const xFixLabel = selection.select('#x-fix-label')
      if (!xFix.empty()) xFix.style('left', `${x}px`)
      if (!xFixLabel.empty()) xFixLabel.style('left', `${x + 10}px`).text(x + this.clientX - this.margin - 15)
    });
    xAxisContainer.on('click', (event: any) => {
      const x = event.layerX + 15
      if (!d3.select(`#x-fix-${x}`).empty()) return
      selection.append('div')
        .attr('id', `x-fix-${x}`)
        .attr('class', `x-fix`)
        .style('top', '16px')
        .style('left', `${x}px`)
        .style('width', '1px')
        .style('height', `${(<Element>document.getElementById('demo')).clientHeight - 31}px`)
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('div')
        .attr('id', `x-fix-button-${x}`)
        .attr('class', `x-fix`)
        .style('top', '18px')
        .style('left', `${x + 3}px`)
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
          d3.select(`#x-fix-${x}`).remove()
          d3.select(`#x-fix-button-${x}`).remove()
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
      const y = event.layerY + 15
      selection.append('div')
        .attr('id', 'y-fix')
        .style('top', `${y}px`)
        .style('left', '16px')
        .style('width', `${(<Element>document.getElementById('demo')).clientWidth - 31}px`)
        .style('height', '1px')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('label')
        .attr('id', 'y-fix-label')
        .style('top', `${y + 8}px`)
        .style('left', '24px')
        .style('color', 'red')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('font-size', '12px')
        .style('font-family', 'Arial')
    });
    yAxisContainer.on('mousemove', (event: any) => {
      const y = event.layerY + 15
      const yFix = selection.select('#y-fix')
      const yFixLabel = selection.select('#y-fix-label')
      if (!yFix.empty()) yFix.style('top', `${y}px`)
      if (!yFixLabel.empty()) yFixLabel.style('top', `${y + 8}px`).text(y + this.clientY - this.margin - 15)
    });
    yAxisContainer.on('click', (event: any) => {
      const y = event.layerY + 15
      if (!d3.select(`#y-fix-${y}`).empty()) return
      selection.append('div')
        .attr('id', `y-fix-${y}`)
        .attr('class', `y-fix`)
        .style('top', `${y}px`)
        .style('left', '16px')
        .style('width', `${(<Element>document.getElementById('demo')).clientWidth - 31}px`)
        .style('height', '1px')
        .style('z-index', '50')
        .style('position', 'absolute')
        .style('background', 'red')
      selection.append('div')
        .attr('id', `y-fix-button-${y}`)
        .attr('class', `y-fix`)
        .style('top', `${y - 16}px`)
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
          d3.select(`#y-fix-${y}`).remove()
          d3.select(`#y-fix-button-${y}`).remove()
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
        d3.selectAll('.x-fix').each(function (d, i) {
          const fix = d3.select(this)
          fix.style('left', parseInt(fix.style('left').replace('px', '')) + changeX + 'px')
        });
      }
      if (changeY !== 0) {
        d3.selectAll('.y-fix').each(function (d, i) {
          const fix = d3.select(this)
          fix.style('top', parseInt(fix.style('top').replace('px', '')) + changeY + 'px')
        });
      }
    })
  }

  enable() {}
  
  disable() {}
  
  removeXTicks() {}
  
  removeYTicks() {}
  
  removeAllTicks() {}

}

interface RULER {
  xFixes?: {
    max?: number;
    enabled?: boolean;
  };
  yFixes?: {
    max?: number;
    enabled?: boolean;
  };
  width: number;
  height: number;
  margin?: number;
}