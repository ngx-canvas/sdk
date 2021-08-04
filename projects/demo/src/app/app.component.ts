import { Point, Project } from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    public offset: Point = new Point();
    public project: Project;
    public resizing: Point = new Point();
    public dragging: boolean;

    constructor() { };

    ngOnInit() {
        this.project = new Project('#demo');
        this.project.width = window.innerWidth;
        this.project.height = window.innerHeight - 4;
        this.project.margin = 100;
        this.project.editing = true;

        this.project.on('ready', () => {
            this.project.import([
                {
                    stroke: {
                        width: 5
                    },
                    position: {
                        x: 200,
                        y: 200,
                        width: 100,
                        height: 100,
                        radius: 20
                    },
                    type: 'rectangle'
                },
                {
                    stroke: {
                        width: 5
                    },
                    position: {
                        x: 200,
                        y: 350,
                        width: 100,
                        height: 100,
                        radius: 50
                    },
                    type: 'circle'
                },
                {
                    font: {
                        color: '#000'
                    },
                    position: {
                        x: 200,
                        y: 510,
                        width: 100,
                        height: 100,
                        radius: 0
                    },
                    type: 'text'
                },
                {
                    font: {
                        color: '#000'
                    },
                    position: {
                        x: 200,
                        y: 550,
                        width: 250,
                        height: 250,
                        radius: 10
                    },
                    src: 'https://linustechtips.com/uploads/monthly_2021_04/94132137-7d4fc100-fe7c-11ea-8512-69f90cb65e48.gif.7e8c349c5d8ef1190d3612184fb0f17f.gif',
                    type: 'vector'
                },
                {
                    stroke: {
                        width: 5
                    },
                    points: [
                        {
                            x: 200,
                            y: 800
                        },
                        {
                            x: 150,
                            y: 900
                        },
                        {
                            x: 300,
                            y: 900
                        }
                    ],
                    type: 'polygon'
                },
                {
                    points: [
                        {
                            x: 400,
                            y: 800
                        },
                        {
                            x: 650,
                            y: 800
                        }
                    ],
                    type: 'line'
                }
            ]);
        });
    };

}