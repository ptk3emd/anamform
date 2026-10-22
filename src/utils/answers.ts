import type { QuestionnaireItem } from '../types/fhir';

export function hasAnswer(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.some(hasAnswer);
  return typeof value === 'boolean';
}

export function readSavedAnswers(key: string): Record<string, unknown> {
  const parsed = JSON.parse(localStorage.getItem(key) || '{}');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  return Object.fromEntries(Object.entries(parsed).filter(([, value]) => hasAnswer(value)));
}

export function validateAnswer(item: QuestionnaireItem, value: unknown): string | null {
  if (!hasAnswer(value)) return null; // Every question may be skipped.
  if (item.type === 'integer' || item.type === 'decimal') {
    const number = Number(value);
    if (!Number.isFinite(number) || (item.type === 'integer' && !Number.isInteger(number))) {
      return item.type === 'integer' ? 'Informe um número inteiro ou limpe a resposta para pular.' : 'Informe um número válido ou limpe a resposta para pular.';
    }
    if (item.minValue !== undefined && number < item.minValue) return `O valor mínimo é ${item.minValue}. Você também pode deixar em branco.`;
    if (item.maxValue !== undefined && number > item.maxValue) return `O valor máximo é ${item.maxValue}. Você também pode deixar em branco.`;
  }
  if (item.type === 'date') {
    const text = String(value);
    const date = new Date(`${text}T12:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) return 'Informe uma data válida ou deixe em branco.';
    if (item.linkId.endsWith('data_nascimento') && date > new Date(new Date().setHours(23, 59, 59, 999))) return 'A data de nascimento não pode estar no futuro.';
  }
  return null;
}
