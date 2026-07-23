import type { BaseType, Selection as D3Selection } from 'd3-selection'

/**
 * A d3 selection of one-or-more DOM elements.
 *
 * Thin, defaulted alias over d3's `Selection` so call sites can write
 * `Selection` instead of the four-parameter d3 generic, while still allowing a
 * caller to narrow the element/datum types when they are known.
 *
 * @typeParam GElement - Selected element type (defaults to any DOM node).
 * @typeParam Datum    - Datum bound to the selected elements.
 * @typeParam PElement - Parent element type.
 * @typeParam PDatum   - Datum bound to the parent.
 */
export type Selection<
  // d3's `Selection` is invariant in its element type, so a single shared alias
  // must default `GElement` permissively to stay assignable from every concrete
  // selection (`rect`, `text`, `image`, …). Callers may still narrow it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GElement extends BaseType = any,
  Datum = unknown,
  PElement extends BaseType = BaseType,
  PDatum = unknown,
> = D3Selection<GElement, Datum, PElement, PDatum>
