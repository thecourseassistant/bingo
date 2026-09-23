export type GridSize = 3 | 4 | 5;

export type GameMode = 'student' | 'caller' | 'instructions';

export type BingoGameMode = 'numbers' | 'letters';

export type DauberStyle = 'stamp-red' | 'stamp-blue' | 'star-gold' | 'heart-pink' | 'emerald-check' | 'purple-sparkle';

export type ThemeStyle = 'cyber-indigo' | 'vibrant-classroom' | 'emerald-park' | 'sunset-orange' | 'dark-slate';

export interface BingoCell {
  id: string;
  value: number | string; // Number 1-100 or Letter A-Z
  isMarked: boolean;
  isFree?: boolean;
  row: number;
  col: number;
}

export type WinPattern = 'line' | 'corners' | 'x-pattern' | 'fullhouse' | 'custom';

export interface WinResult {
  hasWon: boolean;
  patternName: string;
  winningCellIds: string[];
  winningNumbers: (number | string)[];
}

export interface SubmissionData {
  studentName: string;
  studentId?: string;
  timestamp: string;
  winPattern: string;
  winningNumbers: string;
  cardSeed: string;
  gridSize: number;
  proofCode: string;
  gameMode?: BingoGameMode;
  status?: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

export interface BoardConfig {
  gridSize: GridSize;
  maxNumber: number; // default 100 for numbers mode
  includeFreeSpace: boolean;
  freeSpaceLabel: string;
  cardSeed: string;
  dauberStyle: DauberStyle;
  theme: ThemeStyle;
  winningPatternRequired: 'any' | 'line' | 'fullhouse';
  gameMode: BingoGameMode;
}
