import { Selection } from '@libs/common'

/**
 * Global SVG selection - should be managed per Project instance
 * @deprecated Use Project.svg() instead
 */
export const globals: GLOBALS = {
  svg: null
}

interface GLOBALS {
  svg: Selection | null
}
