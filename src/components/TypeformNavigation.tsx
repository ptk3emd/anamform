/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Navigation Dock & Progress Indicator
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface TypeformNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  theme: ThemeConfig;
  answeredCount: number;
}

export const TypeformNavigation: React.FC<TypeformNavigationProps> = ({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
}) => {
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <>
      {/* Top Progress Bar - Fixed at top of viewport */}
      <div
        role="progressbar"
        aria-label="Progresso da anamnese"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        className="fixed top-0 left-0 right-0 h-1 bg-[#2A222B]/10 z-40"
      >
        <div
          className="h-full origin-left transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: '#198754', // Accent green from DESIGN.md
          }}
        />
      </div>

      {/* Floating Chevrons Dock - Positioned neatly above the mobile bottom nav */}
      <aside aria-label="Navegação entre perguntas" className="fixed bottom-[4.5rem] right-4 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#2A222B]/15 shadow-md overflow-hidden">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrev}
            aria-label="Pergunta anterior"
            className="size-11 flex items-center justify-center text-[#2A222B]/70 hover:text-[#2A222B] hover:bg-[#2A222B]/5 active:bg-[#2A222B]/10 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Pergunta anterior (Shift + Tab ou Seta Cima)"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="w-[1px] h-4 bg-[#2A222B]/10" />
          <button
            type="button"
            onClick={onNext}
            className="size-11 flex items-center justify-center text-[#2A222B]/70 hover:text-[#2A222B] hover:bg-[#2A222B]/5 active:bg-[#2A222B]/10 transition-colors cursor-pointer"
            aria-label="Próxima pergunta"
            title="Próxima pergunta (Enter ou Seta Baixo)"
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </aside>
    </>
  );
};
