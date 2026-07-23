// Produce a publishable package.json in dist/<dir> from the source package.json
// (the rollup build emits index.js / index.cjs / index.d.ts alongside it), and
// copy README/LICENSE. Usage: node scripts/pack-dist.mjs <dir>
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const dir = process.argv[2]
if (!dir) {
  console.error('usage: node scripts/pack-dist.mjs <package-dir>')
  process.exit(1)
}

const repoRoot = process.cwd()
const srcDir = resolve(repoRoot, dir)
const distDir = resolve(repoRoot, 'dist', dir)
mkdirSync(distDir, { recursive: true })

const pkg = JSON.parse(readFileSync(resolve(srcDir, 'package.json'), 'utf8'))

// Strip everything a consumer must not receive; force the published entry points.
delete pkg.devDependencies
delete pkg.scripts
delete pkg.nx
delete pkg.private
delete pkg.typings

const published = {
  ...pkg,
  type: 'module',
  main: './index.cjs',
  module: './index.js',
  types: './index.d.ts',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './index.js',
      require: './index.cjs',
    },
    './package.json': './package.json',
  },
  sideEffects: false,
  files: ['index.js', 'index.cjs', 'index.d.ts', 'index.js.map', 'index.cjs.map'],
}

writeFileSync(resolve(distDir, 'package.json'), JSON.stringify(published, null, 2) + '\n')

for (const asset of ['README.md', 'LICENSE.md']) {
  const from = resolve(srcDir, asset)
  if (existsSync(from)) copyFileSync(from, resolve(distDir, asset))
}

console.log(`packaged ${published.name} -> dist/${dir}`)
