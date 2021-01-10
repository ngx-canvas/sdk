![Gitter](https://img.shields.io/gitter/room/ngx-canvas/core) ![GitHub](https://img.shields.io/github/license/ngx-canvas/core) ![npm](https://img.shields.io/npm/dm/@ngx-canvas/core) ![GitHub issues](https://img.shields.io/github/issues-raw/ngx-canvas/core) ![npm](https://img.shields.io/npm/v/@ngx-canvas/core) ![GitHub contributors](https://img.shields.io/github/contributors/ngx-canvas/core) ![GitHub last commit](https://img.shields.io/github/last-commit/ngx-canvas/core)

<img src='https://raw.githubusercontent.com/ngx-canvas/core/master/projects/demo/src/assets/icon.png' width='100'>

# @ngx-canvas/core

This is a Typescript Library that makes canvas intergrations easier!

## Installation

```sh
$ npm i --save @ngx-canvas/core
```

## Shapes
+ [Draw Line](#line)
+ [Draw Text](#text)
+ [Draw Group](#group)
+ [Draw Circle](#circle)
+ [Draw Button](#button)
+ [Draw Vector](#vector)
+ [Draw Polygon](#polygon)
+ [Draw Rectangle](#rectangle)

## Usage

```javascript
import { Project } from '@ngx-canvas/core';

...

/* --- Initialize Project --- */
const project = new Project('demo'); // demo = 'canvas id'

/* --- Import Data Into Project --- */
project.import([
    {
        'fill': {
            'color': 'rgba(0, 0, 0, 0.5)'
        },
        'position': {
            'x':      45,
            'y':      45,
            'radius': 15
        },
        'type': 'circle'
        
    },
    {
        'fill': {
            'color': 'rgba(0, 0, 0, 0.5)'
        },
        'stroke': {
            'width':    2,
            'color':    'rgba(0, 0, 0, 0.5)'
        },
        'position': {
            'x':      20,
            'y':      20,
            'width':  40,
            'height': 40
        },
        'type': 'rectangle'
    },
    {
        'position': {
            'x':      100,
            'y':      100,
            'radius': 50
        },
        'children': [
            {
                'fill': {
                    'color': 'rgba(0, 0, 0, 0.5)'
                },
                'position': {
                    'x':      100,
                    'y':      100,
                    'radius': 50
                },
                'type': 'circle'
            },
            {
                'fill': {
                    'color': 'rgba(0, 0, 0, 0.5)'
                },
                'stroke': {
                    'width':    2,
                    'color':    'rgba(0, 0, 0, 0.5)'
                },
                'position': {
                    'x':      40,
                    'y':      40,
                    'width':  150,
                    'height': 150
                },
                'type': 'rectangle'
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

## Line <a name='line'></a>
```javascript
import { Line } from '@ngx-canvas/core';

const line = new Line({
    'stroke': {
        'color': 'rgba(0, 0, 0, 0.5)'
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
    'position': {
        'x': 45,
        'y': 45
    }
});

console.log(line);
===
{
    'fill': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'stroke': {
        'width':    1,
        'color':    'rgba(0, 0, 0, 1)'
    },
    'points': [
        {
            'x': 0,
            'y': 0
        },
        {
            'x': 1,
            'y': 0
        },
        {
            'x': 1,
            'y': 1
        },
        {
            'x': 0,
            'y': 1
        },
        {
            'x': 0,
            'y': 0
        }
    ],
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'name':         '',
    'data':         {},
    'selected':     false,
    'draggable':    false
}
```

## Text <a name='text'></a>
```javascript
import { Text } from '@ngx-canvas/core';

const text = new Text({
    'fill': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'font': {
        'size':         20,
        'color':        'rgba(0, 0, 0, 1)',
        'family':       'Arial',
        'baseline':     'middle',
        'alignment':    'center'
    },
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    }
});

console.log(text);
===
{
    'fill': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'font': {
        'size':         20,
        'color':        'rgba(0, 0, 0, 1)',
        'family':       'Arial',
        'baseline':     'middle',
        'alignment':    'center'
    },
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'name':         '',
    'data':         {},
    'selected':     false,
    'draggable':    false
}
```

## Circle <a name='circle'></a>

```javascript
import { Circle } from '@ngx-canvas/core';

const circle = new Circle({
    'fill': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'stroke': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'position': {
        'x':        45,
        'y':        45,
        'radius':   25
    }
});

console.log(circle);
===
{
    'fill': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'stroke': {
        'color': 'rgba(0, 0, 0, 0.5)'
    },
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'id':           'xxx',
    'name':         '',
    'data':         {},
    'type':         'circle',
    'selected':     false,
    'draggable':    false,
    'lineWidth':    1,
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
}
```

## Vector <a name='vector'></a>

```javascript
import { Vector } from '@ngx-canvas/core';

const vector = new Vector({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'src':  './assets/icon.png'
});

console.log(vector);
===
{
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'id':           'xxx',
    'src':          './assets/icon.png',
    'name':         '',
    'data':         {},
    'type':         'vector',
    'image':        {},
    'selected':     false,
    'draggable':    false
}
```

## Group <a name='group'></a>

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
    ]
});

console.log(group);
===
{
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'id':           'xxx',
    'name':         '',
    'data':         {},
    'type':         'group',
    'children':     [LINE, GROUP, CIRCLE, POLYGON, RECTANGLE, ...]
    'selected':     false,
    'draggable':    false,
    'lineWidth':    1,
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
}
```

## Button <a name='button'></a>

```javascript
import { Button } from '@ngx-canvas/core';

const button = new Button({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100,
        'radius':   10
    },
    'value': 'click me!'
});

console.log(button);
===
{
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'id':           'xxx',
    'name':         '',
    'data':         {},
    'type':         'vector',
    'value':        '',
    'selected':     false,
    'draggable':    false,
    'fontColor':    '',
    'lineWidth':    1,
    'fillColor':    '',
    'strokeColor':  ''
}
```

## Polygon <a name='polygon'></a>

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
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
});

console.log(polygon);
===
{
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'points': [
        {
            'x': 0,
            'y': 0
        },
        {
            'x': 1,
            'y': 0
        },
        {
            'x': 1,
            'y': 1
        },
        {
            'x': 0,
            'y': 1
        },
        {
            'x': 0,
            'y': 0
        }
    ],
    'id':           'xxx',
    'name':         '',
    'data':         {},
    'type':         'polygon',
    'selected':     false,
    'draggable':    false,
    'lineWidth':    1,
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
}
```

## Rectangle <a name='rectangle'></a>

```javascript
import { Rectangle } from '@ngx-canvas/core';

const rectangle = new Rectangle({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
});

console.log(rectangle);
===
{
    'position': {
        'center': {
            'x': 0,
            'y': 0
        },
        'x':        0,
        'y':        0,
        'top':      0,
        'left':     0,
        'width':    0,
        'right':    0,
        'radius':   0,
        'height':   0,
        'bottom':   0,
        'rotation': 0
    },
    'id':           'xxx',
    'name':         '',
    'data':         {},
    'type':         'rectangle',
    'selected':     false,
    'draggable':    false,
    'lineWidth':    1,
    'fillColor':    'rgba(0, 0, 0, 0.5)',
    'strokeColor':  'rgba(0, 0, 0, 1)'
}
```

## Alignment Tool <a name='alignment'></a>

```javascript
import { AlignmentTool } from '@ngx-canvas/core';

const alignment = new AlignmentTool();

// Align Tops
alignment.tops();

// Align lefts
alignment.lefts();

// Align rights
alignment.rights();

// Align bottoms
alignment.bottoms();

// Align Centers
alignment.centers();

// Send To Back
alignment.sendtoback();

// Send Backward
alignment.sendbackward();

// Bring To Front
alignment.bringtofront();

// Bring Forward
alignment.bringforward();

// Align Vertical Centers
alignment.verticalcenters();

// Align Horizontal Centers
alignment.horizontalcenters();

```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[![DEONATE](https://raw.githubusercontent.com/ngx-canvas/core/master/projects/demo/src/assets/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZVDGBQ9HJCE4Y&source=url)