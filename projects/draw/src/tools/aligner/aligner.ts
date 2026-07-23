import { min, max, mean } from 'd3-array'
import { select, selectAll } from 'd3-selection'

export class AlignerTool {
  private projectId = ''

  constructor(projectId: string) {
    this.projectId = projectId
  }

  public tops(): void {
    const selection = selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = select(this)
      items.push(Number(shape.attr('top')))
    })

    const top: number = min(items, d => d) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('top')) - top, 'vertical')
    })
  }

  public lefts(): void {
    const selection = selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = select(this)
      items.push(Number(shape.attr('left')))
    })

    const left: number = min(items, d => d) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('left')) - left, 'horizontal')
    })
  }

  public rights(): void {
    const selection = selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = select(this)
      items.push(Number(shape.attr('right')))
    })

    const right: number = max(items, d => d) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('right')) - right, 'horizontal')
    })
  }

  public bottoms(): void {
    const selection = selectAll('.shape.selected')

    const items: number[] = []
    selection.each(function () {
      const shape = select(this)
      items.push(Number(shape.attr('bottom')))
    })

    const bottom: number = max(items, d => d) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('bottom')) - bottom, 'vertical')
    })
  }

  /** Move the selected shapes behind all their siblings. */
  public sendToBack(): void {
    selectAll('.shape.selected').lower()
  }

  /** Move the selected shapes forward one step in paint order. */
  public bringForward(): void {
    // Process front-to-back and skip already-selected neighbours so a
    // contiguous multi-selection moves as a block instead of oscillating.
    const nodes = selectAll<Element, unknown>('.shape.selected').nodes()
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      const next = node.nextElementSibling
      if (next && !next.classList.contains('selected') && node.parentNode) {
        node.parentNode.insertBefore(next, node)
      }
    }
  }

  /** Move the selected shapes backward one step in paint order. */
  public sendBackward(): void {
    // Process back-to-front and skip already-selected neighbours so a
    // contiguous multi-selection moves as a block instead of oscillating.
    const nodes = selectAll<Element, unknown>('.shape.selected').nodes()
    for (const node of nodes) {
      const prev = node.previousElementSibling
      if (prev && !prev.classList.contains('selected') && node.parentNode) {
        node.parentNode.insertBefore(node, prev)
      }
    }
  }

  /** Move the selected shapes in front of all their siblings. */
  public bringToFront(): void {
    selectAll('.shape.selected').raise()
  }

  public absoluteCenters(): void {
    const selection = selectAll('.shape.selected')

    const items: { x: number, y: number, width: number, height: number }[] = []
    selection.each(function () {
      const shape = select(this)
      items.push({
        x: Number(shape.attr('x')),
        y: Number(shape.attr('y')),
        width: Number(shape.attr('width')),
        height: Number(shape.attr('height'))
      })
    })

    const meanCenterY: number = mean(items, d => d.y + d.height / 2) || 0
    const meanCenterX: number = mean(items, d => d.x + d.width / 2) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('cy')) - meanCenterY, 'vertical')
      coordinate(shape, Number(shape.attr('cx')) - meanCenterX, 'horizontal')
    })
  }

  public verticalCenters(): void {
    const selection = selectAll('.shape.selected')

    const items: { y: number, height: number }[] = []
    selection.each(function () {
      const shape = select(this)
      items.push({
        y: Number(shape.attr('y')),
        height: Number(shape.attr('height'))
      })
    })

    const meanCenterY: number = mean(items, d => d.y + d.height / 2) || 0

    selection.each(function () {
      const shape = select(this)
      coordinate(shape, Number(shape.attr('cy')) - meanCenterY, 'vertical')
    })
  }

  public horizontalCenters(): void {
    const selection = selectAll('.shape.selected')

    const items: { x: number, width: number }[] = []
    selection.each(function () {
      const shape = select(this)
      items.push({
        x: Number(shape.attr('x')),
        width: Number(shape.attr('width'))
      })
    })

    const meanCenterX: number = mean(items, d => d.x + d.width / 2) || 0

    selection.each(function () {
      const shape = select(this)
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
