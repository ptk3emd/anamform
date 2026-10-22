import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HOSPITAL_ADMISSION_QUESTIONNAIRE as questionnaire } from '../src/data/questionnaires';
import { DEFAULT_THEME } from '../src/types/theme';
import { TypeformQuestionCard } from '../src/components/TypeformQuestionCard';

let Summary: React.ComponentType<any>;
before(async () => {
  // Node renders the real component; CSS stays in the production build.
  const outdir = path.resolve('node_modules/.cache/anamform-tests');
  await mkdir(outdir, { recursive: true });
  const outfile = path.join(outdir, 'clinical-summary.cjs');
  await build({ entryPoints: ['src/components/ClinicalSummaryView.tsx'], bundle: true, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' }, outfile, logLevel: 'silent' });
  Summary = createRequire(import.meta.url)(outfile).ClinicalSummaryView;
});

const renderSummary = (answers: Record<string, unknown>) => renderToStaticMarkup(React.createElement(Summary, { answers, questionnaire, onBackToForm() {}, onEditItem() {} }));

test('estado vazio oferece coleta sem achados normais ou classificação de risco', () => {
  const html = renderSummary({});
  assert.match(html, /Seu registro começa na coleta/);
  assert.match(html, /Identificação não informada/);
  assert.doesNotMatch(html, /EMERGÊNCIA|URGENTE|Nega alergias|Masculino/);
});

test('documento usa estrutura semântica, CSS dedicado e escape de texto informado', () => {
  const html = renderSummary({ 'anamnese/identificacao/nome_completo': '<script>alert(1)</script>', 'anamnese/ros/audicao': 'Zumbido unilateral' });
  assert.match(html, /<article class="clinical-document/);
  assert.match(html, /class="clinical-section"/);
  assert.match(html, /class="clinical-entry[\s"]/);
  assert.match(html, /Zumbido unilateral/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
});

test('uma resposta de saturação não presume suporte de oxigênio nem urgência', () => {
  const html = renderSummary({ 'anamnese/exame_fisico/spo2': 94 });
  assert.match(html, /94 %/);
  assert.doesNotMatch(html, /em ar ambiente|URGENTE|Manchester/);
});

test('pergunta vazia oferece pular e concluir, sem inserir o exemplo na resposta', () => {
  const item = questionnaire.item.find(i => i.linkId.endsWith('/dor_tipo'))!;
  const html = renderToStaticMarkup(React.createElement(TypeformQuestionCard, { item, questionIndex: 0, totalQuestions: questionnaire.item.length, value: '', onChange() {}, onNext() {}, onPrev() {}, onFinish() {}, theme: DEFAULT_THEME }));
  assert.match(html, /Pular item/);
  assert.match(html, /Concluir coleta/);
  assert.match(html, /Como caracterizar este item/);
  assert.match(html, /<textarea[^>]*><\/textarea>/);
  assert.doesNotMatch(html, /obrigatório|\brequired=/);
});

test('escala de dor em branco não marca zero como resposta', () => {
  const item = questionnaire.item.find(i => i.linkId.endsWith('/dor_intensidade'))!;
  const props = { item, questionIndex: 0, totalQuestions: 252, onChange() {}, onNext() {}, onPrev() {}, onFinish() {}, theme: DEFAULT_THEME };
  const blank = renderToStaticMarkup(React.createElement(TypeformQuestionCard, { ...props, value: '' }));
  assert.doesNotMatch(blank, /aria-pressed="true"/);
  const zero = renderToStaticMarkup(React.createElement(TypeformQuestionCard, { ...props, value: 0 }));
  assert.match(zero, /aria-pressed="true" aria-label="Dor 0 de 10"/);
  assert.match(zero, /Limpar resposta/);
});
