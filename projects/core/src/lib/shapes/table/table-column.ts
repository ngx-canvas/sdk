export class TableColumn {

  public key: string = ''
  public header: any = {
    value: ''
  }
  public footer: any = {
    value: ''
  }
  
  constructor({ key, header, footer }: TABLE_COLUMN) {
    if (key) this.key = key
    if (header) this.header = header
    if (footer) this.footer = footer
  }

}

interface TABLE_COLUMN {
  header?: {
    value?: string
  }
  footer?: {
    value?: string
  }
  key?: string
}
