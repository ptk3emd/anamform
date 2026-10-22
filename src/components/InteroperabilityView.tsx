/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Healthcare Interoperability Hub: FHIR R4 & openEHR EHRbase
 */

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Database,
  Send,
  Layers,
  FileCheck2,
  ExternalLink,
  ArrowLeft,
  Server,
} from 'lucide-react';
import { Questionnaire, QuestionnaireResponse } from '../types/fhir';
import {
  convertFhirToOpenEHRFlat,
  buildEhrbasePayload,
  buildBahmniObsPayload,
} from '../utils/openehrConverter';

interface InteroperabilityViewProps {
  questionnaire: Questionnaire;
  questionnaireResponse: QuestionnaireResponse;
  onBackToForm: () => void;
}

export const InteroperabilityView: React.FC<InteroperabilityViewProps> = ({
  questionnaire,
  questionnaireResponse,
  onBackToForm,
}) => {
  const [activeTab, setActiveTab] = useState<'fhir-qr' | 'fhir-q' | 'openehr-flat' | 'ehrbase-payload' | 'bahmni'>('fhir-qr');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ehrbaseSuccess, setEhrbaseSuccess] = useState<string | null>(null);

  const openEhrFlat = convertFhirToOpenEHRFlat(questionnaireResponse);
  const ehrbasePayload = buildEhrbasePayload(questionnaireResponse);
  const bahmniPayload = buildBahmniObsPayload(questionnaireResponse);

  const getActivePayloadJson = () => {
    switch (activeTab) {
      case 'fhir-qr':
        return JSON.stringify(questionnaireResponse, null, 2);
      case 'fhir-q':
        return JSON.stringify(questionnaire, null, 2);
      case 'openehr-flat':
        return JSON.stringify(openEhrFlat, null, 2);
      case 'ehrbase-payload':
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
    a.download = `${activeTab}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateEhrbasePost = () => {
    setIsSubmitting(true);
    setEhrbaseSuccess(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setEhrbaseSuccess('Simulação concluída. Nenhum dado foi enviado ou gravado em servidor.');
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
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
            <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-[#2A222B]/15 bg-white text-[#2A222B] hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .json</span>
          </button>

          <button
            onClick={handleSimulateEhrbasePost}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#198754] text-white hover:bg-[#146c43] disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Simulando...' : 'Simular envio ao EHRbase'}</span>
          </button>
        </div>
      </div>

      {/* EHRbase Success Notification */}
      {ehrbaseSuccess && (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{ehrbaseSuccess}</span>
          </div>
          <span className="text-xs font-mono-code bg-emerald-200/60 text-emerald-900 px-2 py-1 rounded">
            Demonstração local
          </span>
        </div>
      )}

      {/* Architecture Explainer Card */}
      <div className="p-5 rounded-2xl border border-[#2A222B]/10 bg-white shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-[#2A222B]">
              Interoperabilidade Semântica em Saúde: FHIR R4 &harr; openEHR (CISTEC)
            </h3>
            <p className="text-sm text-[#2A222B]/70 leading-relaxed">
              O .anamform utiliza a especificação CISTEC para transformar cada pergunta do questionário em um caminho <strong>FLAT openEHR</strong> no <code>linkId</code>. Isso possibilita que os dados preenchidos no formulário Typeform sejam imediatamente exportados como um recurso padrão <strong>FHIR QuestionnaireResponse</strong> e convertidos em composições nativas para <strong>EHRbase</strong>, <strong>OpenEMR</strong> e <strong>Bahmni</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A222B]/10 pb-2">
        <button
          onClick={() => setActiveTab('fhir-qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'fhir-qr'
              ? 'bg-[#2A222B] text-white shadow-xs'
              : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>FHIR QuestionnaireResponse</span>
        </button>

        <button
          onClick={() => setActiveTab('openehr-flat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'openehr-flat'
              ? 'bg-[#2A222B] text-white shadow-xs'
              : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>openEHR FLAT (CISTEC)</span>
        </button>

        <button
          onClick={() => setActiveTab('ehrbase-payload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ehrbase-payload'
              ? 'bg-[#2A222B] text-white shadow-xs'
              : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>EHRbase Composition API</span>
        </button>

        <button
          onClick={() => setActiveTab('bahmni')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'bahmni'
              ? 'bg-[#2A222B] text-white shadow-xs'
              : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bahmni / OpenMRS Adaptador</span>
        </button>

        <button
          onClick={() => setActiveTab('fhir-q')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'fhir-q'
              ? 'bg-[#2A222B] text-white shadow-xs'
              : 'bg-white border border-[#2A222B]/10 text-[#2A222B]/70 hover:text-[#2A222B]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Definição FHIR Questionnaire</span>
        </button>
      </div>

      {/* JSON Viewer */}
      <div className="rounded-2xl border border-[#2A222B]/15 bg-[#18181B] text-emerald-400 p-5 shadow-lg overflow-hidden flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between text-xs text-zinc-400 pb-3 border-b border-zinc-800 font-mono-code">
          <span>{activeTab}.json</span>
          <span className="text-zinc-500">HL7 FHIR R4 & openEHR REST API 1.0</span>
        </div>
        <pre className="mt-3 flex-1 overflow-y-auto font-mono-code text-xs md:text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap select-all">
          {getActivePayloadJson()}
        </pre>
      </div>
    </div>
  );
};
