/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Welcome Screen
 */

import React from 'react';
import { Stethoscope, Clock, ArrowRight } from 'lucide-react';
import { Questionnaire } from '../types/fhir';
import { ThemeConfig } from '../types/theme';

interface WelcomeScreenProps {
  questionnaire: Questionnaire;
  onStart: () => void;
  onLoadSample?: () => void;
  theme: ThemeConfig;
  answeredCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  questionnaire,
  onStart,
  onLoadSample,
  theme,
  answeredCount,
}) => {
  const titleSizeClass =
    theme.welcomeSize === 'sm'
      ? 'text-2xl md:text-3xl'
      : theme.welcomeSize === 'lg'
      ? 'text-4xl md:text-5xl'
      : 'text-3xl md:text-4xl';

  const alignmentClass =
    theme.alignment === 'center'
      ? 'text-center items-center mx-auto'
      : 'text-left items-start';

  return (
    <div className={`w-full max-w-[760px] flex flex-col ${alignmentClass} px-4 py-12`}>
      {/* Icon Badge */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-8 shadow-sm"
        style={{ backgroundColor: theme.brandColor }}
      >
        <Stethoscope className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Main Title */}
      <h1
        className={`font-medium tracking-tight text-[#2A222B] mb-4 font-display ${titleSizeClass}`}
      >
        .anamform
      </h1>

      {/* Description */}
      <p className="w-full text-base md:text-lg text-[#2A222B]/70 mb-8 max-w-xl leading-relaxed">
        Roteiro de anamnese completa com sequência propedêutica IPPA.
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-sm text-[#2A222B]/65 mb-10 font-medium">
        <Clock className="w-4 h-4 text-[#2A222B]/45" />
        <span>Tempo estimado: 45 a 60 min</span>
      </div>

      {/* Start Button & Quick Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          data-testid="start-anamnese-btn"
          onClick={onStart}
          className="flex items-center gap-3 px-8 py-3.5 rounded-xl text-white font-medium text-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-[transform,opacity] duration-150 cursor-pointer"
          style={{ backgroundColor: theme.brandColor }}
        >
          <span>{answeredCount > 0 ? 'Continuar Anamnese' : 'Iniciar Anamnese'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {onLoadSample && answeredCount === 0 && (
          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center gap-2 px-5 py-3.5 min-h-11 rounded-xl bg-white border border-[#2A222B]/15 text-[#2A222B] hover:bg-slate-50 font-medium text-sm transition-all shadow-xs cursor-pointer"
            title="Carregar caso pré-preenchido de 144 itens para teste rápido"
          >
            <span>Carregar Caso Clínico (SCA)</span>
          </button>
        )}

        <span className="text-xs text-[#2A222B]/65 font-medium hidden sm:inline">
          pressione <strong className="font-semibold text-[#2A222B]/70">Enter ↵</strong>
        </span>
      </div>
    </div>
  );
};
