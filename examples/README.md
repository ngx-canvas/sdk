# Examples

Runnable examples for ngx-canvas.

## Running

The examples import `@ngx-canvas/core` from the **local build**, so build the
packages first, then serve this directory over HTTP (ES modules and import maps
don't work from `file://`).

```bash
# from the repo root
pnpm build

# then serve the repo and open the example
npx serve .
# open http://localhost:3000/examples/basic/index.html
```

The `d3-*` peer dependencies and `uuid` are loaded from a CDN via the page's
import map, so no bundler is required.

## Examples

| Path | Shows |
| --- | --- |
| [`basic/`](basic/index.html) | Creating a `Project`, importing shapes as JSON, adding shapes dynamically, and exporting the scene as SVG. |
