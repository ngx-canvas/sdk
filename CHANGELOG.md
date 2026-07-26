## 1.1.0 (2026-07-26)

### 🚀 Features

- replace hand-rolled geometry and ruler code with d3 built-ins ([5030b62](https://github.com/ngx-canvas/sdk/commit/5030b62))

### 🩹 Fixes

- **deps:** scope minimatch/brace-expansion overrides per major line ([f889e5c](https://github.com/ngx-canvas/sdk/commit/f889e5c))

### ❤️ Thank You

- Claude Opus 4.8
- Clayton Constant @claytoncc

## 1.0.1 (2026-07-25)

### 🩹 Fixes

- **deps:** resolve npm audit advisories ([d6a2348](https://github.com/ngx-canvas/sdk/commit/d6a2348))

### ❤️ Thank You

- Claude Opus 4.8
- Clayton Constant @claytoncc

# 1.0.0 (2026-07-25)

### 🚀 Features

- ⚠️  modernize SDK — tree-shakeable d3, drop rxjs, remove global singleton ([83edb74](https://github.com/ngx-canvas/sdk/commit/83edb74))

### 🩹 Fixes

- update documentation generation workflows to handle missing manifest files ([d130852](https://github.com/ngx-canvas/sdk/commit/d130852))

### ⚠️  Breaking Changes

- modernize SDK — tree-shakeable d3, drop rxjs, remove global singleton  ([83edb74](https://github.com/ngx-canvas/sdk/commit/83edb74))
  removes the `globals` export and global SVG singleton; peer
  dependencies change from `d3`/`rxjs` to granular `d3-*` packages; `MomentoTool`
  and `Draw.momento` are renamed to `MementoTool` and `Draw.memento`;
  `ProjectOptions` replaces the internal `PROJECT_OPTIONS` type.

### ❤️ Thank You

- Clayton Constant @claytoncc

## 0.8.63 (2025-12-26)

This was a version bump only, there were no code changes.

## 0.8.62 (2025-12-25)

This was a version bump only, there were no code changes.

## 0.8.61 (2025-12-25)

This was a version bump only, there were no code changes.