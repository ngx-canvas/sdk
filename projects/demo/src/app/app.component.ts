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
  public mode: string = 'table'
  public tools: any = {}
  public offset: Point = new Point()
  public project!: Project
  public resizing: Point = new Point()
  public dragging!: boolean

  public async SetExampleMode (mode: string) {
    this.mode = mode
    this.project.destroy()
    this.tools.select.disable()
    switch (mode) {
      case ('aligner'):
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
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
              opacity: 75
            },
            stroke: {
              color: '#F44336',
              opacity: 100
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
              opacity: 75
            },
            stroke: {
              color: '#4CAF50',
              opacity: 100
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
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
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
              opacity: 75
            },
            stroke: {
              color: '#F44336',
              opacity: 100
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
        // this.tools.momento.enable()
        break
      case ('ruler'):
        this.tools.ruler.enable()
        break
      case ('select'):
        this.tools.select.enable()
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
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
              opacity: 75
            },
            stroke: {
              color: '#F44336',
              opacity: 100
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
              color: '#FFEB3B',
              opacity: 75
            },
            stroke: {
              color: '#FFEB3B',
              opacity: 100
            },
            position: {
              x: 500,
              y: 500,
              width: 150,
              height: 150
            },
            type: 'ellipse'
          }
        ])
        break
      case ('button'):
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 75,
              radius: 20
            },
            type: 'button',
            value: 'Click me'
          }
        ])
        break
      case ('circle'):
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
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
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
            },
            position: {
              x: 200,
              y: 200,
              width: 150,
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
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
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
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
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
        const data = [
          {
            "name": "Lewis Hamilton",
            "age": 37,
            "team": "Mercedes-AMG Petronas",
            "wins": 100
          },
          {
            "name": "Valtteri Bottas",
            "age": 32,
            "team": "Mercedes-AMG Petronas",
            "wins": 10
          },
          {
            "name": "Max Verstappen",
            "age": 25,
            "team": "Red Bull Racing",
            "wins": 8
          },
          {
            "name": "Sergio Perez",
            "age": 32,
            "team": "Red Bull Racing",
            "wins": 3
          },
          {
            "name": "Charles Leclerc",
            "age": 24,
            "team": "Scuderia Ferrari",
            "wins": 2
          },
          {
            "name": "Carlos Sainz Jr.",
            "age": 27,
            "team": "Scuderia Ferrari",
            "wins": 2
          },
          {
            "name": "Daniel Ricciardo",
            "age": 32,
            "team": "McLaren",
            "wins": 7
          },
          {
            "name": "Lando Norris",
            "age": 22,
            "team": "McLaren",
            "wins": 0
          },
          {
            "name": "Pierre Gasly",
            "age": 25,
            "team": "Scuderia AlphaTauri",
            "wins": 1
          },
          {
            "name": "Yuki Tsunoda",
            "age": 21,
            "team": "Scuderia AlphaTauri",
            "wins": 0
          },
          {
            "name": "Fernando Alonso",
            "age": 40,
            "team": "Alpine",
            "wins": 32
          },
          {
            "name": "Esteban Ocon",
            "age": 25,
            "team": "Alpine",
            "wins": 1
          },
          {
            "name": "Lance Stroll",
            "age": 23,
            "team": "Aston Martin Cognizant",
            "wins": 0
          },
          {
            "name": "Sebastian Vettel",
            "age": 34,
            "team": "Aston Martin Cognizant",
            "wins": 53
          },
          {
            "name": "Kimi Räikkönen",
            "age": 42,
            "team": "Alfa Romeo Racing",
            "wins": 21
          },
          {
            "name": "Antonio Giovinazzi",
            "age": 27,
            "team": "Alfa Romeo Racing",
            "wins": 0
          },
          {
            "name": "George Russell",
            "age": 23,
            "team": "Williams Racing",
            "wins": 0
          },
          {
            "name": "Nicholas Latifi",
            "age": 26,
            "team": "Williams Racing",
            "wins": 0
          },
          {
            "name": "Mick Schumacher",
            "age": 23,
            "team": "Haas F1 team",
            "wins": 0
          },
          {
            "name": "Nikita Mazepin",
            "age": 23,
            "team": "Haas F1 team",
            "wins": 0
          }
        ]
        await this.project.import([
          {
            data,
            header: {
              'text-align': 'left',
              'border-bottom': '1px solid red'
            },
            columns: [
              {
                header: {
                  style: {
                    'text-align': 'left',
                    'border-bottom': '1px solid red'
                  },
                  value: 'Driver'  
                },
                footer: {
                  value: ''
                },
                key: 'name'
              },
              {
                header: {
                  value: 'Team'  
                },
                footer: {
                  value: ''
                },
                key: 'team'
              },
              {
                header: {
                  value: 'Wins'  
                },
                footer: {
                  value: (data.map(o => o.wins).reduce((a: any, b: any) => a + b, 0) / data.length)
                },
                key: 'wins'
              },
              {
                header: {
                  value: 'Age'  
                },
                footer: {
                  value: (data.map(o => o.age).reduce((a: any, b: any) => a + b, 0) / data.length)
                },
                key: 'age'
              }
            ],
            position: {
              x: 200,
              y: 200,
              width: 500,
              height: 800
            },
            type: 'table'
          }
        ])
        break
      case ('text'):
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            type: 'text',
            value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque mollitia amet inventore et impedit laboriosam ullam unde. Molestias quasi cum ea optio, minima magnam omnis, recusandae molestiae commodi hic quaerat.'
          }
        ])
        break
      case ('vector'):
        await this.project.import([
          {
            fill: {
              color: '#03A9F4',
              opacity: 75
            },
            stroke: {
              color: '#03A9F4',
              opacity: 100
            },
            position: {
              x: 200,
              y: 200,
              width: 200,
              height: 200
            },
            src: 'http://localhost:4200/assets/icon.png',
            type: 'vector'
          }
        ])
        break
      case ('chart-area'):
        break
      case ('chart-bar'):
        break
      case ('chart-column'):
        break
      case ('chart-donut'):
        break
      case ('chart-line'):
        break
      case ('chart-pie'):
        break
    }
  }

  ngOnInit () {
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
      this.SetExampleMode(this.mode)
    })
    this.project.on('dragging', () => { })
  }
}
