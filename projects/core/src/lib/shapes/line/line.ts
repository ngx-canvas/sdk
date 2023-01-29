import { Point } from '../../utilities/point/point';
import { SHAPE, Shape } from '../shape/shape';

export class Line extends Shape {

	public type: string = 'line';
	public points: Point[] = [];

	constructor(args?: LINE) {
		super(args);
		if (typeof (args) != 'undefined' && args != null) {
			if (Array.isArray(args.points)) {
				this.points = args.points;
			};
		};
	};

  apply(parent: any) {
    this.el = parent.append('line')
      .attr('id', this.id)
      .attr('x1', !(this.stroke.width % 2) ? this.points[0].x : this.points[0].x + 0.5)
      .attr('y1', !(this.stroke.width % 2) ? this.points[0].y : this.points[0].y + 0.5)
      .attr('x2', !(this.stroke.width % 2) ? this.points[1].x : this.points[1].x + 0.5)
      .attr('y2', !(this.stroke.width % 2) ? this.points[1].y : this.points[1].y + 0.5)
      .attr('fill', this.fill.color)
      .attr('stroke', this.stroke.color)
      .attr('fill-opacity', this.fill.opacity)
      .attr('stroke-width', this.stroke.width)
      .attr('stroke-linecap', this.stroke.cap)
      .attr('stroke-opacity', this.stroke.opacity)
  }

}

interface LINE extends SHAPE {
	points?: Point[];
}