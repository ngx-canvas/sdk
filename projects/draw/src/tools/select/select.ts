import * as d3 from 'd3';
import { Subject } from 'rxjs';
import {
  Points,
  Position,
  Transform,
  Selection,
  CurveMode,
  CurveModes,
} from '@libs/common';

/**
 * Selection box color constant
 */
const SELECTION_COLOR = '#2196F3';

/**
 * CSS class for selected shapes
 */
const SELECTED_CLASS = 'selected';

/**
 * CSS class for shape elements
 */
const SHAPE_CLASS = 'shape';

export class SelectTool {
  private readonly projectId: string;
  private _selection: Selection = d3.select('reset');

  public count = 0;
  public origin: { x: number; y: number } = { x: 0, y: 0 };
  public readonly changes: Subject<SelectBoxEvent> =
    new Subject<SelectBoxEvent>();
  public readonly context: Subject<MouseEvent> = new Subject<MouseEvent>();
  public enabled = true;
  public destination: { x: number; y: number } = { x: 0, y: 0 };

  private readonly _box: SelectBox;

  constructor(projectId: string) {
    this.projectId = projectId;
    this._box = new SelectBox(projectId);

    this._box.changes.subscribe((event) => this.changes.next(event));
    this._box.context.subscribe((event) => this.context.next(event));

    this._box.changes.subscribe((event) => {
      const shapes = d3.selectAll(
        `#${projectId} .${SHAPE_CLASS}.${SELECTED_CLASS}`,
      );
      shapes.each(function () {
        const shape = d3.select(this);
        const position = new Position().fromSelection(shape as any);
        switch (event.from) {
          case 'body': {
            position.x += event.dx;
            position.y += event.dy;
            position.top += event.dy;
            position.left += event.dx;
            position.right += event.dx;
            position.bottom += event.dy;

            shape.attr('x', position.x);
            shape.attr('y', position.y);
            shape.attr('top', position.top);
            shape.attr('left', position.left);
            shape.attr('right', position.right);
            shape.attr('bottom', position.bottom);

            const points = new Points().fromString(shape);
            if (points.exists) {
              points.value = points.value.map((o) => {
                return {
                  x: o.x + event.dx,
                  y: o.y + event.dy,
                };
              });
              shape.attr('points', points.toString());
              if (shape.attr('d'))
                shape.datum(points.value).attr(
                  'd',
                  <any>d3
                    .line()
                    .x((d: any) => d.x)
                    .y((d: any) => d.y)
                    .curve(CurveMode[<CurveModes>shape.attr('curve-mode')]),
                );
            }

            const transform = new Transform().fromString(shape);
            if (transform.exists) {
              transform.rotate.x += event.dx;
              transform.rotate.y += event.dy;
              transform.translate.x += event.dx;
              transform.translate.y += event.dy;
              shape.attr('transform', transform.toString());
            }
            break;
          }
          case 'r': {
            // Apply rotation to the shape
            if (event.rotation !== undefined) {
              const cx = position.x + position.width / 2;
              const cy = position.y + position.height / 2;
              shape.attr(
                'transform',
                `rotate(${event.rotation}, ${cx}, ${cy})`,
              );
            }
            break;
          }
          case 'n': {
            position.y += event.dy;
            position.top += event.dy;
            position.height -= event.dy;

            shape.attr('y', position.y);
            shape.attr('top', position.top);
            shape.attr('height', position.height);
            break;
          }
          case 'e': {
            position.width += event.dx;
            position.right += event.dx;

            shape.attr('width', position.width);
            shape.attr('right', position.right);
            break;
          }
          case 's': {
            position.height += event.dy;
            position.bottom += event.dy;

            shape.attr('height', position.height);
            shape.attr('bottom', position.bottom);
            break;
          }
          case 'w': {
            position.x += event.dx;
            position.left += event.dx;
            position.width -= event.dx;

            shape.attr('x', position.x);
            shape.attr('left', position.left);
            shape.attr('width', position.width);
            break;
          }
          case 'ne': {
            position.y += event.dy;
            position.top += event.dy;
            position.width += event.dx;
            position.right += event.dx;
            position.height -= event.dy;

            shape.attr('y', position.y);
            shape.attr('top', position.top);
            shape.attr('width', position.width);
            shape.attr('right', position.right);
            shape.attr('height', position.height);
            break;
          }
          case 'nw': {
            position.x += event.dx;
            position.y += event.dy;
            position.top += event.dy;
            position.left += event.dx;
            position.width -= event.dx;
            position.height -= event.dy;

            shape.attr('y', position.y);
            shape.attr('x', position.x);
            shape.attr('top', position.top);
            shape.attr('left', position.left);
            shape.attr('width', position.width);
            shape.attr('height', position.height);
            break;
          }
          case 'se': {
            position.width += event.dx;
            position.right += event.dx;
            position.height += event.dy;
            position.bottom += event.dy;

            shape.attr('width', position.width);
            shape.attr('right', position.right);
            shape.attr('height', position.height);
            shape.attr('bottom', position.bottom);
            break;
          }
          case 'sw': {
            position.x += event.dx;
            position.left += event.dx;
            position.width -= event.dx;
            position.height += event.dy;
            position.bottom += event.dy;

            shape.attr('x', position.x);
            shape.attr('left', position.left);
            shape.attr('width', position.width);
            shape.attr('height', position.height);
            shape.attr('bottom', position.bottom);
            break;
          }
        }
        // Update center point
        const newCx = position.x + position.width / 2;
        const newCy = position.y + position.height / 2;
        shape.attr('cx', newCx);
        shape.attr('cy', newCy);

        // Update ellipse radii if this is an ellipse
        const shapeType = shape.attr('type');
        if (shapeType === 'ellipse') {
          shape.attr('rx', position.width / 2);
          shape.attr('ry', position.height / 2);
        }

        // Update transform to use new center (preserve rotation angle)
        const transformAttr = shape.attr('transform');
        if (transformAttr && event.from !== 'r') {
          const rotateMatch = transformAttr.match(/rotate\(([^,)]+)/);
          if (rotateMatch) {
            const angle = parseFloat(rotateMatch[1]) || 0;
            shape.attr('transform', `rotate(${angle}, ${newCx}, ${newCy})`);
          }
        }
      });
    });
  }

