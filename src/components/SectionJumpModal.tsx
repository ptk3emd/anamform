/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Section Jump & Outline Drawer with Real-Time Search & Status Filters
 */

import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, Circle, ArrowRight, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  // Filter questions based on search and status
  const filteredQuestions = useMemo(() => {
    return questions
      .map((item, originalIndex) => {
        const hasAnswer =
          answers[item.linkId] !== undefined &&
          answers[item.linkId] !== null &&
          answers[item.linkId] !== '' &&
          (!Array.isArray(answers[item.linkId]) || answers[item.linkId].length > 0);
        return { item, originalIndex, hasAnswer };
      })
      .filter(({ item, hasAnswer }) => {
        if (filterMode === 'pending' && hasAnswer) return false;
        if (filterMode === 'completed' && !hasAnswer) return false;

        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchText = item.text.toLowerCase().includes(term);
          const matchCat = item.category?.toLowerCase().includes(term);
          const matchPrefix = item.prefix?.toLowerCase().includes(term);
          return matchText || matchCat || matchPrefix;
        }

        return true;
      });
  }, [questions, answers, searchTerm, filterMode]);

  // Group filtered questions by category
  const groups = useMemo(() => {
    const result: Record<string, { item: QuestionnaireItem; originalIndex: number; hasAnswer: boolean }[]> = {};
    filteredQuestions.forEach((entry) => {
      const cat = entry.item.category || 'Geral';
      if (!result[cat]) {
        result[cat] = [];
      }
      result[cat].push(entry);
    });
    return result;
  }, [filteredQuestions]);

  const totalAnswered = useMemo(() => {
    return questions.filter((item) => {
      const val = answers[item.linkId];
      return val !== undefined && val !== null && val !== '' && (!Array.isArray(val) || val.length > 0);
    }).length;
  }, [questions, answers]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#2A222B]/10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2A222B]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-[#2A222B]">
                Índice da Anamnese Médica
              </h3>
              <p className="text-xs text-[#2A222B]/60 mt-0.5">
                {totalAnswered} de {questions.length} itens respondidos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#2A222B]/65 hover:text-[#2A222B] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#2A222B]/55 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar item semiológico (ex: Glasgow, Murphy, Dor)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#2A222B]/15 rounded-xl text-xs text-[#2A222B] focus:border-[#2A222B] focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#2A222B] text-white'
                  : 'bg-slate-100 text-[#2A222B]/70 hover:bg-slate-200'
              }`}
            >
              Todos ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'pending'
                  ? 'bg-[#2A222B] text-white'
                  : 'bg-slate-100 text-[#2A222B]/70 hover:bg-slate-200'
              }`}
            >
              Pendentes ({questions.length - totalAnswered})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'completed'
                  ? 'bg-[#2A222B] text-white'
                  : 'bg-slate-100 text-[#2A222B]/70 hover:bg-slate-200'
              }`}
            >
              Preenchidos ({totalAnswered})
            </button>
          </div>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.keys(groups).length === 0 ? (
            <div className="text-center py-12 text-[#2A222B]/65 text-xs">
              Nenhum item semiológico encontrado para a busca &quot;{searchTerm}&quot;.
            </div>
          ) : (
            Object.entries(groups).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A222B]/65 px-1">
                  {category}
                </h4>
                <div className="space-y-1">
                  {items.map(({ item, originalIndex, hasAnswer }) => {
                    const isCurrent = currentIndex === originalIndex;

                    return (
                      <button
                        key={item.linkId}
                        type="button"
                        onClick={() => {
                          onSelectQuestion(originalIndex);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-all cursor-pointer ${
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
                                isCurrent ? 'text-white/65' : 'text-[#2A222B]/50'
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
