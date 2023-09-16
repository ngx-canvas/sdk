import * as d3 from 'd3'

/* --- SHAPES --- */
import { Shape, SHAPE } from '../shape/shape'
import { TableRow, TABLE_ROW } from './table-row'
import { Selection } from '../../project'

export class Table extends Shape {

  public type: string = 'table'
  public thead: TableRow[] = []
  public tbody: TableRow[] = []
  public tfoot: TableRow[] = []

  constructor(args?: TABLE) {
    super(args)
    if (args?.thead) this.thead = args.thead.map((o) => new TableRow(o))
    if (args?.tbody) this.tbody = args.tbody.map((o) => new TableRow(o))
    if (args?.tfoot) this.tfoot = args.tfoot.map((o) => new TableRow(o))
  }

  apply(parent: Selection) {
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: TABLE) {
    if (config) Object.assign(this, config)
    this.el
      .attr('transform', `translate(${this.position.x}, ${this.position.y})`)

    const rowspan = this.thead.length + this.tbody.length + this.tfoot.length
    const rowHeight = this.position.height / rowspan

    d3.select(`#${this.id} .thead`).remove()
    const thead = this.el.append('g')
      .attr('class', 'thead')

    let top = 0
    this.thead.forEach((row) => {
      const trow = thead
        .append('g')
        .attr('class', 'row')
      let left = 0
      row.cells.forEach((cell) => {
        const tcell = trow
          .append('g')
          .attr('class', 'cell')
          .attr('transform', `translate(${left}, ${top})`)
        const _width = (cell.colspan / row.colspan) * this.position.width
        tcell
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('fill', cell.fill.color)
          .attr('width', _width)
          .attr('height', rowHeight)
          .attr('stroke', cell.stroke.color)
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('stroke-width', cell.stroke.width)
          .attr('stroke-linecap', cell.stroke.cap)
          .attr('stroke-opacity', cell.stroke.opacity)
          .attr('stroke-dasharray', cell.stroke.dasharray())
        tcell
          .append('text')
          .attr('x', _width / 2)
          .attr('y', rowHeight / 2)
          .attr('fill', cell.font.color)
          .attr('text-anchor', 'middle')
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('alignment-baseline', 'middle')
          .text(cell.value)
        left += _width
      })
      top += rowHeight
    })

    d3.select(`#${this.id} .tbody`).remove()
    const tbody = this.el.append('g')
      .attr('class', 'tbody')

    this.tbody.forEach((row) => {
      const trow = tbody
        .append('g')
        .attr('class', 'row')
      let left = 0
      row.cells.forEach((cell) => {
        const tcell = trow
          .append('g')
          .attr('class', 'cell')
          .attr('transform', `translate(${left}, ${top})`)
        const _width = (cell.colspan / row.colspan) * this.position.width
        tcell
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('fill', cell.fill.color)
          .attr('width', _width)
          .attr('height', rowHeight)
          .attr('stroke', cell.stroke.color)
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('stroke-width', cell.stroke.width)
          .attr('stroke-linecap', cell.stroke.cap)
          .attr('stroke-opacity', cell.stroke.opacity)
          .attr('stroke-dasharray', cell.stroke.dasharray())
        tcell
          .append('text')
          .attr('x', _width / 2)
          .attr('y', rowHeight / 2)
          .attr('fill', cell.font.color)
          .attr('text-anchor', 'middle')
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('alignment-baseline', 'middle')
          .text(cell.value)
        left += _width
      })
      top += rowHeight
    })

    d3.select(`#${this.id} .tfoot`).remove()
    const tfoot = this.el.append('g')
      .attr('class', 'tfoot')

    this.tfoot.forEach((row) => {
      const trow = tfoot
        .append('g')
        .attr('class', 'row')
      let left = 0
      row.cells.forEach((cell) => {
        const tcell = trow
          .append('g')
          .attr('class', 'cell')
          .attr('transform', `translate(${left}, ${top})`)
        const _width = (cell.colspan / row.colspan) * this.position.width
        tcell
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('fill', cell.fill.color)
          .attr('width', _width)
          .attr('height', rowHeight)
          .attr('stroke', cell.stroke.color)
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('stroke-width', cell.stroke.width)
          .attr('stroke-linecap', cell.stroke.cap)
          .attr('stroke-opacity', cell.stroke.opacity)
          .attr('stroke-dasharray', cell.stroke.dasharray())
        tcell
          .append('text')
          .attr('x', _width / 2)
          .attr('y', rowHeight / 2)
          .attr('fill', cell.font.color)
          .attr('text-anchor', 'middle')
          .attr('fill-opacity', cell.fill.opacity / 100)
          .attr('alignment-baseline', 'middle')
          .text(cell.value)
        left += _width
      })
      top += rowHeight
    })
  }
}

interface TABLE extends SHAPE {
  thead?: TABLE_ROW[]
  tbody?: TABLE_ROW[]
  tfoot?: TABLE_ROW[]
}
