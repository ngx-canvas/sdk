# Contributing

Thanks for your interest in improving ngx-canvas!

## Prerequisites

- **Node.js** `>= 20` (the repo pins `22` via `.nvmrc` — run `nvm use`).
- **pnpm** `>= 10` (declared via the `packageManager` field; enable with `corepack enable`).

## Setup

```bash
pnpm install
```

### Supply-chain protections

Installs are hardened in `pnpm-workspace.yaml` and apply automatically:

- **`minimumReleaseAge: 1440`** — a package version must have been public for at
  least 24 hours before pnpm will install it. This quarantines freshly published
  (potentially compromised) versions long enough for the ecosystem to catch and
  yank them, and it applies to transitive dependencies too.
- **`onlyBuiltDependencies: []`** — dependencies may **not** run
  `preinstall`/`install`/`postinstall` scripts automatically. If a dependency
  genuinely needs its build script (e.g. a native binary), review it and add its
  exact name to that allowlist in a dedicated commit — never disable the policy
  wholesale.

When adding a dependency, prefer well-established packages, pin a sensible range,
and let the cooldown do its job. Avoid obscure/one-off packages.

## Common commands

| Command | Description |
| --- | --- |
| `pnpm build` | Build `common`, `core`, and `draw`. |
| `pnpm test` | Run unit tests (jsdom environment). |
| `pnpm lint` | Lint all projects. |
| `pnpm typecheck` | Type-check every package. |
| `pnpm format` | Format with Prettier. |

Nx caches task results — pass `--skip-nx-cache` to force a re-run.

## Project layout

```
projects/core   → @ngx-canvas/core  (scene model + shapes)
projects/draw   → @ngx-canvas/draw  (interactive editor tools)
libs/common     → shared primitives (Point, Position, Emitter, …)
```

## Coding standards

- **Strict TypeScript.** No `any` at API boundaries; prefer precise generics.
- **Tree-shaking friendly.** Import granular `d3-*` submodules, never the `d3`
  meta-package.
- **No runtime singletons.** State is scoped to instances.
- Run `pnpm lint` and `pnpm test` before opening a PR.

## Releases

Releases are driven by [Nx Release](https://nx.dev/features/manage-releases):

```bash
pnpm release          # version + changelog + tag (no publish)
pnpm release:dry-run  # preview
```

Pushing the resulting `v*.*.*` tag triggers the GitHub Action that publishes
`@ngx-canvas/core` and `@ngx-canvas/draw` to npm with provenance.
