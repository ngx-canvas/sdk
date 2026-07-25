# Documentation

The docs are **version-decoupled**: the SDK generates a versioned JSON artifact,
and the site in [`site/`](site/) is a static **shell** that renders that JSON at
runtime. Publishing a new SDK version drops a new JSON file into the deploy's
`/data/` dir — **the site is never rebuilt per version**.

```
scripts/generate-docs.mjs           gh-pages (deployed once)
  ├─ TypeDoc reflection (core+draw)    index.html   ← the shell
  ├─ docs/guides/*.md  → prose         404.html     ← boots the shell for deep links
  └─ → dist/docs/<version>.json        data/
        + versions.json                  versions.json   { latest, versions[] }
                                         0.8.63.json     ← add per release, NO rebuild
```

## Content sources

- **API reference** — extracted from source by TypeDoc (`typedoc --json` via the
  programmatic API). Descriptions and `@example` usage come from **JSDoc in the
  source**, so improving a doc means improving the code comment.
- **Guides** — hand-authored Markdown in [`guides/`](guides/) with frontmatter
  (`title`, `slug`, `navGroup`, `order`).

## Commands

```bash
# from the repo root
pnpm docs:json     # generate dist/docs/<version>.json + versions.json

# develop the site against the generated data
cp dist/docs/* docs/site/public/data/
cd docs/site && npm install && npm run dev
```

## Deploy

Two GitHub Actions (see `.github/workflows/`):

- **`docs-site.yml`** — builds the static shell and publishes it to `gh-pages`.
  Runs only when `docs/site/**` changes. Set the repo variable `DOCS_BASE_PATH`
  (e.g. `/sdk`) if serving from a Pages sub-path.
- **`docs-data.yml`** — on each GitHub release, runs `pnpm docs:json` and
  publishes the new `<version>.json` + updated `versions.json` to
  `gh-pages/data/` (preserving the shell and older versions). No site rebuild.

## URLs

- `/<slug>` renders the **latest** version (e.g. `/core/shapes/rectangle`).
- `/<version>/<slug>` pins a specific version (e.g. `/0.8.63/core/shapes/rectangle`).

The version switcher in the sidebar reads `versions.json`.
