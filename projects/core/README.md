# @ngx-canvas/core

This is a Typescript Library that makes canvas intergrations easier!

## Installation

```sh
$ npm i --save @ngx-canvas/core
```

## Usage

```javascript
import { Project } from '@ngx-canvas/core';

...

/* --- Initialize Project --- */
const project = new Project('demo'); // demo = 'canvas id'

/* --- Import Data Into Project --- */
project.import([
    {
        'position': {
            'x':      45,
            'y':      45,
            'radius': 15
        },
        'type':       'circle',
        'fillColor':  'rgba(0, 0, 0, 0.5)'
    },
    {
        'position': {
            'x':      20,
            'y':      20,
            'width':  40,
            'height': 40
        },
        'type':         'rectangle',
        'lineWidth':    2,
        'fillColor':    'rgba(0, 0, 0, 0.5)',
        'strokeColor':  'rgba(0, 0, 0, 0.5)'
    },
    {
        'position': {
            'x':      100,
            'y':      100,
            'radius': 50
        },
        'children': [
            {
                'position': {
                    'x':      100,
                    'y':      100,
                    'radius': 50
                },
                'type':       'circle',
                'fillColor':  'rgba(0, 0, 0, 0.5)'
            },
            {
                'position': {
                    'x':      40,
                    'y':      40,
                    'width':  150,
                    'height': 150
                },
                'type':         'rectangle',
                'lineWidth':    2,
                'fillColor':    'rgba(0, 0, 0, 0.5)',
                'strokeColor':  'rgba(0, 0, 0, 0.5)'
            }
        ],
        'type':       'group',
        'fillColor':  'rgba(0, 0, 0, 0.5)'
    }
]);

/* --- Project Event Listeners --- */
project.click.subscribe((point: Point) => {});

project.mouseup.subscribe((point: Point) => {});

project.mousemove.subscribe((point: Point) => {});

project.mousedown.subscribe((point: Point) => {});

```