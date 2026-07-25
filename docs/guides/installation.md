---
title: Installation
slug: installation
navGroup: Guides
order: 2
description: Install the core scene model and the optional interactive editor.
---

# Installation

Install the core scene model along with the granular `d3-*` peers it uses:

```bash
# core scene model
npm install @ngx-canvas/core d3-selection d3-drag d3-shape d3-array d3-scale d3-axis uuid
```

Add the interactive editor layer when you need selection, resize, grid, ruler,
zoom, grouping, alignment or undo/redo:

```bash
# optional interactive editor
npm install @ngx-canvas/draw
```

## Peer dependencies

The `d3-*` packages and `uuid` are declared as **peer dependencies** so the SDK
stays tree-shakeable and never bundles its own copy of d3 into your app. Install
only the ones your features use — your bundler's tree-shaking removes the rest.

Both packages ship **dual ESM + CommonJS** builds with an `exports` map, so
`import` and `require` both resolve correctly.

## Requirements

- A modern browser (ES2020+).
- Node.js `>= 20` if you build the SDK from source.
