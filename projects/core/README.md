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

## Line

```javascript
import { Line } from '@ngx-canvas/core';

const line = new Line({
    'position': {
        'x': 45,
        'y': 45
    },
    'points': [
        {
            'x': 45,
            'y': 45
        },
        {
            'x': 145,
            'y': 145
        }
    ],
    'type':         'line',
    'strokeColor':  'rgba(0, 0, 0, 0.5)'
});
```

## Circle

```javascript
import { Circle } from '@ngx-canvas/core';

const circle = new Circle({
    'position': {
        'x':        45,
        'y':        45,
        'radius':   25
    },
    'type':         'circle',
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
});
```

## Group

```javascript
import { Group } from '@ngx-canvas/core';

const group = new Group({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'children': [
        line,
        circle
    ],
    'type': 'group'
});
```

## Polygon

```javascript
import { Polygon } from '@ngx-canvas/core';

const polygon = new Polygon({
    'position': {
        'x': 45,
        'y': 45
    },
    'points': [
        {
            'x': 45,
            'y': 45
        },
        {
            'x': 100,
            'y': 45
        },
        {
            'x': 100,
            'y': 100
        },
        {
            'x': 45,
            'y': 100
        },
        {
            'x': 45,
            'y': 45
        }
    ],
    'type':         'polygon',
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
});
```

## Rectangle

```javascript
import { Rectangle } from '@ngx-canvas/core';

const rectangle = new Rectangle({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'type':         'rectangle',
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
});