/* --- SHAPES --- */
import { TableColumn } from './table-column'
import { SHAPE, Shape } from '../shape/shape'

export class Table extends Shape {

  public type: string = 'table'
  public rows: any[] = []
  public header: any = {}
  public footer: any = {}
  public columns: TableColumn[] = []

  constructor(args?: TABLE) {
    super(args)
    if (typeof (args) !== 'undefined' && args != null) {
      if (typeof (args.rows) !== 'undefined' && args.rows != null) this.rows = args.rows
      if (typeof (args.header) !== 'undefined' && args.header != null) this.header = args.header
      if (typeof (args.footer) !== 'undefined' && args.footer != null) this.footer = args.footer
      if (typeof (args.columns) !== 'undefined' && args.columns != null) this.columns = args.columns.map(o => new TableColumn(o))
    }
  }

  apply(parent: any) {
    this.el = parent.append('foreignObject')
      .attr('id', this.id)
      .attr('class', 'shape')
    this.update()

    // const thead = this.el.append('thead').append('tr')
    // const tbody = this.el.append('tbody')
    // const tfoot = this.el.append('tfoot').append('tr')

    // this.columns.forEach(col => {
    //   const th = thead.append('th')
    //   if (col.header?.style) {
    //     Object.keys(col.header?.style).forEach((key) => th.style(key, col.header.style[key]))
    //   } else if (this.header) {
    //     Object.keys(this.header).forEach((key) => th.style(key, this.header[key]))
    //   }
    //   th.html(col.header.value)
    // })

    // this.data.forEach((row: any) => {
    //   const tr = tbody.append('tr')
    //   this.columns.forEach(col => {
    //     tr.append('td').html(row[col.key])
    //   })
    // })

    // this.columns.forEach(col => {
    //   tfoot.append('td')
    //     .style('text-align', 'left')
    //     .html(col.footer.value)
    // })
  }

  update(config?: TABLE) {
    if (config) Object.assign(this, config)
    this.rows = <any>[
      { name: 'Alice', age: 25, location: 'New York' },
      { name: 'Bob', age: 30, location: 'San Francisco' },
      { name: 'Charlie', age: 22, location: 'Los Angeles' }
    ]
    this.columns = ['name', 'age', 'location'].map(o => new TableColumn({ key: o }))

    this.el
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('name', this.name)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .style('background-color', this.fill.color)
    let table = this.el.select('table')
    if (table.empty()) table = this.el.append('xhtml:table')
    table
      .attr('width', '100%')
      .style('border-collapse', 'collapse')

    table.select('thead').remove()
    const thead = table.append('thead').append('tr')

    thead.selectAll('td')
      .data((d: any) => this.columns)
      .enter()
      .append('td')
      .text((d: any) => d.key)

    table.select('tbody').remove()
    const tbody = table.append('tbody')

    const brows = tbody.selectAll('tr')
      .data(this.rows)
      .enter()
      .append('tr')

    brows.selectAll('td')
      .data((d: any) => Object.values(d))
      .enter()
      .append('td')
      .text((d: any) => d)
  }
}

interface TABLE extends SHAPE {
  rows?: any[]
  header?: any
  footer?: any
  columns?: TableColumn[]
}
