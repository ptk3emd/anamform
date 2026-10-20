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
    <header className="sticky top-0 z-30 bg-[#F6F4EF]/80 backdrop-blur-md border-b border-[#2A222B]/5 px-4 md:px-8 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2A222B] text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-[#2A222B] tracking-tight">
            .anamform
          </span>
        </div>

        {/* Current Category / Step indicator */}
        <div className="min-w-0 text-xs text-[#2A222B]/60 truncate max-w-[200px] sm:max-w-xs font-medium">
          {currentCategory || currentQuestionnaire.title}
        </div>

        {/* Subtle percentage */}
        <div className="text-xs font-mono-code text-[#2A222B]/65">
          {progressPercent}%
        </div>
      </div>
    </header>
  );
};