  /**
   * Select all shapes in the project
   * @returns Selection result with all shapes
   */
  all() {
    return this.byBounds({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      width: Infinity,
      right: Infinity,
      height: Infinity,
      bottom: Infinity,
    });
  }

  /**
   * Select a shape by ID
   * @param id The shape ID
   * @param shapeClass The shape class constructor (unused, kept for backward compatibility)
   * @param scale The current scale factor
   * @returns The selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  byId(id: string, shapeClass: unknown, scale: number) {
    this._selection = d3.select(`#${id}`);
    if (this._selection.empty()) {
      return this.selection();
    }

    // Mark shape as selected
    this._selection.classed(SELECTED_CLASS, true);

    // Get position from selection attributes
    const position = new Position().fromSelection(this._selection as any);

    // Get the shape's current rotation from transform attribute
    let rotation = 0;
    const transformAttr = this._selection.attr('transform');
    if (transformAttr) {
      const rotateMatch = transformAttr.match(/rotate\(([^,)]+)/);
      if (rotateMatch) {
        rotation = parseFloat(rotateMatch[1]) || 0;
      }
    }

    this._box.show({ ...position, rotation });
    this._box.scale(scale);

    // Update selection count
    this._count();

    return this.selection();
  }

  hideBox() {
    return this._box.hide();
  }

  private _count(): void {
    this.count = d3
      .selectAll(`#${this.projectId} .${SHAPE_CLASS}.${SELECTED_CLASS}`)
      .filter(function () {
        return d3.select(this).classed(SELECTED_CLASS);
      })
      .size();
  }

  showBox(args: SelectionBounds) {
    args.y = args.top;
    args.x = args.left;
    this._box.show(args);
    this._box.scale(args.scale || 1);
  }

  enable() {
    this.enabled = true;
    return this.enabled;
  }

  disable() {
    this.enabled = false;
    return this.enabled;
  }

  byBounds(area: SelectionBounds) {
    const bounds: SelectionBounds = {
      x: Infinity,
      y: Infinity,
      top: Infinity,
      left: Infinity,
      width: -Infinity,
      right: -Infinity,
      height: -Infinity,
      bottom: -Infinity,
    };

    d3.selectAll(`#${this.projectId} svg.ngx-canvas > .${SHAPE_CLASS}`).each(
      function () {
        const shape = d3.select(this);
        const top = Number(shape.attr('top')) || 0;
        const left = Number(shape.attr('left')) || 0;
        const right = Number(shape.attr('right')) || 0;
        const bottom = Number(shape.attr('bottom')) || 0;

        if (
          top >= area.top &&
          left >= area.left &&
          right <= area.right &&
          bottom <= area.bottom
        ) {
          if (!shape.classed(SELECTED_CLASS)) {
            shape.classed(SELECTED_CLASS, true);
          }
          if (top <= bounds.top) bounds.top = top;
          if (left <= bounds.left) bounds.left = left;
          if (right >= bounds.right) bounds.right = right;
          if (bottom >= bounds.bottom) bounds.bottom = bottom;
        }
      },
    );

    this._selection = d3
      .selectAll(`#${this.projectId} svg.ngx-canvas > .${SHAPE_CLASS}`)
      .filter(function () {
        return d3.select(this).classed(SELECTED_CLASS);
      });

    bounds.y = bounds.top;
    bounds.x = bounds.left;
    bounds.width = bounds.right - bounds.left;
    bounds.height = bounds.bottom - bounds.top;

    this._count();

    return {
      bounds,
      selection: this._selection,
    };
  }

  /**
   * Unselect all shapes
   */
  unselect(): void {
    const shapes = d3.selectAll(
      `#${this.projectId} svg.ngx-canvas > .${SHAPE_CLASS}`,
    );
    shapes.classed(SELECTED_CLASS, false);
    this._selection = d3.select('reset');
    this.count = 0;
  }

