import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentNamePage } from './components/StudentNamePage';
import { StudentCard } from './components/StudentCard';
import { TeacherCenter } from './components/TeacherCenter';
import { TeacherPasscodeModal } from './components/TeacherPasscodeModal';
import { WinModal } from './components/WinModal';
import { AppsScriptModal } from './components/AppsScriptModal';
import { VerifierModal } from './components/VerifierModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';

import { BoardConfig, BingoCell, WinResult } from './types';
import { generateBoardCells } from './utils/bingoLogic';

export default function App() {
  // Student Flow Step: 'name' (Step 1: Enter Name) -> 'game' (Step 2: 4x4 Bingo Card)
  const [studentStep, setStudentStep] = useState<'name' | 'game'>(() => {
    const savedName = localStorage.getItem('bingo_student_name');
    return savedName && savedName.trim() !== '' ? 'game' : 'name';
  });

  // Teacher Center Mode (unlocked with passcode 147852)
  const [isTeacherCenterActive, setIsTeacherCenterActive] = useState<boolean>(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState<boolean>(false);

  // Google Apps Script Web App URL
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFromQuery = params.get('scriptUrl');
    if (urlFromQuery) return urlFromQuery;
    return localStorage.getItem('bingo_script_url') || '';
  });

  // Student Identity
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('bingo_student_name') || '';
  });
  const [studentId, setStudentId] = useState<string>(() => {
    return localStorage.getItem('bingo_student_id') || '';
  });

  // Helper to generate a unique random card seed per student
  const createStudentSeed = (name: string) => {
    const randPart = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase()
      : Math.random().toString(36).substring(2, 10).toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase();
    const cleanName = (name || 'STUDENT').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `CARD-${cleanName.slice(0, 6)}-${timePart}-${randPart}`;
  };

  // Card Seed state
  const [cardSeed, setCardSeed] = useState<string>(() => {
    const savedSeed = localStorage.getItem('bingo_card_seed');
    if (savedSeed && savedSeed.trim() !== '') return savedSeed;
    const initialSeed = createStudentSeed(localStorage.getItem('bingo_student_name') || '');
    localStorage.setItem('bingo_card_seed', initialSeed);
    return initialSeed;
  });

  // Board Configuration: Forced 4x4 grid, NO Free space
  const boardConfig: BoardConfig = {
    gridSize: 4,
    maxNumber: 100,
    includeFreeSpace: false,
    freeSpaceLabel: '',
    cardSeed: cardSeed,
    dauberStyle: 'stamp-red',
    theme: 'cyber-indigo',
    winningPatternRequired: 'line',
  };

  // Bingo Cells (4x4)
  const [cells, setCells] = useState<BingoCell[]>(() => {
    const savedCells = localStorage.getItem('bingo_board_cells');
    if (savedCells) {
      try {
        const parsed = JSON.parse(savedCells);
        if (Array.isArray(parsed) && parsed.length === 16) {
          return parsed;
        }
      } catch (e) {
        // Fallback to fresh board
      }
    }
    const freshCells = generateBoardCells(4, 100, false, cardSeed);
    localStorage.setItem('bingo_board_cells', JSON.stringify(freshCells));
    return freshCells;
  });

  // Teacher Called Numbers List (1-100)
  const [calledNumbers, setCalledNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('bingo_called_numbers');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [winModalData, setWinModalData] = useState<{
    winResult: WinResult;
    proofCode: string;
  } | null>(null);

  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState<boolean>(false);
  const [isVerifierModalOpen, setIsVerifierModalOpen] = useState<boolean>(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem('bingo_script_url', scriptUrl);
  }, [scriptUrl]);

  useEffect(() => {
    localStorage.setItem('bingo_student_name', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('bingo_student_id', studentId);
  }, [studentId]);

  useEffect(() => {
    localStorage.setItem('bingo_called_numbers', JSON.stringify(calledNumbers));
  }, [calledNumbers]);

  useEffect(() => {
    localStorage.setItem('bingo_board_cells', JSON.stringify(cells));
  }, [cells]);

  // Handle student starting the game from name entry page
  const handleStartGame = () => {
    let currentSeed = localStorage.getItem('bingo_card_seed');
    if (!currentSeed) {
      currentSeed = createStudentSeed(studentName);
      localStorage.setItem('bingo_card_seed', currentSeed);
      setCardSeed(currentSeed);
      const freshCells = generateBoardCells(4, 100, false, currentSeed);
      setCells(freshCells);
      localStorage.setItem('bingo_board_cells', JSON.stringify(freshCells));
    }
    setStudentStep('game');
  };

  // Handle Bingo Win Claim Triggered
  const handleBingoTriggered = (winResult: WinResult, proofCode: string) => {
    setWinModalData({ winResult, proofCode });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white pb-10">
      {/* Navbar */}
      <Navbar
        onOpenTeacherPasscode={() => setShowPasscodeModal(true)}
        isTeacherCenterActive={isTeacherCenterActive}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-2 sm:px-4 pt-2">
        {isTeacherCenterActive ? (
          <TeacherCenter
            calledNumbers={calledNumbers}
            setCalledNumbers={setCalledNumbers}
            soundEnabled={false}
            scriptUrlConfigured={Boolean(scriptUrl && scriptUrl.trim() !== '')}
            onOpenVerifier={() => setIsVerifierModalOpen(true)}
            onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
            onOpenGithub={() => setIsGithubModalOpen(true)}
            onExitTeacherCenter={() => setIsTeacherCenterActive(false)}
          />
        ) : studentStep === 'name' ? (
          <StudentNamePage
            studentName={studentName}
            setStudentName={setStudentName}
            studentId={studentId}
            setStudentId={setStudentId}
            onStartGame={handleStartGame}
            onOpenTeacherPasscode={() => setShowPasscodeModal(true)}
          />
        ) : (
          <StudentCard
            cells={cells}
            setCells={setCells}
            config={boardConfig}
            studentName={studentName}
            studentId={studentId}
            onBingoTriggered={handleBingoTriggered}
          />
        )}
      </main>

      {/* Teacher Passcode Modal */}
      {showPasscodeModal && (
        <TeacherPasscodeModal
          onSuccess={() => {
            setShowPasscodeModal(false);
            setIsTeacherCenterActive(true);
          }}
          onClose={() => setShowPasscodeModal(false)}
        />
      )}

      {/* Win Modal Celebration */}
      {winModalData && (
        <WinModal
          winResult={winModalData.winResult}
          proofCode={winModalData.proofCode}
          studentName={studentName}
          studentId={studentId}
          cardSeed={boardConfig.cardSeed}
          gridSize={4}
          scriptUrl={scriptUrl}
          onClose={() => setWinModalData(null)}
          openAppsScriptModal={() => setIsAppsScriptModalOpen(true)}
        />
      )}

      {/* Teacher Modals */}
      {isAppsScriptModalOpen && (
        <AppsScriptModal
          scriptUrl={scriptUrl}
          setScriptUrl={setScriptUrl}
          onClose={() => setIsAppsScriptModalOpen(false)}
        />
      )}

      {isVerifierModalOpen && (
        <VerifierModal
          calledNumbers={calledNumbers}
          onClose={() => setIsVerifierModalOpen(false)}
        />
      )}

      {isGithubModalOpen && (
        <GitHubPagesModal onClose={() => setIsGithubModalOpen(false)} />
      )}
    </div>
  );
}
