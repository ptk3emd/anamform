/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clinical Summary & Physician Notes View for Electronic Health Records (PEP)
 * Refined with Manchester Triage Stratification and Dual View (PEP Text vs Interactive Cards)
 */

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  FileText,
  AlertTriangle,
  ArrowLeft,
  HeartPulse,
  ShieldAlert,
  Download,
  LayoutGrid,
  FileCode,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { generateClinicalSummary } from '../utils/clinicalSummary';

interface ClinicalSummaryViewProps {
  answers: Record<string, any>;
  onBackToForm: () => void;
  onGoToInterop: () => void;
  onLoadSample?: () => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({
  answers,
  onBackToForm,
  onGoToInterop,
  onLoadSample,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'cards'>('text');
  const summaryText = generateClinicalSummary(answers);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Clinical risk assessment
  const hasAllergy = Boolean(answers['anamnese/antecedentes/alergias']) &&
    !answers['anamnese/antecedentes/alergias']?.toLowerCase().includes('nega');
  const allergyDetails = answers['anamnese/antecedentes/alergias'];
  
  const dorEva = Number(answers['anamnese/hda/dor_intensidade']);
  const isHighPain = !isNaN(dorEva) && dorEva >= 7;
  const pa = answers['anamnese/exame_fisico/pressao_arterial'];
  const fc = answers['anamnese/exame_fisico/fc_pulso'] || answers['anamnese/exame_fisico/frequencia_cardiaca'];
  const spo2 = Number(answers['anamnese/exame_fisico/spo2'] || answers['anamnese/exame_fisico/saturacao_o2']);
  const glasgow = answers['anamnese/exame_fisico/glasgow'] || answers['anamnese/exame_fisico/escala_glasgow'];

  // Calculate Manchester Triage Protocol Alert
  const getTriageClassification = () => {
    if ((!isNaN(spo2) && spo2 < 90) || glasgow === 'grave' || (typeof glasgow === 'string' && parseInt(glasgow, 10) <= 12)) {
      return { label: 'EMERGÊNCIA (VERMELHO)', color: 'bg-rose-600 text-white', desc: 'Atendimento imediato' };
    }
    if (isHighPain || (!isNaN(spo2) && spo2 < 95) || pa?.includes('160') || pa?.includes('170') || pa?.includes('180')) {
      return { label: 'MUITO URGENTE (LARANJA)', color: 'bg-amber-600 text-white', desc: 'Atendimento em até 10 minutos' };
    }
    return { label: 'URGENTE (AMARELO)', color: 'bg-yellow-500 text-zinc-900', desc: 'Atendimento prioritário' };
  };

  const triage = getTriageClassification();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2A222B]/10">
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2A222B]/80 hover:text-[#2A222B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Questionário</span>
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#2A222B]/5 rounded-xl border border-[#2A222B]/10">
          <button
            type="button"
            onClick={() => setViewMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'text'
                ? 'bg-white text-[#2A222B] shadow-xs'
                : 'text-[#2A222B]/60 hover:text-[#2A222B]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Nota Texto (PEP)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#2A222B] shadow-xs'
                : 'text-[#2A222B]/60 hover:text-[#2A222B]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cartões Clínicos</span>
          </button>
        </div>

        {/* Actions: Copy, Download, Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => {
              const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Anamnese_${(answers['anamnese/identificacao/nome_completo'] || 'Paciente').replace(/\s+/g, '_')}_${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Baixar nota em arquivo texto"
          >
            <Download className="w-4 h-4" />
            <span>Baixar (.txt)</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Empty State Helper Banner */}
      {Object.keys(answers).length === 0 && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <strong className="font-semibold text-amber-950 block">Nenhum dado clínico preenchido ainda</strong>
            <span className="text-amber-800">Inicie a coleta conversacional ou carregue o caso clínico demonstrativo (SCA com 144 itens).</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onBackToForm}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Iniciar Coleta
            </button>
            {onLoadSample && (
              <button
                type="button"
                onClick={onLoadSample}
                className="px-3 py-1.5 rounded-lg bg-[#2A222B] text-white font-medium hover:bg-[#3d323e] transition-colors cursor-pointer shadow-xs"
              >
                Carregar Caso Completo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Clinical Warning Banners */}
      {(hasAllergy || isHighPain) && (
        <div className="space-y-2">
          {hasAllergy && (
            <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/80 text-rose-900 flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">ALERTA CRÍTICO: ALERGIA MEDICAMENTOSA</strong>
                <p className="text-sm mt-0.5">{allergyDetails}</p>
              </div>
            </div>
          )}

          {isHighPain && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">DOR AGUDA SEVERA (EVA {dorEva}/10)</strong>
                <p className="text-sm mt-0.5">Priorizar analgesia escalonada imediata e monitorização cardiorrespiratória contínua.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patient Header Card */}
      <div className="p-6 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2A222B]/50">
                Prontuário Médico Digital
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${triage.color}`}>
                {triage.label}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2A222B] mt-1 font-display">
              {answers['anamnese/identificacao/nome_completo'] || 'Paciente Anônimo'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[#2A222B]/70 mt-1.5 font-medium">
              <span>Nasc: {answers['anamnese/identificacao/data_nascimento'] || 'Não informada'}</span>
              <span>·</span>
              <span>Sexo: {answers['anamnese/identificacao/sexo_biologico'] === 'female' ? 'Feminino' : 'Masculino'}</span>
              <span>·</span>
              <span>Ocupação: {answers['anamnese/identificacao/profissao'] || 'Não informada'}</span>
              <span>·</span>
              <span>Procedência: {answers['anamnese/identificacao/naturalidade_procedencia'] || 'Não informada'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs shrink-0">
            <HeartPulse className="w-6 h-6 text-rose-500 shrink-0" />
            <div className="space-y-0.5 font-mono-code">
              <div className="font-semibold text-slate-800">PA: {pa || '--'} mmHg</div>
              <div className="text-slate-600">FC: {fc || '--'} | SpO2: {spo2 ? `${spo2}%` : '--'}</div>
            </div>
          </div>
        </div>

        {/* MODE 1: PURE FORMATTED TEXT FOR EHR (PEP) */}
        {viewMode === 'text' && (
          <div className="mt-4 pt-4 border-t border-[#2A222B]/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A222B]/50">
                Evolução Clínica Formatada (Padrão CFM / Prontuário Eletrônico)
              </label>
              <span className="text-[11px] text-[#2A222B]/50 font-mono-code">
                Pronto para colar em Tasy, MV Soul, AGHU, Epic, Cerner
              </span>
            </div>
            <pre className="p-5 bg-[#F6F4EF] rounded-xl font-mono-code text-xs md:text-sm text-[#2A222B] leading-relaxed whitespace-pre-wrap overflow-x-auto border border-[#2A222B]/10 shadow-inner">
              {summaryText}
            </pre>
          </div>
        )}

        {/* MODE 2: INTERACTIVE CARDS (IPPA SEMIOLOGY) */}
        {viewMode === 'cards' && (
          <div className="mt-4 pt-4 border-t border-[#2A222B]/10 space-y-4">
            {/* QP & HDA Card */}
            <div className="p-4 rounded-xl border border-[#2A222B]/10 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2A222B]/60 tracking-wider">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Queixa Principal &amp; História da Doença Atual (HDA)</span>
              </div>
              <p className="text-sm font-semibold text-[#2A222B]">
                &quot;{answers['anamnese/hda/queixa_principal'] || 'Não relatada'}&quot;
              </p>
              <p className="text-xs md:text-sm text-[#2A222B]/80 leading-relaxed">
                {answers['anamnese/hda/relato_cronologico'] || 'Sem relato cronológico registrado.'}
              </p>
              {answers['anamnese/hda/caracterizacao_dor'] && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 mt-2">
                  <strong>Semiologia da Dor:</strong> {answers['anamnese/hda/caracterizacao_dor']}
                </div>
              )}
            </div>

            {/* Antecedentes Pessoais & Medicamentos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[#2A222B]/10 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold uppercase text-[#2A222B]/60 tracking-wider block">
                  Antecedentes Pessoais &amp; Cirurgias
                </span>
                <p className="text-xs text-[#2A222B]/80">
                  {answers['anamnese/antecedentes/cirurgias_internacoes'] || 'Nega cirurgias ou internações prévias.'}
                </p>
                <div className="text-xs pt-1 border-t border-slate-200">
                  <strong>Tabagismo / Carga Tabágica:</strong> {answers['anamnese/habitos/tabagismo_completo'] || 'Não informado.'}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#2A222B]/10 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold uppercase text-[#2A222B]/60 tracking-wider block">
                  Medicamentos em Uso Contínuo
                </span>
                <p className="text-xs text-[#2A222B]/80 leading-relaxed">
                  {answers['anamnese/antecedentes/medicamentos_continuos'] || 'Nega uso de medicações contínuas.'}
                </p>
              </div>
            </div>

            {/* Exame Físico IPPA Card */}
            <div className="p-4 rounded-xl border border-[#2A222B]/10 bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold uppercase text-[#2A222B]/60 tracking-wider block">
                Exame Físico Admissional (IPPA — Porto, Bates &amp; Rocco)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-semibold text-slate-700">Tórax &amp; Pulmão (IPPA)</div>
                  <p className="text-slate-600 mt-1">{answers['anamnese/exame_fisico/pulmao_ausculta_ruidos'] || 'MV audível sem RA'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-semibold text-slate-700">Cardiovascular</div>
                  <p className="text-slate-600 mt-1">{answers['anamnese/exame_fisico/cv_ausculta_bulhas'] || 'RCR 2T, BNF sem sopros'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-semibold text-slate-700">Abdômen (I-A-P-P)</div>
                  <p className="text-slate-600 mt-1">{answers['anamnese/exame_fisico/abdome_palpacao'] || 'Flácido, indolor, RHA +'}</p>
                </div>
              </div>
            </div>

            {/* Hipóteses & Conduta */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-900 tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Hipóteses Diagnósticas &amp; Prescrição</span>
              </div>
              <div className="text-xs md:text-sm font-semibold text-emerald-950 whitespace-pre-line">
                {answers['anamnese/conduta/hipoteses_principais'] || 'A esclarecer.'}
              </div>
              <div className="text-xs text-emerald-900 mt-2 pt-2 border-t border-emerald-200/60 whitespace-pre-line">
                <strong>Prescrição &amp; Conduta Inicial:</strong>
                <p className="mt-1">{answers['anamnese/conduta/prescricao_inicial'] || 'A definir.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
