import { Fill, Font, Stroke } from '../../index'

export class TableCell {

  public key = ''
  public fill = new Fill()
  public font = new Font()
  public value = ''
  public stroke = new Stroke()
  public rowspan = 1
  public colspan = 1

  constructor(args?: TABLE_CELL) {
    if (args?.key) this.key = args.key
    if (args?.fill) this.fill = new Fill(args.fill)
    if (args?.font) this.font = new Font(args.font)
    if (args?.value) this.value = args.value
    if (args?.stroke) this.stroke = new Stroke(args.stroke)
    if (args?.rowspan) this.rowspan = args.rowspan
    if (args?.colspan) this.colspan = args.colspan
  }

}

export interface TABLE_CELL {
  key?: string
  fill?: Fill
  font?: Font
  value?: string
  stroke?: Stroke
  rowspan?: number
  colspan?: number
}
