/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile-First Bottom Bar Navigation for AnamneseFlow
 */

import React from 'react';
import {
  Stethoscope,
  ListOrdered,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';

export type AppViewMode = 'form' | 'summary' | 'settings';

interface MobileBottomNavProps {
  activeView: AppViewMode;
  onChangeView: (view: AppViewMode) => void;
  onOpenSectionIndex: () => void;
  answeredCount: number;
  totalQuestions: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onChangeView,
  onOpenSectionIndex,
  answeredCount,
  totalQuestions,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2A222B]/10 shadow-lg px-2 sm:px-6 py-1.5 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* TAB 1: COLETA (TYPEFORM) */}
        <button
          type="button"
          onClick={() => onChangeView('form')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'form'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/50 hover:text-[#2A222B]/80'
          }`}
        >
          <div className="relative">
            <Stethoscope className={`w-5 h-5 ${activeView === 'form' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {answeredCount > 0 && activeView !== 'form' && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Coleta</span>
        </button>

        {/* TAB 2: ÍNDICE (144 ITENS) */}
        <button
          type="button"
          onClick={onOpenSectionIndex}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all text-[#2A222B]/50 hover:text-[#2A222B]/80 cursor-pointer"
          title="Ver as 29 seções e 144 itens semiológicos"
        >
          <ListOrdered className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5 tracking-tight">
            Índice ({answeredCount}/{totalQuestions})
          </span>
        </button>

        {/* TAB 3: PRONTUÁRIO (PEP) */}
        <button
          type="button"
          onClick={() => onChangeView('summary')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'summary'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/50 hover:text-[#2A222B]/80'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeView === 'summary' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">Prontuário</span>
        </button>

        {/* TAB 4: AJUSTES / CONFIGURAÇÕES */}
        <button
          type="button"
          onClick={() => onChangeView('settings')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'settings'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/50 hover:text-[#2A222B]/80'
          }`}
        >
          <SettingsIcon className={`w-5 h-5 ${activeView === 'settings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
