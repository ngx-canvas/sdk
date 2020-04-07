import { view } from './view';
import { data } from './data';

import { POINT } from './utilities/point';
import { Select } from './utilities/select';
import { POSITION } from './utilities/position';

import { Subject } from 'rxjs';

/* --- SHAPES --- */
import { Line } from './shapes/line';
import { Text } from './shapes/text';
import { Group } from './shapes/group';
import { Circle } from './shapes/circle';
import { Button } from './shapes/button';
import { Vector } from './shapes/vector';
import { Polygon } from './shapes/polygon';
import { Rectangle } from './shapes/rectangle';

export class Project {

    public click:       Subject<POINT> = new Subject<POINT>();
    public mouseup:     Subject<POINT> = new Subject<POINT>();
    public mousemove:   Subject<POINT> = new Subject<POINT>();
    public mousedown:   Subject<POINT> = new Subject<POINT>();

    public grid:        any     = {
        'snap':         false,
        'enabled':      false,
        'spacing':      10,
        'lineWidth':    1,
        'strokeColor':  'rgba(0, 0, 0, 1)'
    };
    public width:       number  = 600;
    public height:      number  = 600;
    public offset:      any     = {
        'top':  0,
        'left': 0
    };
    public fillColor:   string  = 'rgba(255, 255, 255, 1)';
    
    constructor(canvasId: string) {
        view.canvas     = document.getElementById(canvasId);
        view.context    = view.canvas.getContext('2d');

        view.canvas.addEventListener('click', (event) => this.click.next({
            'x': event.clientX - this.offset.left,
            'y': event.clientY - this.offset.top
        }));

        view.canvas.addEventListener('mouseup', (event) => this.mouseup.next({
            'x': event.clientX - this.offset.left,
            'y': event.clientY - this.offset.top
        }));
        view.canvas.addEventListener('mousemove', (event) => this.mousemove.next({
            'x': event.clientX - this.offset.left,
            'y': event.clientY - this.offset.top
        }));
        view.canvas.addEventListener('mousedown', (event) => this.mousedown.next({
            'x': event.clientX - this.offset.left,
            'y': event.clientY - this.offset.top
        }));

        this.draw();
    };

