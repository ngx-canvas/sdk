import { TableCell, TABLE_CELL } from './table-cell'

export class TableRow {

  public cells: TableCell[] = []
  public colspan: number = 0

  constructor(args?: TABLE_ROW) {
    if (args?.cells) this.cells = args.cells.map((o) => new TableCell(o))
    this.colspan = this.cells.map(o => o.colspan).reduce((a, b) => a + b, 0)
  }

}

export interface TABLE_ROW {
  cells?: TABLE_CELL[]
  colspan?: number
}
