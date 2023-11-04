import * as d3 from 'd3'
import { Selection } from '../../common/selection'

export class GroupTool {

  private projectId: string = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public group(selection: Selection, position: any) {
    const svg = d3.selectAll('svg.ngx-canvas')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const group: any = svg.append('g')
      .attr('x', position.x)
      .attr('y', position.y)
      .attr('cx', position.center.x)
      .attr('cy', position.center.y)
      .attr('rx', position.radius)
      .attr('top', position.top)
      .attr('left', position.left)
      .attr('type', 'group')
      .attr('class', 'shape')
      .attr('right', position.right)
      .attr('width', position.width)
      .attr('height', position.height)
      .attr('bottom', position.bottom)
      .attr('transform', `rotate(${position.rotation}, ${position.center.x}, ${position.center.y})`)      

    selection.each(function () {
      group.node().appendChild(this)
    })

    return group
  }

  public ungroup(selection: Selection) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg: any = d3.selectAll('svg.ngx-canvas')

    const shapes = selection.selectAll('.shape')
    shapes.each(function () {
      svg.node().appendChild(this)
    })

    selection.remove()

    return shapes
  }
}

export type GroupCommand = 'GROUP' | 'UNGROUP'