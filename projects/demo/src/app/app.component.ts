import { OnInit, Component } from '@angular/core'
import {
  Point,
  Project
} from '../../../core/src/public-api'
import {
  Page,
  GridTool,
  RulerTool,
  SelectTool,
  AlignerTool
} from '../../../draw/src/public-api'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  public mode: string = 'aligner'
  public tools: any = {}
  public offset: Point = new Point()
  public project!: Project
  public resizing: Point = new Point()
  public dragging!: boolean

  constructor() { }

  public SetExampleMode(mode: string) {
    this.mode = mode
    this.project.destroy()
    switch (mode) {
      case ('aligner'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          },
          {
            fill: {
              color: '#F44336',
              opacity: 0.75
            },
            stroke: {
              color: '#F44336',
              opacity: 1
            },
            position: {
              x: 300,
              y: 300,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          },
          {
            fill: {
              color: '#4CAF50',
              opacity: 0.75
            },
            stroke: {
              color: '#4CAF50',
              opacity: 1
            },
            position: {
              x: 400,
              y: 400,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          }
        ])
        break
      case ('grid'):
        this.tools.grid.enable()
        break
      case ('grouper'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          },
          {
            fill: {
              color: '#F44336',
              opacity: 0.75
            },
            stroke: {
              color: '#F44336',
              opacity: 1
            },
            position: {
              x: 300,
              y: 300,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          }
        ])
        break
      case ('momento'):
        break
      case ('ruler'):
        break
      case ('select'):
        break
      case ('button'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 400,
              radius: 20
            },
            type: 'button',
            value: 'Click me'
          }
        ])
        break
      case ('circle'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'circle'
          }
        ])
        break
      case ('cubic-bezier-curve'):
        break
      case ('ellipse'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'ellipse'
          }
        ])
        break
      case ('elliptical-curve'):
        break
      case ('line'):
        break
      case ('polygon'):
        break
      case ('polyline'):
        break
      case ('quadratic-bezier-curve'):
        break
      case ('range'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'range'
          }
        ])
        break
      case ('rectangle'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'rectangle'
          }
        ])
        break
      case ('table'):
        break
      case ('text'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'text',
            value: 'I am text'
          }
        ])
        break
      case ('vector'):
        this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 0.75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 1
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            src: './assets/icon.png',
            type: 'vector'
          }
        ])
        break
      case ('area'):
        break
      case ('bar'):
        break
      case ('column'):
        break
      case ('donut'):
        break
      case ('line'):
        break
      case ('pie'):
        break
    }
  }

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
      this.tools.grid = new GridTool()
      this.tools.ruler = new RulerTool({
        width: window.innerWidth * 2,
        margin: 100,
        height: window.innerHeight * 2
      })
      this.tools.select = new SelectTool()
      this.tools.aligner = new AlignerTool()
      this.SetExampleMode('aligner')
    })
    this.project.on('dragging', () => { })
  }

}