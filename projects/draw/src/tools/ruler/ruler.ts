import { range } from 'd3-array'
import { Axis, axisBottom, axisRight } from 'd3-axis'
import { ScaleLinear, scaleLinear } from 'd3-scale'
import { select, selectAll } from 'd3-selection'
import { Selection } from '@libs/common'

/**
 * Tick weights, as `[interval, length]` pairs. `d3-axis` renders a single tick
 * length per axis, so a multi-weight ruler is drawn as one generator per weight
 * over a shared scale. Longest last: coincident ticks share an origin, so the
 * longest simply wins visually and no de-duplication is needed.
 */
const TICKS: readonly [interval: number, size: number][] = [
  [10, 4],
  [50, 8],
  [100, 15]
]

/** Only the longest ticks carry a label. */
const LABELLED = 100

/** Ticks run 15px past the canvas so the ruler covers the gutter. */
const OVERHANG = 15

/** One rendered tick weight: the generator plus the group it draws into. */
interface TickLayer {
  axis: Axis<number>
  group: Selection
  anchor: 'x' | 'y'
  interval: number
}

/**
 * This will initialise the ruler tool. This will show a scale ruler about the XY axes. It will allow users to drop fixes and draw more accurately
 *
 * @example
 * ```ts
 * import { RulerTool } from '@ngx-canvas/draw';
 *
 * const ruler = new RulerTool('canvas');
 * ```
 */
export class RulerTool {
  private _scale = 1
  private _enabled = true
  private _projectId = ''

  private clientX = 0
  private clientY = 0

  /**
   * User units → CSS pixels, one scale per axis. Every tick weight on an axis
   * shares its scale, so rescaling is a single `range()` update rather than a
   * per-tick DOM write.
   */
  private readonly xScale: ScaleLinear<number, number> = scaleLinear()
  private readonly yScale: ScaleLinear<number, number> = scaleLinear()

  private xLayers: TickLayer[] = []
  private yLayers: TickLayer[] = []

  constructor(projectId: string) {
    this._projectId = projectId

    this.setupAxes()
  }

  public scale(_scale: number): void {
    this._scale = _scale
    const { width: viewBoxWidth, height: viewBoxHeight } = this.viewBox()

    const xAxisContainer = select('.x-axis-container')
    const offsetWidth = (<SVGSVGElement | null>xAxisContainer.node())?.parentElement?.offsetWidth ?? 0
    const width = viewBoxWidth * _scale
    xAxisContainer.attr('width', Math.max(width, offsetWidth) + OVERHANG)

    const yAxisContainer = select('.y-axis-container')
    const offsetHeight = (<SVGSVGElement | null>yAxisContainer.node())?.parentElement?.offsetHeight ?? 0
    const height = viewBoxHeight * _scale
    yAxisContainer.attr('height', Math.max(height, offsetHeight) + OVERHANG)

    // Re-range the shared scales and re-call each generator: d3-axis re-binds by
    // tick value and re-translates every tick itself.
    this.rescale(this.xScale, this.xLayers, viewBoxWidth, _scale)
    this.rescale(this.yScale, this.yLayers, viewBoxHeight, _scale)

    selectAll('.x-fix-marker').each(function () {
      const marker = select(this)
      marker.style('left', `${((Number(marker.attr('id').replace('x-fix-', '')) - 15) * _scale) + 15}px`)
    })
    selectAll('.x-fix-button').each(function () {
      const button = select(this)
      button.style('left', `${((Number(button.attr('id').replace('x-fix-button-', '')) - 15) * _scale) + 18}px`)
    })
    selectAll('.y-fix-marker').each(function () {
      const marker = select(this)
      marker.style('top', `${((Number(marker.attr('id').replace('y-fix-', '')) - 15) * _scale) + 15}px`)
    })
    selectAll('.y-fix-button').each(function () {
      const button = select(this)
      button.style('top', `${((Number(button.attr('id').replace('y-fix-button-', '')) - 15) * _scale) - 1}px`)
    })
    select('#x-fix').remove()
    select('#x-fix-label').remove()
    select('#y-fix').remove()
    select('#y-fix-label').remove()
  }

  public enable(): void {
    this._enabled = true
  }

  public disable(): void {
    this._enabled = false
  }

  public removeXTicks(): void {
    selectAll('div.x-fix').remove()
  }

  public removeYTicks(): void {
    selectAll('div.y-fix').remove()
  }

  public removeAllTicks(): void {
    this.removeXTicks()
    this.removeYTicks()
  }

