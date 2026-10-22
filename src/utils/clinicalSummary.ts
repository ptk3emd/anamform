import type { Questionnaire, QuestionnaireItem } from '../types/fhir';
import { HOSPITAL_ADMISSION_QUESTIONNAIRE } from '../data/questionnaires';
import { getActiveQuestions } from './fhirValidator';
import { hasAnswer } from './answers';

export interface ClinicalEntry {
  id: string;
  label: string;
  value: string;
  answered: boolean;
  parentId?: string;
  parentLabel?: string;
}

export interface ClinicalSection {
  id: string;
  title: string;
  entries: ClinicalEntry[];
  answered: number;
}

export function cleanLabel(text: string): string {
  return text.replace(/^\d+\)\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/:$/, '').trim();
}

export function formatAnswer(item: QuestionnaireItem, value: unknown): string {
  if (!hasAnswer(value)) return 'Não informado';
  if (Array.isArray(value)) return value.filter(hasAnswer).map(v => formatAnswer(item, v)).join('; ');
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  const option = item.answerOption?.find(o => o.valueCoding?.code === value || o.valueString === value || o.valueInteger === value);
  if (option) return option.valueCoding?.display || option.valueString || String(option.valueInteger);
  if (item.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value).split('-').reverse().join('/');
  const result = String(value).trim();
  if (item.unit && (item.type === 'decimal' || item.type === 'integer')) return `${result.replace('.', ',')} ${item.unit}`;
  return result;
}

export function buildClinicalSections(answers: Record<string, unknown>, questionnaire: Questionnaire = HOSPITAL_ADMISSION_QUESTIONNAIRE): ClinicalSection[] {
  const sections = new Map<string, ClinicalSection>();
  for (const item of getActiveQuestions(questionnaire, answers)) {
    const category = item.category || 'Informações clínicas';
    if (!sections.has(category)) sections.set(category, {
      id: `clinical-section-${sections.size + 1}`,
      title: category.replace(/^\d+\.\s*/, ''), entries: [], answered: 0,
    });
    const section = sections.get(category)!;
    const answered = hasAnswer(answers[item.linkId]);
    section.entries.push({ id: item.linkId, label: cleanLabel(item.text), value: formatAnswer(item, answers[item.linkId]),
      answered, parentId: item.parentLinkId, parentLabel: item.parentText ? cleanLabel(item.parentText) : undefined });
    if (answered) section.answered++;
  }
  return [...sections.values()];
}

export function generateClinicalSummary(
  answers: Record<string, unknown>,
  questionnaire: Questionnaire = HOSPITAL_ADMISSION_QUESTIONNAIRE,
  options: { includeEmpty?: boolean; generatedAt?: Date } = {},
): string {
  const sections = buildClinicalSections(answers, questionnaire);
  const answered = sections.reduce((total, section) => total + section.answered, 0);
  const lines = ['PRONTUÁRIO CLÍNICO', questionnaire.title,
    `Gerado em: ${(options.generatedAt || new Date()).toLocaleString('pt-BR')}`,
    `${answered} itens registrados. Campos não preenchidos não representam achados negativos ou normais.`, ''];
  if (!answered && !options.includeEmpty) lines.push('Nenhuma informação clínica registrada.');
  for (const section of sections) {
    const entries = section.entries.filter(entry => options.includeEmpty || entry.answered);
    if (!entries.length) continue;
    lines.push(section.title.toLocaleUpperCase('pt-BR'), '');
    for (const entry of entries) lines.push(`${entry.parentId ? '  ' : ''}${entry.label}: ${entry.value}`);
    lines.push('');
  }
  lines.push('Documento gerado a partir das respostas registradas. Revisar antes de incorporar ao prontuário.');
  return lines.join('\n');
}
