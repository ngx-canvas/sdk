import * as d3 from 'd3'

export class AlignerTool {
  private projectId = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public tops(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push(Number(shape.attr('top')))
    })

    const top: number = d3.min(items, d => d) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('top')) - top, 'vertical')
    })
  }

  public lefts(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push(Number(shape.attr('left')))
    })

    const left: number = d3.min(items, d => d) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('left')) - left, 'horizontal')
    })
  }

  public rights(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push(Number(shape.attr('right')))
    })

    const right: number = d3.max(items, d => d) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('right')) - right, 'horizontal')
    })
  }

  public bottoms(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push(Number(shape.attr('bottom')))
    })

    const bottom: number = d3.max(items, d => d) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('bottom')) - bottom, 'vertical')
    })
  }

  public sendToBack(): void {
    console.log('sendToBack')
  }

  public bringForward(): void {
    console.log('bringForward')
  }

  public sendBackward(): void {
    console.log('sendBackward')
  }

  public bringToFront(): void {
    console.log('bringToFront')
  }

  public absoluteCenters(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: { x: number, y: number, width: number, height: number }[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push({
        x: Number(shape.attr('x')),
        y: Number(shape.attr('y')),
        width: Number(shape.attr('width')),
        height: Number(shape.attr('height'))
      })
    })

    const meanCenterY: number = d3.mean(items, d => d.y + d.height / 2) || 0
    const meanCenterX: number = d3.mean(items, d => d.x + d.width / 2) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('cy')) - meanCenterY, 'vertical')
      coordinate(shape, Number(shape.attr('cx')) - meanCenterX, 'horizontal')
    })
  }

  public verticalCenters(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: { y: number, height: number }[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push({
        y: Number(shape.attr('y')),
        height: Number(shape.attr('height'))
      })
    })

    const meanCenterY: number = d3.mean(items, d => d.y + d.height / 2) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('cy')) - meanCenterY, 'vertical')
    })
  }

  public horizontalCenters(): void {
    const selection = d3.selectAll('.shape.selected')

    const items: { x: number, width: number }[] = []
    selection.each(function () {
      const shape = d3.select(this)
      items.push({
        x: Number(shape.attr('x')),
        width: Number(shape.attr('width'))
      })
    })

    const meanCenterX: number = d3.mean(items, d => d.x + d.width / 2) || 0

    selection.each(function () {
      const shape = d3.select(this)
      coordinate(shape, Number(shape.attr('cx')) - meanCenterX, 'horizontal')
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const coordinate = (shape: any, distance: number, direction: 'vertical' | 'horizontal') => {
  switch (direction) {
  case ('vertical'): {
    const y = Number(shape.attr('y'))
    const cy = Number(shape.attr('cy'))
    const top = Number(shape.attr('top'))
    const bottom = Number(shape.attr('bottom'))
    shape.attr('y', y - distance)
    shape.attr('cy', cy - distance)
    shape.attr('top', top - distance)
    shape.attr('bottom', bottom - distance)
    break
  }
  case ('horizontal'): {
    const x = Number(shape.attr('x'))
    const cx = Number(shape.attr('cx'))
    const left = Number(shape.attr('left'))
    const right = Number(shape.attr('right'))
    shape.attr('x', x - distance)
    shape.attr('cx', cx - distance)
    shape.attr('left', left - distance)
    shape.attr('right', right - distance)
    break
  }
  default:
    throw new Error('Direction not configured!')
  }
}

export const enum AlignCommand {
  TopEdges = 'TOP:EDGES',
  LeftEdges = 'LEFT:EDGES',
  RightEdges = 'RIGHT:EDGES',
  BottomEdges = 'BOTTOM:EDGES',
  AbsoluteCenters = 'ABSOLUTE:CENTERS',
  VerticalCenters = 'VERTICAL:CENTERS',
  HorizontalCenters = 'HORIZONTAL:CENTERS'
}
