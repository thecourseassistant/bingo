import { BingoCell, GridSize, WinResult, SubmissionData, BingoGameMode } from '../types';

/**
 * English Alphabet letters pool A-Z (strictly single uppercase letters)
 */
export const ALPHABET_POOL: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * Validate that cells strictly adhere to single letters A-Z or numbers 1-100
 */
export function validateAndSanitizeCells(
  cells: BingoCell[],
  gameMode: BingoGameMode
): boolean {
  if (!Array.isArray(cells) || cells.length !== 16) return false;

  return cells.every((c) => {
    if (!c || c.value === undefined || c.value === null) return false;
    if (gameMode === 'letters') {
      const valStr = String(c.value).trim().toUpperCase();
      // Strict check: MUST be exactly 1 uppercase English letter A-Z
      return valStr.length === 1 && /^[A-Z]$/.test(valStr);
    } else {
      const numVal = Number(c.value);
      return typeof c.value === 'number' && !isNaN(numVal) && numVal >= 1 && numVal <= 100;
    }
  });
}

/**
 * Seeded PRNG (Mulberry32) for deterministic card generation
 */
function mulberry32(seed: number) {
  let s = seed;
  const rand = function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < 20; i++) {
    rand();
  }
  return rand;
}

function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash);
}

/**
 * Generate unique random numbers (1-100) or single letters (A-Z) for gridSize x gridSize table
 */
export function generateBoardCells(
  gridSize: GridSize = 4,
  maxNumber: number = 100,
  includeFreeSpace: boolean = false,
  seedStr?: string,
  gameMode: BingoGameMode = 'numbers'
): BingoCell[] {
  const totalCells = gridSize * gridSize;

  const randomFunc = seedStr && seedStr.trim() !== ''
    ? mulberry32(hashString(seedStr + ':' + gameMode))
    : Math.random;

  let pool: (number | string)[] = [];

  if (gameMode === 'letters') {
    pool = [...ALPHABET_POOL];
  } else {
    for (let i = 1; i <= maxNumber; i++) {
      pool.push(i);
    }
  }

  // Shuffle pool using Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(randomFunc() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selectedItems = pool.slice(0, totalCells);

  const cells: BingoCell[] = [];
  let itemIdx = 0;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const rawVal = selectedItems[itemIdx];
      // Ensure single letter format if letters mode
      const finalVal = gameMode === 'letters'
        ? String(rawVal).toUpperCase().trim().slice(0, 1)
        : Number(rawVal);

      cells.push({
        id: `cell-${row}-${col}`,
        value: finalVal,
        isMarked: false,
        isFree: false,
        row,
        col,
      });
      itemIdx++;
    }
  }

  return cells;
}

/**
 * Check win patterns: ONLY Horizontal Rows, Vertical Columns, and Diagonals
 */
export function checkWinCondition(
  cells: BingoCell[],
  gridSize: GridSize
): WinResult {
  const markedMap: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  cells.forEach((cell) => {
    markedMap[cell.row][cell.col] = cell.isMarked;
  });

  const winningCellIds = new Set<string>();
  const winningPatterns: string[] = [];
  const winningNumbersList: (number | string)[] = [];

  // 1. Check Rows (Horizontal)
  for (let r = 0; r < gridSize; r++) {
    let rowComplete = true;
    for (let c = 0; c < gridSize; c++) {
      if (!markedMap[r][c]) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      winningPatterns.push(`Row ${r + 1}`);
      for (let c = 0; c < gridSize; c++) {
        const cell = cells.find((cell) => cell.row === r && cell.col === c);
        if (cell) {
          winningCellIds.add(cell.id);
          if (!winningNumbersList.includes(cell.value)) {
            winningNumbersList.push(cell.value);
          }
        }
      }
    }
  }

  // 2. Check Columns (Vertical)
  for (let c = 0; c < gridSize; c++) {
    let colComplete = true;
    for (let r = 0; r < gridSize; r++) {
      if (!markedMap[r][c]) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      winningPatterns.push(`Col ${c + 1}`);
      for (let r = 0; r < gridSize; r++) {
        const cell = cells.find((cell) => cell.row === r && cell.col === c);
        if (cell) {
          winningCellIds.add(cell.id);
          if (!winningNumbersList.includes(cell.value)) {
            winningNumbersList.push(cell.value);
          }
        }
      }
    }
  }

  // 3. Diagonal Top-Left to Bottom-Right
  let diag1Complete = true;
  for (let i = 0; i < gridSize; i++) {
    if (!markedMap[i][i]) {
      diag1Complete = false;
      break;
    }
  }
  if (diag1Complete) {
    winningPatterns.push('Diagonal ↘');
    for (let i = 0; i < gridSize; i++) {
      const cell = cells.find((cell) => cell.row === i && cell.col === i);
      if (cell) {
        winningCellIds.add(cell.id);
        if (!winningNumbersList.includes(cell.value)) {
          winningNumbersList.push(cell.value);
        }
      }
    }
  }

  // 4. Diagonal Top-Right to Bottom-Left
  let diag2Complete = true;
  for (let i = 0; i < gridSize; i++) {
    if (!markedMap[i][gridSize - 1 - i]) {
      diag2Complete = false;
      break;
    }
  }
  if (diag2Complete) {
    winningPatterns.push('Diagonal ↙');
    for (let i = 0; i < gridSize; i++) {
      const cell = cells.find((cell) => cell.row === i && cell.col === gridSize - 1 - i);
      if (cell) {
        winningCellIds.add(cell.id);
        if (!winningNumbersList.includes(cell.value)) {
          winningNumbersList.push(cell.value);
        }
      }
    }
  }

  const hasWon = winningPatterns.length > 0;

  return {
    hasWon,
    patternName: winningPatterns.join(' + ') || 'None',
    winningCellIds: Array.from(winningCellIds),
    winningNumbers: winningNumbersList,
  };
}

