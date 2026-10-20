/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Welcome Screen
 */

import React from 'react';
import { Stethoscope, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Questionnaire } from '../types/fhir';
import { ThemeConfig } from '../types/theme';

interface WelcomeScreenProps {
  questionnaire: Questionnaire;
  onStart: () => void;
  theme: ThemeConfig;
  answeredCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  questionnaire,
  onStart,
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
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md"
        style={{ backgroundColor: theme.brandColor }}
      >
        <Stethoscope className="w-7 h-7 text-emerald-400" />
      </div>

      {/* Main Title */}
      <h1
        className={`font-medium tracking-tight text-[#2A222B] mb-4 font-display ${titleSizeClass}`}
      >
        {questionnaire.title}
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-[#2A222B]/75 mb-6 max-w-xl leading-relaxed">
        {questionnaire.description ||
          'Bem-vindo à coleta de anamnese clínica digital. Responda com atenção para garantir a acurácia dos registros assistenciais.'}
      </p>

      {/* Metadata Indicators (Zero-Pill discipline compliant) */}
      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#2A222B]/60 mb-8 font-medium">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#2A222B]/50" />
          <span>Tempo estimado: 3 a 5 min</span>
        </div>
        <span aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FHIR R4 &amp; openEHR Compatível</span>
        </div>
        <span aria-hidden="true">·</span>
        <span>LGPD / Sigilo Médico</span>
      </div>

      {/* Start Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          data-testid="start-anamnese-btn"
          onClick={onStart}
          className="flex items-center gap-3 px-8 py-3.5 rounded-xl text-white font-medium text-lg shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          style={{ backgroundColor: theme.brandColor }}
        >
          <span>{answeredCount > 0 ? 'Continuar Anamnese' : 'Iniciar Anamnese'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-xs text-[#2A222B]/50 font-medium hidden sm:inline">
          pressione <strong className="font-semibold text-[#2A222B]/70">Enter ↵</strong>
        </span>
      </div>
    </div>
  );
};
