class State {

  public data: any = {}
  public index: number = 0
  readonly date: Date = new Date()

  constructor(args?: any) {
    if (typeof (args) != 'undefined' && args != null) {
      this.data = args
    }
  }

}

export class MomentoTool {

  public limit: number = 10
  public latestIndex: number = 0
  public currentIndex: number = 0
  private states: State[] = []

  /**
   * Initializes state manager
   * @param {STATE_MANAGER} args - (Optional) Override limit by passing it in as args.limit
   */
  constructor(args?: STATE_MANAGER) {
    if (args?.limit) this.limit = args.limit
  }

  /**
   * Returns true if you can undo
   * @function
   */
  public canUndo() {
    let minIndex: number = 0
    if (this.states.length > 0) {
      minIndex = this.states[0].index
    }
    if (this.currentIndex > minIndex) {
      return true
    }
    return false
  }

  /**
   * Returns true if you can redo
   * @function
   */
  public canRedo() {
    if (this.currentIndex < this.latestIndex) {
      return true
    }
    return false
  }

  /**
   * Returns previous state
   * @function
   */
  public undo() {
    if (this.canUndo()) {
      this.currentIndex -= 1
      return this.getState(this.currentIndex)
    }
    return
  }

  /**
   * Returns next state
   * @function
   */
  public redo() {
    if (this.canRedo()) {
      this.currentIndex += 1
      return this.getState(this.currentIndex)
    }
    return
  }

  /**
   * Adds a new state to memory
   * @function
   * @param {any} args - This is the data you want to save in your new state
   */
  public do(args: any) {
    // Check if there is future states to be removed
    let count = 0
    this.states.map(state => {
      if (state.index > this.currentIndex) {
        count += 1
      }
    })
    // Remove future states
    if (count > 0) {
      for (let i = 0; i < this.states.length; i++) {
        if (this.states[i].index == this.currentIndex) {
          this.states.splice(i + 1, count)
          break
        }
      }
    }
    // Remain within limit
    if (this.states.length == this.limit) {
      this.states.shift()
    }
    // Set current index
    if (this.states.length > 0) {
      this.currentIndex = this.getState(this.currentIndex).index + 1
    }
    let state: State = new State(args)
    state.index = this.currentIndex
    this.latestIndex = this.currentIndex
    this.states.push(state)
  }

  /**
   * Returns state for index
   * @function
   * @param {number} index - This will be the state index you want to return
   */
  private getState(index: number) {
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].index == index) {
        return this.states[i]
      }
    }
    return {} as any
  }

}

interface STATE_MANAGER {
  limit: number
}