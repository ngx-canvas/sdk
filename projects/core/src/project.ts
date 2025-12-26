import * as d3 from 'd3';
import { Subject } from 'rxjs';

/* --- SHAPES --- */
import {
  Text,
  Line,
  Curve,
  Group,
  Chart,
  Table,
  Range,
  Vector,
  Iframe,
  Ellipse,
  Polygon,
  Polyline,
  Rectangle,
  Shape,
} from './shapes';

/* --- GLOBALS --- */
import { globals } from './globals';

/* --- UTILITIES --- */
import { Fill } from './utilities';
import { Selection } from '@libs/common';

class ProjectEvents {
  public ready: Subject<void> = new Subject<void>();
  public dragging: Subject<Shape> = new Subject<Shape>();
}

export interface ProjectOptions {
  width?: number;
  height?: number;
}

export class Project extends ProjectEvents {
  public fill: Fill = new Fill();
  public width = 600;
  public height = 600;

  private shapes: Shape[] = [];
  private projectId: string;
  private _svg: Selection | null = null;

  constructor(reference: string, options: ProjectOptions = {}) {
    super();

    if (options.width && options.width > 0) this.width = options.width;
    if (options.height && options.height > 0) this.height = options.height;

    this.projectId = reference;
    this.initialize(reference);
  }

  /**
   * Get the SVG selection element
   * @returns The SVG selection or null if not initialized
   */
  public getSvg(): Selection | null {
    return this._svg || globals.svg;
  }

  /**
   * Get the project ID
   */
  public id(): string {
    return this.projectId;
  }

  /**
   * Add a shape to the project
   * @param shape The shape to add
   * @returns The added shape
   */
  public addShape(shape: Shape): Shape {
    if (!this._svg) {
      throw new Error('Project not initialized. Wait for ready event.');
    }

    this.shapes.push(shape);
    shape.apply(this._svg);
    return shape;
  }

  /**
   * Remove a shape from the project
   * @param shapeId The ID of the shape to remove
   * @returns True if shape was removed, false otherwise
   */
  public removeShape(shapeId: string): boolean {
    const index = this.shapes.findIndex((s) => s.id === shapeId);
    if (index === -1) return false;

    const shape = this.shapes[index];
    shape.remove();
    this.shapes.splice(index, 1);
    return true;
  }

  /**
   * Get all shapes in the project
   * @returns Array of all shapes
   */
  public getShapes(): Shape[] {
    return [...this.shapes];
  }

  /**
   * Get a shape by ID
   * @param shapeId The ID of the shape
   * @returns The shape or undefined if not found
   */
  public getShape(shapeId: string): Shape | undefined {
    return this.shapes.find((s) => s.id === shapeId);
  }

  /**
   * Clear all shapes from the project
   */
  public clear(): void {
    this.shapes.forEach((shape) => shape.remove());
    this.shapes = [];
  }

  /**
   * @deprecated Use getSvg() instead
   */
  public element() {
    return this.getSvg();
  }

  private draw(): void {
    if (!this._svg) return;
    this.shapes.forEach((shape) => {
      if (!shape.el) {
        shape.apply(this._svg!);
      }
    });
  }

  /**
   * Reset the project by removing all shapes
   * @deprecated Use clear() instead
   */
  public reset(): void {
    this.clear();
  }

  public export(type: 'svg'): string {
    if (!this._svg) {
      throw new Error('Project not initialized');
    }

    const svgClone = d3
      .select(`#${this.projectId} svg`)
      .clone(true) as Selection;
    if (svgClone.empty()) {
      throw new Error('SVG element not found');
    }

    svgClone.attr('style', null);
    svgClone.attr('class', null);
    svgClone.attr('current-scale', null);
    svgClone.selectAll('.tool').remove();

    switch (type) {
      case 'svg': {
        const node = svgClone.node();
        if (!node) {
          throw new Error('Failed to clone SVG node');
        }
        return new XMLSerializer().serializeToString(node);
      }
      default: {
        throw new Error(`Unsupported export type: ${type}`);
      }
    }
  }

