/**
 * A minimal, strongly-typed synchronous event emitter.
 *
 * It intentionally mirrors the small slice of the RxJS `Subject` surface the
 * SDK actually used (`next` / `subscribe` / `unsubscribe`) so the library can
 * drop the heavyweight `rxjs` peer dependency without breaking consumers, while
 * gaining precise generic typing of every payload.
 *
 * @typeParam T - The value type delivered to subscribers.
 *
 * @example
 * ```ts
 * const ready = new Emitter<void>()
 * const sub = ready.subscribe(() => console.log('ready'))
 * ready.next()
 * sub.unsubscribe()
 * ```
 */
export type Listener<T> = (value: T) => void

/** Handle returned by {@link Emitter.subscribe} used to stop receiving events. */
export interface Subscription {
  /** Remove the associated listener. Safe to call more than once. */
  unsubscribe(): void
}

export class Emitter<T> {
  private readonly listeners = new Set<Listener<T>>()

  /**
   * Register a listener. Returns a {@link Subscription}; call `unsubscribe()`
   * to detach it. The same function reference is only registered once.
   */
  subscribe(listener: Listener<T>): Subscription {
    this.listeners.add(listener)
    return {
      unsubscribe: () => {
        this.listeners.delete(listener)
      },
    }
  }

  /** Emit a value to every current subscriber, in subscription order. */
  next(value: T): void {
    // Iterate a snapshot so listeners may (un)subscribe during dispatch.
    for (const listener of [...this.listeners]) listener(value)
  }

  /** Detach every listener. */
  clear(): void {
    this.listeners.clear()
  }

  /** Number of active subscribers. */
  get size(): number {
    return this.listeners.size
  }
}
