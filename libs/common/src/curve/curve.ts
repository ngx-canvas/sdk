import * as d3 from 'd3'

export const CurveMode = {
  'basis': d3.curveBasis,
  'basis-open': d3.curveBasisOpen,
  'basis-closed': d3.curveBasisClosed,
  'bump-x': d3.curveBumpX,
  'bump-y': d3.curveBumpY,
  'bundle': d3.curveBundle,
  'cardinal': d3.curveCardinal,
  'cardinal-open': d3.curveCardinalOpen,
  'cardinal-closed': d3.curveCardinalClosed,
  'catmull-rom': d3.curveCatmullRom,
  'catmull-rom-open': d3.curveCatmullRomOpen,
  'catmull-rom-closed': d3.curveCatmullRomClosed,
  'linear': d3.curveLinear,
  'linear-closed': d3.curveLinearClosed,
  'monotone-x': d3.curveMonotoneX,
  'monotone-y': d3.curveMonotoneY,
  'natural': d3.curveNatural,
  'step': d3.curveStep,
  'step-after': d3.curveStepAfter,
  'step-before': d3.curveStepBefore
}

export type CurveModes = 'basis' | 'basis-open' | 'basis-closed' | 'bump-x' | 'bump-y' | 'bundle' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'catmull-rom' | 'catmull-rom-open' | 'catmull-rom-closed' | 'linear' | 'linear-closed' | 'monotone-x' | 'monotone-y' | 'natural' | 'step' | 'step-after' | 'step-before'