  /**
   * Destroy the project and clean up resources
   */
  public destroy(): void {
    this.clear();
    if (this._svg) {
      this._svg.selectAll('.shape').remove();
    }
    this._svg = null;
    globals.svg = null;
  }

  /**
   * Download the project as an SVG file
   * @param filename Optional filename (default: 'image.svg')
   */
  public download(filename: string = 'image.svg'): void {
    if (!this._svg) {
      throw new Error('Project not initialized');
    }

    const node = this._svg.node();
    if (!node) {
      throw new Error('SVG node not found');
    }

    const source = new XMLSerializer().serializeToString(node);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  private updatePage(reference: string): void {
    const container = d3.select(`#${reference}`);
    if (container.empty()) {
      throw new Error(`Container element #${reference} not found`);
    }

    container.style('overflow', 'hidden').style('position', 'relative');

    if (!this._svg) {
      throw new Error('SVG not initialized');
    }

    this._svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('margin-bottom', '-10px')
      .style('background-color', this.fill.color);
  }

  /**
   * Shape registry mapping type strings to constructors
   */
  private readonly shapeRegistry: Record<string, (args: unknown) => Shape> = {
    text: (args: unknown) => new Text(args as any),
    line: (args: unknown) => new Line(args as any),
    chart: (args: unknown) => new Chart(args as any),
    group: (args: unknown) => new Group(args as any),
    table: (args: unknown) => new Table(args as any),
    curve: (args: unknown) => new Curve(args as any),
    range: (args: unknown) => new Range(args as any),
    vector: (args: unknown) => new Vector(args as any),
    iframe: (args: unknown) => new Iframe(args as any),
    ellipse: (args: unknown) => new Ellipse(args as any),
    polygon: (args: unknown) => new Polygon(args as any),
    polyline: (args: unknown) => new Polyline(args as any),
    rectangle: (args: unknown) => new Rectangle(args as any),
  };

  /**
   * Import shapes from SVG or JSON
   * @param options Import options
   * @returns Promise that resolves when import is complete
   */
  public async import(options: ImportAsSvg | ImportAsJson): Promise<void> {
    if (!this._svg) {
      throw new Error('Project not initialized');
    }

    if (options.replace) {
      this.clear();
    }

    switch (options.mode) {
      case 'svg': {
        const xml = new DOMParser().parseFromString(
          options.data,
          'application/xml',
        );
        const parseError = xml.querySelector('parsererror');
        if (parseError) {
          throw new Error('Failed to parse SVG XML');
        }

        const elements = xml.documentElement.getElementsByClassName('shape');
        if (elements.length === 0) {
          throw new Error('No shapes found in SVG data');
        }

        for (let i = 0; i < elements.length; i++) {
          this._svg.append(() => elements[i]);
        }
        break;
      }
      case 'json': {
        if (!Array.isArray(options.data)) {
          throw new Error('JSON data must be an array');
        }

        const importedShapes: Shape[] = [];
        for (const item of options.data) {
          if (!item || typeof item !== 'object' || !('type' in item)) {
            continue;
          }

          const type = String(item.type);
          const factory = this.shapeRegistry[type];
          if (factory) {
            const shape = factory(item);
            importedShapes.push(shape);
          }
        }

        importedShapes.forEach((shape) => this.addShape(shape));
        break;
      }
      default: {
        throw new Error(`Unsupported import mode: ${(options as any).mode}`);
      }
    }
  }

  private async initialize(reference: string): Promise<void> {
    const container = d3.select(`#${reference}`);
    if (container.empty()) {
      throw new Error(`Container element #${reference} not found`);
    }

    const ngxContainer = container
      .append('div')
      .attr('id', 'ngx-container')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto')
      .style('position', 'relative')
      .style('background-color', '#e0e0e0');

    this._svg = ngxContainer
      .append('svg')
      .attr('class', 'ngx-canvas') as Selection;

    // Maintain backward compatibility with globals
    globals.svg = this._svg;

    this.updatePage(reference);
    this.ready.next();
  }
}

export interface ImportAsSvg {
  mode: 'svg';
  data: string;
  replace?: boolean;
}

export interface ImportAsJson {
  mode: 'json';
  data: unknown[];
  replace?: boolean;
}
