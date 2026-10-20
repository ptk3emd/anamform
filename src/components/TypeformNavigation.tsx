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
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#2A222B]/10 z-40">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: '#198754', // Accent green from DESIGN.md
          }}
        />
      </div>

      {/* Floating Chevrons Dock - Positioned neatly above the mobile bottom nav */}
      <aside className="fixed bottom-16 right-4 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#2A222B]/15 shadow-md overflow-hidden">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrev}
            className="p-2.5 text-[#2A222B]/70 hover:text-[#2A222B] hover:bg-[#2A222B]/5 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Pergunta anterior (Shift + Tab ou Seta Cima)"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="w-[1px] h-4 bg-[#2A222B]/10" />
          <button
            type="button"
            onClick={onNext}
            className="p-2.5 text-[#2A222B]/70 hover:text-[#2A222B] hover:bg-[#2A222B]/5 transition-colors cursor-pointer"
            title="Próxima pergunta (Enter ou Seta Baixo)"
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </aside>
    </>
  );
};
