import * as d3 from 'd3'

export class RulerTool {
  public xFixes = {
    max: 100,
    enabled: true
  } as {
    max: number
    enabled: boolean
  }

  public yFixes = {
    max: 100,
    enabled: true
  } as {
    max: number
    enabled: boolean
  }

  private _scale: number = 1
  private clientX: number = 0
  private clientY: number = 0
  private enabled: boolean = true

  constructor(args?: RULER) {
    const selection: any = d3.select('#demo')
    const viewBox = d3.select('#demo .ngx-canvas').attr('viewBox').split(' ')
    const viewBoxWidth = Number(viewBox.at(-2))
    const viewBoxHeight = Number(viewBox.at(-1))

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
    const xAxisContainer = selection.append('svg')
      .attr('class', 'tool ruler x-axis-container')
      .attr('width', viewBoxWidth)
      .attr('height', 16)
    xAxisContainer.style('top', '0px')
    xAxisContainer.style('left', '15px')
    xAxisContainer.style('right', '0px')
    xAxisContainer.style('z-index', '100')
    xAxisContainer.style('overflow', 'hidden')
    xAxisContainer.style('position', 'absolute')
    const xAxis = xAxisContainer.append('g')
      .attr('class', 'x-axis')
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
      .attr('width', '100%')
      .attr('height', 15)
      .attr('stroke', '#000')
      .attr('stroke-width', 1)

    const xTicks: any[] = []
    d3.range(0, xAxisContainer.attr('width'), 100).map((value) => {
      xTicks.push({
        size: TickSize.LG,
        value
      })
    })
    d3.range(0, xAxisContainer.attr('width'), 50).filter(value => !xTicks.map((tick) => tick.value).includes(value)).map((value) => {
      xTicks.push({
        size: TickSize.MD,
        value
      })
    })
    d3.range(0, xAxisContainer.attr('width'), 10).filter(value => !xTicks.map((tick) => tick.value).includes(value)).map((value) => {
      xTicks.push({
        size: TickSize.SM,
        value
      })
    })
    xTicks.sort((a, b) => a.value - b.value).forEach(({ size, value }) => {
      createTick({
        size,
        value,
        label: size === 15 ? value.toString() : null,
        parent: xAxis,
        anchor: 'x'
      })
    })
    xAxisContainer.on('mouseleave', () => {
      if (this.enabled) {
        selection.select('#x-fix').remove()
        selection.select('#x-fix-label').remove()
      }
    })
    xAxisContainer.on('mouseenter', (event: any) => {
      if (this.enabled) {
        const x: number = Number(event.layerX) + 15
        selection.append('div')
          .attr('id', 'x-fix')
          .style('top', '16px')
          .style('left', `${x}px`)
          .style('width', '1px')
          .style('height', `${(document.getElementById('demo') as Element).clientHeight - 31}px`)
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
      }
    })
    xAxisContainer.on('mousemove', (event: any) => {
      if (this.enabled) {
        const x: number = Number(event.layerX) + 15
        const xFix = selection.select('#x-fix')
        const xFixLabel = selection.select('#x-fix-label')
        if (!(xFix.empty() as boolean)) xFix.style('left', `${x}px`)
        if (!(xFixLabel.empty() as boolean)) xFixLabel.style('left', `${x + 10}px`).text(Math.round((x + this.clientX - 15) / this._scale))
      }
    })
    xAxisContainer.on('click', (event: any) => {
      if (this.enabled) {
        const x: number = Number(event.layerX) + 15
        if (!(d3.select(`#x-fix-${x}`).empty())) return
        selection.append('div')
          .attr('id', `x-fix-${x}`)
          .attr('class', 'x-fix')
          .style('top', '16px')
          .style('left', `${x}px`)
          .style('width', '1px')
          .style('height', `${(document.getElementById('demo') as Element).clientHeight - 31}px`)
          .style('z-index', '50')
          .style('position', 'absolute')
          .style('background', 'red')
        selection.append('div')
          .attr('id', `x-fix-button-${x}`)
          .attr('class', 'x-fix')
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
      }
    })

    /* --- Y AXIS --- */
    const yAxisContainer = selection.append('svg')
      .attr('class', 'tool ruler y-axis-container')
      .attr('width', 16)
      .attr('height', viewBoxHeight)
    yAxisContainer.style('top', '15px')
    yAxisContainer.style('left', '0px')
    yAxisContainer.style('bottom', '0px')
    yAxisContainer.style('z-index', '100')
    yAxisContainer.style('overflow', 'hidden')
    yAxisContainer.style('position', 'absolute')
    const yAxis = yAxisContainer.append('g')
      .attr('class', 'y-axis')
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
      .attr('height', '100%')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)

