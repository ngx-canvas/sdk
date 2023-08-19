import * as d3 from 'd3'
import { Point } from '../../utilities'
import { SHAPE, Shape } from '../shape/shape'

export class Curve extends Shape {
  public type: string = 'curve'
  public points: Point[] = []

  constructor(args?: CURVE) {
    super(args)

    if (args?.points) this.points = args?.points.map(o => new Point(o))
  }

  apply(parent: any) {
    const data = [
      { x: 50, y: 150 },
      { x: 100, y: 50 },
      { x: 150, y: 200 },
      { x: 200, y: 100 },
      { x: 250, y: 150 },
    ];

    // Create an SVG element
    const svg = d3.select("svg");

    // Define a curve generator
    const curveGenerator: any = d3.line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(d3.curveStep); // You can change the curve type

    // Create a path element using the curve generator
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", curveGenerator);
    // let d = 'M'
    // this.points.forEach((point, index) => {
    //   d = d + ' '
    //   switch(index) {
    //     case 0:
    //       d = d + `${point.x} ${point.y}`
    //       break
    //     case 1:
    //       d = d + `C ${point.x} ${point.y},`
    //       break
    //     case 2:
    //     case 3:
    //       d = d + `${point.x} ${point.y},`
    //       break
    //   }
    // })

    // this.el = parent.append('path')
    //   .attr('d', d)
    //   .attr('x', this.position.x)
    //   .attr('y', this.position.y)
    //   .attr('id', this.id)
    //   .attr('cx', this.position.center.x)
    //   .attr('cy', this.position.center.y)
    //   .attr('top', this.position.top)
    //   .attr('fill', this.fill.color)
    //   .attr('left', this.position.left)
    //   .attr('class', 'shape')
    //   .attr('right', this.position.right)
    //   .attr('bottom', this.position.bottom)
    //   .attr('stroke', this.stroke.color)
    //   .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
    //   .attr('fill-opacity', this.fill.opacity / 100)
    //   .attr('stroke-width', this.stroke.width)
    //   .attr('stroke-linecap', this.stroke.cap)
    //   .attr('stroke-opacity', this.stroke.opacity)
  }

  public update() {

  }
}

interface CURVE extends SHAPE {
  points: Point[]
}
