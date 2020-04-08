import {
    view,
    data,
    Point,
    POINT,
    Project,
    SelectBox,
    KeyboardTool,
    AlignmentTool
} from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    public offset:      POINT;
    public dragging:    boolean;
    public selected:    any[] = [];
    public clipboard:   any[] = [];

    public alignment = new AlignmentTool();

    constructor() {};

    ngOnInit() {
        const project   = new Project('demo');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight - 100;
        project.editing = true;

        const select    = new SelectBox();
        const keyboard  = new KeyboardTool();

        project.import([
            {
                'type': 'rectangle',
                'position': {
                    'x':        250,
                    'y':        250,
                    'width':    100,
                    'height':   100
                },
                'fillColor': 'rgba(100, 50, 25, 0.5)'
            },
            {
                'type': 'rectangle',
                'position': {
                    'x':        200,
                    'y':        200,
                    'width':    200,
                    'height':   200
                },
                'fillColor': 'rgba(25, 50, 100, 0.5)'
            }
        ]);

        project.mouseup.subscribe(point => {
            project.deselect();

            if (!this.dragging) {
                project.hit(point);
            } else {
                project.select(select.bounds());
            };
            
            data.filter(item => item.selected).map(item => {
                item.draggable = false;
            });

            select.reset();

            this.dragging = false;
        });

        project.mousemove.subscribe(point => {
            if (data.filter(item => item.selected).length == 0) {
                select.position.width   = point.x - select.position.x;
                select.position.height  = point.y - select.position.y;    
            } else {
                select.reset();
                data.filter(item => item.selected).map(item => {
                    if (item.draggable) {
                        item.move({
                            'x': point.x - this.offset.x,
                            'y': point.y - this.offset.y
                        });
                    };
                });
            };
            
            this.dragging = true;
        });

        project.mousedown.subscribe(point => {
            select.reset();
            select.active       = true;
            select.position.x   = point.x;
            select.position.y   = point.y;

            view.canvas.style.cursor = 'pointer';

            project.deselect();

            project.hit(point);

            data.filter(item => item.selected).map(item => {
                this.offset = new Point({
                    'x': point.x - item.position.center.x,
                    'y': point.y - item.position.center.y
                });
                item.draggable = true;
            });

            this.dragging = false;
        });

        keyboard.keyup.subscribe(event => console.log(event.key));
        
        keyboard.keydown.subscribe(event => {
            if (event.ctrlKey && !event.altKey && !event.shiftKey) {
                if (event.key == 'a') { // SELECT ALL
                    this.selected = data.map(item => {
                        item.selected = true;
                        return item;
                    });
                };
                if (event.key == 'c') { // COPY
                    this.clipboard = JSON.parse(JSON.stringify(this.selected));
                    this.clipboard.map(item => {
                        item.position.x         += 50;
                        item.position.y         += 50;
                        item.position.center.x  += 50;
                        item.position.center.y  += 50;
                    });
                };
                if (event.key == 'v') { // PASTE
                    if (this.clipboard.length > 0) {
                        project.import(this.clipboard);
                    };
                };
                if (event.key == 'x') { // CUT
                    this.clipboard = JSON.parse(JSON.stringify(this.selected));
                    this.selected.map(item => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id == item.id) {
                                data.splice(i, 1);
                                break;
                            };
                        };
                    });
                };
                if (event.key == 'z') { // UNDO
                    
                };
                if (event.key == 'y') { // REDO
                    
                };
            } else if (event.ctrlKey && event.shiftKey) {

            } else {
                if (event.key == 'ArrowUp') {
                    this.selected.map(item => {
                        item.position.center.y -= 1;
                        item.move(item.position.center);
                    });
                };
                if (event.key == 'ArrowDown') {
                    this.selected.map(item => {
                        item.position.center.y += 1;
                        item.move(item.position.center);
                    });
                };
                if (event.key == 'ArrowLeft') {
                    this.selected.map(item => {
                        item.position.center.x -= 1;
                        item.move(item.position.center);
                    });
                };
                if (event.key == 'ArrowRight') {
                    this.selected.map(item => {
                        item.position.center.x += 1;
                        item.move(item.position.center);
                    });
                };
            };
        });
        
    };

}