  scale(_scale: number) {
    this._box.scale(_scale);
  }

  /**
   * Get the current selection
   */
  selection(): Selection {
    return d3.selectAll(`#${this.projectId} .${SHAPE_CLASS}.${SELECTED_CLASS}`);
  }
}

class SelectBox {
  public readonly end: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>();
  public readonly drag: Subject<OrdinanceEvent> = new Subject<OrdinanceEvent>();
  public readonly start: Subject<OrdinanceEvent> =
    new Subject<OrdinanceEvent>();
  public readonly changes: Subject<SelectBoxEvent> =
    new Subject<SelectBoxEvent>();
  public readonly context: Subject<MouseEvent> = new Subject<MouseEvent>();

  private readonly _element: d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private readonly projectId: string;
  private _initialMouseAngle = 0;
  private _startRotation = 0;
  private _currentRotation = 0;

  constructor(projectId: string) {
    this.projectId = projectId;
    this._element = d3
      .select(`#${projectId} #ngx-container`)
      .append('div')
      .attr('class', 'tool select')
      .style('top', '0px')
      .style('left', '0px')
      .style('width', '0px')
      .style('height', '0px')
      .style('z-index', '1')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('transform-origin', 'center center')
      .style('transform', 'rotate(0deg)');
    this._element
      .append('div')
      .attr('class', 'r-line')
      .style('top', '-20px')
      .style('left', '50%')
      .style('width', '1px')
      .style('height', '20px')
      .style('position', 'absolute')
      .style('background-color', SELECTION_COLOR);

    this._element
      .append('div')
      .attr('class', 'border')
      .style('top', '0px')
      .style('left', '0px')
      .style('right', '0px')
      .style('bottom', '0px')
      .style('cursor', 'move')
      .style('border', `1px solid ${SELECTION_COLOR}`)
      .style('z-index', '0')
      .style('position', 'absolute')
      .style('background-color', 'rgba(33, 150, 243, 0.1)');

    const offset = {
      x: 0,
      y: 0,
    };

    const drag = d3.drag();
    drag.on('end', (event) => this.end.next({ by: 'body', event }));
    drag.on('drag', (event) => this.drag.next({ by: 'body', event }));
    drag.on('start', (event) => {
      const top = Number(this._element.style('top').replace('px', ''));
      const left = Number(this._element.style('left').replace('px', ''));
      offset.y = event.sourceEvent.pageY - top;
      offset.x = event.sourceEvent.pageX - left;
      this.start.next({ by: 'body', event });
    });
    this._element.call(drag as any);

    this._element.on('contextmenu', (event: MouseEvent) =>
      this.context.next(event),
    );

    this.ordinance(this._element, 'r');
    this.ordinance(this._element, 'n');
    this.ordinance(this._element, 'e');
    this.ordinance(this._element, 's');
    this.ordinance(this._element, 'w');
    this.ordinance(this._element, 'ne');
    this.ordinance(this._element, 'nw');
    this.ordinance(this._element, 'se');
    this.ordinance(this._element, 'sw');

    this.start.subscribe(({ by, event }: OrdinanceEvent) => {
      if (by === 'r') {
        // Get the container's bounding rect for accurate coordinate conversion
        const container = document.querySelector(`#${this.projectId}`);
        const containerRect = container?.getBoundingClientRect() || {
          left: 0,
          top: 0,
        };

        // Calculate the center of the selection box in screen coordinates
        const boxTop = Number(this._element.style('top').replace('px', ''));
        const boxLeft = Number(this._element.style('left').replace('px', ''));
        const boxWidth = Number(this._element.style('width').replace('px', ''));
        const boxHeight = Number(
          this._element.style('height').replace('px', ''),
        );

        // Center in screen coordinates
        const centerX = containerRect.left + boxLeft + boxWidth / 2;
        const centerY = containerRect.top + boxTop + boxHeight / 2;

        // Calculate initial angle from center to mouse position
        const mouseX = event.sourceEvent.clientX;
        const mouseY = event.sourceEvent.clientY;
        this._initialMouseAngle =
          Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        // Store the starting rotation
        this._startRotation = this._currentRotation;
      }
    });

    this.drag.subscribe(({ by, event }: OrdinanceEvent) => {
      const top = Number(this._element.style('top').replace('px', ''));
      const left = Number(this._element.style('left').replace('px', ''));
      const width = Number(this._element.style('width').replace('px', ''));
      const height = Number(this._element.style('height').replace('px', ''));
      switch (by) {
        case 'r': {
          // Get the container's bounding rect for accurate coordinate conversion
          const container = document.querySelector(`#${this.projectId}`);
          const containerRect = container?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };

          // Center in screen coordinates
          const centerX = containerRect.left + left + width / 2;
          const centerY = containerRect.top + top + height / 2;

          // Calculate current angle from center to mouse position
          const mouseX = event.sourceEvent.clientX;
          const mouseY = event.sourceEvent.clientY;
          const currentMouseAngle =
            Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

          // Calculate the new rotation (starting rotation + angle delta)
          const angleDelta = currentMouseAngle - this._initialMouseAngle;
          this._currentRotation = this._startRotation + angleDelta;

          // Update the selection box rotation
          this._element.style(
            'transform',
            `rotate(${this._currentRotation}deg)`,
          );

          // Emit the rotation change
          this.changes.next({
            dx: 0,
            dy: 0,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
            rotation: this._currentRotation,
          });
          break;
        }
        case 'n':
          this._element.style('top', `${top + event.dy}px`);
          this._element.style('height', `${height - event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'e':
          this._element.style('width', `${width + event.dx}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 's':
          this._element.style('height', `${height + event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'w':
          this._element.style('left', `${left + event.dx}px`);
          this._element.style('width', `${width - event.dx}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'ne':
          this._element.style('top', `${top + event.dy}px`);
          this._element.style('width', `${width + event.dx}px`);
          this._element.style('height', `${height - event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'nw':
          this._element.style('top', `${top + event.dy}px`);
          this._element.style('left', `${left + event.dx}px`);
          this._element.style('width', `${width - event.dx}px`);
          this._element.style('height', `${height - event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'se':
          this._element.style('width', `${width + event.dx}px`);
          this._element.style('height', `${height + event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'sw':
          this._element.style('left', `${left + event.dx}px`);
          this._element.style('width', `${width - event.dx}px`);
          this._element.style('height', `${height + event.dy}px`);
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
        case 'body':
          this._element.style('top', `${event.sourceEvent.pageY - offset.y}px`);
          this._element.style(
            'left',
            `${event.sourceEvent.pageX - offset.x}px`,
          );
          this.changes.next({
            dx: event.dx,
            dy: event.dy,
            top,
            left,
            from: by,
            right: left + width,
            bottom: top + height,
          });
          break;
      }
    });
  }

  private ordinance(parent: Selection, classed: OrdinancePoint) {
    const ordinance = parent
      .append('div')
      .attr('class', classed)
      .style('width', '7px')
      .style('height', '7px')
      .style('z-index', '1')
      .style('border', '1px solid #FFFFFF')
      .style('position', 'absolute')
      .style('background-color', SELECTION_COLOR);
    switch (classed) {
      case 'r':
        ordinance
          .style('top', '-25px')
          .style('left', 'calc(50% - 4px)')
          .style('cursor', 'grab')
          .style('border-radius', '100%');
        break;
      case 'n':
        ordinance
          .style('top', '-4px')
          .style('left', 'calc(50% - 4px)')
          .style('cursor', 'n-resize');
        break;
      case 'e':
        ordinance
          .style('top', 'calc(50% - 4px)')
          .style('right', '-4px')
          .style('cursor', 'e-resize');
        break;
      case 's':
        ordinance
          .style('left', 'calc(50% - 4px)')
          .style('bottom', '-4px')
          .style('cursor', 's-resize');
        break;
      case 'w':
        ordinance
          .style('top', 'calc(50% - 4px)')
          .style('left', '-4px')
          .style('cursor', 'w-resize');
        break;
      case 'ne':
        ordinance
          .style('top', '-4px')
          .style('right', '-4px')
          .style('cursor', 'ne-resize');
        break;
      case 'nw':
        ordinance
          .style('top', '-4px')
          .style('left', '-4px')
          .style('cursor', 'nw-resize');
        break;
      case 'se':
        ordinance
          .style('right', '-4px')
          .style('bottom', '-4px')
          .style('cursor', 'se-resize');
        break;
      case 'sw':
        ordinance
          .style('left', '-4px')
          .style('bottom', '-4px')
          .style('cursor', 'sw-resize');
        break;
    }

    // const offset = {
    //   x: 0,
    //   y: 0
    // }

    const drag = d3.drag();
    drag.on('end', (event) => this.end.next({ by: classed, event }));
    drag.on('drag', (event) => {
      this.drag.next({ by: classed, event });
    });
    drag.on('start', (event) => {
      // const top = Number(this._element.style('top').replace('px', ''))
      // const left = Number(this._element.style('left').replace('px', ''))
      // offset.y = event.sourceEvent.pageY - top
      // offset.x = event.sourceEvent.pageX - left
      this.start.next({ by: classed, event });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ordinance.call(<any>drag);
  }

  public show({ x, y, width, height, rotation }: SelectionBounds) {
    // Set rotation (use provided rotation or reset to 0)
    this._currentRotation = rotation || 0;
    this._startRotation = this._currentRotation;
    this._initialMouseAngle = 0;

    this._element
      .attr('top', y)
      .attr('left', x)
      .attr('width', width)
      .attr('height', height)
      .style('top', `${y}px`)
      .style('left', `${x}px`)
      .style('width', `${width + 1}px`)
      .style('height', `${height + 1}px`)
      .style('display', 'block')
      .style('transform', `rotate(${this._currentRotation}deg)`);
  }

  hide() {
    this._element.style('display', 'none');
  }

  scale(_scale: number) {
    const top = Number(this._element.attr('top')) * _scale;
    const left = Number(this._element.attr('left')) * _scale;
    const width = Number(this._element.attr('width')) * _scale;
    const height = Number(this._element.attr('height')) * _scale;
    this._element
      .style('top', `${top}px`)
      .style('left', `${left}px`)
      .style('width', `${width + 1}px`)
      .style('height', `${height + 1}px`)
      .style('transform', `rotate(${this._currentRotation}deg)`);
  }
}

interface SelectBoxEvent {
  dx: number;
  dy: number;
  top: number;
  left: number;
  from: OrdinancePoint;
  right: number;
  bottom: number;
  rotation?: number;
}

type OrdinancePoint =
  | 'r'
  | 'n'
  | 'e'
  | 's'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw'
  | 'body';

interface OrdinanceEvent {
  by: 'r' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'body';
  event: DragSourceEvent;
}

interface DragSourceEvent extends DragEvent {
  dx: number;
  dy: number;
  sourceEvent: MouseEvent;
}

interface SelectionBounds {
  x: number;
  y: number;
  top: number;
  left: number;
  width: number;
  right: number;
  scale?: number;
  height: number;
  bottom: number;
  rotation?: number;
}