    private draw() {
        view.canvas.width               = this.width;
        view.canvas.height              = this.height;
        view.canvas.style.background    = this.fillColor;

        view.context.clearRect(0, 0, view.canvas.width, view.canvas.height);

        this.gridify();

        data.map(item => {
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
            if (item instanceof Polygon) {
                this.polygon(item);
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

    private gridify() {
        if (this.grid.enabled) {
            let maxX        = view.canvas.width;
            let maxY        = view.canvas.height;

            for (let index = 0; index < maxX; index++) {
                view.context.beginPath();

                view.context.lineWidth      = this.grid.lineWidth;
                view.context.strokeStyle    = this.grid.strokeColor;

                view.context.moveTo(index * this.grid.spacing, 0);
                view.context.lineTo(index * this.grid.spacing, maxY);

                view.context.stroke();
                
                view.context.closePath();
            };

            for (let index = 0; index < maxY; index++) {
                view.context.beginPath();

                view.context.lineWidth      = this.grid.lineWidth;
                view.context.strokeStyle    = this.grid.strokeColor;

                view.context.moveTo(0, index * this.grid.spacing);
                view.context.lineTo(maxX, index * this.grid.spacing);

                view.context.stroke();
                
                view.context.closePath();
            };
        };
    };

    public export() {
        let json = JSON.parse(JSON.stringify(data));
        return json;
    };

    public deselect() {
        data.map(item => {
            item.selected = false;
        });
    };

    private line(item) {
        view.context.beginPath();

        view.context.lineCap        = 'round';
        view.context.fillStyle      = item.fillColor;
        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = item.strokeColor;

        if (Array.isArray(item.points)) {
            let index = 0;
            item.points.map(point => {
                if (index == 0) {
                    view.context.moveTo(point.x, point.y);
                } else {
                    view.context.lineTo(point.x, point.y);
                };
                index++;
            });
        };

        view.context.fill();
        view.context.stroke();
        
        view.context.closePath();
    };

    private text(item) {
        view.context.beginPath();

        if (typeof(item.value) == "undefined" || item.value == null) {
            item.value = '';
        };
        let font                    = [item.fontSize, 'px', ' ', item.fontFamily].join('');
        view.context.font           = font;
        view.context.textAlign      = item.textAlign;
        view.context.fillStyle      = item.fontColor;
        view.context.textBaseline   = item.textBaseline;
        view.context.fillText(item.value, item.position.center.x, item.position.center.y);
        
        view.context.closePath();
    };
    
    private group(item) {
        item.children.map(child => {
            if (child instanceof Line) {
                this.line(child);
            };
            if (child instanceof Text) {
                this.text(child);
            };
            if (child instanceof Group) {
                this.group(child);
            };
            if (child instanceof Circle) {
                this.circle(child);
            };
            if (child instanceof Vector) {
                this.vector(child);
            };
            if (child instanceof Polygon) {
                this.polygon(child);
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

    private button(item) {
        view.context.beginPath();

        view.context.moveTo(item.position.x + item.position.radius, item.position.y);
        view.context.arcTo(item.position.x + item.position.width, item.position.y, item.position.x + item.position.width, item.position.y + item.position.height, item.position.radius);
        view.context.arcTo(item.position.x + item.position.width, item.position.y + item.position.height, item.position.x, item.position.y + item.position.height, item.position.radius);
        view.context.arcTo(item.position.x, item.position.y + item.position.height, item.position.x, item.position.y, item.position.radius);
        view.context.arcTo(item.position.x, item.position.y, item.position.x + item.position.width, item.position.y, item.position.radius);
        
        view.context.fillStyle = item.fillColor;
        view.context.fill();
        
        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = item.strokeColor;
        view.context.stroke();

        if (typeof(item.value) == "undefined" || item.value == null) {
            item.value = '';
        };
        let font                    = [item.fontSize, 'px', ' ', item.fontFamily].join('');
        view.context.font           = font;
        view.context.textAlign      = 'center';
        view.context.fillStyle      = item.fontColor;
        view.context.textBaseline   = 'middle';
        view.context.fillText(item.value, item.position.center.x, item.position.center.y + item.lineWidth);

        view.context.closePath();
    };

    private vector(item) {
        view.context.beginPath();

        view.context.drawImage(item.image, item.position.x, item.position.y, item.position.width, item.position.height);
        
        view.context.closePath();
    };

    private polygon(item) {
        view.context.beginPath();
        
        view.context.lineCap        = 'round';
        view.context.fillStyle      = item.fillColor;
        view.context.lineWidth      = item.lineWidth;
        view.context.strokeStyle    = item.strokeColor;
        
        if (Array.isArray(item.points)) {
            let index = 0;
            item.points.map(point => {
                if (index == 0) {
                    view.context.moveTo(point.x, point.y);
                } else {
                    view.context.lineTo(point.x, point.y);
                };
                index++;
            });
        };

        view.context.fill();
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

    private ImportText(item) {
        return new Text(item, true);
    };

    private ImportGroup(item) {
        item.children = item.children.map(child => {
            switch(child.type) {
                case('line'):
                    child = this.ImportLine(child);
                    break;
                case('text'):
                    child = this.ImportText(child);
                    break;
                case('group'):
                    child = this.ImportGroup(child);
                    break;
                case('circle'):
                    child = this.ImportCircle(child);
                    break;
                case('button'):
                    child = this.ImportButton(child);
                    break;
                case('vector'):
                    child = this.ImportVector(child);
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

    private ImportButton(item) {
        return new Button(item, true);
    };

    private ImportVector(item) {
        return new Vector(item, true);
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
                case('text'):
                    item = this.ImportText(item);
                    break;
                case('group'):
                    item = this.ImportGroup(item);
                    break;
                case('circle'):
                    item = this.ImportCircle(item);
                    break;
                case('button'):
                    item = this.ImportButton(item);
                    break;
                case('vector'):
                    item = this.ImportVector(item);
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

    public select(position: POSITION) {
        return data.filter(item => {
            let hit = true;
            if (position.top > item.position.top) {
                hit = false;
            };
            if (position.left > item.position.left) {
                hit = false;
            };
            if (position.right < item.position.right) {
                hit = false;
            };
            if (position.bottom < item.position.bottom) {
                hit = false;
            };
            return hit;
        });
    };

}