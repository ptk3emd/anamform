/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Typeform Single Question View with Fluid Keyboard & Touch Interaction
 * Refined with quick clinical suggestion chips and EVA pain slider
 */

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Mic, MicOff, AlertCircle, ListChecks } from 'lucide-react';
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
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-advance must call the latest onNext (it validates against the freshest
  // answers) and must fire once, even on a double tap or after the card changes.
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceSoon = (ms: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      onNextRef.current();
    }, ms);
  };
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [item.linkId]);

  // Auto-focus input on mount or question change, only where a pointer is fine
  // (desktop). On touch screens, focusing opens the keyboard without a tap.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
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
      setSpeechNotice('Reconhecimento de voz não suportado neste navegador. Digite sua resposta manualmente.');
      setTimeout(() => setSpeechNotice(null), 4000);
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
        setSpeechNotice('Ouvindo... Fale sua resposta para a anamnese.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentVal = value ? `${value} ${transcript}` : transcript;
        onChange(currentVal);
        setIsRecording(false);
        setSpeechNotice(null);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setSpeechNotice('Não foi possível capturar o áudio. Tente novamente ou digite.');
        setTimeout(() => setSpeechNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setTimeout(() => setSpeechNotice(null), 1500);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
      setSpeechNotice('Erro ao iniciar microfone. Digite manualmente.');
      setTimeout(() => setSpeechNotice(null), 4000);
    }
  };

  // Keyboard shortcut listener for choices (A, B, C...) and boolean (S, N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Dialogs (índice, limpar respostas) own the keyboard while open
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[role="dialog"],[role="alertdialog"],[aria-modal="true"]')) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;

      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        // Holding Enter must not race through the questionnaire
        if (e.key === 'Enter' && !e.shiftKey && !e.repeat) {
          e.preventDefault();
          onNextRef.current();
        }
        return;
      }

      // Enter outside inputs is handled once, by the global navigation in App
      if (e.key === 'Enter') return;

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
            advanceSoon(250);
          }
        } else if (key === 'N' || key === '0') {
          e.preventDefault();
          onChange(false);
          if (theme.autoAdvanceOnSingleChoice) {
            advanceSoon(250);
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
        advanceSoon(260);
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

  // Quick clinical suggestion chips generator
  const getQuickChips = (): string[] => {
    if (item.linkId.includes('pressao_arterial')) {
      return ['120/80', '130/85', '140/90', '150/95', '160/100', '90/60'];
    }
    if (item.linkId.includes('fc_pulso') || item.linkId.includes('frequencia_cardiaca')) {
      return ['64', '72', '80', '88', '102', '120'];
    }
    if (item.linkId.includes('temperatura')) {
      return ['36.2', '36.6', '37.0', '37.5', '38.2', '39.0'];
    }
    if (item.linkId.includes('spo2') || item.linkId.includes('saturacao_o2')) {
      return ['99', '98', '97', '95', '92', '88'];
    }
    if (item.linkId.includes('fr_ritmo') || item.linkId.includes('frequencia_respiratoria')) {
      return ['16', '18', '20', '24', '28'];
    }
    if (item.linkId.includes('queixa_principal')) {
      return [
        'Dor no peito com aperto forte e falta de ar',
        'Falta de ar súbita aos esforços',
        'Febre persistente, tosse e prostração',
        'Cefaleia holocraniana intensa e náuseas',
        'Dor abdominal difusa em cólica e vômitos',
      ];
    }
    if (item.linkId.includes('achados_relevantes')) {
      return [
        'BEG, corado, hidratado. ACV: RCR 2T, BNF sem sopros. AR: MV universalmente audível sem RA. Abdome: indolor, RHA presentes.',
        'REG, taquipneico, sudoreico. ACV: taquicárdico sem sopros. AR: estertores crepitantes em bases. Abdome flácido.',
      ];
    }
    return [];
  };

  const quickChips = getQuickChips();
  const isEvaScale = item.linkId.includes('dor_intensidade') || (item.unit === '/ 10' && item.type === 'integer');

  return (
    <div className={`w-full max-w-[760px] flex flex-col ${alignmentClass} px-4 py-6 md:py-8 min-w-0`}>
      {/* Category Kicker */}
      {item.category && (
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-[#2A222B]/65">
          <span>{item.category}</span>
          {item.required && (
            <span className="text-amber-800 font-medium">· obrigatório</span>
          )}
        </div>
      )}

      {/* Question Header & Title */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:gap-3 mb-3 w-full min-w-0">
        <span
          className="shrink-0 text-sm md:text-base font-mono-code font-semibold px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: theme.brandColor }}
        >
          {item.prefix ? item.prefix : questionIndex + 1}<span aria-hidden="true"> &rarr;</span>
        </span>
        <h2
          className={`font-normal text-[#2A222B] tracking-tight min-w-0 flex-1 [text-wrap:pretty] [overflow-wrap:anywhere] ${titleSizeClass} ${fontFamilyClass}`}
        >
          {item.text}
        </h2>
      </div>

      {/* Help text / Description */}
      {item.helpText && (
        <p className="text-sm md:text-base text-[#2A222B]/70 mb-4 font-normal max-w-xl [overflow-wrap:anywhere]">
          {item.helpText}
        </p>
      )}

      {/* Input Renderer according to FHIR item.type */}
      <div className="w-full my-3">
        {/* SPECIAL: EVA PAIN SCALE (0 - 10) */}
        {isEvaScale && (
          <div className="w-full max-w-lg space-y-4 p-4 rounded-2xl bg-white border border-[#2A222B]/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2A222B]/65">
              <span>0 (Sem dor)</span>
              <span className="text-sm font-bold font-mono-code text-[#2A222B] bg-[#2A222B]/10 px-2 py-0.5 rounded">
                EVA: {value !== undefined ? `${value} / 10` : 'Selecione'}
              </span>
              <span className="text-rose-600">10 (Pior dor imaginável)</span>
            </div>

            <div className="grid grid-cols-11 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                const isSelected = Number(value) === score;
                const isHigh = score >= 7;
                const isMed = score >= 4 && score < 7;
                return (
                  <button
                    key={score}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Dor ${score} de 10`}
                    onClick={() => {
                      onChange(score);
                      if (theme.autoAdvanceOnSingleChoice) advanceSoon(250);
                    }}
                    className={`min-h-11 py-3 rounded-lg font-mono-code text-sm font-semibold transition-[transform,background-color,box-shadow] duration-200 cursor-pointer ${
                      isSelected
                        ? isHigh
                          ? 'bg-rose-600 text-white shadow-md scale-105'
                          : isMed
                          ? 'bg-amber-500 text-white shadow-md scale-105'
                          : 'bg-[#2A222B] text-white shadow-md scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#2A222B]'
                    }`}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STRING / TEXT */}
        {!isEvaScale && (item.type === 'string' || item.type === 'text') && (
          <div className="relative w-full">
            {item.type === 'text' ? (
              <textarea
                ref={inputRef as any}
                rows={4}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={item.placeholder || 'Digite sua resposta aqui...'}
                maxLength={5000}
                aria-invalid={!!error}
                aria-describedby={error ? `${item.linkId}-error` : undefined}
                aria-label={item.text}
                className="w-full text-base md:text-xl p-3 pr-14 bg-transparent border-b-2 border-[#2A222B]/20 text-[#2A222B] placeholder:text-[#2A222B]/35 focus:border-[#2A222B] focus:outline-none transition-colors resize-none rounded-t-lg bg-[#2A222B]/[0.02]"
              />
            ) : (
              <input
                ref={inputRef as any}
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={item.placeholder || 'Digite sua resposta aqui...'}
                maxLength={300}
                autoComplete="off"
                enterKeyHint="next"
                aria-invalid={!!error}
                aria-describedby={error ? `${item.linkId}-error` : undefined}
                aria-label={item.text}
                className="w-full text-lg md:text-2xl py-3 pl-1 pr-14 bg-transparent border-b-2 border-[#2A222B]/25 text-[#2A222B] placeholder:text-[#2A222B]/35 focus:border-[#2A222B] focus:outline-none transition-colors"
              />
            )}

            {/* Mic speech-to-text button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title="Ditar por voz"
              aria-label={isRecording ? 'Parar ditado por voz' : 'Ditar por voz'}
              aria-pressed={isRecording}
              className={`absolute right-1 bottom-1 size-11 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-white text-[#2A222B]/60 border-[#2A222B]/15 hover:text-[#2A222B] shadow-2xs'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            {speechNotice && (
              <div role="status" className="text-xs text-[#2A222B]/80 mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#198754] animate-pulse" />
                <span>{speechNotice}</span>
              </div>
            )}
          </div>
        )}

        {/* INTEGER / DECIMAL (non-EVA) */}
        {!isEvaScale && (item.type === 'integer' || item.type === 'decimal') && (
          <div className="flex items-center gap-3 w-full max-w-md">
            <input
              ref={inputRef as any}
              type="number"
              inputMode={item.type === 'decimal' ? 'decimal' : 'numeric'}
              enterKeyHint="next"
              aria-invalid={!!error}
              aria-describedby={error ? `${item.linkId}-error` : undefined}
              aria-label={item.text}
              step={item.type === 'decimal' ? '0.1' : '1'}
              value={value !== undefined ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="w-48 text-2xl md:text-4xl py-2 px-1 bg-transparent border-b-2 border-[#2A222B]/25 text-[#2A222B] placeholder:text-[#2A222B]/30 focus:border-[#2A222B] focus:outline-none transition-colors font-mono-code"
            />
            {item.unit && (
              <span className="text-base md:text-xl text-[#2A222B]/60 font-medium">
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
              aria-label={item.text}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="text-lg md:text-2xl py-2.5 px-3 rounded-lg border-2 border-[#2A222B]/20 bg-white text-[#2A222B] focus:border-[#2A222B] focus:outline-none transition-colors font-sans cursor-pointer shadow-xs"
            />
          </div>
        )}

        {/* BOOLEAN */}
        {item.type === 'boolean' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            <button
              type="button"
              aria-pressed={value === true}
              onClick={() => {
                onChange(true);
                if (theme.autoAdvanceOnSingleChoice) advanceSoon(250);
              }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-[background-color,border-color,color,box-shadow] duration-200 font-medium text-base md:text-lg text-left cursor-pointer active:scale-[0.99] ${
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
              aria-pressed={value === false}
              onClick={() => {
                onChange(false);
                if (theme.autoAdvanceOnSingleChoice) advanceSoon(250);
              }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-[background-color,border-color,color,box-shadow] duration-200 font-medium text-base md:text-lg text-left cursor-pointer active:scale-[0.99] ${
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
              <p className="text-xs text-[#2A222B]/60 mb-1">
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
                  aria-pressed={isSelected}
                  onClick={() => handleChoiceSelect(optVal)}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl border-2 transition-[background-color,border-color,color,box-shadow] duration-200 text-left group cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'border-[#2A222B] bg-[#2A222B] text-white shadow-sm'
                      : 'border-[#2A222B]/15 bg-white text-[#2A222B] hover:border-[#2A222B]/40 hover:bg-[#2A222B]/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                    <span className="text-sm md:text-base font-medium [overflow-wrap:anywhere]">{optLabel}</span>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}

        {/* QUICK CLINICAL CHIPS BAR */}
        {quickChips.length > 0 && (
          <div className="mt-4 pt-2 border-t border-[#2A222B]/10">
            <div className="flex items-center gap-1.5 text-xs text-[#2A222B]/60 mb-2">
              <ListChecks className="w-3.5 h-3.5 text-[#2A222B]/65" aria-hidden="true" />
              <span>Valores frequentes (toque rápido para preencher):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    onChange(chip);
                    if (theme.autoAdvanceOnSingleChoice && !item.multiselect) {
                      advanceSoon(250);
                    }
                  }}
                  className="min-h-9 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono-code text-[#2A222B] transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
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
            role="alert"
            id={`${item.linkId}-error`}
            className="flex items-start gap-2 text-rose-700 text-sm font-medium mt-2 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 max-w-xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typeform Action Button ("OK" / Next) */}
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium text-base min-h-11 shadow-sm transition-[transform,opacity] duration-150 active:scale-95 hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: theme.brandColor }}
        >
          <span>OK</span>
          <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
        </button>
        <span className="text-xs text-[#2A222B]/65 font-medium hidden sm:inline">
          pressione <strong className="font-semibold text-[#2A222B]/70">Enter ↵</strong>
        </span>
      </div>
    </div>
  );
};
