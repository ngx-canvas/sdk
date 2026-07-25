---
title: Quickstart
slug: quickstart
navGroup: Guides
order: 3
description: Create a project, add shapes, and export the scene as SVG.
---

# Quickstart

## Create a project

Bind a `Project` to a DOM element by id, then import shapes as JSON once the
scene is ready:

```ts
import { Project, Rectangle } from '@ngx-canvas/core'

// bind a project to an element with id="canvas"
const project = new Project('canvas', { width: 800, height: 600 })

project.ready.subscribe(() => {
  project.import({
    mode: 'json',
    data: [
      {
        type: 'rectangle',
        fill: { color: '#3b82f6' },
        position: { x: 40, y: 40, width: 200, height: 120 },
      },
    ],
  })
})
```

## Export the scene

Serialize the current scene to an SVG string at any time:

```ts
const svg = project.export('svg')
```

## Add interactivity

Layer the editor on top for selection, zoom, grid, ruler, alignment and
undo/redo:

```ts
import { Draw } from '@ngx-canvas/draw'

const draw = new Draw('canvas')
draw.select.changes.subscribe((event) => console.log('selection changed', event))
// draw.zoom, draw.grid, draw.ruler, draw.aligner, draw.memento (undo/redo)
```

## Events

Every emitter exposes `.subscribe(listener)` returning a `{ unsubscribe() }`
handle and `.next(value)` — a tiny typed event system with no RxJS dependency:

```ts
const sub = project.ready.subscribe(() => {
  /* ... */
})
sub.unsubscribe()
```
