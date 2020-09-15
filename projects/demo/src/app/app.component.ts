import {
    view,
    data,
    Point,
    POINT,
    Project,
    SelectBox,
} from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    public offset: POINT;
    public project: any;
    public resizing: POINT;
    public dragging: boolean;

    constructor() { };

    public export() {
        console.log(this.project.export());
    };

    ngOnInit() {
        const select = new SelectBox();
        this.project = new Project('demo');
        this.project.width = window.innerWidth;
        this.project.height = window.innerHeight;
        this.project.editing = true;

        this.project.import([
            {
                'fill': {
                    'color': '#000000'
                },
                'font': {
                    'size': 10,
                    'color': '#000000',
                    'alignment': 'center'
                },
                'stroke': {
                    'cap': 'square',
                    'width': 2,
                    'color': '#000000'
                },
                'labels': [
                    'mon',
                    'tue',
                    'wed',
                    'thu',
                    'fri',
                    'sat',
                    'son'
                ],
                'series': [
                    {
                        'fill': {
                            'color': 'rgba(33, 150, 243, 0.25)'
                        },
                        'stroke': {
                            'cap': 'square',
                            'width': 2,
                            'color': 'rgba(33, 150, 243, 1)'
                        },
                        'type': 'column',
                        'value': [2,1,0,6,3,4,9],
                        'title': 'week report'
                    },
                    {
                        'fill': {
                            'color': 'rgba(244, 67, 54, 0.25)'
                        },
                        'stroke': {
                            'cap': 'square',
                            'width': 2,
                            'color': 'rgba(244, 67, 54, 1)'
                        },
                        'type': 'line',
                        'value': [2,1,0,6,3,4,9],
                        'title': 'week report'
                    }
                ],
                'position': {
                    'x': 10,
                    'y': 10,
                    'width': 600,
                    'height': 300
                },
                'type': 'chart'
            }
        ]);

        this.project.mouseup.subscribe(point => {
            this.project.deselect();

            if (!this.dragging) {
                this.project.hit(point);
            } else {
                this.project.select(select.bounds());
            };

            data.filter(item => item.selected).map(item => {
                item.draggable = false;
            });

            select.reset();

            this.resizing = null;
            this.dragging = false;
        });

        this.project.mousemove.subscribe(point => {
            if (this.resizing) {
                data.filter(item => item.near(this.resizing, 5)).map(item => {
                    item.resize(this.resizing, point);
                    this.resizing = point;
                });
            } else {
                if (data.filter(item => item.selected).length == 0) {
                    select.position.width = point.x - select.position.x;
                    select.position.height = point.y - select.position.y;
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

        this.project.mousedown.subscribe(point => {
            view.canvas.style.cursor = 'pointer';

            this.project.deselect();

            this.project.hit(point, 5);

            data.filter(item => item.selected).map(item => {
                this.offset = new Point({
                    'x': point.x - item.position.center.x,
                    'y': point.y - item.position.center.y
                });
                item.draggable = true;
            });

            if (data.filter(item => item.selected).length == 0) {
                select.reset();
                select.active = true;
                select.position.x = point.x;
                select.position.y = point.y;
            };

            this.resizing = null;
            data.filter(item => item.near(point, 5)).map(item => {
                this.resizing = item.near(point, 5);
            });

            this.dragging = false;
        });
    };

}