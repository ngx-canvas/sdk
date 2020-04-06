import { OnInit, Component } from '@angular/core';
import {
    view,
    data,
    Point,
    POINT,
    Project,
    SelectBox
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

    constructor() {};

    change(value) {
        data[0].value = value;
    };

    ngOnInit() {
        const project   = new Project('demo');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight - 100;

        const selectbox = new SelectBox();

        project.import([
            {
                'type': 'vector',
                'position': {
                    'x':        200,
                    'y':        200,
                    'width':    200,
                    'height':   200
                },
                'src': './assets/icon.png'
            }
        ]);

        project.mouseup.subscribe(point => {
            this.dragging   = true;
            this.pressing   = false;
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
        });
        
        project.mousemove.subscribe(point => {
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

            this.pressing   = true;

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
        });

        console.log(project.export());
    };

}