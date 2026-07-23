<img src='https://ngx-canvas.github.io/docs/assets/icons/icon-512x512.png' width='100' alt='ngx-canvas logo'>

# ngx-canvas

A small, framework-agnostic TypeScript toolkit for building **SVG** drawing and
diagramming surfaces on the web. It gives you a typed scene model (`@ngx-canvas/core`)
and an optional interactive editor layer — selection, resize, grid, ruler, zoom,
grouping, alignment and undo/redo — in `@ngx-canvas/draw`.

> Despite the `ngx-` name this library has **no Angular dependency**. It renders
> with [d3](https://d3js.org) selections and works in any browser (vanilla TS/JS,
> React, Vue, Svelte, Angular, …).

[Demo](https://ngx-canvas.github.io/demo) · [Documentation](https://ngx-canvas.github.io/docs)

---

## Packages

| Package | What it is |
| --- | --- |
| [`@ngx-canvas/core`](projects/core) | The scene: a `Project` bound to a DOM element plus 13 shape primitives (rectangle, ellipse, line, curve, polygon, polyline, text, table, chart, group, iframe, vector, range). |
| [`@ngx-canvas/draw`](projects/draw) | An interactive editor built on top of core: selection boxes, resize handles, grid, ruler, zoom, grouping, alignment and undo/redo. |

## Install

```bash
# core scene model
npm install @ngx-canvas/core d3-selection d3-drag d3-shape d3-array d3-scale d3-axis uuid

# optional interactive editor
npm install @ngx-canvas/draw
```

The `d3-*` packages and `uuid` are declared as **peer dependencies** so the SDK
stays tree-shakeable and never bundles a copy of d3 into your app. Install only
the ones your features use — your bundler's tree-shaking removes the rest.

## Quick start

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

// export the scene as an SVG string
const svg = project.export('svg')
```

Add interactivity with the editor layer:

```ts
import { Draw } from '@ngx-canvas/draw'

const draw = new Draw('canvas')
draw.select.changes.subscribe((event) => console.log('selection changed', event))
draw.zoom // pan/zoom, draw.grid, draw.ruler, draw.aligner, draw.memento (undo/redo)
```

## Events

The SDK ships a tiny, strongly-typed event emitter (no RxJS dependency). Every
emitter exposes `.subscribe(listener)` returning a `{ unsubscribe() }` handle and
`.next(value)`:

```ts
const sub = project.ready.subscribe(() => { /* ... */ })
sub.unsubscribe()
```

## Development

This is an [Nx](https://nx.dev) monorepo managed with [pnpm](https://pnpm.io).

```bash
pnpm install        # install (see security notes below)
pnpm build          # build common + core + draw
pnpm test           # run unit tests
pnpm lint           # lint
pnpm typecheck      # type-check all packages
pnpm format         # prettier --write
```

### Supply-chain safety

`pnpm-workspace.yaml` enables two protections for every install:

- **`minimumReleaseAge`** — a dependency version must be public for at least 24h
  before it can be installed, quarantining freshly published malicious releases
  (applies to transitive deps too).
- **`onlyBuiltDependencies: []`** — no dependency may run install/postinstall
  lifecycle scripts automatically; each must be reviewed and allowlisted.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

MIT — see [LICENSE](LICENSE.md).
