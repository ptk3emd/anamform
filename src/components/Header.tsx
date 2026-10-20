/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Minimalist Clean Header for AnamneseFlow (Distraction-Free)
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
    <header className="sticky top-0 z-30 bg-[#F6F4EF]/80 backdrop-blur-md border-b border-[#2A222B]/5 px-4 md:px-8 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2A222B] text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#2A222B] tracking-tight">
              AnamneseFlow
            </span>
            <span className="text-[10px] font-mono-code bg-[#2A222B]/10 text-[#2A222B]/80 px-1.5 py-0.5 rounded font-medium">
              FHIR R4
            </span>
          </div>
        </div>

        {/* Current Category / Step indicator */}
        <div className="text-xs text-[#2A222B]/60 truncate max-w-[200px] sm:max-w-xs font-medium">
          {currentCategory || currentQuestionnaire.title}
        </div>

        {/* Subtle percentage */}
        <div className="text-xs font-mono-code text-[#2A222B]/50">
          {progressPercent}%
        </div>
      </div>
    </header>
  );
};
