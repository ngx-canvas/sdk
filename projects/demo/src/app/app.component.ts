import {
    view,
    data,
    Point,
    POINT,
    Project,
    SelectBox
} from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    public offset:      POINT;
    public resizing:    POINT;
    public dragging:    boolean;

    constructor() {};

    ngOnInit() {
        const select    = new SelectBox();
        const project   = new Project('demo', 'apiKey');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight - 100;
        project.editing = true;

        project.import([
            {
                'position': {
                    'x':      400,
                    'y':      400,
                    'width':  100,
                    'radius': 50,
                    'height': 100
                },
                'type':         'circle',
                'lineWidth':    1,
                'strokeColor':  'rgba(0, 0, 0, 1)',
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

            this.resizing = null;
            this.dragging = false;
        });

        project.mousemove.subscribe(point => {
            if (this.resizing) {
                data.filter(item => item.near(this.resizing, 5)).map(item => {
                    item.resize(this.resizing, point);
                    this.resizing = point;
                });
            } else {
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
            };
            
            this.dragging = true;
        });

        project.mousedown.subscribe(point => {
            view.canvas.style.cursor = 'pointer';

            project.deselect();

            project.hit(point, 5);

            data.filter(item => item.selected).map(item => {
                this.offset = new Point({
                    'x': point.x - item.position.center.x,
                    'y': point.y - item.position.center.y
                });
                item.draggable = true;
            });

            if (data.filter(item => item.selected).length == 0) {
                select.reset();
                select.active       = true;
                select.position.x   = point.x;
                select.position.y   = point.y;
            };
            
            this.resizing = null;
            data.filter(item => item.near(point, 5)).map(item => {
                this.resizing = item.near(point, 5);
            });

            this.dragging = false;
        });
    };

}