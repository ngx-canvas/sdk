import { OnInit, Component } from '@angular/core'
import {
  Point,
  Project
} from '../../../core/src/public-api'
import {
  Page,
  GridTool,
  RulerTool,
  AlignerTool
} from '../../../draw/src/public-api'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  public offset: Point = new Point()
  public project!: Project
  public resizing: Point = new Point()
  public dragging!: boolean

  constructor() { }

  ngOnInit() {
    this.project = new Project('#demo')
    this.project.width = window.innerWidth * 2
    this.project.height = window.innerHeight * 2

    this.project.on('ready', () => {
      new Page({
        width: window.innerWidth * 2,
        margin: 100,
        height: window.innerHeight * 2
      })
      new GridTool()
      new RulerTool({
        width: window.innerWidth * 2,
        margin: 100,
        height: window.innerHeight * 2
      })
      this.project.import([
        {
          font: {
            size: 10,
            style: ['bold', 'italic', 'underline'],
            baseline: 'center',
            alignment: 'center'
          },
          stroke: {
            width: 1,
            color: '#E0E0E0'
          },
          position: {
            x: 100,
            y: 100,
            width: 1000,
            height: 25,
            radius: 4
          },
          type: 'range',
          value: 75
        }
      ])

      new AlignerTool()
    })

    this.project.on('dragging', () => { })
  }

}