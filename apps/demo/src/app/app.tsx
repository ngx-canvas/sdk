import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Project,
  Rectangle,
  Ellipse,
  Line,
  Text,
  Point,
} from '@ngx-canvas/core';
import { Draw, Mode, MouseEventBounded } from '@ngx-canvas/draw';
import logo from '../assets/logo.png';

type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'text' | 'select';

interface ShapeConfig {
  type: ShapeType;
  label: string;
  icon: string;
}

const SHAPES: ShapeConfig[] = [
  { type: 'select', label: 'Select', icon: '⬚' },
  { type: 'rectangle', label: 'Rectangle', icon: '▢' },
  { type: 'ellipse', label: 'Ellipse', icon: '○' },
  { type: 'line', label: 'Line', icon: '╱' },
  { type: 'text', label: 'Text', icon: 'T' },
];

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F8B500',
  '#00CED1',
];

const PROJECT_ID = 'canvas-container';

export function App() {
  const [selectedTool, setSelectedTool] = useState<ShapeType>('rectangle');
  const [fillColor, setFillColor] = useState('#4ECDC4');
  const [strokeColor, setStrokeColor] = useState('#2C3E50');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [shapeCount, setShapeCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [textInput, setTextInput] = useState('');

  const projectRef = useRef<Project | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const isDrawingRef = useRef(false);
  const currentShapeRef = useRef<Rectangle | Ellipse | Line | null>(null);

  // Refs for current values (to avoid stale closures in event handlers)
  const fillColorRef = useRef(fillColor);
  const strokeColorRef = useRef(strokeColor);
  const strokeWidthRef = useRef(strokeWidth);

  // Keep refs in sync with state
  useEffect(() => {
    fillColorRef.current = fillColor;
  }, [fillColor]);

  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  // Initialize the canvas
  useEffect(() => {
    // Small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      try {
        // Create the project
        const project = new Project(PROJECT_ID, {
          width: 800,
          height: 600,
        });

        projectRef.current = project;

        // Wait for project to be ready
        project.ready.subscribe(() => {
          // Create draw tools
          const draw = new Draw(PROJECT_ID);
          drawRef.current = draw;

          // Set initial mode
          draw.setMode(Mode.Rectangle);

          // Setup mouse event handlers
          setupDrawingEvents(draw, project);

          setIsReady(true);
        });
      } catch (error) {
        console.error('Failed to initialize canvas:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (projectRef.current) {
        projectRef.current.destroy();
      }
      if (drawRef.current) {
        drawRef.current.destroy();
      }
    };
  }, []);

  // Setup drawing event handlers
  const setupDrawingEvents = useCallback((draw: Draw, project: Project) => {
    // Mouse down - start drawing
    draw.mousedown.subscribe((event: MouseEventBounded) => {
      if (event.isContext) return;

      const mode = draw.mode();

      if (mode === Mode.Select) {
        // Handle selection
        handleSelection(event, draw);
        return;
      }

      isDrawingRef.current = true;
      const { start } = event;

      // Create shape based on current mode (use refs for current values)
      switch (mode) {
        case Mode.Rectangle: {
          const rect = new Rectangle({
            position: {
              x: start.x,
              y: start.y,
              width: 1,
              height: 1,
            },
            fill: { color: fillColorRef.current, opacity: 80 },
            stroke: {
              color: strokeColorRef.current,
              width: strokeWidthRef.current,
            },
          });
          project.addShape(rect);
          currentShapeRef.current = rect;
          break;
        }
        case Mode.Ellipse: {
          const ellipse = new Ellipse({
            position: {
              x: start.x,
              y: start.y,
              width: 1,
              height: 1,
            },
            fill: { color: fillColorRef.current, opacity: 80 },
            stroke: {
              color: strokeColorRef.current,
              width: strokeWidthRef.current,
            },
          });
          project.addShape(ellipse);
          currentShapeRef.current = ellipse;
          break;
        }
        case Mode.Line: {
          const line = new Line({
            points: [
              new Point({ x: start.x, y: start.y }),
              new Point({ x: start.x, y: start.y }),
            ],
            fill: { color: 'none', opacity: 0 },
            stroke: {
              color: strokeColorRef.current,
              width: strokeWidthRef.current,
            },
          });
          project.addShape(line);
          currentShapeRef.current = line;
          break;
        }
      }

      updateShapeCount();
    });

    // Mouse move - update shape while drawing
    draw.mousemove.subscribe((event: MouseEventBounded) => {
      if (!isDrawingRef.current || !currentShapeRef.current) return;

      const { start, end, diff } = event;
      const shape = currentShapeRef.current;

      if (shape instanceof Rectangle || shape instanceof Ellipse) {
        // Calculate position for drawing in any direction
        const x = diff.x >= 0 ? start.x : end.x;
        const y = diff.y >= 0 ? start.y : end.y;
        const width = Math.abs(diff.x);
        const height = Math.abs(diff.y);

        shape.update({
          position: { x, y, width, height },
        });
      } else if (shape instanceof Line) {
        shape.points = [
          new Point({ x: start.x, y: start.y }),
          new Point({ x: end.x, y: end.y }),
        ];
        shape.update();
      }
    });

    // Mouse up - finish drawing
    draw.mouseup.subscribe(() => {
      if (isDrawingRef.current && currentShapeRef.current) {
        // Check if shape is too small (likely a click, not a drag)
        const shape = currentShapeRef.current;
        if (shape instanceof Rectangle || shape instanceof Ellipse) {
          if (shape.position.width < 5 && shape.position.height < 5) {
            project.removeShape(shape.id);
            updateShapeCount();
          }
        } else if (shape instanceof Line) {
          const dx = shape.points[1].x - shape.points[0].x;
          const dy = shape.points[1].y - shape.points[0].y;
          if (Math.sqrt(dx * dx + dy * dy) < 5) {
            project.removeShape(shape.id);
            updateShapeCount();
          }
        }
      }

      isDrawingRef.current = false;
      currentShapeRef.current = null;
    });
  }, []);

  // Handle shape selection
  const handleSelection = useCallback(
    (event: MouseEventBounded, draw: Draw) => {
      const target = event.target as Element;
      if (target?.classList?.contains('shape')) {
        const shapeId = target.getAttribute('id');
        if (shapeId) {
          draw.select.unselect();
          draw.select.byId(shapeId, null, draw.zoom.value());
        }
      } else {
        draw.select.unselect();
        draw.select.hideBox();
      }
    },
    [],
  );

  // Update shape count
  const updateShapeCount = useCallback(() => {
    if (projectRef.current) {
      setShapeCount(projectRef.current.getShapes().length);
    }
  }, []);

  // Update draw mode when tool changes
  useEffect(() => {
    if (drawRef.current) {
      const modeMap: Record<ShapeType, Mode> = {
        select: Mode.Select,
        rectangle: Mode.Rectangle,
        ellipse: Mode.Ellipse,
        line: Mode.Line,
        text: Mode.Text,
      };
      drawRef.current.setMode(modeMap[selectedTool]);

      // Hide selection box when switching away from select mode
      if (selectedTool !== 'select') {
        drawRef.current.select.unselect();
        drawRef.current.select.hideBox();
      }
    }
  }, [selectedTool]);

  // Toggle grid
  useEffect(() => {
    if (drawRef.current) {
      if (showGrid) {
        drawRef.current.grid.enable();
      } else {
        drawRef.current.grid.disable();
      }
    }
  }, [showGrid]);

  // Toggle ruler
  useEffect(() => {
    if (drawRef.current) {
      if (showRuler) {
        drawRef.current.ruler.enable();
      } else {
        drawRef.current.ruler.disable();
      }
    }
  }, [showRuler]);

  // Update zoom
  useEffect(() => {
    if (drawRef.current && isReady) {
      const scale = zoomLevel / 100;
      try {
        drawRef.current.zoom.scale(scale);
        drawRef.current.ruler.scale(scale);
        drawRef.current.scale(scale);
      } catch (e) {
        console.warn('Could not set zoom:', e);
      }
    }
  }, [zoomLevel, isReady]);

  // Add text to canvas
  const handleAddText = useCallback(() => {
    if (!projectRef.current || !textInput.trim()) return;

    const text = new Text({
      value: textInput,
      position: {
        x: 100,
        y: 100,
        width: 200,
        height: 30,
      },
      fill: { color: fillColor },
      font: { size: 24, family: 'Arial' },
    });

    projectRef.current.addShape(text);
    setTextInput('');
    updateShapeCount();
  }, [textInput, fillColor, updateShapeCount]);

  // Clear all shapes
  const handleClear = useCallback(() => {
    if (projectRef.current) {
      projectRef.current.clear();
      if (drawRef.current) {
        drawRef.current.select.unselect();
        drawRef.current.select.hideBox();
      }
      updateShapeCount();
    }
  }, [updateShapeCount]);

  // Export SVG
  const handleExport = useCallback(() => {
    if (projectRef.current) {
      try {
        projectRef.current.download('canvas-export.svg');
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  }, []);

  // Load demo shapes
  const handleLoadDemo = useCallback(() => {
    if (!projectRef.current) return;

    // Clear existing shapes
    projectRef.current.clear();

    // Add demo shapes
    const shapes = [
      new Rectangle({
        position: { x: 50, y: 50, width: 150, height: 100 },
        fill: { color: '#FF6B6B', opacity: 80 },
        stroke: { color: '#2C3E50', width: 2 },
      }),
      new Ellipse({
        position: { x: 250, y: 80, width: 120, height: 80 },
        fill: { color: '#4ECDC4', opacity: 80 },
        stroke: { color: '#2C3E50', width: 2 },
      }),
      new Rectangle({
        position: { x: 420, y: 60, width: 100, height: 100 },
        fill: { color: '#45B7D1', opacity: 80 },
        stroke: { color: '#2C3E50', width: 2 },
      }),
      new Line({
        points: [new Point({ x: 100, y: 200 }), new Point({ x: 300, y: 250 })],
        stroke: { color: '#F8B500', width: 3 },
      }),
      new Ellipse({
        position: { x: 350, y: 220, width: 180, height: 120 },
        fill: { color: '#DDA0DD', opacity: 70 },
        stroke: { color: '#BB8FCE', width: 3 },
      }),
      new Rectangle({
        position: { x: 80, y: 300, width: 200, height: 150 },
        fill: { color: '#96CEB4', opacity: 75 },
        stroke: { color: '#2C3E50', width: 2 },
      }),
      new Text({
        value: 'NGX Canvas Demo',
        position: { x: 300, y: 400, width: 200, height: 40 },
        fill: { color: '#2C3E50' },
        font: { size: 28, family: 'Arial' },
      }),
      new Line({
        points: [new Point({ x: 550, y: 150 }), new Point({ x: 700, y: 350 })],
        stroke: { color: '#00CED1', width: 4 },
      }),
      new Ellipse({
        position: { x: 600, y: 380, width: 100, height: 100 },
        fill: { color: '#FFEAA7', opacity: 85 },
        stroke: { color: '#F8B500', width: 2 },
      }),
    ];

    shapes.forEach((shape) => projectRef.current?.addShape(shape));
    updateShapeCount();
  }, [updateShapeCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="NGX Canvas" className="size-10" />
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  NGX Canvas
                </h1>
                <p className="text-xs text-white/50">SDK Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/10">
                {shapeCount} shape{shapeCount !== 1 ? 's' : ''}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isReady
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {isReady ? '● Ready' : '○ Loading...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Tools */}
          <aside className="col-span-3 space-y-4">
            {/* Tool Picker */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <h2 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                Tools
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.type}
                    onClick={() => setSelectedTool(shape.type)}
                    className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                      selectedTool === shape.type
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{shape.icon}</span>
                    <span className="text-xs">{shape.label}</span>
                  </button>
                ))}
              </div>

              {selectedTool === 'text' && (
                <div className="mt-4 space-y-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
                  />
                  <button
                    onClick={handleAddText}
                    disabled={!textInput.trim()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Text
                  </button>
                </div>
              )}

              {selectedTool === 'select' && (
                <p className="mt-4 text-xs text-white/40 text-center">
                  Click on shapes to select them
                </p>
              )}

              {selectedTool !== 'select' && selectedTool !== 'text' && (
                <p className="mt-4 text-xs text-white/40 text-center">
                  Click and drag on canvas to draw
                </p>
              )}
            </div>

            {/* Color Picker */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <h2 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                Colors
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Fill
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFillColor(color)}
                        className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                          fillColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Stroke
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setStrokeColor(color)}
                        className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                          strokeColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">
                    Stroke Width: {strokeWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* View Controls */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <h2 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                View
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-left text-sm transition-all duration-200 flex items-center justify-between ${
                    showGrid
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>Grid</span>
                  <span className="text-lg">{showGrid ? '▣' : '▢'}</span>
                </button>
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-left text-sm transition-all duration-200 flex items-center justify-between ${
                    showRuler
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>Ruler</span>
                  <span className="text-lg">📏</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="text-xs text-white/50 mb-2 block">
                  Zoom: {zoomLevel}%
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                    disabled={zoomLevel <= 50}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                    disabled={zoomLevel >= 200}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Canvas Area */}
          <main className="col-span-9">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              {/* Canvas Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">Canvas</span>
                  <span className="text-xs text-white/30">800 × 600</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      selectedTool === 'select'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {selectedTool === 'select'
                      ? '⬚ Select Mode'
                      : `✏️ Drawing: ${selectedTool}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadDemo}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                  >
                    Load Demo
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all"
                  >
                    Export SVG
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div
                id={PROJECT_ID}
                className="rounded-xl border border-white/10 overflow-hidden"
                style={{
                  height: '632px',
                  background: '#0f172a',
                  position: 'relative',
                }}
              />
            </div>

            {/* Info Panel */}
            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/70 mb-2">
                How to use
              </h3>
              <div className="grid grid-cols-4 gap-4 text-xs text-white/50">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">①</span>
                  <span>Select tool to draw or Select to pick shapes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">②</span>
                  <span>Choose fill and stroke colors</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">③</span>
                  <span>Click and drag on the canvas to draw</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">④</span>
                  <span>Use zoom ±, toggle grid/ruler</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
