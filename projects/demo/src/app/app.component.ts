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
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    public offset:      POINT;
    public project:     any;
    public resizing:    POINT;
    public dragging:    boolean;

    constructor() {};

    public export() {
        console.log(this.project.export());
    };

    ngOnInit() {
        const select            = new SelectBox();
        this.project            = new Project('demo', 'apiKey');
        this.project.width      = window.innerWidth;
        this.project.height     = window.innerHeight - 100;
        this.project.editing    = true;
        
        this.project.import([
            {
                'children': [
                    {
                        'fill': {
                            'color':    'rgba(66, 66, 66, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(66, 66, 66, 1)'
                        },
                        'position': {
                            'x':        200,
                            'y':        500,
                            'width':    200,
                            'height':   100,
                        },
                        'type': 'rectangle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(33, 33, 33, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(33, 33, 33, 1)'
                        },
                        'position': {
                            'x':        175,
                            'y':        570,
                            'width':    250,
                            'height':   50
                        },
                        'type': 'rectangle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(33, 33, 33, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(33, 33, 33, 1)'
                        },
                        'position': {
                            'x':        50,
                            'y':        50,
                            'width':    500,
                            'height':   500,
                        },
                        'type': 'circle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(66, 66, 66, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(66, 66, 66, 1)'
                        },
                        'position': {
                            'x':        75,
                            'y':        75,
                            'width':    450,
                            'height':   450,
                        },
                        'type': 'circle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(33, 33, 33, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(33, 33, 33, 1)'
                        },
                        'position': {
                            'x':        80,
                            'y':        80,
                            'width':    440,
                            'height':   440,
                        },
                        'type': 'circle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(255, 255, 255, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(255, 255, 255, 1)'
                        },
                        'position': {
                            'x':        90,
                            'y':        90,
                            'width':    420,
                            'height':   420,
                        },
                        'type': 'circle'
                    },
                    {
                        'fill': {
                            'color':    'rgba(33, 33, 33, 1)',
                        },
                        'stroke': {
                            'width':    0,
                            'color':    'rgba(33, 33, 33, 1)'
                        },
                        'position': {
                            'x':        280,
                            'y':        280,
                            'width':    40,
                            'height':   40,
                        },
                        'type': 'circle'
                    }
                ],
                'type': 'group'
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