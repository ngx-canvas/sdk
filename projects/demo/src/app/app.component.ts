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
                'type': 'group',
                'position': {},
                'children': [
                    {
                        'type': 'group',
                        'position': {},
                        'children': [
                            {
                                'type': 'group',
                                'position': {},
                                'children': [
                                    {
                                        'position': {
                                            'x':      40,
                                            'y':      40,
                                            'width':  150,
                                            'height': 150
                                        },
                                        'points': [
                                            {
                                                'x': 40,
                                                'y': 40
                                            },
                                            {
                                                'x': 100,
                                                'y': 40
                                            },
                                            {
                                                'x': 100,
                                                'y': 100
                                            },
                                            {
                                                'x': 40,
                                                'y': 100
                                            },
                                            {
                                                'x': 40,
                                                'y': 40
                                            }
                                        ],
                                        'type':         'polygon',
                                        'lineWidth':    2,
                                        'fillColor':    'rgba(0, 0, 0, 0.5)',
                                        'strokeColor':  'rgba(0, 0, 0, 0.5)'
                                    },
                                    {
                                        'position': {
                                            'x':      40,
                                            'y':      40,
                                            'width':  40,
                                            'height': 40
                                        },
                                        'points': [
                                            {
                                                'x': 100,
                                                'y': 100
                                            },
                                            {
                                                'x': 140,
                                                'y': 100
                                            },
                                            {
                                                'x': 140,
                                                'y': 140
                                            },
                                            {
                                                'x': 100,
                                                'y': 140
                                            },
                                            {
                                                'x': 100,
                                                'y': 100
                                            }
                                        ],
                                        'type':         'polygon',
                                        'lineWidth':    2,
                                        'fillColor':    'rgba(0, 0, 0, 0.5)',
                                        'strokeColor':  'rgba(0, 0, 0, 0.5)'
                                    }
                                ]
                            }
                        ]
                    }
                ]
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

            if (data.filter(item => item.selected).length == 0) {
                select.reset();
                select.active       = true;
                select.position.x   = point.x;
                select.position.y   = point.y;
            };

            this.dragging = false;
        });
    };

}