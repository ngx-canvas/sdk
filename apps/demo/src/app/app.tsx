import { useState } from 'react';

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

export function App() {
  const [selectedTool, setSelectedTool] = useState<ShapeType>('rectangle');
  const [fillColor, setFillColor] = useState('#4ECDC4');
  const [strokeColor, setStrokeColor] = useState('#2C3E50');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">◈</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  NGX Canvas
                </h1>
                <p className="text-xs text-white/50">SDK Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/10">
                0 shapes
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ○ Loading...
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
                <button className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                  Add Text
                </button>
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
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all">
                    Load Demo
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all">
                    Clear All
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all">
                    Export SVG
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div
                id="canvas-container"
                className="rounded-xl border border-white/10"
                style={{
                  height: '600px',
                  background: '#0f172a',
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