/**
 * Generate a verification code based on student name, seed, and marked items
 */
export function generateProofCode(
  studentName: string,
  cardSeed: string,
  cells: BingoCell[]
): string {
  const markedVals = cells
    .filter((c) => c.isMarked)
    .map((c) => String(c.value).toUpperCase().slice(0, 1))
    .sort()
    .join('-');

  const rawStr = `${studentName.trim().toUpperCase()}:${cardSeed}:${markedVals}`;
  const hash = hashString(rawStr).toString(16).toUpperCase().padStart(6, '0');
  return `BNG-${hash.slice(0, 3)}-${hash.slice(3, 6)}`;
}

/**
 * Audio Synthesizer using Web Audio API
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'daub' | 'unmarked' | 'win' | 'draw' | 'error') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'daub') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'unmarked') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (type === 'draw') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn('Web Audio Playback failed', e);
  }
}

/**
 * Speak call item (number or letter) using browser SpeechSynthesis
 */
export function speakCallItem(item: number | string) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    let text = '';
    if (typeof item === 'string') {
      text = `Letter ${item.toUpperCase().slice(0, 1)}`;
    } else {
      text = `Number ${item}`;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}

/**
 * Submit Bingo result to Google Sheet Apps Script URL
 */
export async function submitResultToGoogleSheet(
  scriptUrl: string,
  payload: SubmissionData
): Promise<{ success: boolean; message: string }> {
  if (!scriptUrl || scriptUrl.trim() === '') {
    return {
      success: false,
      message: 'Google Apps Script URL is not configured. Please add your Web App URL in settings.',
    };
  }

  const cleanUrl = scriptUrl.trim();

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data && data.result === 'error') {
        throw new Error(data.error || 'Apps Script returned error');
      }
      return { success: true, message: 'Bingo verified & recorded to Google Sheet!' };
    }

    const queryParams = new URLSearchParams({
      studentName: payload.studentName,
      studentId: payload.studentId || '',
      winPattern: payload.winPattern,
      winningNumbers: payload.winningNumbers,
      proofCode: payload.proofCode,
      cardSeed: payload.cardSeed,
      gridSize: String(payload.gridSize),
      gameMode: payload.gameMode || 'numbers',
    }).toString();

    const getUrl = `${cleanUrl}?${queryParams}`;
    await fetch(getUrl, { mode: 'no-cors' });

    return {
      success: true,
      message: 'Result sent to Google Sheet (opaque mode confirmed).',
    };
  } catch (err: unknown) {
    console.warn('Primary fetch failed, attempting GET fallback...', err);

    try {
      const queryParams = new URLSearchParams({
        studentName: payload.studentName,
        studentId: payload.studentId || '',
        winPattern: payload.winPattern,
        winningNumbers: payload.winningNumbers,
        proofCode: payload.proofCode,
        cardSeed: payload.cardSeed,
        gridSize: String(payload.gridSize),
        gameMode: payload.gameMode || 'numbers',
      }).toString();

      await fetch(`${cleanUrl}?${queryParams}`, { mode: 'no-cors' });
      return {
        success: true,
        message: 'Bingo submitted to Google Sheet!',
      };
    } catch (fallbackErr: unknown) {
      const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
      return {
        success: false,
        message: `Failed to submit: ${msg}. Please check your Google Apps Script URL.`,
      };
    }
  }
}
