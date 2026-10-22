/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Minimalist Clean Header for .anamform (Distraction-Free)
 */

import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Questionnaire } from '../types/fhir';

interface HeaderProps {
  currentQuestionnaire: Questionnaire;
  currentCategory?: string;
  progressPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentQuestionnaire,
  currentCategory,
  progressPercent,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F6F4EF]/80 backdrop-blur-md border-b border-[#2A222B]/5 py-2.5 transition-colors">
      <div className="max-w-[760px] mx-auto px-4 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#2A222B] text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-[#2A222B] tracking-tight">
            .anamform
          </span>
        </div>

        {/* Current Category / Step indicator */}
        <div className="min-w-0 flex-1 text-xs text-[#2A222B]/65 truncate text-right sm:text-center font-medium" title={currentCategory || currentQuestionnaire.title}>
          {currentCategory || currentQuestionnaire.title}
        </div>

        {/* Subtle percentage */}
        <div className="shrink-0 w-9 text-right text-xs font-mono-code text-[#2A222B]/65" aria-label={`${progressPercent}% dos itens preenchidos`}>
          {progressPercent}%
        </div>
      </div>
    </header>
  );
};
