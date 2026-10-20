/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Theme Customizer based on Typeform Design System & UI Kit
 */

import React, { useState } from 'react';
import { X, Check, AlignLeft, AlignCenter } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface ThemeSettingsProps {
  theme: ThemeConfig;
  onChange: (updated: ThemeConfig) => void;
  onClose: () => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  theme,
  onChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'font' | 'buttons' | 'background'>('font');
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);

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
    { label: 'Cinza Hospitalar Suave (#F8FAFC)', value: '#F8FAFC' },
    { label: 'Escuro Minimalista (#18181B)', value: '#18181B' },
  ];

  const handleSave = () => {
    onChange(localTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#2A222B]/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A222B]/10">
          <div className="flex items-center gap-2 text-sm text-[#2A222B]/70">
            <span>Design</span>
            <span>&gt;</span>
            <span className="font-medium text-[#2A222B]">Tema de Anamnese</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#2A222B]/65 hover:text-[#2A222B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-[#2A222B]/10 text-sm font-medium">
          <button
            onClick={() => setActiveTab('font')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'font'
                ? 'border-[#2A222B] text-[#2A222B]'
                : 'border-transparent text-[#2A222B]/60 hover:text-[#2A222B]'
            }`}
          >
            Tipografia & Cores
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'buttons'
                ? 'border-[#2A222B] text-[#2A222B]'
                : 'border-transparent text-[#2A222B]/60 hover:text-[#2A222B]'
            }`}
          >
            Interação & Botões
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'background'
                ? 'border-[#2A222B] text-[#2A222B]'
                : 'border-transparent text-[#2A222B]/60 hover:text-[#2A222B]'
            }`}
          >
            Fundo & Canvas
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'font' && (
            <>
              {/* Font Family */}
              <div>
                <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider mb-2">
                  Família Tipográfica
                </label>
                <select
                  value={localTheme.fontFamily}
                  onChange={(e) =>
                    setLocalTheme({
                      ...localTheme,
                      fontFamily: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-[#2A222B]/20 bg-white text-[#2A222B] focus:border-[#2A222B] focus:outline-none"
                >
                  <option value="serif">Tobias / Lora / Georgia (Design.md Serifada Médica)</option>
                  <option value="sans">Geist / Plus Jakarta / Inter (Sans-Serif Moderna)</option>
                  <option value="system">Fonte Nativa do Sistema</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider mb-2">
                  Cor de Títulos e Destaque
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setLocalTheme({ ...localTheme, brandColor: c.value })}
                      className={`h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                        localTheme.brandColor === c.value
                          ? 'border-[#2A222B] scale-105 shadow-xs'
                          : 'border-transparent hover:scale-102'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {localTheme.brandColor === c.value && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size and Positioning Box - Highlighted like in screenshot */}
              <div className="p-4 rounded-xl border-2 border-amber-400/80 bg-amber-50/20 space-y-4">
                <span className="text-xs font-semibold text-[#2A222B] uppercase tracking-wide">
                  Tamanho e Posicionamento
                </span>

                {/* Welcome screen and endings */}
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
                          onClick={() => setLocalTheme({ ...localTheme, welcomeSize: s })}
                          className={`px-3 py-1 rounded text-xs capitalize font-medium transition-all ${
                            localTheme.welcomeSize === s
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

                {/* Questions */}
                <div>
                  <div className="text-xs text-[#2A222B]/70 mb-1.5 font-medium">
                    Tamanho das Perguntas
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex bg-[#2A222B]/5 p-0.5 rounded-md">
                      {(['sm', 'md', 'lg'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setLocalTheme({ ...localTheme, questionSize: s })}
                          className={`px-3 py-1 rounded text-xs capitalize font-medium transition-all ${
                            localTheme.questionSize === s
                              ? 'bg-white shadow-xs text-[#2A222B]'
                              : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Alignment */}
                    <div className="flex bg-[#2A222B]/5 p-0.5 rounded-md">
                      <button
                        type="button"
                        onClick={() => setLocalTheme({ ...localTheme, alignment: 'left' })}
                        className={`p-1.5 rounded transition-all ${
                          localTheme.alignment === 'left'
                            ? 'bg-white shadow-xs text-[#2A222B]'
                            : 'text-[#2A222B]/60 hover:text-[#2A222B]'
                        }`}
                        title="Alinhar à esquerda"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalTheme({ ...localTheme, alignment: 'center' })}
                        className={`p-1.5 rounded transition-all ${
                          localTheme.alignment === 'center'
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
            </>
          )}

          {activeTab === 'buttons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#2A222B]/10">
                <div>
                  <div className="font-medium text-[#2A222B]">Auto-avanço ao escolher opção</div>
                  <div className="text-xs text-[#2A222B]/60">
                    Avança automaticamente para a próxima pergunta após selecionar uma opção única (comportamento nativo Typeform)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localTheme.autoAdvanceOnSingleChoice}
                  onChange={(e) =>
                    setLocalTheme({
                      ...localTheme,
                      autoAdvanceOnSingleChoice: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#2A222B] rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#2A222B]/10">
                <div>
                  <div className="font-medium text-[#2A222B]">Efeitos sonoros sutis</div>
                  <div className="text-xs text-[#2A222B]/60">
                    Som discreto de transição ao avançar perguntas
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localTheme.soundEffects}
                  onChange={(e) =>
                    setLocalTheme({
                      ...localTheme,
                      soundEffects: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#2A222B] rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#2A222B]/70 uppercase tracking-wider">
                Cor de Fundo da Aplicação
              </label>
              <div className="space-y-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.value}
                    type="button"
                    onClick={() => setLocalTheme({ ...localTheme, bgColor: bg.value })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                      localTheme.bgColor === bg.value
                        ? 'border-[#2A222B] ring-1 ring-[#2A222B]'
                        : 'border-[#2A222B]/10 hover:border-[#2A222B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-md border border-black/20"
                        style={{ backgroundColor: bg.value }}
                      />
                      <span className="font-medium text-[#2A222B]">{bg.label}</span>
                    </div>
                    {localTheme.bgColor === bg.value && <Check className="w-4 h-4 text-[#2A222B]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A222B]/10 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#2A222B]/70 hover:text-[#2A222B] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-[#2A222B] hover:bg-[#3d333e] rounded-lg transition-colors shadow-xs"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
};
