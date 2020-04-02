import { Project } from 'projects/core/src/public-api';
import { OnInit, Component } from '@angular/core';

@Component({
    selector:       'app-root',
    styleUrls:      ['./app.component.scss'],
    templateUrl:    './app.component.html'
})

export class AppComponent implements OnInit {

    constructor() {};

    ngOnInit() {
        const project = new Project('demo');
        project.import([
            {
                'type': 'circle',
                'position': {
                    'x':        100,
                    'y':        100,
                    'radius':   50
                },
                'fillColor': 'rgba(0, 0, 0, 0.5)'
            }
        ])
    };

}