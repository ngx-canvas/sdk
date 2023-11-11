class State {
  public index = 0
  readonly date: Date = new Date()

  constructor (args?: STATE) {
    if (args) Object.assign(this, args)
  }
}

export class MomentoTool {
  private _projectId = ''

  public limit = 10
  public latestIndex = 0
  public currentIndex = 0
  private readonly states: State[] = []

  constructor(projectId: string) {
    this._projectId = projectId
  }

  public push(state: State) {
    return state
  }

  public canUndo (): boolean {
    let minIndex = 0
    if (this.states.length > 0) minIndex = this.states[0].index
    if (this.currentIndex > minIndex) return true
    return false
  }

  public canRedo (): boolean {
    if (this.currentIndex < this.latestIndex) {
      return true
    }
    return false
  }

  public undo () {
    if (this.canUndo()) {
      this.currentIndex -= 1
      return this.getState(this.currentIndex)
    }
    return null
  }

  public redo () {
    if (this.canRedo()) {
      this.currentIndex += 1
      return this.getState(this.currentIndex)
    }
    return null
  }

  public do (args: STATE) {
    // Check if there is future states to be removed
    let count = 0
    this.states.forEach(state => {
      if (state.index > this.currentIndex) {
        count += 1
      }
    })
    // Remove future states
    if (count > 0) {
      for (let i = 0; i < this.states.length; i++) {
        if (this.states[i].index === this.currentIndex) {
          this.states.splice(i + 1, count)
          break
        }
      }
    }
    // Remain within limit
    if (this.states.length === this.limit) {
      this.states.shift()
    }
    // Set current index
    if (this.states.length > 0) {
      const st = this.getState(this.currentIndex)
      this.currentIndex = st ? st?.index + 1 : 0
    }
    const state: State = new State(args)
    state.index = this.currentIndex
    this.latestIndex = this.currentIndex
    this.states.push(state)
  }

  private getState (index: number): State | null {
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].index === index) {
        return this.states[i]
      }
    }
    return null
  }

}

type STATE = any