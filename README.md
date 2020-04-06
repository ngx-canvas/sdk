<img src="https://raw.githubusercontent.com/ngx-canvas/core/master/projects/demo/src/assets/icon.png" width="100">

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

## Line <a name="line"></a>
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

console.log(line);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "points": [
        {
            "x": 0,
            "y": 0
        },
        {
            "x": 1,
            "y": 0
        },
        {
            "x": 1,
            "y": 1
        },
        {
            "x": 0,
            "y": 1
        },
        {
            "x": 0,
            "y": 0
        }
    ],
    "id":           "xxx",
    "name":         "",
    "type":         "line",
    "selected":     false,
    "lineWidth":    1,
    "fillColor":    "rgba(0, 0, 0, 0.5)",
    "strokeColor":  "rgba(0, 0, 0, 1)"
}
```

## Text <a name="text"></a>
```javascript
import { Text } from '@ngx-canvas/core';

const text = new Text({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'type':         'text',
    'fontSize':     20,
    'textAlign':    'center',
    'fontColor':    'rgba(0, 0, 0, 0.5)',
    'fontFamily':   'Arial',
    'textBaseline': 'middle'
});

console.log(text);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "name":         "",
    "type":         "text",
    "selected":     false,
    "fontSize":     20,
    "textAlign":    "center",
    "fontColor":    "rgba(0, 0, 0, 0.5)",
    "fontFamily":   "Arial",
    "textBaseline": "middle"
}
```

## Circle <a name="circle"></a>

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

console.log(circle);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "name":         "",
    "type":         "circle",
    "selected":     false,
    "lineWidth":    1,
    "fillColor":    "rgba(0, 0, 0, 0.5)",
    "strokeColor":  "rgba(0, 0, 0, 1)"
}
```

## Vector <a name="vector"></a>

```javascript
import { Vector } from '@ngx-canvas/core';

const vector = new Vector({
    'position': {
        'x':        45,
        'y':        45,
        'width':    100,
        'height':   100
    },
    'src':  './assets/icon.png',
    'type': 'vector'
});

console.log(vector);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "src":          "./assets/icon.png",
    "name":         "",
    "type":         "vector",
    "image":        {},
    "selected":     false,
}
```

## Group <a name="group"></a>

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

console.log(group);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "name":         "",
    "type":         "group",
    "children":     [LINE, GROUP, CIRCLE, POLYGON, RECTANGLE, ...]
    "selected":     false,
    "lineWidth":    1,
    "fillColor":    "rgba(0, 0, 0, 0.5)",
    "strokeColor":  "rgba(0, 0, 0, 1)"
}
```

## Button <a name="button"></a>

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
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "name":         "",
    "type":         "vector",
    "value":        "",
    "selected":     false,
    "fontColor":    "",
    "lineWidth":    1,
    "fillColor":    "",
    "strokeColor":  ""
}
```

## Polygon <a name="polygon"></a>

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

console.log(polygon);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "points": [
        {
            "x": 0,
            "y": 0
        },
        {
            "x": 1,
            "y": 0
        },
        {
            "x": 1,
            "y": 1
        },
        {
            "x": 0,
            "y": 1
        },
        {
            "x": 0,
            "y": 0
        }
    ],
    "id":           "xxx",
    "name":         "",
    "type":         "polygon",
    "selected":     false,
    "lineWidth":    1,
    "fillColor":    "rgba(0, 0, 0, 0.5)",
    "strokeColor":  "rgba(0, 0, 0, 1)"
}
```

## Rectangle <a name="rectangle"></a>

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

console.log(rectangle);
===
{
    "position": {
        "center": {
            "x": 0,
            "y": 0
        },
        "x":        0,
        "y":        0,
        "top":      0,
        "left":     0,
        "width":    0,
        "right":    0,
        "radius":   0,
        "height":   0,
        "bottom":   0,
        "rotation": 0
    },
    "id":           "xxx",
    "name":         "",
    "type":         "rectangle",
    "selected":     false,
    "lineWidth":    1,
    "fillColor":    "rgba(0, 0, 0, 0.5)",
    "strokeColor":  "rgba(0, 0, 0, 1)"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[![DEONATE](https://raw.githubusercontent.com/ngx-canvas/core/master/projects/demo/src/assets/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZVDGBQ9HJCE4Y&source=url)