    const yTicks: any[] = []
    d3.range(0, xAxisContainer.attr('width'), 100).map((value) => {
      yTicks.push({
        size: TickSize.LG,
        value
      })
    })
    d3.range(0, xAxisContainer.attr('width'), 50).filter(value => !yTicks.map((tick) => tick.value).includes(value)).map((value) => {
      yTicks.push({
        size: TickSize.MD,
        value
      })
    })
    d3.range(0, xAxisContainer.attr('width'), 10).filter(value => !yTicks.map((tick) => tick.value).includes(value)).map((value) => {
      yTicks.push({
        size: TickSize.SM,
        value
      })
    })
    yTicks.sort((a, b) => a.value - b.value).forEach(({ size, value }) => {
      createTick({
        size,
        value,
        label: size === 15 ? value.toString() : null,
        parent: yAxis,
        anchor: 'y'
      })
    })
    yAxisContainer.on('mouseleave', () => {
      if (this.enabled) {
        selection.select('#y-fix').remove()
        selection.select('#y-fix-label').remove()
      }
    })
    yAxisContainer.on('mouseenter', (event: any) => {
      if (this.enabled) {
        const y: number = Number(event.layerY) + 15
        selection.append('div')
          .attr('id', 'y-fix')
          .style('top', `${y}px`)
          .style('left', '16px')
          .style('width', `${(document.getElementById('demo') as Element).clientWidth - 31}px`)
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
      }
    })
    yAxisContainer.on('mousemove', (event: any) => {
      if (this.enabled) {
        const y: number = Number(event.layerY) + 15
        const yFix = selection.select('#y-fix')
        const yFixLabel = selection.select('#y-fix-label')
        if (!(yFix.empty() as boolean)) yFix.style('top', `${y}px`)
        if (!(yFixLabel.empty() as boolean)) yFixLabel.style('top', `${y + 8}px`).text(Math.round((y + this.clientY - 15) / this._scale))
      }
    })
    yAxisContainer.on('click', (event: any) => {
      if (this.enabled) {
        const y: number = Number(event.layerY) + 15
        if (!(d3.select(`#y-fix-${y}`).empty())) return
        selection.append('div')
          .attr('id', `y-fix-${y}`)
          .attr('class', 'y-fix')
          .style('top', `${y}px`)
          .style('left', '16px')
          .style('width', `${(document.getElementById('demo') as Element).clientWidth - 31}px`)
          .style('height', '1px')
          .style('z-index', '50')
          .style('position', 'absolute')
          .style('background', 'red')
        selection.append('div')
          .attr('id', `y-fix-button-${y}`)
          .attr('class', 'y-fix')
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
      }
    })

    /* --- AXES SCROLL SPY --- */
    d3.select('#ngx-container').on('scroll', (event) => {
      const scrollTop = (document.getElementById('ngx-container') as Element).scrollTop
      const scrollLeft = (document.getElementById('ngx-container') as Element).scrollLeft
      let changeX = 0
      let changeY = 0
      if (scrollTop !== this.clientY) changeY = this.clientY - scrollTop
      if (scrollLeft !== this.clientX) changeX = this.clientX - scrollLeft
      this.clientY = scrollTop
      this.clientX = scrollLeft
      xAxis.attr('transform', `translate(${-this.clientX},0)`)
      yAxis.attr('transform', `translate(0,${-this.clientY})`)
      if (changeX !== 0) {
        d3.selectAll('.x-fix').each(function (d, i) {
          const fix = d3.select(this)
          fix.style('left', `${parseInt(fix.style('left').replace('px', '')) + changeX}px`)
        })
      }
      if (changeY !== 0) {
        d3.selectAll('.y-fix').each(function (d, i) {
          const fix = d3.select(this)
          fix.style('top', `${parseInt(fix.style('top').replace('px', '')) + changeY}px`)
        })
      }
    })
  }

  scale(val: number): void {
    this._scale = val
    const viewBox = d3.select('#demo .ngx-canvas').attr('viewBox').split(' ')
    const viewBoxWidth = Number(viewBox.at(-2))
    const viewBoxHeight = Number(viewBox.at(-1))

    const xAxis = d3.select('.x-axis')
    const width = viewBoxWidth * val
    const xAxisContainer = d3.select('.x-axis-container')
    const offsetWidth = (<any>xAxisContainer?.node()).parentElement.offsetWidth
    xAxisContainer.attr('width', width >= offsetWidth ? width : offsetWidth)

    const xTicks = d3.range(0, viewBoxWidth, 10)
    xTicks.forEach(x => {
      xAxis.select(`.tick.x-tick-${x}`).attr('transform', `translate(${(x * val) + 0.5},0)`)
    })

    const yAxis = d3.select('.y-axis')
    const height = viewBoxHeight * val
    const yAxisContainer = d3.select('.y-axis-container')
    const offsetHeight = (<any>yAxisContainer?.node()).parentElement.offsetHeight
    yAxisContainer.attr('height', height >= offsetHeight ? height : offsetHeight)

    const yTicks = d3.range(0, viewBoxHeight, 10)
    yTicks.forEach(y => {
      yAxis.select(`.tick.y-tick-${y}`).attr('transform', `translate(0,${(y * val) + 0.5})`)
    })
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  removeXTicks(): void {
    d3.selectAll('div.x-fix').remove()
  }

  removeYTicks(): void {
    d3.selectAll('div.y-fix').remove()
  }

  removeAllTicks(): void {
    d3.selectAll('div.x-fix').remove()
    d3.selectAll('div.y-fix').remove()
  }
}

interface RULER {
  xFixes?: {
    max?: number
    enabled?: boolean
  }
  yFixes?: {
    max?: number
    enabled?: boolean
  }
  width: number
  height: number
  margin?: number
}

const enum TickSize {
  SM = 4,
  MD = 8,
  LG = 15
}

interface TICK {
  size: TickSize
  value: number
  label?: string
  parent: any
  anchor: 'x' | 'y'
}

const createTick = ({ size, label, value, parent, anchor }: TICK) => {
  const pos = value + 0.5

  const tick = parent.append('g')
    .attr('class', `tick ${anchor}-tick-${value}`)
    .attr('transform', anchor === 'x' ? `translate(${pos},0)` : `translate(0,${pos})`)

  tick.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', anchor === 'x' ? 0 : size)
    .attr('y2', anchor === 'x' ? size : 0)

  if (label) tick.append('text')
    .text(label)
    .attr('x', 2)
    .attr('y', 13)
    .attr('transform', anchor === 'y' ? 'rotate(270)' : null)
    .attr('stroke-width', 0)
}