  /** The canvas dimensions in user units. */
  private viewBox(): { width: number, height: number } {
    const viewBox = select(`#${this._projectId} .ngx-canvas`).attr('viewBox').split(' ')
    return {
      width: Number(viewBox[viewBox.length - 2]),
      height: Number(viewBox[viewBox.length - 1])
    }
  }

  /**
   * Map user units onto CSS pixels for `extent` units of canvas at zoom `k`.
   *
   * No half-pixel nudge here: `d3-axis` already offsets ticks by half a pixel to
   * keep 1px lines crisp, and drops to none on HiDPI where it would blur them.
   */
  private static domainOf(
    scale: ScaleLinear<number, number>,
    extent: number,
    k: number
  ): ScaleLinear<number, number> {
    const span = extent + OVERHANG
    return scale.domain([0, span]).range([0, span * k])
  }

  /**
   * Build one generator per tick weight, drawing into its own group under
   * `parent`. `anchor` picks the orientation: `x` ticks hang down into the
   * horizontal strip, `y` ticks reach right into the vertical one.
   */
  private buildLayers(parent: Selection, anchor: 'x' | 'y', scale: ScaleLinear<number, number>, extent: number): TickLayer[] {
    return TICKS.map(([interval, size]) => {
      const axis = (anchor === 'x' ? axisBottom<number>(scale) : axisRight<number>(scale))
        .tickValues(range(0, extent + OVERHANG, interval))
        .tickSizeInner(size)
        // The bordered background rect already draws the axis line.
        .tickSizeOuter(0)

      if (interval !== LABELLED) axis.tickFormat(() => '')

      const group = parent.append('g').attr('class', `ticks ${anchor}-ticks-${interval}`)
      const layer: TickLayer = { axis, group, anchor, interval }
      this.renderLayer(layer)
      return layer
    })
  }

  /** Draw (or redraw) a tick weight, then correct what `d3-axis` styles for charts. */
  private renderLayer({ axis, group, anchor, interval }: TickLayer): void {
    group.call(<never>axis)

    // d3-axis emits its own baseline path; the ruler's rect provides it instead.
    group.select('.domain').remove()

    if (interval === LABELLED) {
      // Chart axes sit labels clear of the ticks; a ruler tucks them into the
      // 16px strip beside the tick, and the vertical ruler reads bottom-up.
      group.selectAll('text')
        .attr('x', 2)
        .attr('y', 13)
        .attr('dy', null)
        .attr('text-anchor', 'start')
        .attr('stroke-width', 0)
        .attr('font-family', 'Arial')
        .attr('transform', anchor === 'y' ? 'rotate(270)' : null)
    } else {
      // Unlabelled weights still emit empty text nodes; drop them.
      group.selectAll('text').remove()
    }
  }

  /** Re-range a scale for a new zoom level and redraw every weight on it. */
  private rescale(scale: ScaleLinear<number, number>, layers: TickLayer[], extent: number, k: number): void {
    RulerTool.domainOf(scale, extent, k)
    for (const layer of layers) this.renderLayer(layer)
  }

