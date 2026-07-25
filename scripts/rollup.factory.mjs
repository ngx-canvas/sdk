import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const commonSrc = resolve(repoRoot, 'libs/common/src/index.ts')

/** Rewrites the `@libs/common` path alias to its source so it is bundled in. */
const aliasPlugin = alias({
  entries: [{ find: '@libs/common', replacement: commonSrc }],
})

/**
 * Externalize every bare (node_modules) import so peer deps like `d3-*`,
 * `uuid` and `tslib` are never bundled — but keep `@libs/common` internal so
 * the private shared code is inlined into each published package.
 */
const external = (id) =>
  !id.startsWith('.') && !id.startsWith('/') && id !== '@libs/common'

/**
 * Build a package to dual ESM + CJS with a single bundled `.d.ts`.
 *
 * @param {object}  options
 * @param {string}  options.dir       Package dir relative to repo root (e.g. "projects/core").
 * @param {boolean} [options.bundleCommon] Whether to inline `@libs/common` (core/draw).
 */
export function createBuild({ dir, bundleCommon = false }) {
  const pkgDir = resolve(repoRoot, dir)
  const input = resolve(pkgDir, 'src/index.ts')
  const outDir = resolve(repoRoot, 'dist', dir)
  // A dedicated build tsconfig that widens rootDir/include to cover the inlined
  // `@libs/common` sources when needed (avoids plugin-typescript rootDir errors).
  const tsconfig = resolve(pkgDir, 'tsconfig.rollup.json')

  const plugins = [
    ...(bundleCommon ? [aliasPlugin] : []),
    nodeResolve({ extensions: ['.ts', '.js'] }),
    typescript({
      tsconfig,
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        composite: false,
        sourceMap: true,
      },
    }),
  ]

  const js = {
    input,
    external,
    plugins,
    output: [
      { file: resolve(outDir, 'index.js'), format: 'es', sourcemap: true },
      { file: resolve(outDir, 'index.cjs'), format: 'cjs', sourcemap: true, exports: 'named' },
    ],
  }

  const types = {
    input,
    external,
    plugins: [...(bundleCommon ? [aliasPlugin] : []), dts({ tsconfig })],
    output: { file: resolve(outDir, 'index.d.ts'), format: 'es' },
  }

  return [js, types]
}
