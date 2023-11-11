import * as d3 from 'd3'
import { Point } from '../../utilities'
import { Selection } from '@libs/common'
import { Shape, SHAPE } from '../shape/shape'

type CurveMode = 'basis' | 'basis-open' | 'basis-closed' | 'bump-x' | 'bump-y' | 'bundle' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'catmull-rom' | 'catmull-rom-open' | 'catmull-rom-closed' | 'linear' | 'linear-closed' | 'monotone-x' | 'monotone-y' | 'natural' | 'step' | 'step-after' | 'step-before'

export class Curve extends Shape {
  readonly type: string = 'curve'
  
  public mode: CurveMode = 'basis'
  public points: Point[] = []

  constructor(args?: CURVE) {
    super(args)

    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply(parent: Selection) {
    this.el = parent.append('path')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: CURVE) {
    if (config) Object.assign(this, config)
    this.position.fromPoints(this.points)
    this.el
      .datum(this.points)
      .attr('d', d3.line().x((d: any) => d.x).y((d: any) => d.y).curve(this._mode()))
      .attr('x', this.position.x)
      .attr('y', this.position.y)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('right', this.position.right)
      .attr('width', this.position.width)
      .attr('height', this.position.height)
      .attr('bottom', this.position.bottom)
      .attr('stroke', this.stroke.color)
      .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }

  private _mode() {
    switch (this.mode) {
    case 'basis':
      return d3.curveBasis
    case 'basis-open':
      return d3.curveBasisOpen
    case 'basis-closed':
      return d3.curveBasisClosed
    case 'bump-x':
      return d3.curveBumpX
    case 'bump-y':
      return d3.curveBumpY
    case 'bundle':
      return d3.curveBundle
    case 'cardinal':
      return d3.curveCardinal
    case 'cardinal-open':
      return d3.curveCardinalOpen
    case 'cardinal-closed':
      return d3.curveCardinalClosed
    case 'catmull-rom':
      return d3.curveCatmullRom
    case 'catmull-rom-open':
      return d3.curveCatmullRomOpen
    case 'catmull-rom-closed':
      return d3.curveCatmullRomClosed
    case 'linear':
      return d3.curveLinear
    case 'linear-closed':
      return d3.curveLinearClosed
    case 'monotone-x':
      return d3.curveMonotoneX
    case 'monotone-y':
      return d3.curveMonotoneY
    case 'natural':
      return d3.curveNatural
    case 'step':
      return d3.curveStep
    case 'step-after':
      return d3.curveStepAfter
    case 'step-before':
      return d3.curveStepBefore
    default:
      return d3.curveBasis
    }
  }
}

interface CURVE extends SHAPE {
  mode: CurveMode
  points: Point[]
}
