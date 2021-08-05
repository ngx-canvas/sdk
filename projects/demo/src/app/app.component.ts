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
        this.project.width = window.innerWidth - 200;
        this.project.height = window.innerHeight - 204;
        this.project.margin = 100;
        this.project.editing = true;

        this.project.on('ready', () => {
            this.project.import([
                {
                    rows: [
                        {
                            columns: [
                                {
                                    children: [
                                        {
                                            font: {
                                                alignment: 'center'
                                            },
                                            position: {
                                                x: 200,
                                                y: 220,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'A1'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 300,
                                                y: 220,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'B1'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 400,
                                                y: 220,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'C1'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 500,
                                                y: 220,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'D1'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 600,
                                                y: 220,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'E1'
                                        }
                                    ],
                                    type: 'column'
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    children: [
                                        {
                                            font: {
                                                alignment: 'center'
                                            },
                                            position: {
                                                x: 200,
                                                y: 240,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'A2'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 300,
                                                y: 240,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'B2'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 400,
                                                y: 240,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'C2'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 500,
                                                y: 240,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'D2'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 600,
                                                y: 240,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'E2'
                                        }
                                    ],
                                    type: 'column'
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    children: [
                                        {
                                            font: {
                                                alignment: 'center'
                                            },
                                            position: {
                                                x: 200,
                                                y: 260,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'A3'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 300,
                                                y: 260,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'B3'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 400,
                                                y: 260,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'C3'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 500,
                                                y: 260,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'D3'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 600,
                                                y: 260,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'E3'
                                        }
                                    ],
                                    type: 'column'
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    children: [
                                        {
                                            font: {
                                                alignment: 'center'
                                            },
                                            position: {
                                                x: 200,
                                                y: 280,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'A4'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 300,
                                                y: 280,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'B4'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 400,
                                                y: 280,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'C4'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 500,
                                                y: 280,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'D4'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 600,
                                                y: 280,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'E4'
                                        }
                                    ],
                                    type: 'column'
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    children: [
                                        {
                                            font: {
                                                alignment: 'center'
                                            },
                                            position: {
                                                x: 200,
                                                y: 300,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'A5'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 300,
                                                y: 300,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'B5'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 400,
                                                y: 300,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'C5'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 500,
                                                y: 300,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'D5'
                                        }
                                    ],
                                    type: 'column'
                                },
                                {
                                    children: [
                                        {
                                            position: {
                                                x: 600,
                                                y: 300,
                                                width: 100,
                                                height: 20
                                            },
                                            type: 'text',
                                            value: 'E5'
                                        }
                                    ],
                                    type: 'column'
                                }
                            ]
                        }
                    ],
                    stroke: {
                        width: 5
                    },
                    header: {
                        columns: [
                            {
                                children: [
                                    {
                                        font: {
                                            alignment: 'center'
                                        },
                                        position: {
                                            x: 200,
                                            y: 200,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'HEADER A'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 300,
                                            y: 200,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'HEADER B'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 400,
                                            y: 200,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'HEADER C'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 500,
                                            y: 200,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'HEADER D'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 600,
                                            y: 200,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'HEADER E'
                                    }
                                ],
                                type: 'column'
                            }
                        ]
                    },
                    footer: {
                        columns: [
                            {
                                children: [
                                    {
                                        font: {
                                            alignment: 'center'
                                        },
                                        position: {
                                            x: 200,
                                            y: 320,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'FOOTER A'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 300,
                                            y: 320,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'FOOTER B'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 400,
                                            y: 320,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'FOOTER C'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 500,
                                            y: 320,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'FOOTER D'
                                    }
                                ],
                                type: 'column'
                            },
                            {
                                children: [
                                    {
                                        position: {
                                            x: 600,
                                            y: 320,
                                            width: 100,
                                            height: 20
                                        },
                                        type: 'text',
                                        value: 'FOOTER E'
                                    }
                                ],
                                type: 'column'
                            }
                        ]
                    },
                    position: {
                        x: 200,
                        y: 200,
                        width: 500,
                        height: 140
                    },
                    type: 'table'
                },
                {
                    stroke: {
                        color: '#000000',
                        opacity: 100
                    },
                    position: {
                        x: 250,
                        y: 400,
                        radius: 50
                    },
                    type: 'circle'
                }
            ]);
        });
    };

}