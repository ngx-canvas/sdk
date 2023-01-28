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

}

interface LINE extends SHAPE {
	points?: Point[];
}