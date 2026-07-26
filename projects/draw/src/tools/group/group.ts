import { select } from 'd3-selection'
import { v4 as uuid } from 'uuid'
import { Selection, boundsOf } from '@libs/common'

/**
 * This will initialise the group tool. This will allow users to merge and separate shapes
 *
 * @example
 * ```ts
 * import { GroupTool } from '@ngx-canvas/draw';
 *
 * const group = new GroupTool('canvas');
 * ```
 */
export class GroupTool {

  private projectId = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public group(selection: Selection) {
    const svg = select(`#${this.projectId}`).select('svg.ngx-canvas')

    selection.classed('selected', false)

    const { top: y, left: x, width, height } = boundsOf(selection)
    const cx = x + width / 2
    const cy = y + height / 2

    const group = svg.append('g')
      .attr('x', x)
      .attr('y', y)
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('rx', 0)
      .attr('id', uuid())
      .attr('top', y)
      .attr('left', x)
      .attr('type', 'group')
      .attr('class', 'shape')
      .attr('right', x + width)
      .attr('width', width)
      .attr('height', height)
      .attr('bottom', y + height)
      .attr('transform', `rotate(0,${cx},${cy})`)

    selection.each(function () {
      group.node()?.appendChild(<Node>this)
    })
    group.classed('selected', true)

    return group
  }

  public ungroup(selection: Selection) {
    const svg = select(`#${this.projectId}`).select('svg.ngx-canvas')

    const shapes = selection.selectAll('.shape')
    shapes.classed('selected', true)
    shapes.each(function () {
      (<Element>svg.node()).appendChild(<Node>this)
    })

    selection.remove()

    return shapes
  }
}

export type GroupCommand = 'GROUP' | 'UNGROUP'