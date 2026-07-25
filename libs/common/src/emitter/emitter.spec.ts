import { Emitter } from './emitter'

describe('Emitter', () => {
  it('delivers values to subscribers in order', () => {
    const emitter = new Emitter<number>()
    const seen: number[] = []
    emitter.subscribe((v) => seen.push(v))
    emitter.subscribe((v) => seen.push(v * 10))

    emitter.next(1)

    expect(seen).toEqual([1, 10])
  })

  it('stops delivering after unsubscribe', () => {
    const emitter = new Emitter<string>()
    const seen: string[] = []
    const sub = emitter.subscribe((v) => seen.push(v))

    emitter.next('a')
    sub.unsubscribe()
    emitter.next('b')

    expect(seen).toEqual(['a'])
  })

  it('unsubscribe is idempotent', () => {
    const emitter = new Emitter<void>()
    const sub = emitter.subscribe(() => undefined)
    sub.unsubscribe()
    expect(() => sub.unsubscribe()).not.toThrow()
    expect(emitter.size).toBe(0)
  })

  it('registers a given listener reference only once', () => {
    const emitter = new Emitter<number>()
    const listener = jest.fn()
    emitter.subscribe(listener)
    emitter.subscribe(listener)

    emitter.next(5)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(emitter.size).toBe(1)
  })

  it('supports void payloads via next()', () => {
    const emitter = new Emitter<void>()
    const listener = jest.fn()
    emitter.subscribe(listener)

    emitter.next()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('tolerates a listener that unsubscribes during dispatch', () => {
    const emitter = new Emitter<number>()
    const seen: number[] = []
    const sub = emitter.subscribe((v) => {
      seen.push(v)
      sub.unsubscribe()
    })
    emitter.subscribe((v) => seen.push(v + 100))

    emitter.next(1)
    emitter.next(2)

    expect(seen).toEqual([1, 101, 102])
  })

  it('clear removes every listener', () => {
    const emitter = new Emitter<number>()
    emitter.subscribe(() => undefined)
    emitter.subscribe(() => undefined)
    expect(emitter.size).toBe(2)

    emitter.clear()

    expect(emitter.size).toBe(0)
  })
})
