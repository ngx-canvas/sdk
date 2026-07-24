/**
 * @jest-environment jsdom
 *
 * Regression coverage for the Project scene container. Several of these lock in
 * bug fixes from the modernization pass and must not silently regress.
 */
import { Project } from './project'
import type { ShapeData } from './project'

function mount(): void {
  document.body.innerHTML = '<div id="canvas"></div>'
}

describe('Project', () => {
  it('emits `ready` to subscribers attached after construction', async () => {
    mount()
    const project = new Project('canvas', { width: 100, height: 100 })

    // The documented usage subscribes *after* `new Project(...)`; the emit is
    // deferred with queueMicrotask so this must still fire (regression: a
    // synchronous emit would be missed and this would hang/time out).
    await new Promise<void>((resolve) => project.ready.subscribe(resolve))

    expect(project.element().node()).toBeTruthy()
  })

  it('renders every shape from a json import', async () => {
    mount()
    const project = new Project('canvas', { width: 200, height: 200 })
    await project.import({
      mode: 'json',
      data: [
        { type: 'rectangle', position: { x: 10, y: 10, width: 20, height: 20 } },
        { type: 'ellipse', position: { x: 40, y: 40, width: 20, height: 20 } },
        { type: 'text', position: { x: 5, y: 5 } },
      ],
    })

    expect(document.querySelectorAll('#canvas .shape').length).toBe(3)
  })

  it('ignores a shape whose type collides with an Object.prototype member', async () => {
    mount()
    const project = new Project('canvas', {})
    await project.import({
      mode: 'json',
      data: [
        { type: 'toString' } as ShapeData,
        { type: 'constructor' } as ShapeData,
        { type: 'rectangle', position: { x: 0, y: 0, width: 10, height: 10 } },
      ],
    })

    // Only the real rectangle should render; prototype members must not slip
    // through the factory lookup.
    expect(document.querySelectorAll('#canvas .shape').length).toBe(1)
  })

  it('imports every shape from an svg string (no live-collection skipping)', async () => {
    mount()
    const project = new Project('canvas', {})
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="shape"/><rect class="shape"/><rect class="shape"/>' +
      '<rect class="shape"/><rect class="shape"/><rect class="shape"/>' +
      '</svg>'

    await project.import({ mode: 'svg', data: svg })

    expect(document.querySelectorAll('#canvas .shape').length).toBe(6)
  })

  it('replaces existing shapes on import when replace is not disabled', async () => {
    mount()
    const project = new Project('canvas', {})
    const rect: ShapeData = { type: 'rectangle', position: { x: 0, y: 0, width: 10, height: 10 } }

    await project.import({ mode: 'json', data: [rect] })
    await project.import({ mode: 'json', data: [rect] })

    expect(document.querySelectorAll('#canvas .shape').length).toBe(1)
  })
})
