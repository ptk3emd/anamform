/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clinical Summary & Physician Notes View for Electronic Health Records (PEP)
 */

import React, { useState } from 'react';
import { Copy, Check, Printer, FileText, AlertTriangle, ArrowLeft, HeartPulse, ShieldAlert } from 'lucide-react';
import { generateClinicalSummary } from '../utils/clinicalSummary';

interface ClinicalSummaryViewProps {
  answers: Record<string, any>;
  onBackToForm: () => void;
  onGoToInterop: () => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({
  answers,
  onBackToForm,
  onGoToInterop,
}) => {
  const [copied, setCopied] = useState(false);
  const summaryText = generateClinicalSummary(answers);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract clinical alert highlights
  const hasAllergy = Boolean(answers['anamnese/antecedentes/tem_alergias']);
  const allergyDetails = answers['anamnese/antecedentes/alergias_detalhes'];
  const dorEva = Number(answers['anamnese/hda/dor_intensidade']);
  const isHighPain = !isNaN(dorEva) && dorEva >= 7;
  const pa = answers['anamnese/exame_fisico/pressao_arterial'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2A222B]/10">
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2A222B]/80 hover:text-[#2A222B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Questionário</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar para Prontuário'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={onGoToInterop}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#2A222B] text-white hover:bg-[#3f3440] transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Ver FHIR & openEHR</span>
          </button>
        </div>
      </div>

      {/* Clinical Warning Banners */}
      {(hasAllergy || isHighPain) && (
        <div className="space-y-2">
          {hasAllergy && (
            <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/80 text-rose-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">ALERTA CLÍNICO DE ALERGIA MEDICAMENTOSA</strong>
                <p className="text-sm mt-0.5">{allergyDetails || 'Histórico de alergia referido pelo paciente. Verificar antes de prescrever.'}</p>
              </div>
            </div>
          )}

          {isHighPain && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">DOR AGUDA MODERADA A SEVERA (EVA {dorEva}/10)</strong>
                <p className="text-sm mt-0.5">Priorizar analgesia escalonada e reavaliação dos sinais vitais.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patient Banner */}
      <div className="p-6 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2A222B]/50">
              Prontuário Médico Digital
            </span>
            <h2 className="text-2xl font-bold text-[#2A222B] mt-0.5 font-display">
              {answers['anamnese/identificacao/nome_completo'] || 'Paciente Anônimo'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#2A222B]/70 mt-1">
              <span>Nasc: {answers['anamnese/identificacao/data_nascimento'] || 'Não informada'}</span>
              <span>·</span>
              <span>Sexo: {answers['anamnese/identificacao/sexo_biologico'] === 'female' ? 'Feminino' : 'Masculino'}</span>
              <span>·</span>
              <span>Ocupação: {answers['anamnese/identificacao/profissao'] || 'Não informada'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <div>
              <div className="font-semibold text-slate-800">Sinais Vitais Admissão</div>
              <div className="text-slate-600">PA: {pa || '--'} | FC: {answers['anamnese/exame_fisico/frequencia_cardiaca'] || '--'} bpm | SpO2: {answers['anamnese/exame_fisico/saturacao_o2'] || '--'}%</div>
            </div>
          </div>
        </div>

        {/* Formatted Medical Note Content */}
        <div className="mt-4 pt-4 border-t border-[#2A222B]/10">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A222B]/50 mb-2">
            Nota de Evolução Clínica Formatada (Padrão CFM / PEP)
          </label>
          <pre className="p-5 bg-[#F6F4EF] rounded-xl font-mono-code text-xs md:text-sm text-[#2A222B] leading-relaxed whitespace-pre-wrap overflow-x-auto border border-[#2A222B]/10 shadow-inner">
            {summaryText}
          </pre>
        </div>
      </div>
    </div>
  );
};
