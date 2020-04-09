import { POINT } from '../utilities/point';
import { Line, LINE } from '../shapes/line';
import { Circle, CIRCLE } from '../shapes/circle';
import { Button, BUTTON } from '../shapes/button';
import { Polygon, POLYGON } from '../shapes/polygon';
import { Rectangle, RECTANGLE } from '../shapes/rectangle';

export class DrawingTool {

    public mode:        string;
    public active:      boolean;

    public line:        LINE;
    public circle:      CIRCLE;
    public button:      BUTTON;
    public polygon:     POLYGON;
    public rectangle:   RECTANGLE;

    constructor() {};

    public next(point: POINT) {
        switch(this.mode) {
            case('line'):
                this.line.points.push(point);
                break;
            case('circle'):
                break;
            case('button'):
                break;
            case('polygon'):
                break;
            case('rectangle'):
                break;
        }
    };

    public start(point: POINT) {
        this.active = true;

        switch(this.mode) {
            case('line'):
                this.line = new Line({
                    'position': {
                        'x':        point.x,
                        'y':        point.y,
                        'width':    0,
                        'height':   0
                    },
                    'points':       [point],
                    'lineWidth':    2
                });
                break;
            case('circle'):
                break;
            case('button'):
                break;
            case('polygon'):
                break;
            case('rectangle'):
                break;
        };
    };

    public finish(point: POINT) {
        switch(this.mode) {
            case('line'):
                break;
            case('circle'):
                break;
            case('button'):
                break;
            case('polygon'):
                break;
            case('rectangle'):
                break;
        }
    };

    public DrawLine(point: POINT) {
        const line = new Line({
            'position': {
                'x':        point.x,
                'y':        point.y,
                'width':    0,
                'height':   0
            },
            'points':       [point],
            'lineWidth':    2
        });
    };

    public DrawCircle(point: POINT) {

    };

    public DrawButton(point: POINT) {

    };

    public DrawPolygon(point: POINT) {

    };

    public DrawRectangle(point: POINT) {

    };

}