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

    ngOnInit() {
        const project   = new Project('demo');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight;

        const selectbox = new SelectBox();

        project.import([
            {
                'type': 'rectangle',
                'position': {
                    'x':        160,
                    'y':        160,
                    'width':    80,
                    'height':   100,
                },
                'lineWidth':    1,
                'fillColor':    'rgba(76, 175, 80, 0.5)',
                'strokeColor':  'rgba(76, 175, 80, 1)'
            },
            {
                'type': 'circle',
                'position': {
                    'x':        100,
                    'y':        100,
                    'radius':   50
                },
                'lineWidth':    2,
                'fillColor':    'rgba(156, 39, 176, 0.5)',
                'strokeColor':  'rgba(156, 39, 176, 1)'
            },
            {
                'type': 'circle',
                'position': {
                    'x':        204,
                    'y':        100,
                    'radius':   50
                },
                'lineWidth':    4,
                'fillColor':    'rgba(218,165,32, 0.5)',
                'strokeColor':  'rgba(255, 215, 0, 1)'
            },
            // {
            //     'type': 'polygon',
            //     'position': {
            //         'x':        300,
            //         'y':        300,
            //         'radius':   50
            //     },
            //     'points': [
            //         {
            //             'x':        300,
            //             'y':        300,
            //         },
            //         {
            //             'x':        350,
            //             'y':        350,
            //         },
            //         {
            //             'x':        250,
            //             'y':        250,
            //         }
            //     ],
            //     'lineWidth':    4,
            //     'fillColor':    'rgba(218,165,32, 0.5)',
            //     'strokeColor':  'rgba(255, 215, 0, 1)'
            // }
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
                    point.x = point.x - this.offset.x;
                    point.y = point.y - this.offset.y;
                    item.move(point)
                };
            });

            if (this.pressing && this.selected.length == 0) {
                selectbox.position.width    = point.x - selectbox.position.x;
                selectbox.position.height   = point.y - selectbox.position.y;
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
    };

}