import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'core-page',
  styleUrls: ['./core.page.scss'],
  templateUrl: './core.page.html'
})

export class CorePage implements AfterViewInit {

  constructor(private title: Title, private route: ActivatedRoute) { }

  public sections = sections;

  ngAfterViewInit(): void {
    this.title.setTitle('NGXCANVAS | CORE DOCS');

    this.route.params.subscribe((params: any) => {
      let id = ['docs', 'core'];
      if (params.section) id.push(params.section);
      if (params.subsection) id.push(params.subsection);
      let element = document.getElementById(id.join('-'));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });

    const params: any = this.route.snapshot.params;
    let id = ['docs', 'core'];
    if (params.section) id.push(params.section);
    if (params.subsection) id.push(params.subsection);
    let element = document.getElementById(id.join('-'));
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

}

const sections = [
  {
    id: "docs-core-installation",
    header: "Installation",
    paragraph: "Simply run npm install to add library to your node modules.",
    code: "npm i --save @ngx-canvas/core;"
  },
  {
    id: "docs-core-usage",
    header: "Usage",
    paragraph: "Initialise project variable in your component and link it to your canvas via the canvas id attribute. Once that is done you can then import shapes into your project or draw new shapes. If you want to learn how to draw shapes go to <a class=\"link\" href=\"/docs/core/shapes\">shapes documentation</a>",
    code: "import \{ Project \} from '@ngx-canvas/core';\n\nconst project = new Project('canvas-id');\n\nproject.import([SHAPE, SHAPE, SHAPE]);"
  },
  {
    id: "docs-core-tools",
    header: "Tools",
    paragraph: "These are helper classes that extend shapes and perform vital actions"
  },
  {
    id: "docs-core-tools-alignment",
    subheader: "Alignment Tool",
    paragraph: "Align shapes on canvas in various different positions with ease. Shapes must be selected before alignment can be processed.",
    code: "import { AlignmentTool } from '@ngx-canvas/core';\n\nconst align = new AlignmentTool();\n\n// Select shapes for alignment!\n\nalign.tops();\nalign.lefts();\nalign.rights();\nalign.bottoms();\nalign.centers();\nalign.sendtoback();\nalign.sendbackward();\nalign.bringtofront();\nalign.bringforward();\nalign.verticalcenters();\nalign.horizontalcenters();"
  },
  {
    id: "docs-core-tools-keyboard",
    subheader: "Keyboard Tool",
    paragraph: "Listen for key taps and emit events",
    code: "import { KeyboardTool } from '@ngx-canvas/core';\n\nconst keyboard = new KeyboardTool();\n\nkeyboard.keyup.subscribe((event: KeyboardEvent) => {});\n\nkeyboard.keydown.subscribe((event: KeyboardEvent) => {});"
  },
  {
    id: "docs-core-shapes",
    header: "Shapes",
    paragraph: "These are elements on the canvas that can be created and formatted to produce graphics"
  },
  {
    id: "docs-core-shapes-arc",
    subheader: "Arc Shape",
    paragraph: "Draw arc on the canvas",
    code: "import { Arc } from '@ngx-canvas/core';\n\nconst arc = new Arc({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    radius: 50,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "arc",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-button",
    subheader: "Button Shape",
    paragraph: "Draw button on the canvas",
    code: "import { Button } from '@ngx-canvas/core';\n\nconst button = new Button({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    radius: 50,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "button",
        description: ""
      },
      {
        name: "fill",
        type: "FILL",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "font",
        type: "Font",
        default: "<a class=\"link\" href=\"/docs/core/utilities/font\">new Font()</a>",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "value",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-chart",
    subheader: "Chart Shape - Alpha Development",
    paragraph: "Draw chart on the canvas",
    code: "import { Chart } from '@ngx-canvas/core';\n\nconst chart = new Chart({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "chart",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "font",
        type: "Font",
        default: "<a class=\"link\" href=\"/docs/core/utilities/font\">new Font()</a>",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "{}",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "value",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-circle",
    subheader: "Circle Shape",
    paragraph: "Draw circle on the canvas",
    code: "import { Circle } from '@ngx-canvas/core';\n\nconst circle = new Circle({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    radius: 50,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "circle",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-group",
    subheader: "Group Shape",
    paragraph: "Draw group on the canvas",
    code: "import { Group } from '@ngx-canvas/core';\n\nconst group = new Group({\n  children: [SHAPE, SHAPE]\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "group",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "children",
        type: "Shape[]",
        default: "[]",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-line",
    subheader: "Line Shape",
    paragraph: "Draw line on the canvas",
    code: "import { Line } from '@ngx-canvas/core';\n\nconst line = new Line({\n  points: [POINT, POINT, POINT, POINT]\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "line",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "points",
        type: "Point[]",
        default: "[]",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-polygon",
    subheader: "Polygon Shape",
    paragraph: "Draw polygon on the canvas",
    code: "import { Polygon } from '@ngx-canvas/core';\n\nconst polygon = new Polygon({\n  points: [POINT, POINT, POINT, POINT]\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "polygon",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "points",
        type: "Point[]",
        default: "[]",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-rectangle",
    subheader: "Rectangle Shape",
    paragraph: "Draw rectangle on the canvas",
    code: "import { Rectangle } from '@ngx-canvas/core';\n\nconst rectangle = new Rectangle({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "rectangle",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "font",
        type: "Font",
        default: "<a class=\"link\" href=\"/docs/core/utilities/font\">new Font()</a>",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "{}",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-text",
    subheader: "Text Shape",
    paragraph: "Draw text on the canvas",
    code: "import { Text } from '@ngx-canvas/core';\n\nconst text = new Text({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "text",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "font",
        type: "Font",
        default: "<a class=\"link\" href=\"/docs/core/utilities/font\">new Font()</a>",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "{}",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "value",
        type: "Number|String",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-shapes-vector",
    subheader: "Vector Shape",
    paragraph: "Draw vector on the canvas",
    code: "import { Vector } from '@ngx-canvas/core';\n\nconst vector = new Vector({\n  position: {\n    x: 0,\n    y: 0,\n    width: 100,\n    height: 100\n  }\n});",
    properties: [
      {
        name: "id",
        type: "Readonly String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "src",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "type",
        type: "Readonly String",
        default: "vector",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "<a class=\"link\" href=\"/docs/core/utilities/fill\">new Fill()</a>",
        description: ""
      },
      {
        name: "font",
        type: "Font",
        default: "<a class=\"link\" href=\"/docs/core/utilities/font\">new Font()</a>",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "{}",
        description: ""
      },
      {
        name: "name",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "value",
        type: "Number|String",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "<a class=\"link\" href=\"/docs/core/utilities/stroke\">new Stroke()</a>",
        description: ""
      },
      {
        name: "hidden",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "<a class=\"link\" href=\"/docs/core/utilities/position\">new Position()</a>",
        description: ""
      },
      {
        name: "selected",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "dragging",
        type: "Boolean",
        default: "false",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities",
    header: "Utilities",
    paragraph: "These are extension classes"
  },
  {
    id: "docs-core-utilities-color",
    subheader: "Color Utility",
    paragraph: "Creates a color class",
    code: "import { Color } from '@ngx-canvas/core';\n\nconst Color = new Color('#000000');",
    properties: [
      {
        name: "r",
        type: "Number",
        default: "null",
        description: ""
      },
      {
        name: "g",
        type: "Number",
        default: "null",
        description: ""
      },
      {
        name: "b",
        type: "Number",
        default: "null",
        description: ""
      },
      {
        name: "a",
        type: "Number",
        default: "null",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-events",
    subheader: "Events Utility",
    paragraph: "Creates a event class",
    code: "import { Events } from '@ngx-canvas/core';\n\nconst events = new Events();",
    properties: [
      {
        name: "events",
        type: "Functions{}",
        default: "null",
        description: ""
      },
      {
        name: "on(event: string, dispatcher: Function)",
        type: "Function",
        default: "null",
        description: ""
      },
      {
        name: "onffevent: string)",
        type: "Function",
        default: "null",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-fill",
    subheader: "Fill Utility",
    paragraph: "Creates a fill class",
    code: "import { Fill } from '@ngx-canvas/core';\n\nconst fill = new Fill({\n  color: 'rgba(0, 0, 0, 1)'\n});",
    properties: [
      {
        name: "color",
        type: "String",
        default: "null",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-font",
    subheader: "Font Utility",
    paragraph: "Creates a font class",
    code: "import { Font } from '@ngx-canvas/core';\n\nconst font = new Font({\n  size: 14,\n  color: 'rgba(0, 0, 0, 1)',\n  family: 'sans-serif',\n  baseline: 'middle',\n  alignment: 'center'\n});",
    properties: [
      {
        name: "size",
        type: "Number",
        default: "14",
        description: ""
      },
      {
        name: "color",
        type: "String",
        default: "rgba(0, 0, 0, 1)",
        description: ""
      },
      {
        name: "family",
        type: "String",
        default: "sans-serif",
        description: ""
      },
      {
        name: "baseline",
        type: "String",
        default: "middle",
        description: ""
      },
      {
        name: "alignment",
        type: "String",
        default: "center",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-point",
    subheader: "Point Utility",
    paragraph: "Creates a point class",
    code: "import { Point } from '@ngx-canvas/core';\n\nconst point = new Point({\n  x: 0,\n  y: 0\n});",
    properties: [
      {
        name: "x",
        type: "Number",
        default: "0",
        description: ""
      },
      {
        name: "y",
        type: "Number",
        default: "0",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-position",
    subheader: "Position Utility",
    paragraph: "Creates a position class",
    code: "import { Position } from '@ngx-canvas/core';\n\nconst position = new Position({\n  center: {\n    x: 0,\n    y: 0\n  },\n  x: 0,\n  y: 0,\n  top: 0,\n  left: 0,\n  right: 0,\n  width: 0,\n  radius: 0,\n  height: 0,\n  bottom: 0,\n  rotation: 0\n});",
    properties: [
      {
        name: "x",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "y",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "top",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "left",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "right",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "width",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "center",
        type: "Point",
        default: "new Point()",
        description: ""
      },
      {
        name: "radius",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "height",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "bottom",
        type: "Number",
        default: 0,
        description: ""
      },
      {
        name: "rotation",
        type: "Number",
        default: 0,
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-select",
    subheader: "Select Utility",
    paragraph: "Creates a select class",
    code: "import { Select } from '@ngx-canvas/core';\n\nconst select = new Select(SHAPE);"
  },
  {
    id: "docs-core-utilities-select-box",
    subheader: "Select Box Utility",
    paragraph: "Creates a select box class",
    code: "import { SelectBox } from '@ngx-canvas/core';\n\nconst selectbox = new SelectBox(SHAPE);",
    properties: [
      {
        name: "color",
        type: "String",
        default: "#2196F3",
        description: ""
      },
      {
        name: "active",
        type: "Boolean",
        default: "false",
        description: ""
      },
      {
        name: "position",
        type: "Position",
        default: "new Position()",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-seires",
    subheader: "Seires Utility - Alpha Development",
    paragraph: "Creates a series class",
    code: "import { Seires } from '@ngx-canvas/core';\n\nconst seires = new Seires();",
    properties: [
      {
        name: "id",
        type: "String",
        default: "ObjectId()",
        description: ""
      },
      {
        name: "type",
        type: "String",
        default: "series",
        description: ""
      },
      {
        name: "fill",
        type: "Fill",
        default: "new Fill()",
        description: ""
      },
      {
        name: "data",
        type: "Any",
        default: "null",
        description: ""
      },
      {
        name: "title",
        type: "String",
        default: "null",
        description: ""
      },
      {
        name: "value",
        type: "Number",
        default: "null",
        description: ""
      },
      {
        name: "stroke",
        type: "Stroke",
        default: "new Stroke()",
        description: ""
      }
    ]
  },
  {
    id: "docs-core-utilities-snap-point",
    subheader: "Snap Point Utility - Alpha Development",
    paragraph: "Creates a snap point class",
    code: "import { SnapPoint } from '@ngx-canvas/core';\n\nconst snappoint = new SnapPoint();"
  },
  {
    id: "docs-core-utilities-stroke",
    subheader: "Stroke Utility",
    paragraph: "Creates a stroke class",
    code: "import { Stroke } from '@ngx-canvas/core';\n\nconst stroke = new Stroke();",
    properties: [
      {
        name: "cap",
        type: "String",
        default: "round",
        description: ""
      },
      {
        name: "width",
        type: "Number",
        default: "1",
        description: ""
      },
      {
        name: "style",
        type: "String",
        default: "solid",
        description: ""
      },
      {
        name: "color",
        type: "String",
        default: "rgba(0, 0, 0, 1)",
        description: ""
      }
    ]
  }
];