# Welcome to NGXCANVAS DRAW!

This module is intended will help you draw everything you need.

## Installation
```sh
$ npm i --save @ngx-canvas/draw
```

## Prerequisites
```sh
$ npm i --save @ngx-canvas/core d3
```

## Table of Contents


## Aligner Tool
This is used to align items against other items.
```ts
import { AlignerTool } from 'ngx-canvas/draw'

const aligner = new AlignerTool()
```

## Grid Tool
This will draw a grid on the drawing canvas.
```ts
import { GridTool } from 'ngx-canvas/draw'

const grid = new GridTool()
```

## Momento Tool
This will track the changes on the canvas. It will let you undo/redo the changes.
```ts
import { MomentoTool } from 'ngx-canvas/draw'

const momento = new MomentoTool()
```

## Ruler Tool
This will place an XY Axis ruler on the drawing canvas.
```ts
import { RulerTool } from 'ngx-canvas/draw'

const ruler = new RulerTool({
  width: 1000,
  height: 1000,
  margin: 50
})
```

### Inputs
| Property  | Type    | Default | Required  | Description                                                                                                     |
|-----------|---------|---------|-----------|-----------------------------------------------------------------------------------------------------------------|
| width     | number  | 0       | Yes       | This will set the total width of ruler. This is usually the exact width of the drawing canvas, not the screen.  |
| height    | number  | 0       | Yes       | This will set the total height of ruler. This is usually the exact height of the drawing canvas, not the screen.|
| margin    | number  | 0       | No        | This is the margin used on the drawing canvas, if set at all.                                                   |

### Outputs