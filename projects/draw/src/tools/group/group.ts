import * as d3 from 'd3'

export class GroupTool {

  private projectId: string = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public group(): void {
    const selection = d3.selectAll(`${this.projectId} .shape.selected`)
    const x: number[] = []
    const y: number[] = []
    selection.attr('selected', false)
    selection.each(function () {
      const shape = d3.select(this)
      x.push(Number(shape.attr('x')))
      y.push(Number(shape.attr('y')))
      const classes = shape.attr('class').split(' ')
      shape.attr('class', classes.filter(c => c !== 'selected').join(' '))
    })
    const top: number = d3.min(x) || 0
    const left: number = d3.min(y) || 0
    const svg = d3.select('svg.ngx-canvas')
    const group = svg.append('g')
    group.attr('transform', `translate(${top}, ${left})`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloned: any = selection.clone().each(function () {
      const shape = d3.select(this)
      shape.attr('x', Number(shape.attr('x')) - top)
      shape.attr('y', Number(shape.attr('y')) - left)
    }).nodes()

    group.node()?.append(...cloned)
    selection.remove()
  }

  public ungroup(): void {
    // const selection = d3.selectAll(`${this.projectId} .shape.selected`)
  }
}
