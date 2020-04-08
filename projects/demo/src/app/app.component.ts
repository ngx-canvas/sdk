import { OnInit, Component } from '@angular/core';
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

@Component({
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    public offset:      POINT;
    public pressing:    boolean;
    public dragging:    boolean;
    public selected:    any[] = [];
    public clipboard:   any[] = [];

    public alignment = new AlignmentTool();

    constructor() {};

    ngOnInit() {
        const project   = new Project('demo');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight - 100;

        const keyboard  = new KeyboardTool();
        const selectbox = new SelectBox();

        project.import([
            {
                'type': 'rectangle',
                'position': {
                    'x':        200,
                    'y':        200,
                    'width':    150,
                    'height':   50
                },
                'fillColor': 'rgba(25, 50, 100, 1)'
            },
            {
                'type': 'rectangle',
                'position': {
                    'x':        300,
                    'y':        300,
                    'width':    150,
                    'height':   50
                },
                'fillColor': 'rgba(100, 50, 25, 1)'
            }
        ]);

        project.mouseup.subscribe(point => {
            const position  = selectbox.bounds();

            selectbox.reset();

            view.canvas.style.cursor = 'pointer';

            this.offset = new Point({
                'x': 0,
                'y': 0
            });

            this.selected.map(item => {
                item.draggable = false;
            });

            this.selected = project.select(position);
            
            this.selected.map(item => {
                item.selected = true;
            });

            if (this.selected.length == 0) {
                project.deselect();

                this.selected = data.filter(o => o.hit(point)).sort((a, b) => {
                    if (a.position.width < b.position.width) {
                        return -1;
                    } else if (a.position.width > b.position.width) {
                        return 1;
                    } else {
                        return 0;
                    };
                }).slice(0, 1);

                this.selected.map(item => {
                    item.selected   = true;
                    item.draggable  = false;
                });
            };

            this.pressing = false;
            this.dragging = false;
        });
        
        project.mousemove.subscribe(point => {
            this.dragging = true;
            this.selected.map(item => {
                if (item.draggable) {
                    item.selected = false;
                    point.x = point.x - this.offset.x;
                    point.y = point.y - this.offset.y;
                    item.move(point);
                };
            });

            if (this.pressing && this.selected.length == 0) {
                selectbox.position.width    = point.x - selectbox.position.x;
                selectbox.position.height   = point.y - selectbox.position.y;
            } else {
                selectbox.reset();
            };
        });
        
        project.mousedown.subscribe(point => {
            selectbox.active        = true;
            selectbox.position.x    = point.x;
            selectbox.position.y    = point.y;

            view.canvas.style.cursor = 'pointer';

            project.deselect();

            this.selected = data.filter(o => o.hit(point)).sort((a, b) => {
                if (a.position.width < b.position.width) {
                    return -1;
                } else if (a.position.width > b.position.width) {
                    return 1;
                } else {
                    return 0;
                };
            }).slice(0, 1);

            if (this.selected.length == 1) {
                view.canvas.style.cursor = 'move';

                this.offset = new Point({
                    'x': point.x - this.selected[0].position.center.x,
                    'y': point.y - this.selected[0].position.center.y
                });
            };

            this.selected.map(item => {
                item.selected   = true;
                item.draggable  = true;
            });

            this.pressing = true;
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