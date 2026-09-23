import React, { useState } from 'react';
import { BoardConfig, GridSize, DauberStyle, BingoCell } from '../types';
import {
  Settings,
  Grid,
  Paintbrush,
  Sparkles,
  RotateCcw,
  X,
  Edit3,
  Check
} from 'lucide-react';

interface CardCustomizerModalProps {
  config: BoardConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoardConfig>>;
  cells: BingoCell[];
  setCells: React.Dispatch<React.SetStateAction<BingoCell[]>>;
  onClose: () => void;
  onRegenerateCard: () => void;
}

export const CardCustomizerModal: React.FC<CardCustomizerModalProps> = ({
  config,
  setConfig,
  cells,
  setCells,
  onClose,
  onRegenerateCard,
}) => {
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [cellEditVal, setCellEditVal] = useState<string>('');

  const dauberOptions: { id: DauberStyle; label: string; colorClass: string }[] = [
    { id: 'stamp-red', label: 'Crimson Red', colorClass: 'bg-red-500' },
    { id: 'stamp-blue', label: 'Cyan Blue', colorClass: 'bg-cyan-500' },
    { id: 'star-gold', label: 'Gold Star', colorClass: 'bg-amber-400 text-slate-950' },
    { id: 'heart-pink', label: 'Pink Heart', colorClass: 'bg-pink-500' },
    { id: 'emerald-check', label: 'Emerald Green', colorClass: 'bg-emerald-500' },
    { id: 'purple-sparkle', label: 'Purple Sparkle', colorClass: 'bg-purple-600' },
  ];

  const handleGridSizeChange = (newSize: GridSize) => {
    setConfig((prev) => ({ ...prev, gridSize: newSize }));
  };

  const handleDauberSelect = (style: DauberStyle) => {
    setConfig((prev) => ({ ...prev, dauberStyle: style }));
  };

  const handleSeedChange = (newSeed: string) => {
    setConfig((prev) => ({ ...prev, cardSeed: newSeed }));
  };

  const startEditCell = (cell: BingoCell) => {
    if (cell.isFree) return;
    setEditingCellId(cell.id);
    setCellEditVal(String(cell.value));
  };

  const saveEditedCell = (cellId: string) => {
    const valNum = parseInt(cellEditVal, 10);
    if (isNaN(valNum) || valNum < 1 || valNum > 100) {
      alert('Please enter a valid number between 1 and 100.');
      return;
    }

    setCells((prev) =>
      prev.map((c) => (c.id === cellId ? { ...c, value: valNum } : c))
    );
    setEditingCellId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-white space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Customize Bingo Board</h2>
            <p className="text-xs text-slate-400">
              Change layout size, dauber colors, or custom cell numbers
            </p>
          </div>
        </div>

        {/* Grid Size Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-indigo-400" />
            <span>Grid Layout Dimensions:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([3, 4, 5] as GridSize[]).map((size) => (
              <button
                key={`grid-size-${size}`}
                onClick={() => handleGridSizeChange(size)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  config.gridSize === size
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {size} x {size} Grid ({size * size} Cells)
              </button>
            ))}
          </div>
        </div>

        {/* Dauber Style Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Paintbrush className="w-4 h-4 text-purple-400" />
            <span>Marker / Dauber Style:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {dauberOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleDauberSelect(opt.id)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  config.dauberStyle === opt.id
                    ? 'bg-slate-800 border-indigo-400 ring-2 ring-indigo-400/40 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${opt.colorClass} shrink-0`} />
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Seed Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Card Seed / Class Code:
            </span>
            <button
              onClick={onRegenerateCard}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Shuffle Seed
            </button>
          </label>
          <input
            type="text"
            value={config.cardSeed}
            onChange={(e) => handleSeedChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500"
            placeholder="Type seed (e.g., MATH-101-GROUP-A)"
          />
        </div>

        {/* Cell Manual Number Editor */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Individual Numbers (Optional):</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Click any cell below to replace its number manually (1-100).
          </p>

          <div
            className={`grid ${
              config.gridSize === 5
                ? 'grid-cols-5'
                : config.gridSize === 4
                ? 'grid-cols-4'
                : 'grid-cols-3'
            } gap-1.5 pt-1`}
          >
            {cells.map((cell) => (
              <div key={`edit-cell-${cell.id}`} className="relative">
                {editingCellId === cell.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={cellEditVal}
                      onChange={(e) => setCellEditVal(e.target.value)}
                      className="w-full py-1.5 px-1 bg-amber-400 text-slate-950 font-bold text-xs rounded text-center focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEditedCell(cell.id)}
                      className="p-1 bg-emerald-500 text-slate-950 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditCell(cell)}
                    disabled={cell.isFree}
                    className={`w-full aspect-square rounded-lg border text-xs font-bold transition-all ${
                      cell.isFree
                        ? 'bg-slate-900 border-slate-800 text-amber-400'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-indigo-900/50 text-slate-200'
                    }`}
                  >
                    {cell.isFree ? 'FREE' : cell.value}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Apply & Close */}
        <div className="pt-3">
          <button
            onClick={() => {
              onRegenerateCard();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
          >
            Save & Apply Board Settings
          </button>
        </div>
      </div>
    </div>
  );
};
