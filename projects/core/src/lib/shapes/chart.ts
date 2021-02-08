import { data } from '../data';
import { ObjectId } from '../id';
import { FILL, Fill } from '../utilities/fill';
import { Font, FONT } from '../utilities/font';
import { Point, POINT } from '../utilities/point';
import { SERIES, Series } from '../utilities/series';
import { EVENTS, Events } from '../utilities/events';
import { STROKE, Stroke } from '../utilities/stroke';
import { Position, POSITION } from '../utilities/position';

export class Chart extends Events {

    readonly type: string = 'chart';

    public id: string = ObjectId();
    public min: number = 0;
    public max: number = 100;
    public data: any = {};
    public name: string = '';
    public font: FONT = new Font();
    public fill: FILL = new Fill();
    public labels: number[] | string[] = [];
    public series: SERIES[] = [];
    public hidden: boolean = false;
    public stroke: STROKE = new Stroke();
    public position: POSITION = new Position();
    public selected: boolean = false;
    public dragging: boolean = false;

    constructor(chart?: CHART, skip?: boolean) {
        super();

        this.set(chart);

        if (!skip) {
            data.push(this);
        };

        this.bounds();
    };

    public bounds() {
        this.position.top = this.position.y;
        this.position.left = this.position.x;
        this.position.right = this.position.left + this.position.width;
        this.position.bottom = this.position.top + this.position.height;
        this.position.center = new Point({
            'x': this.position.x + (this.position.width / 2),
            'y': this.position.y + (this.position.height / 2)
        });
    };

    public set(chart: CHART) {
        if (typeof (chart) != 'undefined' && chart != null) {
            if (typeof (chart.id) == 'string') {
                this.id = chart.id;
            };
            if (typeof (chart.name) == 'string') {
                this.name = chart.name;
            };
            if (typeof (chart.hidden) != "undefined") {
                this.hidden = chart.hidden;
            };
            if (Array.isArray(chart.labels)) {
                this.labels = chart.labels;
            };
            if (Array.isArray(chart.series)) {
                this.series = chart.series.map(series => new Series(series));
            };
            if (typeof (chart.data) != "undefined" && chart.data != null) {
                this.data = chart.data;
            };
            if (typeof (chart.fill) != 'undefined' && chart.fill != null) {
                this.fill = new Fill(chart.fill);
            };
            if (typeof (chart.font) != 'undefined' && chart.font != null) {
                this.font = new Font(chart.font);
            };
            if (typeof (chart.stroke) != 'undefined' && chart.stroke != null) {
                this.stroke = new Stroke(chart.stroke);
            };
            if (typeof (chart.position) != 'undefined' && chart.position != null) {
                this.position = new Position(chart.position);
            };
        };
    };

    public move(point: POINT) {
        this.position.x = point.x - (this.position.width / 2);
        this.position.y = point.y - (this.position.height / 2);
        this.position.top = this.position.y;
        this.position.left = this.position.x;
        this.position.right = point.x + (this.position.width / 2);
        this.position.center = point;
        this.position.bottom = point.y + (this.position.height / 2);
    };

    public hit(point: POINT, radius?: number) {
        if (typeof (radius) != "undefined") {
            radius = 0;
        };
        let hit: boolean = true;
        if (point.x < this.position.x - radius) {
            hit = false;
        };
        if (point.x > this.position.x + this.position.width + radius) {
            hit = false;
        };
        if (point.y < this.position.y - radius) {
            hit = false;
        };
        if (point.y > this.position.y + this.position.height + radius) {
            hit = false;
        };
        return hit;
    };

    public near(point: POINT, radius?: number) {
        if (typeof (radius) == "undefined") {
            radius = 0;
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.top
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.top - radius <= point.y && this.position.top + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.top
            });
        };
        if (this.position.left - radius <= point.x && this.position.left + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.left,
                'y': this.position.bottom
            });
        };
        if (this.position.right - radius <= point.x && this.position.right + radius >= point.x && this.position.bottom - radius <= point.y && this.position.bottom + radius >= point.y) {
            return new Point({
                'x': this.position.right,
                'y': this.position.bottom
            });
        };
        return false;
    };

    public resize(point: POINT, current: POINT) {
        if (this.position.x == point.x && this.position.y == point.y) {
            this.position.x = this.position.x - (point.x - current.x);
            this.position.y = this.position.y - (point.y - current.y);
            this.position.width = this.position.width + (point.x - current.x);
            this.position.height = this.position.height + (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y == point.y) {
            this.position.y = this.position.y - (point.y - current.y);
            this.position.width = this.position.width - (point.x - current.x);
            this.position.height = this.position.height + (point.y - current.y);
        };
        if (this.position.x == point.x && this.position.y + this.position.height == point.y) {
            this.position.x = this.position.x - (point.x - current.x);
            this.position.width = this.position.width + (point.x - current.x);
            this.position.height = this.position.height - (point.y - current.y);
        };
        if (this.position.x + this.position.width == point.x && this.position.y + this.position.height == point.y) {
            this.position.width = this.position.width - (point.x - current.x);
            this.position.height = this.position.height - (point.y - current.y);
        };
        if (this.position.width < 0) {
            this.position.width = 0;
        };
        if (this.position.height < 0) {
            this.position.height = 0;
        };
        this.bounds();
    };

}

export interface CHART extends EVENTS {
    'id'?: string;
    'min'?: number;
    'max'?: number;
    'data'?: any;
    'name'?: string;
    'fill'?: FILL;
    'font'?: FONT;
    'series'?: SERIES[];
    'labels'?: number[] | string[];
    'hidden'?: boolean;
    'stroke'?: STROKE;
    'position'?: POSITION;
    'selected'?: boolean;
    'dragging'?: boolean;
}