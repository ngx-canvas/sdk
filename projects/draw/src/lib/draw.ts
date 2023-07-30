import * as d3 from 'd3'

export class Draw {
  private id: string = ''

  constructor (id: string) {
    this.id = id
    const conatiner = d3.select(`#${id}`)
  }
}
