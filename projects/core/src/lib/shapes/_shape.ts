import * as d3 from 'd3';

import { Fill } from '../utilities/fill';
import { Font } from '../utilities/font';
import { Stroke } from '../utilities/stroke';
import { ObjectId } from '../utilities/id';
import { Position } from '../utilities/position';

export class Shape {

  public el: any;
  public id: string = ObjectId();
  public fill: Fill = new Fill();
  public font: Font = new Font();
  public data: any = {};
  public name: string = '';
  public stroke: Stroke = new Stroke();
  public hidden: boolean = false;
  public position: Position = new Position();
  public selected: boolean = false;
  public dragging: boolean = false;
  public conditions: any[] = [];

  constructor(args?: SHAPE) {
    Object.assign(this, args);
    this.font = new Font(this.font);
    this.fill = new Fill(this.fill);
    this.stroke = new Stroke(this.stroke);
    this.position = new Position(this.position);

    // conditions(shape, this.conditions);
  };

  public on(event: 'drag' | 'click' | 'drag-end' | 'mouse-up' | 'drag-start' | 'mouse-move' | 'mouse-down' | 'mouse-enter' | 'mouse-leave' | 'double-click', callback: Function) {
    switch (event) {
      case ('drag'):
        d3.drag().on('drag', (event: any) => callback(event))(this.el)
        break;
      case ('click'):
        this.el.on('click', (event: any) => callback(event))
        break;
      case ('drag-end'):
        d3.drag().on('end', (event: any) => callback(event))(this.el)
        break;
      case ('mouse-up'):
        this.el.on('mouseup', (event: any) => callback(event))
        break;
      case ('drag-start'):
        d3.drag().on('start', (event: any) => callback(event))(this.el)
        break;
      case ('mouse-move'):
        this.el.on('mousemove', (event: any) => callback(event))
        break;
      case ('mouse-down'):
        this.el.on('mousedown', (event: any) => callback(event))
        break;
      case ('mouse-enter'):
        this.el.on('mouseenter', (event: any) => callback(event))
        break;
      case ('mouse-leave'):
        this.el.on('mouseleave', (event: any) => callback(event))
        break;
      case ('double-click'):
        this.el.on('dblclick', (event: any) => callback(event))
        break;
    }
  }

}

export interface SHAPE {
  id?: string;
  fill?: Fill;
  font?: Font;
  data?: any;
  name?: string;
  stroke?: Stroke;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  position?: Position;
  conditions?: any[];
}