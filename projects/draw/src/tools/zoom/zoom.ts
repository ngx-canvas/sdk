import * as d3 from 'd3';

/**
 * Constants for zoom limits
 */
const MIN_SCALE = 0.4;
const MAX_SCALE = 2.6;
const SCALE_ATTR = 'current-scale';

export class ZoomTool {
  private readonly projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  /**
   * Get the current zoom scale
   * @returns The current scale factor (default: 1.0)
   */
  public value(): number {
    const svg = this.getSvg();
    const scale = Number(svg.attr(SCALE_ATTR)) || 1;
    return Math.abs(parseFloat(scale.toFixed(1)));
  }

  /**
   * Set the zoom scale
   * @param scale The scale factor (must be between MIN_SCALE and MAX_SCALE)
   * @throws Error if SVG or container not found
   */
  public scale(scale: number): void {
    if (scale < MIN_SCALE || scale > MAX_SCALE) {
      console.warn(
        `Scale ${scale} is out of bounds [${MIN_SCALE}, ${MAX_SCALE}]`,
      );
      return;
    }

    const svg = this.getSvg();
    const viewBox = svg.attr('viewBox');

    if (!viewBox) {
      throw new Error('SVG viewBox not found');
    }

    const viewBoxParts = viewBox.split(' ');
    if (viewBoxParts.length < 4) {
      throw new Error('Invalid viewBox format');
    }

    const viewBoxWidth = Number(viewBoxParts[2]);
    const viewBoxHeight = Number(viewBoxParts[3]);

    if (isNaN(viewBoxWidth) || isNaN(viewBoxHeight)) {
      throw new Error('Invalid viewBox dimensions');
    }

    svg
      .style('width', `${viewBoxWidth * scale}px`)
      .style('height', `${viewBoxHeight * scale}px`)
      .attr(SCALE_ATTR, scale);
  }

  /**
   * Get the SVG selection
   * @throws Error if SVG not found
   */
  private getSvg(): d3.Selection<any, any, any, any> {
    const svg = d3.select(`#${this.projectId} .ngx-canvas`) as d3.Selection<
      any,
      any,
      any,
      any
    >;
    if (svg.empty()) {
      throw new Error(`SVG canvas not found for project: ${this.projectId}`);
    }
    return svg;
  }
}
