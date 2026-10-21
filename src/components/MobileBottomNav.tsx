/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile-First Bottom Bar Navigation for .anamform
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
    <nav aria-label="Seções do app" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#2A222B]/10 shadow-[0_-4px_16px_rgba(42,34,43,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))] px-2 sm:px-6 py-1.5 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* TAB 1: COLETA (TYPEFORM) */}
        <button
          type="button"
          onClick={() => onChangeView('form')}
          aria-current={activeView === 'form' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-h-11 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'form'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/65 hover:text-[#2A222B]/80'
          }`}
        >
          <div className="relative">
            <Stethoscope className={`w-5 h-5 ${activeView === 'form' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {answeredCount > 0 && activeView !== 'form' && (
              <span aria-hidden="true" className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#198754]" />
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Coleta</span>
        </button>

        {/* TAB 2: ÍNDICE (144 ITENS) */}
        <button
          type="button"
          onClick={onOpenSectionIndex}
          className="flex flex-col items-center justify-center min-h-11 py-1 px-3 rounded-xl transition-all text-[#2A222B]/65 hover:text-[#2A222B]/80 cursor-pointer"
          title="Ver as 29 seções e 144 itens semiológicos"
        >
          <ListOrdered className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5 tracking-tight whitespace-nowrap">
            Índice ({answeredCount}/{totalQuestions})
          </span>
        </button>

        {/* TAB 3: PRONTUÁRIO (PEP) */}
        <button
          type="button"
          onClick={() => onChangeView('summary')}
          aria-current={activeView === 'summary' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-h-11 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'summary'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/65 hover:text-[#2A222B]/80'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeView === 'summary' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">Prontuário</span>
        </button>

        {/* TAB 4: AJUSTES / CONFIGURAÇÕES */}
        <button
          type="button"
          onClick={() => onChangeView('settings')}
          aria-current={activeView === 'settings' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-h-11 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'settings'
              ? 'text-[#2A222B] font-semibold'
              : 'text-[#2A222B]/65 hover:text-[#2A222B]/80'
          }`}
        >
          <SettingsIcon className={`w-5 h-5 ${activeView === 'settings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-0.5 tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
