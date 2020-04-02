import { view, data, Point, POINT, Project } from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    public offset:      POINT;
    public selected:    any[] = [];

    constructor() {};

    ngOnInit() {
        const project   = new Project('demo');
        project.width   = window.innerWidth;
        project.height  = window.innerHeight;

        project.import([
            {
                'type': 'circle',
                'position': {
                    'x':        100,
                    'y':        100,
                    'radius':   50
                },
                'lineWidth':    4,
                'fillColor':    'rgba(218,165,32, 0.5)',
                'strokeColor':  'rgba(255, 215, 0, 1)'
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
            }
        ]);

        project.mouseup.subscribe(point => {
            view.canvas.style.cursor = 'pointer';

            this.offset = new Point({
                'x': 0,
                'y': 0
            });
            
            this.selected.map(item => {
                item.draggable = false;
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
        });
        
        project.mousedown.subscribe(point => {
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