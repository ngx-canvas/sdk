import * as d3 from 'd3'
import { globals } from '../../globals'
import { Position } from '../position/position'

export function aligner(position: any) {
  const { top, left, right, center, bottom } = position
  /*
    - CHECK LEFT TO LEFT
    - CHECK LEFT TO CENTER
    - CHECK LEFT TO RIGHT

    - CHECK CENTER TO LEFT
    - CHECK CENTER TO CENTER
    - CHECK CENTER TO RIGHT

    - CHECK RIGHT TO LEFT
    - CHECK RIGHT TO CENTER
    - CHECK RIGHT TO RIGHT

    - CHECK TOP TO TOP
    - CHECK TOP TO CENTER
    - CHECK TOP TO BOTTOM

    - CHECK CENTER TO TOP
    - CHECK CENTER TO CENTER
    - CHECK CENTER TO BOTTOM

    - CHECK BOTTOM TO TOP
    - CHECK BOTTOM TO CENTER
    - CHECK BOTTOM TO BOTTOM
  */

  let vertical = 0
  let horizontal = 0

  const L2L = globals.svg.selectAll(`.shape[left='${left}']`).size()
  if (L2L > 1) horizontal = left
  const L2C = globals.svg.selectAll(`.shape[left='${center.x}']`).size()
  if (L2C > 1) horizontal = center.x
  const L2R = globals.svg.selectAll(`.shape[left='${right}']`).size()
  if (L2R > 1) horizontal = right

  const C2L = globals.svg.selectAll(`.shape[center-x='${left}']`).size()
  if (C2L > 1) horizontal = left
  const C2C = globals.svg.selectAll(`.shape[center-x='${center.x}']`).size()
  if (C2C > 1) horizontal = center.x
  const C2R = globals.svg.selectAll(`.shape[center-x='${right}']`).size()
  if (C2R > 1) horizontal = right

  const R2L = globals.svg.selectAll(`.shape[right='${left}']`).size()
  if (R2L > 1) horizontal = left
  const R2C = globals.svg.selectAll(`.shape[right='${center.x}']`).size()
  if (R2C > 1) horizontal = center.x
  const R2R = globals.svg.selectAll(`.shape[right='${right}']`).size()
  if (R2R > 1) horizontal = right

  // const R2L = globals.svg.selectAll(`.shape[right='${right}']`).size()
  // const R2C = globals.svg.selectAll(`.shape[right='${center.x}']`).size()
  // const R2R = globals.svg.selectAll(`.shape[right='${right}']`).size()

  if (vertical > 0 && d3.selectAll('.align-vertical').size() === 0) {
    globals.svg.append('line')
      .attr('class', 'align-vertical')
      .attr('x1', 0)
      .attr('y1', vertical)
      .attr('x2', globals.svg.attr('width'))
      .attr('y2', vertical)
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('fill-opacity', 1)
      .attr('stroke-width', 1)
  } else {
    d3.selectAll('.align-vertical').remove()
  }

  if (horizontal > 0 && d3.selectAll('.align-horizontal').size() === 0) {
    globals.svg.append('line')
      .attr('class', 'align-horizontal')
      .attr('x1', horizontal)
      .attr('y1', 0)
      .attr('x2', horizontal)
      .attr('y2', globals.svg.attr('height'))
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('fill-opacity', 1)
      .attr('stroke-width', 1)
  } else {
    d3.selectAll('.align-horizontal').remove()
  }
}