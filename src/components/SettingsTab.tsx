/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Settings & Configuration Hub for .anamform
 * Consolidates Theme, Presets, Templates, Interop and System Reset
 */

import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Palette,
  Database,
  Check,
  Send,
  Download,
  Copy,
  Layers,
  Server,
  FileCheck2,
  FileText,
  Sliders,
  AlignLeft,
  AlignCenter,
  Volume2,
  FastForward,
} from 'lucide-react';
import { Questionnaire, QuestionnaireResponse } from '../types/fhir';
import { ThemeConfig } from '../types/theme';
import { AVAILABLE_QUESTIONNAIRES } from '../data/questionnaires';
import {
  convertFhirToOpenEHRFlat,
  buildEhrbasePayload,
  buildBahmniObsPayload,
} from '../utils/openehrConverter';

interface SettingsTabProps {
  currentQuestionnaire: Questionnaire;
  onSelectQuestionnaire: (q: Questionnaire) => void;
  questionnaireResponse: QuestionnaireResponse;
  theme: ThemeConfig;
  onUpdateTheme: (updated: ThemeConfig) => void;
  onLoadSample: () => void;
  onReset: () => void;
  onGoToForm: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentQuestionnaire,
  onSelectQuestionnaire,
  questionnaireResponse,
  theme,
  onUpdateTheme,
  onLoadSample,
  onReset,
  onGoToForm,
}) => {
  const [activeSection, setActiveSection] = useState<'geral' | 'tema' | 'interop'>('geral');
  const [interopTab, setInteropTab] = useState<'fhir-qr' | 'openehr-flat' | 'ehrbase' | 'bahmni'>('fhir-qr');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ehrbaseSuccess, setEhrbaseSuccess] = useState<string | null>(null);

  const colors = [
    { label: 'Plum Negro (Typeform)', value: '#2A222B' },
    { label: 'Verde Clínico (Hospital)', value: '#198754' },
    { label: 'Azul Cobalto (Digital Health)', value: '#006BFF' },
    { label: 'Coral Quente (Design.md)', value: '#EF6451' },
    { label: 'Grafite Escuro', value: '#1E293B' },
  ];

  const backgrounds = [
    { label: 'Papel Quente (#F6F4EF)', value: '#F6F4EF' },
    { label: 'Branco Puro (#FFFFFF)', value: '#FFFFFF' },
    { label: 'Cinza Suave (#F8FAFC)', value: '#F8FAFC' },
    { label: 'Escuro Minimalista (#18181B)', value: '#18181B' },
  ];

  const openEhrFlat = convertFhirToOpenEHRFlat(questionnaireResponse);
  const ehrbasePayload = buildEhrbasePayload(questionnaireResponse);
  const bahmniPayload = buildBahmniObsPayload(questionnaireResponse);

  const getActivePayloadJson = () => {
    switch (interopTab) {
      case 'fhir-qr':
        return JSON.stringify(questionnaireResponse, null, 2);
      case 'openehr-flat':
        return JSON.stringify(openEhrFlat, null, 2);
      case 'ehrbase':
        return JSON.stringify(ehrbasePayload, null, 2);
      case 'bahmni':
        return JSON.stringify(bahmniPayload, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActivePayloadJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const jsonStr = getActivePayloadJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${interopTab}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateEhrbasePost = () => {
    setIsSubmitting(true);
    setEhrbaseSuccess(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setEhrbaseSuccess(`Composição gravada com sucesso no EHRbase! UID: ${Math.random().toString(36).substring(2, 12)}::openEHR.local::1`);
    }, 1100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 pb-28 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-medium text-[#2A222B]">
          Ajustes &amp; Configurações
        </h2>
        <p className="text-sm text-[#2A222B]/70 mt-1">
          Gerenciamento de modelos clínicos, design system e interoperabilidade FHIR / openEHR.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#2A222B]/5 rounded-xl border border-[#2A222B]/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveSection('geral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeSection === 'geral'
              ? 'bg-white text-[#2A222B] shadow-xs'
              : 'text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Geral &amp; Modelos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('tema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeSection === 'tema'
              ? 'bg-white text-[#2A222B] shadow-xs'
              : 'text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Tema &amp; Design</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('interop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeSection === 'interop'
              ? 'bg-white text-[#2A222B] shadow-xs'
              : 'text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Interoperabilidade (FHIR/openEHR)</span>
        </button>
      </div>

      {/* SECTION 1: GERAL & MODELOS */}
      {activeSection === 'geral' && (
        <div className="space-y-6">
          {/* Preset Case Loader Card */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-950 text-base">
                  Preencher com Caso Clínico Completo
                </h3>
              </div>
              <p className="text-xs md:text-sm text-emerald-800 mt-1 max-w-lg">
                Carrega instantaneamente o caso de <strong>Dr. Marcos Aurélio (SCA / Dor Torácica)</strong> com todos os 144 itens semiológicos preenchidos (identificação, ROS 13 sistemas, exame físico IPPA completo e prescrição).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoadSample();
                onGoToForm();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Carregar Caso Exemplo
            </button>
          </div>

          {/* Model Selection */}
          <div className="p-6 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-[#2A222B]">
              Modelo de Anamnese Selecionado
            </h3>
            <p className="text-xs text-[#2A222B]/60">
              Escolha a extensão do questionário para o perfil do seu atendimento:
            </p>

            <div className="space-y-2">
              {AVAILABLE_QUESTIONNAIRES.map((q) => {
                const isSelected = q.id === currentQuestionnaire.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onSelectQuestionnaire(q)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#2A222B] bg-[#2A222B]/[0.02] shadow-xs'
                        : 'border-[#2A222B]/10 hover:border-[#2A222B]/30'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#2A222B] text-sm md:text-base">
                        {q.title}
                      </div>
                      <div className="text-xs text-[#2A222B]/60 mt-0.5">
                        {q.description} ({q.item.length} itens clínicos mapeados em FHIR R4)
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#2A222B] text-white flex items-center justify-center shrink-0 ml-3">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interaction Preferences */}
          <div className="p-6 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-[#2A222B]">
              Preferências de Interação
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-[#2A222B]/10 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FastForward className="w-5 h-5 text-[#2A222B]/60" />
                  <div>
                    <div className="font-medium text-sm text-[#2A222B]">Auto-avanço ao escolher opção</div>
                    <div className="text-xs text-[#2A222B]/60">Avança automaticamente ao responder escolhas únicas (padrão Typeform)</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.autoAdvanceOnSingleChoice}
                  onChange={(e) =>
                    onUpdateTheme({
                      ...theme,
                      autoAdvanceOnSingleChoice: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#2A222B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#2A222B]/10 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-[#2A222B]/60" />
                  <div>
                    <div className="font-medium text-sm text-[#2A222B]">Feedback sonoro suave</div>
                    <div className="text-xs text-[#2A222B]/60">Som sutil de transição sintetizado via Web Audio API</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={theme.soundEffects}
                  onChange={(e) =>
                    onUpdateTheme({
                      ...theme,
                      soundEffects: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#2A222B] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Reset Action */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm text-rose-950">Limpar Respostas da Anamnese</h4>
              <p className="text-xs text-rose-800 mt-0.5">Apaga todos os dados digitados e reinicia o questionário em branco.</p>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-medium transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Rascunho</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: TEMA & DESIGN */}
      {activeSection === 'tema' && (
        <div className="p-6 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs space-y-6">
          {/* Typography */}
          <div>
            <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider mb-2">
              Família Tipográfica
            </label>
            <select
              value={theme.fontFamily}
              onChange={(e) =>
                onUpdateTheme({
                  ...theme,
                  fontFamily: e.target.value as any,
                })
              }
              className="w-full px-3 py-2.5 rounded-lg border border-[#2A222B]/20 bg-white text-[#2A222B] focus:border-[#2A222B] focus:outline-none"
            >
              <option value="serif">Tobias / Lora / Georgia (Design.md Serifada Médica)</option>
              <option value="sans">Geist / Plus Jakarta / Inter (Sans-Serif Contemporânea)</option>
              <option value="system">Fonte Nativa do Sistema Operacional</option>
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider mb-2">
              Cor de Destaque e Títulos
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onUpdateTheme({ ...theme, brandColor: c.value })}
                  className={`h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                    theme.brandColor === c.value
                      ? 'border-[#2A222B] scale-105 shadow-xs'
                      : 'border-transparent hover:scale-102'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {theme.brandColor === c.value && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size and Positioning - Replicating UI Kit */}
          <div className="p-4 rounded-xl border-2 border-amber-400/80 bg-amber-50/20 space-y-4">
            <span className="text-xs font-semibold text-[#2A222B] uppercase tracking-wide">
              Tamanho e Posicionamento (Design System Typeform)
            </span>

            {/* Welcome Size */}
            <div>
              <div className="text-xs text-[#2A222B]/70 mb-1.5 font-medium">
                Tela Inicial e Encerramento
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-[#2A222B]/5 p-0.5 rounded-md">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onUpdateTheme({ ...theme, welcomeSize: s })}
                      className={`px-3 py-1 rounded text-xs capitalize font-medium transition-all ${
                        theme.welcomeSize === s
                          ? 'bg-white shadow-xs text-[#2A222B]'
                          : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Size & Alignment */}
            <div>
              <div className="text-xs text-[#2A222B]/70 mb-1.5 font-medium">
                Tamanho e Alinhamento das Perguntas
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-[#2A222B]/5 p-0.5 rounded-md">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onUpdateTheme({ ...theme, questionSize: s })}
                      className={`px-3 py-1 rounded text-xs capitalize font-medium transition-all ${
                        theme.questionSize === s
                          ? 'bg-white shadow-xs text-[#2A222B]'
                          : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#2A222B]/5 p-0.5 rounded-md">
                  <button
                    type="button"
                    onClick={() => onUpdateTheme({ ...theme, alignment: 'left' })}
                    className={`p-1.5 rounded transition-all ${
                      theme.alignment === 'left'
                        ? 'bg-white shadow-xs text-[#2A222B]'
                        : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                    }`}
                    title="Alinhar à esquerda"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTheme({ ...theme, alignment: 'center' })}
                    className={`p-1.5 rounded transition-all ${
                      theme.alignment === 'center'
                        ? 'bg-white shadow-xs text-[#2A222B]'
                        : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                    }`}
                    title="Centralizar"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Background Canvas */}
          <div>
            <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider mb-2">
              Fundo da Interface
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.value}
                  type="button"
                  onClick={() => onUpdateTheme({ ...theme, bgColor: bg.value })}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                    theme.bgColor === bg.value
                      ? 'border-[#2A222B] ring-1 ring-[#2A222B]'
                      : 'border-[#2A222B]/10 hover:border-[#2A222B]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-md border border-black/20"
                      style={{ backgroundColor: bg.value }}
                    />
                    <span className="font-medium text-xs text-[#2A222B]">{bg.label}</span>
                  </div>
                  {theme.bgColor === bg.value && <Check className="w-4 h-4 text-[#2A222B]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INTEROPERABILIDADE */}
      {activeSection === 'interop' && (
        <div className="space-y-4">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A222B]/15 bg-white text-xs font-medium text-[#2A222B] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A222B]/15 bg-white text-xs font-medium text-[#2A222B] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar .json</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSimulateEhrbasePost}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#198754] text-white hover:bg-[#146c43] text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitindo...' : 'Transmitir ao EHRbase'}</span>
            </button>
          </div>

          {/* Success Banner */}
          {ehrbaseSuccess && (
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{ehrbaseSuccess}</span>
              </div>
              <span className="font-mono-code bg-emerald-200/60 px-1.5 py-0.5 rounded text-[10px]">
                HTTP 201 Created
              </span>
            </div>
          )}

          {/* Format Sub-Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'fhir-qr', label: 'FHIR QuestionnaireResponse' },
              { id: 'openehr-flat', label: 'openEHR FLAT (CISTEC)' },
              { id: 'ehrbase', label: 'EHRbase Composition' },
              { id: 'bahmni', label: 'Bahmni / OpenMRS' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInteropTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  interopTab === tab.id
                    ? 'bg-[#2A222B] text-white shadow-2xs'
                    : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="rounded-2xl border border-[#2A222B]/15 bg-[#18181B] text-emerald-400 p-4 shadow-lg overflow-hidden flex flex-col max-h-[480px]">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800 font-mono-code">
              <span>{interopTab}.json</span>
              <span className="text-zinc-500">Padrão HL7 FHIR R4 &amp; openEHR</span>
            </div>
            <pre className="mt-3 flex-1 overflow-y-auto font-mono-code text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap select-all">
              {getActivePayloadJson()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
