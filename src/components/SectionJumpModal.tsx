/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Section Jump & Outline Drawer for Medical Questionnaire
 */

import React from 'react';
import { X, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { QuestionnaireItem } from '../types/fhir';

interface SectionJumpModalProps {
  questions: QuestionnaireItem[];
  currentIndex: number;
  answers: Record<string, any>;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
}

export const SectionJumpModal: React.FC<SectionJumpModalProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  onClose,
}) => {
  // Group questions by category
  const groups: Record<string, { item: QuestionnaireItem; index: number }[]> = {};

  questions.forEach((q, idx) => {
    const cat = q.category || 'Geral';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push({ item: q, index: idx });
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#2A222B]/10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A222B]/10">
          <div>
            <h3 className="font-semibold text-base text-[#2A222B]">
              Índice da Anamnese Médica
            </h3>
            <p className="text-xs text-[#2A222B]/60 mt-0.5">
              Navegue diretamente para qualquer seção do questionário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#2A222B]/50 hover:text-[#2A222B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A222B]/50 px-1">
                {category}
              </h4>
              <div className="space-y-1">
                {items.map(({ item, index }) => {
                  const hasAnswer =
                    answers[item.linkId] !== undefined &&
                    answers[item.linkId] !== null &&
                    answers[item.linkId] !== '' &&
                    (!Array.isArray(answers[item.linkId]) || answers[item.linkId].length > 0);
                  const isCurrent = currentIndex === index;

                  return (
                    <button
                      key={item.linkId}
                      type="button"
                      onClick={() => {
                        onSelectQuestion(index);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        isCurrent
                          ? 'bg-[#2A222B] text-white font-medium shadow-xs'
                          : 'hover:bg-[#2A222B]/5 text-[#2A222B]/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {hasAnswer ? (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? 'text-emerald-300' : 'text-emerald-600'
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? 'text-white/40' : 'text-[#2A222B]/30'
                            }`}
                          />
                        )}
                        <span className="truncate">
                          {item.prefix ? `${item.prefix} ` : ''}
                          {item.text}
                        </span>
                      </div>
                      {isCurrent && <ArrowRight className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
