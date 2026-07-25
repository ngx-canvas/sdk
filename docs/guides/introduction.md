---
title: Introduction
slug: introduction
navGroup: Guides
order: 1
description: A framework-agnostic TypeScript toolkit for building SVG drawing surfaces on the web.
---

# ngx-canvas

**ngx-canvas** is a small, framework-agnostic TypeScript toolkit for building
**SVG** drawing and diagramming surfaces on the web. It gives you a typed scene
model in `@ngx-canvas/core` and an optional interactive editor layer —
selection, resize, grid, ruler, zoom, grouping, alignment and undo/redo — in
`@ngx-canvas/draw`.

> Despite the `ngx-` name, this library has **no Angular dependency**. It renders
> with [d3](https://d3js.org) selections and works in any browser environment —
> vanilla TS/JS, React, Vue, Svelte, or Angular.

## Packages

- **`@ngx-canvas/core`** — the scene: a `Project` bound to a DOM element plus 13
  shape primitives (rectangle, ellipse, line, curve, polygon, polyline, text,
  table, chart, group, iframe, vector, range).
- **`@ngx-canvas/draw`** — an interactive editor built on top of core: selection
  boxes, resize handles, grid, ruler, zoom, grouping, alignment and undo/redo.

## Why ngx-canvas

- **Typed, tree-shakeable, dual ESM/CJS** packages that only pull the granular
  `d3-*` modules you actually use.
- **No runtime singletons** — every scene is scoped to its own `Project`.
- **SVG output** you can export, serialize, and style with standard CSS.
