import * as d3 from 'd3'
import { SHAPE, Shape } from '../shape/shape'
import { Selection } from '@libs/common'

export class Chart extends Shape {
  readonly type: string = 'chart'

  constructor(args?: CHART) {
    super(args)
  }

  apply(parent: Selection) {
    this.el = parent.append('g')
      .attr('id', this.id)
      .attr('type', this.type)
      .attr('class', 'shape')
    this.update()
  }

  update(config?: CHART) {
    if (config) Object.assign(this, config)
    this.el
      .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
      .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
      .attr('rx', this.position.radius)
      .attr('cx', this.position.center.x)
      .attr('cy', this.position.center.y)
      .attr('top', this.position.top)
      .attr('fill', this.fill.color)
      .attr('left', this.position.left)
      .attr('width', this.position.width)
      .attr('right', this.position.right)
      .attr('bottom', this.position.bottom)
      .attr('stroke', this.stroke.color)
      .attr('height', this.position.height)
      .attr('transform', `rotate(${this.position.rotation},${this.position.center.x},${this.position.center.y}) translate(${this.position.x},${this.position.y})`)
      .attr('fill-opacity', this.fill.opacity / 100)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
      .classed('selected', this.selected)
    // .attr('stroke-dasharray', this.stroke.style)

    const margin = { top: 15, left: 15, right: 15, bottom: 15 }
    
    const xScale = d3.scaleBand()
      .domain(this.data.map((d: any) => d.name))
      .range([margin.left, this.position.width - (margin.left + margin.right)])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, <any>d3.max(this.data, (d: any) => d.value)])
      .range([this.position.height - (margin.top + margin.bottom), margin.top])

    this.el.selectAll('.bar').remove()
    this.el.selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => <any>xScale(d.name))
      .attr('y', (d: any) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: any) => (this.position.height - (margin.top + margin.bottom)) - yScale(d.value))
      .attr('transform', `translate(${margin.left},0)`)

    // Add x-axis
    this.el.selectAll('.x-axis').remove()
    this.el.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left},${this.position.height - (margin.top + margin.bottom)})`)
      .call(d3.axisBottom(xScale))

    // Add y-axis
    this.el.selectAll('.y-axis').remove()
    this.el.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left + margin.right},0)`)
      .call(d3.axisLeft(yScale))
  }
}

type CHART = SHAPE
