import { view } from './view';
import { data } from './data';

import { POINT } from './utilities/point';

import { Subject } from 'rxjs';

/* --- SHAPES --- */
import { Line } from './shapes/line';
import { Group } from './shapes/group';
import { Select } from './utilities/select';
import { Circle } from './shapes/circle';
import { Polygon } from './shapes/polygon';
import { Rectangle } from './shapes/rectangle';

export class Project {

    public click:       Subject<POINT> = new Subject<POINT>();
    public mouseup:     Subject<POINT> = new Subject<POINT>();
    public mousemove:   Subject<POINT> = new Subject<POINT>();
    public mousedown:   Subject<POINT> = new Subject<POINT>();

    public width:       number = 600;
    public height:      number = 600;
    public fillColor:   string = 'rgba(255, 255, 255, 1)';
    
    constructor(canvasId: string) {
        view.canvas     = document.getElementById(canvasId);
        view.context    = view.canvas.getContext('2d');

        view.canvas.addEventListener('click', (event) => this.click.next({
            'x': event.clientX,
            'y': event.clientY
        }));
        view.canvas.addEventListener('mouseup', (event) => this.mouseup.next({
            'x': event.clientX,
            'y': event.clientY
        }));
        view.canvas.addEventListener('mousemove', (event) => this.mousemove.next({
            'x': event.clientX,
            'y': event.clientY
        }));
        view.canvas.addEventListener('mousedown', (event) => this.mousedown.next({
            'x': event.clientX,
            'y': event.clientY
        }));

        this.draw();
    };

    private draw() {
        view.canvas.width               = this.width;
        view.canvas.height              = this.height;
        view.canvas.style.background    = this.fillColor;

        view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);

        data.map(item => {
            if (item instanceof Line) {
                this.line(item);
            };
            if (item instanceof Group) {
                this.group(item);
            };
            if (item instanceof Circle) {
                this.circle(item);
            };
            if (item instanceof Rectangle) {
                this.rectangle(item);
            };
            if (item.selected) {
                new Select(item);
            };
        });
        
        window.requestAnimationFrame(() => this.draw());
    };

    public export() {
        return JSON.parse(JSON.stringify(data));
    };

    private line(item) {
        view.context.beginPath();

        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = '#000000';

        view.context.moveTo(item.position.x, item.position.y);
        view.context.lineTo(item.position.x + item.position.width, item.position.y + item.position.height);
        view.context.stroke();
        
        view.context.closePath();
    };

    public deselect() {
        data.map(item => {
            item.selected = false;
        });
    };
    
    private group(item) {
        item.children.map(child => {
            if (child instanceof Line) {
                this.group(child);
            };
            if (child instanceof Group) {
                this.group(child);
            };
            if (child instanceof Circle) {
                this.circle(child);
            };
            if (child instanceof Rectangle) {
                this.rectangle(child);
            };
            if (child.selected) {
                new Select(child);
            };
        });
    };

    private circle(item) {
        view.context.beginPath();

        view.context.arc(item.position.center.x, item.position.center.y, item.position.width / 2, 0, 2 * Math.PI);
        
        view.context.fillStyle = item.fillColor;
        view.context.fill();
        
        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = item.strokeColor;
        view.context.stroke();
        
        view.context.closePath();
    };

    private rectangle(item) {
        view.context.beginPath();

        view.context.rect(item.position.x, item.position.y, item.position.width, item.position.height);
        
        view.context.fillStyle = item.fillColor;
        view.context.fill();
        
        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = item.strokeColor;
        view.context.stroke();
        
        view.context.closePath();
    };

    private ImportLine(item) {
        return new Line(item, true);
    };

    private ImportGroup(item) {
        item.children = item.children.map(child => {
            switch(child.type) {
                case('line'):
                    child = this.ImportLine(child);
                    break;
                case('group'):
                    child = this.ImportGroup(child);
                    break;
                case('circle'):
                    child = this.ImportCircle(child);
                    break;
                case('polygon'):
                    child = this.ImportPolygon(child);
                    break;
                case('rectangle'):
                    child = this.ImportRectangle(child);
                    break;
            };
            return child;
        });

        return new Group(item, true);
    };

    private ImportCircle(item) {
        return new Circle(item, true);
    };

    private ImportPolygon(item) {
        return new Polygon(item, true);
    };

    private ImportRectangle(item) {
        return new Rectangle(item, true);
    };

    public async import(json: any[]) {
        json.map(item => {
            switch(item.type) {
                case('line'):
                    item = this.ImportLine(item);
                    break;
                case('group'):
                    item = this.ImportGroup(item);
                    break;
                case('circle'):
                    item = this.ImportCircle(item);
                    break;
                case('polygon'):
                    item = this.ImportPolygon(item);
                    break;
                case('rectangle'):
                    item = this.ImportRectangle(item);
                    break;
            };

            data.push(item);
        });

        return true;
    };

}