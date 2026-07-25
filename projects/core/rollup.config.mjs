import { createBuild } from '../../scripts/rollup.factory.mjs'

export default createBuild({ dir: 'projects/core', bundleCommon: true })
