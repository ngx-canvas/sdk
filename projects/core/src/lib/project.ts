import * as d3 from 'd3';
import { EventEmitter } from 'events';

import { Fill } from './utilities/fill';
import { Grid } from './utilities/grid';

import { BehaviorSubject } from 'rxjs';

/* --- SHAPES --- */
import { Text } from './shapes/text';
import { Line } from './shapes/line';
import { Group } from './shapes/group';
import { Vector } from './shapes/vector';
import { Button } from './shapes/button';
import { Circle } from './shapes/circle';
import { Ellipse } from './shapes/ellipse';
import { Polygon } from './shapes/polygon';
import { Polyline } from './shapes/polyline';
import { Rectangle } from './shapes/rectangle';
import { CubicBezierCurve } from './shapes/cubic-bezier-curve';
import { QuadraticBezierCurve } from './shapes/quadratic-bezier-curve';
import { EllipticalBezierCurve } from './shapes/elliptical-bezier-curve';

export class Project extends EventEmitter {

    public moving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public holding: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public grid: Grid = new Grid();
    public fill: Fill = new Fill();
    public width: number = 600;
    public height: number = 600;
    public margin: number = 0;
    public editing: boolean;

    private svg: any;
    private data: any[] = [];
    private page: any;
    private defs: any;

    constructor(reference: string) {
        super();
        this.initialize(reference);
    };

    private async initialize(reference) {
        this.svg = await d3.select(reference).append('svg');
        await this.svg.attr('fill', '#E0E0E0')

        this.page = await this.svg.append('rect')
            .attr('x', this.margin)
            .attr('y', this.margin)
            .attr('fill', '#FFFFFF')
            .attr('width', this.width)
            .attr('height', this.height);

        this.defs = await this.svg.append('defs');
        await this.defs.append('pattern')
            .attr('id', 'page-grid-small')
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternUnits', 'userSpaceOnUse')
            .append('path')
            .attr('d', ['M', 10, 0, 'L', 0, 0, 0, 10].join(' '))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 0.5)

        let pattern = await this.defs.append('pattern')
            .attr('id', 'page-grid-large')
            .attr('width', 10 * 10)
            .attr('height', 10 * 10)
            .attr('patternUnits', 'userSpaceOnUse')

        await pattern.append('rect')
            .attr('width', 10 * 10)
            .attr('height', 10 * 10)
            .attr('fill', 'url(#page-grid-small)')

