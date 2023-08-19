import * as d3 from 'd3'
import { SHAPE, Shape } from '../shape/shape'

export class Chart extends Shape {
  public type: string = 'chart'

  constructor(args?: CHART) {
    super(args)
  };

  apply(parent: any) {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
      { name: "C", value: 15 },
      { name: "D", value: 25 },
      { name: "E", value: 30 }
    ];

    // Set up the SVG container dimensions
    const width = 400;
    const height = 300;

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, <any>d3.max(data, d => d.value)])
      .range([height, 0]);

    // Create bars
    parent.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: any) => <any>xScale(d.name))
      .attr("y", (d: any) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d: any) => height - yScale(d.value));

    // Add x-axis
    parent.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    parent.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));
    // this.el = parent.append('rect')
    //   .attr('x', !(this.stroke.width % 2) ? this.position.x : this.position.x + 0.5)
    //   .attr('y', !(this.stroke.width % 2) ? this.position.y : this.position.y + 0.5)
    //   .attr('id', this.id)
    //   .attr('rx', this.position.radius)
    //   .attr('cx', this.position.center.x)
    //   .attr('cy', this.position.center.y)
    //   .attr('top', this.position.top)
    //   .attr('fill', this.fill.color)
    //   .attr('left', this.position.left)
    //   .attr('class', 'shape')
    //   .attr('width', this.position.width)
    //   .attr('right', this.position.right)
    //   .attr('bottom', this.position.bottom)
    //   .attr('stroke', this.stroke.color)
    //   .attr('height', this.position.height)
    //   .attr('transform', `rotate(${this.position.rotation}, ${this.position.center.x}, ${this.position.center.y})`)
    //   .attr('fill-opacity', this.fill.opacity / 100)
    //   .attr('stroke-width', this.stroke.width)
    //   .attr('stroke-linecap', this.stroke.cap)
    //   .attr('stroke-opacity', this.stroke.opacity)
    // .attr('stroke-dasharray', this.stroke.style)
  }

  public update() {}
}

interface CHART extends SHAPE { }
