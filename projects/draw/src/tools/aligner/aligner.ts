import { mean } from 'd3-array'
import { select } from 'd3-selection'
import { boundsOf, num } from '@libs/common'
import { translation, transformShape } from '../select/geometry'

/**
 * This will initialise the aligner tool. This tool will arrange selected shapes about one anothers positions
 *
 * @example
 * ```ts
 * import { AlignerTool } from '@ngx-canvas/draw';
 *
 * const aligner = new AlignerTool('canvas');
 * ```
 */
export class AlignerTool {
  private projectId = ''

  /** Every selected shape at the top level of this project's canvas. */
  private selected() {
    return select(`#${this.projectId}`).selectAll<Element, unknown>('svg.ngx-canvas > .shape.selected')
  }

  constructor(projectId: string) {
    this.projectId = projectId
  }

  /**
   * Move every selected shape so that `edge` lands on `target`.
   *
   * Everything goes through {@link transformShape}, which rewrites whichever
   * attributes each element type actually renders from. Writing the bookkeeping
   * box alone — which this tool used to do — moves a `rect` and leaves a
   * `polyline`, `path` or group behind.
   */
  private alignTo(edge: 'top' | 'left' | 'right' | 'bottom', target: number): void {
    const vertical = edge === 'top' || edge === 'bottom'

    this.selected().each(function () {
      const shape = select(this)
      const delta = target - num(shape, edge)
      transformShape(shape, vertical ? translation(0, delta) : translation(delta, 0))
    })
  }

  public tops(): void {
    this.alignTo('top', boundsOf(this.selected()).top)
  }

  public lefts(): void {
    this.alignTo('left', boundsOf(this.selected()).left)
  }

  public rights(): void {
    const { left, width } = boundsOf(this.selected())
    this.alignTo('right', left + width)
  }

  public bottoms(): void {
    const { top, height } = boundsOf(this.selected())
    this.alignTo('bottom', top + height)
  }

  /** Move the selected shapes behind all their siblings. */
  public sendToBack(): void {
    this.selected().lower()
  }

  /** Move the selected shapes forward one step in paint order. */
  public bringForward(): void {
    // Process front-to-back and skip already-selected neighbours so a
    // contiguous multi-selection moves as a block instead of oscillating.
    const nodes = this.selected().nodes()
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      if (!node) continue
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
    const nodes = this.selected().nodes()
    for (const node of nodes) {
      const prev = node.previousElementSibling
      if (prev && !prev.classList.contains('selected') && node.parentNode) {
        node.parentNode.insertBefore(node, prev)
      }
    }
  }

  /** Move the selected shapes in front of all their siblings. */
  public bringToFront(): void {
    this.selected().raise()
  }

  /**
   * The mean centre of the selection, read from the bookkeeping edges rather than
   * `cx`/`cy` so a shape whose centre attributes lag its box still lands right.
   */
  private meanCenter(): { x: number, y: number } {
    const centers: { x: number, y: number }[] = []
    this.selected().each(function () {
      const shape = select(this)
      centers.push({
        x: (num(shape, 'left') + num(shape, 'right')) / 2,
        y: (num(shape, 'top') + num(shape, 'bottom')) / 2
      })
    })

    return {
      x: mean(centers, (d) => d.x) ?? 0,
      y: mean(centers, (d) => d.y) ?? 0
    }
  }

  /** Move every selected shape so its centre lands on the selection's mean centre. */
  private centerOn({ x, y }: { x?: number, y?: number }): void {
    this.selected().each(function () {
      const shape = select(this)
      const dx = x === undefined ? 0 : x - (num(shape, 'left') + num(shape, 'right')) / 2
      const dy = y === undefined ? 0 : y - (num(shape, 'top') + num(shape, 'bottom')) / 2
      transformShape(shape, translation(dx, dy))
    })
  }

  public absoluteCenters(): void {
    const { x, y } = this.meanCenter()
    this.centerOn({ x, y })
  }

  public verticalCenters(): void {
    this.centerOn({ y: this.meanCenter().y })
  }

  public horizontalCenters(): void {
    this.centerOn({ x: this.meanCenter().x })
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
