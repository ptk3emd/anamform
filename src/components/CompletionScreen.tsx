/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Completion & Submission Screen
 */

import React from 'react';
import { CheckCircle2, FileText, Code2, RotateCcw } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface CompletionScreenProps {
  patientName: string;
  totalAnswered: number;
  onGoToSummary: () => void;
  onGoToInterop: () => void;
  onRestart: () => void;
  theme: ThemeConfig;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  patientName,
  totalAnswered,
  onGoToSummary,
  onGoToInterop,
  onRestart,
  theme,
}) => {
  return (
    <div className="w-full max-w-[760px] flex flex-col items-start px-4 py-12">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-md">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-medium text-[#2A222B] mb-3">
        Coleta encerrada. Prontuário pronto para revisar.
      </h1>

      <p className="text-base md:text-lg text-[#2A222B]/75 mb-6 max-w-xl leading-relaxed">
        Você registrou {totalAnswered} itens{patientName ? <> para <strong className="[overflow-wrap:anywhere]">{patientName}</strong></> : ''}. Os demais campos continuam em branco. Revise o texto ou retome a coleta quando precisar.
      </p>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4 rounded-xl bg-white border border-[#2A222B]/10 shadow-xs mb-8 w-full max-w-md text-sm">
        <div>
          <span className="text-[#2A222B]/65 block text-xs">Total de campos preenchidos</span>
          <span className="text-lg font-bold text-[#2A222B]">{totalAnswered} itens clínicos</span>
        </div>
        <div className="hidden sm:block w-[1px] h-8 bg-[#2A222B]/10" />
        <div>
          <span className="text-[#2A222B]/65 block text-xs">Próximo passo</span>
          <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1">
            Revisar o registro
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGoToSummary}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-base shadow-sm hover:opacity-95 transition-all"
          style={{ backgroundColor: theme.brandColor }}
        >
          <FileText className="w-4 h-4" />
          <span>Ver Resumo para Prontuário</span>
        </button>

        <button
          type="button"
          onClick={onGoToInterop}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#2A222B]/15 text-[#2A222B] font-medium text-base hover:bg-slate-50 transition-all shadow-xs"
        >
          <Code2 className="w-4 h-4" />
          <span>Exportar FHIR &amp; openEHR</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="size-11 flex items-center justify-center text-[#2A222B]/65 hover:text-[#2A222B] transition-colors"
          title="Retomar esta coleta"
          aria-label="Retomar esta coleta"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
