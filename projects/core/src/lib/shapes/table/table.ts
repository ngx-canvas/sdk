/* --- SHAPES --- */
import { Row } from '../row/row'
import { TableColumn } from './table-column'
import { SHAPE, Shape } from '../shape/shape'

export class Table extends Shape {
  
  public type: string = 'table'
  public rows: Row[] = []
  public header!: any
  public footer: Row = new Row()
  public columns: TableColumn[] = []

  constructor(args?: TABLE) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.columns) !== 'undefined' && args.columns != null) {
        this.columns = args.columns.map(o => new TableColumn(o))
      }
      if (typeof (args.rows) !== 'undefined' && args.rows != null) {
        this.rows = args.rows.map(o => new Row(o))
      }
      if (typeof (args.header) !== 'undefined' && args.header != null) {
        this.header = args.header
      }
      if (typeof (args.footer) !== 'undefined' && args.footer != null) {
        this.footer = new Row(args.footer)
      }
    }
  }

  apply(parent: any) {
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('top', this.position.top)
      .attr('name', this.name)
      .attr('left', this.position.left)
      .attr('class', 'shape')
      .attr('right', this.position.right)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y}) translate(${this.position.x}, ${this.position.y})`)

    const table = this.el.append('foreignObject')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .append('xhtml:table')
      .attr('width', this.position.width + 'px')
      .style('background-color', this.fill.color)

    const thead = table.append('thead').append('tr')
    const tbody = table.append('tbody')
    const tfoot = table.append('tfoot').append('tr')

    this.columns.forEach(col => {
      const th = thead.append('th')
      if (col.header?.style) {
        Object.keys(col.header?.style).forEach((key) => th.style(key, col.header.style[key]))
      } else if (this.header) {
        Object.keys(this.header).forEach((key) => th.style(key, this.header[key]))
      }
      th.html(col.header.value)
    })

    this.data.forEach((row: any) => {
      const tr = tbody.append('tr')
      this.columns.forEach(col => {
        tr.append('td').html(row[col.key])
      })
    })

    this.columns.forEach(col => {
      tfoot.append('td')
        .style('text-align', 'left')
        .html(col.footer.value)
    })
  }
}

interface TABLE extends SHAPE {
  rows?: Row[]
  header?: any
  footer?: Row
  columns?: TableColumn[]
}
