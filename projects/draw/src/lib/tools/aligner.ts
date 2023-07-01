import * as d3 from 'd3'

export class AlignerTool {
  public tops(): void {
    const selection = d3.selectAll('svg.ngx-canvas .shape.selected')

    let top = Infinity
    selection.each(function () {
      const shape = d3.select(this)
      let cTop = Number(shape.attr('top'))
      if (cTop < top) top = cTop
    }).each(function () {
      const shape = d3.select(this)
      const cTop = Number(shape.attr('top'))
      const found = top === cTop
      if (!found) {
        shape.attr('y', Number(shape.attr('y')) + top - cTop)
        shape.attr('top', Number(shape.attr('top')) + top - cTop)
        shape.attr('bottom', Number(shape.attr('bottom')) + top - cTop)
      }
    })
  }

  public lefts(): void {
    const selection = d3.selectAll('svg.ngx-canvas .shape.selected')

    let left = Infinity
    selection.each(function () {
      const shape = d3.select(this)
      let cLeft = Number(shape.attr('left'))
      if (cLeft < left) left = cLeft
    }).each(function () {
      const shape = d3.select(this)
      const cLeft = Number(shape.attr('left'))
      const found = left === cLeft
      if (!found) {
        shape.attr('x', Number(shape.attr('x')) + left - cLeft)
        shape.attr('left', Number(shape.attr('left')) + left - cLeft)
        shape.attr('right', Number(shape.attr('right')) + left - cLeft)
      }
    })
  }

  public rights(): void {
    const selection = d3.selectAll('svg.ngx-canvas .shape.selected')

    let right = -Infinity
    selection.each(function () {
      const shape = d3.select(this)
      let cRight = Number(shape.attr('right'))
      if (cRight > right) right = cRight
    }).each(function () {
      const shape = d3.select(this)
      const cRight = Number(shape.attr('right'))
      const found = right === cRight
      if (!found) {
        shape.attr('x', Number(shape.attr('x')) + right - cRight)
        shape.attr('left', Number(shape.attr('left')) + right - cRight)
        shape.attr('right', Number(shape.attr('right')) + right - cRight)
      }
    })
  }

  public bottoms(): void {
    const selection = d3.selectAll('svg.ngx-canvas .shape.selected')

    let bottom = -Infinity
    selection.each(function () {
      const shape = d3.select(this)
      let cBottom = Number(shape.attr('bottom'))
      if (cBottom > bottom) bottom = cBottom
    }).each(function () {
      const shape = d3.select(this)
      const cBottom = Number(shape.attr('bottom'))
      const found = bottom === cBottom
      if (!found) {
        shape.attr('y', Number(shape.attr('y')) + bottom - cBottom)
        shape.attr('top', Number(shape.attr('top')) + bottom - cBottom)
        shape.attr('bottom', Number(shape.attr('bottom')) + bottom - cBottom)
      }
    })
  }

  public sendToBack(): void { }

  public bringForward(): void { }

  public sendBackward(): void { }

  public bringToFront(): void { }

  public absoluteCenters(): void { }

  public verticalCenters(): void {
    const selection = d3.selectAll('svg.ngx-canvas .shape.selected')

    let top = Infinity
    let bottom = -Infinity
    selection.each(function () {
      const shape = d3.select(this)
      let cTop = Number(shape.attr('top'))
      if (cTop < top) top = cTop
      let cBottom = Number(shape.attr('bottom'))
      if (cBottom > bottom) bottom = cBottom
    }).each(function () {
      const shape = d3.select(this)
      const center = top - bottom
      const difference = center + Number(shape.attr('cy'))
      const found = center === Number(shape.attr('cy'))
      console.log(center, Number(shape.attr('cy')))
      if (!found) {
        shape.attr('y', Number(shape.attr('y')) - difference)
        shape.attr('cy', Number(shape.attr('cy')) - difference)
        shape.attr('top', Number(shape.attr('top')) - difference)
        shape.attr('bottom', Number(shape.attr('bottom')) - difference)
      }
    })
  }

  public horizontalCenters(): void { }
}
