/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * .anamform - Mobile-First Typeform Medical Anamnesis with FHIR R4 & openEHR Interoperability
 * Optional clinical questions with guided subitems and a structured record.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  HOSPITAL_ADMISSION_QUESTIONNAIRE,
  SAMPLE_PATIENT_CASE,
} from './data/questionnaires';
import { Questionnaire, QuestionnaireItem } from './types/fhir';
import { ThemeConfig, DEFAULT_THEME } from './types/theme';
import {
  getActiveQuestions,
  buildQuestionnaireResponse,
} from './utils/fhirValidator';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { TypeformQuestionCard } from './components/TypeformQuestionCard';
import { TypeformNavigation } from './components/TypeformNavigation';
import { SectionJumpModal } from './components/SectionJumpModal';
import { MobileBottomNav, AppViewMode } from './components/MobileBottomNav';
import { hasAnswer, readSavedAnswers, validateAnswer } from './utils/answers';
import { useDialogFocus } from './utils/useDialogFocus';

const ClinicalSummaryView = lazy(() => import('./components/ClinicalSummaryView').then(module => ({ default: module.ClinicalSummaryView })));
const SettingsTab = lazy(() => import('./components/SettingsTab').then(module => ({ default: module.SettingsTab })));

export default function App() {
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Questionnaire>(
    HOSPITAL_ADMISSION_QUESTIONNAIRE
  );
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      return readSavedAnswers(`anamnese_answers_${HOSPITAL_ADMISSION_QUESTIONNAIRE.id}`);
    } catch {
      return {};
    }
  });

  // -1 = Welcome Screen, 0..N-1 = Question Index, N = Completion Screen
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [activeView, setActiveView] = useState<AppViewMode>('form');

  // Theme settings
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('anamnese_theme');
      const parsed = saved ? JSON.parse(saved) : null;
      const restored = parsed && typeof parsed === 'object' ? { ...DEFAULT_THEME, ...parsed } : DEFAULT_THEME;
      return restored.bgColor === '#18181B' ? { ...restored, bgColor: DEFAULT_THEME.bgColor } : restored;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [isSectionJumpOpen, setIsSectionJumpOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const resetDialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isResetModalOpen, resetDialogRef, () => setIsResetModalOpen(false));
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [activeView, currentIndex]);

  // Sound effects generator via Web Audio API
  const playSubtleSound = useCallback(() => {
    if (!theme.soundEffects) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext muted
    }
  }, [theme.soundEffects]);

  // Save answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`anamnese_answers_${currentQuestionnaire.id}`, JSON.stringify(answers));
      setStorageError(false);
    } catch (e) {
      setStorageError(true);
      console.warn('LocalStorage save error', e);
    }
  }, [answers, currentQuestionnaire.id]);

  // Save theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('anamnese_theme', JSON.stringify(theme));
    } catch (e) {
      console.warn('Theme save error', e);
    }
  }, [theme]);

  // Calculate currently active questions based on enableWhen logic
  const activeQuestions: QuestionnaireItem[] = useMemo(() => {
    return getActiveQuestions(currentQuestionnaire, answers);
  }, [currentQuestionnaire, answers]);

  // Count answered items
  const answeredCount = useMemo(() => {
    return activeQuestions.filter(item => hasAnswer(answers[item.linkId])).length;
  }, [answers, activeQuestions]);

  // Build FHIR QuestionnaireResponse
  const questionnaireResponse = useMemo(() => {
    return buildQuestionnaireResponse(
      currentQuestionnaire,
      answers,
      currentIndex >= activeQuestions.length ? 'completed' : 'in-progress'
    );
  }, [currentQuestionnaire, answers, currentIndex, activeQuestions.length]);

  // Navigation handlers
  const handleAnswerChange = (linkId: string, val: any) => {
    setAnswers((prev) => ({
      ...prev,
      [linkId]: val,
    }));
    setValidationError(null);
  };

  const handleNext = () => {
    // If on Welcome Screen
    if (currentIndex === -1) {
      setCurrentIndex(0);
      playSubtleSound();
      return;
    }

    // Blank answers are always allowed; validate only values the user entered.
    if (currentIndex < activeQuestions.length) {
      const currentItem = activeQuestions[currentIndex];
      const error = validateAnswer(currentItem, answers[currentItem.linkId]);
      if (error) {
        setValidationError(error);
        return;
      }

      setValidationError(null);
      playSubtleSound();

      if (currentIndex + 1 < activeQuestions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Finished all questions -> go to completion
        setCurrentIndex(activeQuestions.length);
      }
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    playSubtleSound();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === 0) {
      setCurrentIndex(-1); // Back to welcome screen
    } else if (currentIndex >= activeQuestions.length) {
      setCurrentIndex(activeQuestions.length - 1);
    }
  };

  // Keyboard navigation for Arrows and Enter
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isSectionJumpOpen || isResetModalOpen || activeView !== 'form' || e.defaultPrevented || e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;

      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';
      if (activeTag === 'button' || activeTag === 'a' || activeTag === 'summary' || activeTag === 'select') return;

      // Arrow keys navigate only outside native controls.
      if (e.key === 'ArrowUp' && !isInput) {
        e.preventDefault();
        handlePrev();
      }

      // Enter or Down arrow to go forward
      if ((e.key === 'Enter' || e.key === 'ArrowDown') && !isInput) {
        e.preventDefault();
        if (currentIndex === -1) handleStart();
        else handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentIndex, isSectionJumpOpen, isResetModalOpen, activeView, activeQuestions, answers]);

  // Start at the first unanswered question when resuming a saved session
  const handleStart = () => {
    const firstPending = activeQuestions.findIndex((q) => {
      return !hasAnswer(answers[q.linkId]);
    });
    if (answeredCount === 0) setCurrentIndex(0);
    else setCurrentIndex(firstPending === -1 ? activeQuestions.length : firstPending);
    playSubtleSound();
  };

  // Escape dismisses the reset confirmation
  useEffect(() => {
    if (!isResetModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsResetModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isResetModalOpen]);

  const handleLoadSample = () => {
    setAnswers(SAMPLE_PATIENT_CASE);
    setCurrentQuestionnaire(HOSPITAL_ADMISSION_QUESTIONNAIRE);
    setCurrentIndex(0);
    setValidationError(null);
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setAnswers({});
    setCurrentIndex(-1);
    setValidationError(null);
    setIsResetModalOpen(false);
    try {
      localStorage.removeItem(`anamnese_answers_${currentQuestionnaire.id}`);
    } catch {}
  };

  const handleSelectQuestionnaire = (q: Questionnaire) => {
    setCurrentQuestionnaire(q);
    try {
      setAnswers(readSavedAnswers(`anamnese_answers_${q.id}`));
    } catch {
      setAnswers({});
    }
    setCurrentIndex(-1);
    setValidationError(null);
  };

  const progressPercent = activeQuestions.length > 0 ? Math.round((answeredCount / activeQuestions.length) * 100) : 0;
  const currentCategory = currentIndex >= 0 && currentIndex < activeQuestions.length ? activeQuestions[currentIndex].category : undefined;

  return (
    <div
      className="min-h-dvh flex flex-col transition-colors selection:bg-[#2A222B] selection:text-white"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Clean Minimal Top Header */}
      <Header
        currentQuestionnaire={currentQuestionnaire}
        currentCategory={currentCategory}
        progressPercent={Math.max(0, Math.min(100, progressPercent))}
      />
      {storageError && <p role="alert" className="no-print mx-auto max-w-3xl px-4 py-3 text-sm text-rose-800">Não foi possível salvar neste navegador. Suas respostas continuam nesta tela; copie ou baixe o prontuário antes de sair.</p>}

      {/* Main Content Area */}
      <main id="conteudo" className="flex-1 flex flex-col justify-center items-center relative overflow-x-hidden">
        <Suspense fallback={<p role="status" className="px-4 py-12 text-sm text-[#2A222B]/70">Carregando visualização…</p>}>
        {/* VIEW 1: TYPEFORM FORM COLLECTOR */}
        {activeView === 'form' && (
          <div className="w-full flex-1 flex flex-col justify-center items-center pb-36 md:pb-28">
            <AnimatePresence mode="wait">
              {/* WELCOME SCREEN */}
              {currentIndex === -1 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex justify-center"
                >
                  <WelcomeScreen
                    questionnaire={currentQuestionnaire}
                    onStart={handleStart}
                    onLoadSample={handleLoadSample}
                    theme={theme}
                    answeredCount={answeredCount}
                  />
                </motion.div>
              )}

              {/* ACTIVE QUESTION CARD */}
              {currentIndex >= 0 && currentIndex < activeQuestions.length && (
                <motion.div
                  key={activeQuestions[currentIndex].linkId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex justify-center"
                >
                  <TypeformQuestionCard
                    item={activeQuestions[currentIndex]}
                    questionIndex={currentIndex}
                    totalQuestions={activeQuestions.length}
                    value={answers[activeQuestions[currentIndex].linkId]}
                    onChange={(val) =>
                      handleAnswerChange(activeQuestions[currentIndex].linkId, val)
                    }
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onFinish={() => setCurrentIndex(activeQuestions.length)}
                    error={validationError}
                    theme={theme}
                  />
                </motion.div>
              )}

              {/* COMPLETION SCREEN */}
              {currentIndex >= activeQuestions.length && (
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex justify-center"
                >
                  <CompletionScreen
                    patientName={answers['anamnese/identificacao/nome_completo']}
                    totalAnswered={answeredCount}
                    onGoToSummary={() => setActiveView('summary')}
                    onGoToInterop={() => setActiveView('settings')}
                    onRestart={() => setCurrentIndex(-1)}
                    theme={theme}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Chevrons Bar */}
            {currentIndex >= 0 && (
              <TypeformNavigation
                currentIndex={currentIndex}
                totalQuestions={activeQuestions.length}
                onPrev={handlePrev}
                onNext={handleNext}
                theme={theme}
                answeredCount={answeredCount}
              />
            )}
          </div>
        )}

        {/* VIEW 2: CLINICAL SUMMARY (PEP) */}
        {activeView === 'summary' && (
          <div className="w-full flex-1 pb-24">
            <ClinicalSummaryView
              answers={answers}
              questionnaire={currentQuestionnaire}
              onBackToForm={() => setActiveView('form')}
              onEditItem={(linkId) => {
                const index = activeQuestions.findIndex(item => item.linkId === linkId);
                if (index >= 0) {
                  setCurrentIndex(index);
                  setValidationError(null);
                  setActiveView('form');
                }
              }}
              onLoadSample={handleLoadSample}
            />
          </div>
        )}

        {/* VIEW 3: SETTINGS & CONFIGURATION (Consolidated Hub) */}
        {activeView === 'settings' && (
          <div className="w-full flex-1">
            <SettingsTab
              currentQuestionnaire={currentQuestionnaire}
              onSelectQuestionnaire={handleSelectQuestionnaire}
              questionnaireResponse={questionnaireResponse}
              theme={theme}
              onUpdateTheme={(newTheme) => setTheme(newTheme)}
              onLoadSample={handleLoadSample}
              onReset={handleReset}
              onGoToForm={() => setActiveView('form')}
            />
          </div>
        )}
        </Suspense>
      </main>

      {/* MOBILE-FIRST BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenSectionIndex={() => setIsSectionJumpOpen(true)}
        answeredCount={answeredCount}
        totalQuestions={activeQuestions.length}
      />

      {/* MODAL: Section and subitem index */}
      {isSectionJumpOpen && (
        <SectionJumpModal
          questions={activeQuestions}
          currentIndex={currentIndex}
          answers={answers}
          onSelectQuestion={(idx) => {
            setCurrentIndex(idx);
            setActiveView('form');
          }}
          onClose={() => setIsSectionJumpOpen(false)}
        />
      )}

      {/* MODAL: Reset Confirmation Dialog */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div ref={resetDialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="reset-title" className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#2A222B]/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 id="reset-title" className="text-lg font-bold text-[#2A222B]">
                Limpar Respostas da Anamnese?
              </h3>
              <p className="text-sm text-[#2A222B]/70 mt-1 leading-relaxed">
                Esta ação apagará todos os dados clínicos digitados e reiniciará o formulário para uma nova admissão. Os dados salvos localmente serão limpos.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#2A222B]/15 text-sm font-medium text-[#2A222B] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
              >
                Sim, Limpar Anamnese
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
