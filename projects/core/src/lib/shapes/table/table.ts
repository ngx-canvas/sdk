/* --- SHAPES --- */
import { Row } from '../row/row'
import { SHAPE, Shape } from '../shape/shape'

export class Table extends Shape {
  public type: string = 'table'
  public rows: Row[] = []
  public header: Row = new Row()
  public footer: Row = new Row()

  constructor(args?: TABLE) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.rows) !== 'undefined' && args.rows != null) {
        this.rows = args.rows.map(o => new Row(o))
      }
      if (typeof (args.header) !== 'undefined' && args.header != null) {
        this.header = new Row(args.header)
      }
      if (typeof (args.footer) !== 'undefined' && args.footer != null) {
        this.footer = new Row(args.footer)
      }
      let top = this.header.position.bottom
      this.rows.map(row => {
        row.columns.map(column => {
          column.position.y = top
          column.position.top = top
          column.position.bounds()
        })
        row.position.bounds()
        top += row.position.height
      })
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
        
    const thead = table.append('thead')
      .append('tr')
        .append('th')
          .style('text-align', 'left')
          .html('Header 1')
    
    const tbody = table.append('tbody')
    tbody.append('tr')
        .append('td')
          .html('1:1')
    tbody.append('tr')
        .append('td')
          .html('2:1')
    tbody.append('tr')
        .append('td')
          .html('3:1')
    tbody.append('tr')
        .append('td')
          .html('4:1')
    tbody.append('tr')
        .append('td')
          .html('5:1')
  }
}

interface TABLE extends SHAPE {
  rows?: Row[]
  header?: Row
  footer?: Row
}
