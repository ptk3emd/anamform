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
    <div className="w-full max-w-[760px] flex flex-col items-start px-4 py-12 animate-in fade-in duration-300">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-md">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-medium text-[#2A222B] mb-3">
        Anamnese Concluída com Sucesso!
      </h1>

      <p className="text-base md:text-lg text-[#2A222B]/75 mb-6 max-w-xl leading-relaxed">
        Os dados clínicos do paciente <strong>{patientName || 'Atendido'}</strong> foram estruturados e validados de acordo com o padrão <strong>FHIR R4 QuestionnaireResponse</strong> e convertidos para caminhos FLAT openEHR.
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#2A222B]/10 shadow-xs mb-8 w-full max-w-md text-sm">
        <div>
          <span className="text-[#2A222B]/50 block text-xs">Total de campos preenchidos</span>
          <span className="text-lg font-bold text-[#2A222B]">{totalAnswered} itens clínicos</span>
        </div>
        <div className="w-[1px] h-8 bg-[#2A222B]/10" />
        <div>
          <span className="text-[#2A222B]/50 block text-xs">Status da interoperabilidade</span>
          <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1">
            Pronto para EHRbase / PEP
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
          className="p-3 text-[#2A222B]/60 hover:text-[#2A222B] transition-colors"
          title="Nova Anamnese"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