        await pattern.append('path')
            .attr('d', ['M', 100, 0, 'L', 0, 0, 0, 100].join(' '))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)

        await this.svg.append('rect')
            .attr('id', 'page-grid')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill-opacity', 0.5)
            .attr('fill', 'url(#page-grid-large)');

        await this.updatePage();

        this.emit('ready');
    }

    public updatePage() {
        this.svg.attr('width', this.width + (this.margin * 2));
        this.svg.attr('height', this.height + (this.margin * 2));
        this.page.attr('x', this.margin);
        this.page.attr('y', this.margin);
        this.page.attr('width', this.width);
        this.page.attr('height', this.height);
    };

    public reset() {
        this.import([]);
    };

    public export() {
        let json = JSON.parse(JSON.stringify(this.data));
        return json;
    };

    public destroy() {
        this.data.splice(0, this.data.length);
    };

    public deselect() {
        this.data.map(item => {
            item.selected = false;
        });
    };

    public download() {
        debugger
    };

    private draw() {
        this.data.map(item => {
            if (item instanceof Line) {
                this.line(item);
            };
            if (item instanceof Text) {
                this.text(item);
            };
            if (item instanceof Group) {
                this.group(item);
            };
            if (item instanceof Circle) {
                this.circle(item);
            };
            if (item instanceof Button) {
                this.button(item);
            };
            if (item instanceof Vector) {
                this.vector(item);
            };
            if (item instanceof Ellipse) {
                this.ellipse(item);
            };
            if (item instanceof Polygon) {
                this.polygon(item);
            };
            if (item instanceof Polyline) {
                this.polyline(item);
            };
            if (item instanceof Rectangle) {
                this.rectangle(item);
            };
        });
    };

    private text(args: Text) {
        const shape = this.svg.append('text')
            .attr('x', args.position.x)
            .attr('y', args.position.y)
            .attr('id', args.id)
            .text('This is parkour')
            .attr('fill', args.font.color)
            .attr('font-size', args.font.size)
            .attr('font-style', args.font.style)
            .attr('font-family', args.font.family)
            .attr('fill-opacity', args.font.opacity)
        // .attr('font-weight', args.font.weigth)
    };

    private line(args: Line) {
        const shape = this.svg.append('line')
            .attr('id', args.id)
            .attr('x1', args.points[0].x)
            .attr('y1', args.points[0].y)
            .attr('x2', args.points[1].x)
            .attr('y2', args.points[1].y)
            .attr('fill', args.fill.color)
            .attr('stroke', args.stroke.color)
            .attr('fill-opacity', args.fill.opacity)
            .attr('stroke-width', args.stroke.width)
            .attr('stroke-linecap', args.stroke.cap)
            .attr('stroke-opacity', args.stroke.opacity)
    };

    private group(args: Group) { };

    private vector(args: Vector) { };

    private button(args: Button) { };

    private circle(args: Circle) { };

    private ellipse(args: Ellipse) { };

    private polygon(args: Polygon) { };

    private polyline(args: Polyline) { };

    private rectangle(args: Rectangle) { };

    private cubicBezierCurve(args: CubicBezierCurve) { };

    private quadraticBezierCurve(args: QuadraticBezierCurve) { };

    private ellipticalBezierCurve(args: EllipticalBezierCurve) { };

    // private group(item: Group) {
    //     item.children.map(child => {
    //         if (child instanceof Line) {
    //             this.line(child);
    //         };
    //         if (child instanceof Text) {
    //             this.text(child);
    //         };
    //         if (child instanceof Group) {
    //             this.group(child);
    //         };
    //         if (child instanceof Circle) {
    //             this.circle(child);
    //         };
    //         if (child instanceof Button) {
    //             this.button(child);
    //         };
    //         if (child instanceof Vector) {
    //             this.vector(child);
    //         };
    //         if (child instanceof Ellipse) {
    //             this.ellipse(child);
    //         };
    //         if (child instanceof Polygon) {
    //             this.polygon(child);
    //         };
    //         if (child instanceof Polyline) {
    //             this.polyline(child);
    //         };
    //         if (child instanceof Rectangle) {
    //             this.rectangle(child);
    //         };
    //     });
    // };

    // private circle(item: Circle) {
    //     const shape = this.svg.append('circle')
    //         .attr('r', item.position.radius)
    //         .attr('id', item.id)
    //         .attr('cx', item.position.center.x)
    //         .attr('cy', item.position.center.y)
    //         .attr('fill', item.fill.color)
    //         .attr('stroke', item.stroke.color)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    //     // .attr('stroke-dasharray', item.stroke.style)
    // };

    // private button(item: Button) {
    //     const shape = this.svg.append('rect')
    //         .attr('x', !(item.stroke.width % 2) ? item.position.x : item.position.x + 0.5)
    //         .attr('y', !(item.stroke.width % 2) ? item.position.y : item.position.y + 0.5)
    //         .attr('id', item.id)
    //         .attr('rx', item.position.radius)
    //         .attr('fill', item.fill.color)
    //         .attr('width', item.position.width)
    //         .attr('stroke', item.stroke.color)
    //         .attr('height', item.position.height)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    //     // .attr('stroke-dasharray', item.stroke.style)
    // };

    // private vector(item: Vector) {
    //     const shape = this.svg.append('image')
    //         .attr('x', item.position.x)
    //         .attr('y', item.position.y)
    //         .attr('id', item.id)
    //         .attr('href', item.src)
    //         .attr('width', item.position.width)
    //         .attr('height', item.position.height)
    // };

    // private polygon(item: Polygon) {
    //     const shape = this.svg.append('polygon')
    //         .attr('id', item.id)
    //         .attr('fill', item.fill.color)
    //         .attr('points', item.points.map(o => [o.x, o.y].join(',')).join(' '))
    //         .attr('stroke', item.stroke.color)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    // };

    // private ellipse(item: Ellipse) {
    //     const shape = this.svg.append('ellipse')
    //         .attr('cx', item.position.center.x)
    //         .attr('cy', item.position.center.y)
    //         .attr('rx', item.position.width / 2)
    //         .attr('ry', item.position.height / 2)
    //         .attr('id', item.id)
    //         .attr('fill', item.fill.color)
    //         .attr('stroke', item.stroke.color)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    //     // .attr('stroke-dasharray', item.stroke.style)
    // };

    // private polyline(item: Polyline) {
    //     const shape = this.svg.append('polyline')
    //         .attr('id', item.id)
    //         .attr('fill', item.fill.color)
    //         .attr('points', item.points.map(o => [o.x, o.y].join(',')).join(' '))
    //         .attr('stroke', item.stroke.color)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    // };

    // private rectangle(item: Rectangle) {
    //     const shape = this.svg.append('rect')
    //         .attr('x', !(item.stroke.width % 2) ? item.position.x : item.position.x + 0.5)
    //         .attr('y', !(item.stroke.width % 2) ? item.position.y : item.position.y + 0.5)
    //         .attr('id', item.id)
    //         .attr('rx', item.position.radius)
    //         .attr('fill', item.fill.color)
    //         .attr('width', item.position.width)
    //         .attr('stroke', item.stroke.color)
    //         .attr('height', item.position.height)
    //         .attr('fill-opacity', item.fill.opacity)
    //         .attr('stroke-width', item.stroke.width)
    //         .attr('stroke-linecap', item.stroke.cap)
    //         .attr('stroke-opacity', item.stroke.opacity)
    //     // .attr('stroke-dasharray', item.stroke.style)
    // };

    private ImportLine(item) {
        return new Line(item);
    };

    private ImportText(item) {
        return new Text(item);
    };

    private ImportGroup(item) {
        item.children = item.children.map(child => {
            switch (child.type) {
                case ('line'):
                    child = this.ImportLine(child);
                    break;
                case ('text'):
                    child = this.ImportText(child);
                    break;
                case ('group'):
                    child = this.ImportGroup(child);
                    break;
                case ('circle'):
                    child = this.ImportCircle(child);
                    break;
                case ('button'):
                    child = this.ImportButton(child);
                    break;
                case ('vector'):
                    child = this.ImportVector(child);
                    break;
                case ('polygon'):
                    child = this.ImportPolygon(child);
                    break;
                case ('rectangle'):
                    child = this.ImportRectangle(child);
                    break;
            };
            return child;
        });

        return new Group(item);
    };

    private ImportCircle(item) {
        return new Circle(item);
    };

    private ImportButton(item) {
        return new Button(item);
    };

    private ImportVector(item) {
        return new Vector(item);
    };

    private ImportEllipse(item) {
        return new Ellipse(item);
    };

    private ImportPolygon(item) {
        return new Polygon(item);
    };

    private ImportPolyline(item) {
        return new Polyline(item);
    };

    private ImportRectangle(item) {
        return new Rectangle(item);
    };

    public async import(json: any[]) {
        this.data.map(item => d3.select(['#', item.id].join('')).remove());

        this.data = [];

        json.map(item => {
            switch (item.type) {
                case ('line'):
                    item = this.ImportLine(item);
                    break;
                case ('text'):
                    item = this.ImportText(item);
                    break;
                case ('group'):
                    item = this.ImportGroup(item);
                    break;
                case ('circle'):
                    item = this.ImportCircle(item);
                    break;
                case ('button'):
                    item = this.ImportButton(item);
                    break;
                case ('vector'):
                    item = this.ImportVector(item);
                    break;
                case ('ellipse'):
                    item = this.ImportEllipse(item);
                    break;
                case ('polygon'):
                    item = this.ImportPolygon(item);
                    break;
                case ('polyline'):
                    item = this.ImportPolyline(item);
                    break;
                case ('rectangle'):
                    item = this.ImportRectangle(item);
                    break;
            };

            this.data.push(item);
        });

        this.draw();

        return true;
    };

}