/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Single Question View with Fluid Keyboard & Touch Interaction
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Mic, MicOff, AlertCircle } from 'lucide-react';
import { QuestionnaireItem } from '../types/fhir';
import { ThemeConfig } from '../types/theme';

interface TypeformQuestionCardProps {
  item: QuestionnaireItem;
  questionIndex: number;
  totalQuestions: number;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  error?: string | null;
  theme: ThemeConfig;
}

const HOTKEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const TypeformQuestionCard: React.FC<TypeformQuestionCardProps> = ({
  item,
  questionIndex,
  value,
  onChange,
  onNext,
  error,
  theme,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-focus input on mount or question change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [item.linkId]);

  // Speech Recognition support for medical dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz direto. Digite o texto manualmente.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentVal = value ? `${value} ${transcript}` : transcript;
        onChange(currentVal);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Keyboard shortcut listener for choices (A, B, C...) and boolean (S, N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger choice hotkeys if typing in a text/number input
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onNext();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        onNext();
        return;
      }

      if (item.type === 'choice' && item.answerOption) {
        const pressedKey = e.key.toUpperCase();
        const index = HOTKEYS.indexOf(pressedKey);
        if (index !== -1 && index < item.answerOption.length) {
          e.preventDefault();
          const option = item.answerOption[index];
          const optValue = option.valueCoding?.code || option.valueString || '';
          handleChoiceSelect(optValue);
        }
      }

      if (item.type === 'boolean') {
        const key = e.key.toUpperCase();
        if (key === 'S' || key === 'Y' || key === '1') {
          e.preventDefault();
          onChange(true);
          if (theme.autoAdvanceOnSingleChoice) {
            setTimeout(onNext, 250);
          }
        } else if (key === 'N' || key === '0') {
          e.preventDefault();
          onChange(false);
          if (theme.autoAdvanceOnSingleChoice) {
            setTimeout(onNext, 250);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, value, theme.autoAdvanceOnSingleChoice]);

  const handleChoiceSelect = (optValue: string) => {
    if (item.multiselect) {
      const currentList: string[] = Array.isArray(value) ? [...value] : [];
      const exists = currentList.includes(optValue);
      const updated = exists
        ? currentList.filter((v) => v !== optValue)
        : [...currentList, optValue];
      onChange(updated);
    } else {
      onChange(optValue);
      if (theme.autoAdvanceOnSingleChoice) {
        setTimeout(onNext, 260);
      }
    }
  };

  // Size styling mapping
  const titleSizeClass =
    theme.questionSize === 'sm'
      ? 'text-xl md:text-2xl leading-snug'
      : theme.questionSize === 'lg'
      ? 'text-3xl md:text-4xl leading-tight'
      : 'text-2xl md:text-3xl leading-snug';

  const alignmentClass =
    theme.alignment === 'center'
      ? 'text-center items-center mx-auto'
      : 'text-left items-start';

  const fontFamilyClass =
    theme.fontFamily === 'serif'
      ? 'font-display'
      : theme.fontFamily === 'sans'
      ? 'font-sans'
      : 'font-normal';

  return (
    <div className={`w-full max-w-[760px] flex flex-col ${alignmentClass} px-4 py-8`}>
      {/* Category Kicker */}
      {item.category && (
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wider uppercase text-[#2A222B]/60">
          <span>{item.category}</span>
          {item.required && (
            <span className="text-amber-600 font-medium lowercase">· obrigatório</span>
          )}
        </div>
      )}

      {/* Question Header & Title */}
      <div className="flex items-baseline gap-3 mb-3 w-full">
        <span
          className="shrink-0 text-sm md:text-base font-mono-code font-semibold px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: theme.brandColor }}
        >
          {questionIndex + 1} &rarr;
        </span>
        <h2
          className={`font-normal text-[#2A222B] tracking-tight w-full ${titleSizeClass} ${fontFamilyClass}`}
        >
          {item.text}
        </h2>
      </div>

      {/* Help text / Description */}
      {item.helpText && (
        <p className="text-sm md:text-base text-[#2A222B]/70 mb-6 font-normal max-w-xl">
          {item.helpText}
        </p>
      )}

      {/* Input Renderer according to FHIR item.type */}
      <div className="w-full my-4">
        {/* STRING / TEXT */}
        {(item.type === 'string' || item.type === 'text') && (
          <div className="relative w-full">
            {item.type === 'text' ? (
              <textarea
                ref={inputRef as any}
                rows={4}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={item.placeholder || 'Digite sua resposta aqui...'}
                className="w-full text-lg md:text-xl p-3 bg-transparent border-b-2 border-[#2A222B]/20 text-[#2A222B] placeholder:text-[#2A222B]/35 focus:border-[#006BFF] focus:outline-none transition-colors resize-none rounded-t-lg bg-[#2A222B]/[0.02]"
              />
            ) : (
              <input
                ref={inputRef as any}
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={item.placeholder || 'Digite sua resposta aqui...'}
                className="w-full text-xl md:text-2xl py-3 px-1 bg-transparent border-b-2 border-[#2A222B]/25 text-[#2A222B] placeholder:text-[#2A222B]/35 focus:border-[#006BFF] focus:outline-none transition-colors"
              />
            )}

            {/* Mic speech-to-text button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title="Ditar por voz"
              className={`absolute right-2 bottom-3 p-2 rounded-full border transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-white text-[#2A222B]/60 border-[#2A222B]/15 hover:text-[#2A222B]'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* INTEGER / DECIMAL */}
        {(item.type === 'integer' || item.type === 'decimal') && (
          <div className="flex items-center gap-3 w-full max-w-md">
            <input
              ref={inputRef as any}
              type="number"
              step={item.type === 'decimal' ? '0.1' : '1'}
              value={value !== undefined ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="w-48 text-3xl md:text-4xl py-2 px-1 bg-transparent border-b-2 border-[#2A222B]/25 text-[#2A222B] placeholder:text-[#2A222B]/30 focus:border-[#006BFF] focus:outline-none transition-colors font-mono-code"
            />
            {item.unit && (
              <span className="text-lg md:text-xl text-[#2A222B]/60 font-medium">
                {item.unit}
              </span>
            )}
          </div>
        )}

        {/* DATE */}
        {item.type === 'date' && (
          <div className="w-full max-w-md">
            <input
              ref={inputRef as any}
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="text-xl md:text-2xl py-3 px-3 rounded-lg border-2 border-[#2A222B]/20 bg-white text-[#2A222B] focus:border-[#006BFF] focus:outline-none transition-colors font-sans cursor-pointer shadow-xs"
            />
          </div>
        )}

        {/* BOOLEAN */}
        {item.type === 'boolean' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={() => {
                onChange(true);
                if (theme.autoAdvanceOnSingleChoice) setTimeout(onNext, 250);
              }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all font-medium text-lg text-left ${
                value === true
                  ? 'border-[#2A222B] bg-[#2A222B] text-white shadow-md'
                  : 'border-[#2A222B]/15 bg-white text-[#2A222B] hover:border-[#2A222B]/40 hover:bg-[#2A222B]/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono-code border ${
                    value === true
                      ? 'border-white/40 bg-white/20 text-white'
                      : 'border-[#2A222B]/20 bg-[#2A222B]/5 text-[#2A222B]/70'
                  }`}
                >
                  S
                </span>
                <span>Sim</span>
              </div>
              {value === true && <Check className="w-5 h-5 text-white" />}
            </button>

            <button
              type="button"
              onClick={() => {
                onChange(false);
                if (theme.autoAdvanceOnSingleChoice) setTimeout(onNext, 250);
              }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all font-medium text-lg text-left ${
                value === false
                  ? 'border-[#2A222B] bg-[#2A222B] text-white shadow-md'
                  : 'border-[#2A222B]/15 bg-white text-[#2A222B] hover:border-[#2A222B]/40 hover:bg-[#2A222B]/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono-code border ${
                    value === false
                      ? 'border-white/40 bg-white/20 text-white'
                      : 'border-[#2A222B]/20 bg-[#2A222B]/5 text-[#2A222B]/70'
                  }`}
                >
                  N
                </span>
                <span>Não</span>
              </div>
              {value === false && <Check className="w-5 h-5 text-white" />}
            </button>
          </div>
        )}

        {/* CHOICE / MULTISELECT */}
        {item.type === 'choice' && item.answerOption && (
          <div className="space-y-2.5 w-full">
            {item.multiselect && (
              <p className="text-xs text-[#2A222B]/60 mb-2">
                Selecione todas as opções aplicáveis (múltipla escolha)
              </p>
            )}

            {item.answerOption.map((opt, idx) => {
              const optVal = opt.valueCoding?.code || opt.valueString || '';
              const optLabel = opt.valueCoding?.display || opt.valueString || '';
              const isSelected = item.multiselect
                ? Array.isArray(value) && value.includes(optVal)
                : value === optVal;
              const hotkey = HOTKEYS[idx] || '';

              return (
                <button
                  key={optVal}
                  type="button"
                  onClick={() => handleChoiceSelect(optVal)}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl border-2 transition-all text-left group ${
                    isSelected
                      ? 'border-[#2A222B] bg-[#2A222B] text-white shadow-sm'
                      : 'border-[#2A222B]/15 bg-white text-[#2A222B] hover:border-[#2A222B]/40 hover:bg-[#2A222B]/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {hotkey && (
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono-code border font-semibold ${
                          isSelected
                            ? 'border-white/30 bg-white/20 text-white'
                            : 'border-[#2A222B]/20 bg-[#2A222B]/5 text-[#2A222B]/70 group-hover:bg-[#2A222B]/10'
                        }`}
                      >
                        {hotkey}
                      </span>
                    )}
                    <span className="text-base md:text-lg font-medium">{optLabel}</span>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation Error Feedback */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 text-rose-600 text-sm font-medium mt-2 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typeform Action Button ("OK" / Next) */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium text-base shadow-sm transition-transform active:scale-95 hover:opacity-95"
          style={{ backgroundColor: theme.brandColor }}
        >
          <span>OK</span>
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
        <span className="text-xs text-[#2A222B]/50 font-medium hidden sm:inline">
          pressione <strong className="font-semibold text-[#2A222B]/70">Enter ↵</strong>
        </span>
      </div>
    </div>
  );
};
