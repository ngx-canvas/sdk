import { min, max } from 'd3-array'
import { select, selectAll } from 'd3-selection'
import { v4 as uuid } from 'uuid'
import { Bounds, Selection } from '@libs/common'

export class GroupTool {

  private projectId = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public group(selection: Selection) {
    const svg = selectAll('svg.ngx-canvas')

    const items: Bounds[] = []
    selection.each(function () {
      const shape = select(this)
      items.push({
        x: Number(shape.attr('x')),
        y: Number(shape.attr('y')),
        width: Number(shape.attr('width')),
        height: Number(shape.attr('height'))
      })
      shape.classed('selected', false)
    })

    const x = <number>min(items, (d: Bounds) => d.x)
    const y = <number>min(items, (d: Bounds) => d.y)
    const right = <number>max(items, (d: Bounds) => d.x + d.width)
    const bottom = <number>max(items, (d: Bounds) => d.y + d.height)

    const group = svg.append('g')
      .attr('x', x)
      .attr('y', y)
      .attr('cx', (right - x) / 2)
      .attr('cy', (bottom - y) / 2)
      .attr('rx', 0)
      .attr('id', uuid())
      .attr('top', y)
      .attr('left', x)
      .attr('type', 'group')
      .attr('class', 'shape')
      .attr('right', right)
      .attr('width', right - x)
      .attr('height', bottom - y)
      .attr('bottom', bottom)
      .attr('transform', `rotate(${0},${(right - x) / 2},${(bottom - y) / 2}) translate(0,0)`)      

    selection.each(function () {
      select(this).classed('selected', false)
      group.node()?.appendChild(<Node>this)
    })
    group.classed('selected', true)

    return group
  }

  public ungroup(selection: Selection) {
    const svg = selectAll('svg.ngx-canvas')

    const shapes = selection.selectAll('.shape')
    shapes.classed('selected', true)
    shapes.each(function () {
      (<HTMLElement>svg.node()).appendChild(<Node>this)
    })

    selection.remove()

    return shapes
  }
}

export type GroupCommand = 'GROUP' | 'UNGROUP'