  private setupAxes(): void {
    select('#ngx-container')
      .style('width', 'calc(100% - 15px)')
      .style('height', 'calc(100% - 15px)')
      .style('margin-top', '15px')
      .style('margin-left', '15px')

    const selection = select(`#${this._projectId}`)
    const { width: viewBoxWidth, height: viewBoxHeight } = this.viewBox()

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const container: any = select('#ngx-container').node()
        container.scrollTop = 0
        container.scrollLeft = 0
      })

    /* --- X AXIS --- */
    const xAxisContainer = selection.append('svg')
      .attr('class', 'tool ruler x-axis-container')
      .attr('width', viewBoxWidth + OVERHANG)
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

    RulerTool.domainOf(this.xScale, viewBoxWidth, this._scale)
    this.xLayers = this.buildLayers(xAxis, 'x', this.xScale, viewBoxWidth)

    xAxisContainer.on('mouseleave', () => {
      if (this._enabled) {
        selection.select('#x-fix').remove()
        selection.select('#x-fix-label').remove()
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xAxisContainer.on('mouseenter', (event: any) => {
      if (this._enabled) {
        const x: number = Number(event.layerX) + 15
        selection.append('div')
          .attr('id', 'x-fix')
          .style('top', '16px')
          .style('left', `${x}px`)
          .style('width', '1px')
          .style('height', `${(document.getElementById(`${this._projectId}`) as Element).clientHeight - 31}px`)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xAxisContainer.on('mousemove', (event: any) => {
      if (this._enabled) {
        const x: number = Number(event.layerX) + 15
        const xFix = selection.select('#x-fix')
        const xFixLabel = selection.select('#x-fix-label')
        if (!(xFix.empty() as boolean)) xFix.style('left', `${x}px`)
        const value = Math.round((x + this.clientX - 15) / this._scale)
        if (!(xFixLabel.empty() as boolean)) xFixLabel.style('left', `${x + 10}px`).text(value).attr('value', value)
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xAxisContainer.on('click', (event: any) => {
      if (this._enabled) {
        const x: number = Number(event.layerX) + 15
        const id = Math.round((x + this.clientX - 15) / this._scale) + 15
        if (!(select(`#x-fix-${id}`).empty())) return
        selection.append('div')
          .attr('id', `x-fix-${id}`)
          .attr('class', 'x-fix x-fix-marker')
          .style('top', '16px')
          .style('left', `${x}px`)
          .style('width', '1px')
          .style('height', `${(document.getElementById(`${this._projectId}`) as Element).clientHeight - 31}px`)
          .style('z-index', '50')
          .style('position', 'absolute')
          .style('background', 'red')
        selection.append('div')
          .attr('id', `x-fix-button-${id}`)
          .attr('class', 'x-fix x-fix-button')
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
            select(`#x-fix-${id}`).remove()
            select(`#x-fix-button-${id}`).remove()
          })
      }
    })

    /* --- Y AXIS --- */
    const yAxisContainer = selection.append('svg')
      .attr('class', 'tool ruler y-axis-container')
      .attr('width', 16)
      .attr('height', viewBoxHeight + OVERHANG)
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

    // Measured off the canvas height, not the x container's width — the old code
    // read the latter, so the vertical ruler was wrong on any non-square canvas.
    RulerTool.domainOf(this.yScale, viewBoxHeight, this._scale)
    this.yLayers = this.buildLayers(yAxis, 'y', this.yScale, viewBoxHeight)

    yAxisContainer.on('mouseleave', () => {
      if (this._enabled) {
        selection.select('#y-fix').remove()
        selection.select('#y-fix-label').remove()
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yAxisContainer.on('mouseenter', (event: any) => {
      if (this._enabled) {
        const y: number = Number(event.layerY) + 15
        selection.append('div')
          .attr('id', 'y-fix')
          .style('top', `${y}px`)
          .style('left', '16px')
          .style('width', `${(document.getElementById(`${this._projectId}`) as Element).clientWidth - 31}px`)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yAxisContainer.on('mousemove', (event: any) => {
      if (this._enabled) {
        const y: number = Number(event.layerY) + 15
        const yFix = selection.select('#y-fix')
        const yFixLabel = selection.select('#y-fix-label')
        if (!(yFix.empty() as boolean)) yFix.style('top', `${y}px`)
        if (!(yFixLabel.empty() as boolean)) yFixLabel.style('top', `${y + 8}px`).text(Math.round((y + this.clientY - 15) / this._scale))
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yAxisContainer.on('click', (event: any) => {
      if (this._enabled) {
        const y: number = Number(event.layerY) + 15
        const id = Math.round((y + this.clientY - 15) / this._scale) + 15
        if (!(select(`#y-fix-${id}`).empty())) return
        selection.append('div')
          .attr('id', `y-fix-${id}`)
          .attr('class', 'y-fix y-fix-marker')
          .style('top', `${y}px`)
          .style('left', '16px')
          .style('width', `${(document.getElementById(`${this._projectId}`) as Element).clientWidth - 31}px`)
          .style('height', '1px')
          .style('z-index', '50')
          .style('position', 'absolute')
          .style('background', 'red')
        selection.append('div')
          .attr('id', `y-fix-button-${id}`)
          .attr('class', 'y-fix y-fix-button')
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
            select(`#y-fix-${id}`).remove()
            select(`#y-fix-button-${id}`).remove()
          })
      }
    })

    /* --- AXES SCROLL SPY --- */
    select('#ngx-container').on('scroll', () => {
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
        selectAll('.x-fix').each(function () {
          const fix = select(this)
          fix.style('left', `${parseInt(fix.style('left').replace('px', '')) + changeX}px`)
        })
      }
      if (changeY !== 0) {
        selectAll('.y-fix').each(function () {
          const fix = select(this)
          fix.style('top', `${parseInt(fix.style('top').replace('px', '')) + changeY}px`)
        })
      }
    })
  }

}
