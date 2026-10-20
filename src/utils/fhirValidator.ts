/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FHIR R4 Questionnaire Evaluator & QuestionnaireResponse Builder
 */

import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseAnswer,
} from '../types/fhir';

/**
 * Checks whether an item should be enabled based on its enableWhen clauses
 */
export function isItemEnabled(
  item: QuestionnaireItem,
  answers: Record<string, any>
): boolean {
  if (!item.enableWhen || item.enableWhen.length === 0) {
    return true;
  }

  const behavior = item.enableBehavior || 'all';

  const results = item.enableWhen.map((clause) => {
    const parentAnswer = answers[clause.question];

    switch (clause.operator) {
      case 'exists': {
        const hasValue = parentAnswer !== undefined && parentAnswer !== null && parentAnswer !== '';
        return clause.answerBoolean === false ? !hasValue : hasValue;
      }
      case '=': {
        if (clause.answerBoolean !== undefined) {
          return Boolean(parentAnswer) === clause.answerBoolean;
        }
        if (clause.answerString !== undefined) {
          return String(parentAnswer) === clause.answerString;
        }
        if (clause.answerInteger !== undefined) {
          return Number(parentAnswer) === clause.answerInteger;
        }
        if (clause.answerDecimal !== undefined) {
          return Number(parentAnswer) === clause.answerDecimal;
        }
        if (clause.answerCoding?.code !== undefined) {
          if (Array.isArray(parentAnswer)) {
            return parentAnswer.includes(clause.answerCoding.code);
          }
          return parentAnswer === clause.answerCoding.code;
        }
        return parentAnswer === clause.answerString;
      }
      case '!=': {
        if (clause.answerBoolean !== undefined) {
          return Boolean(parentAnswer) !== clause.answerBoolean;
        }
        if (clause.answerCoding?.code !== undefined) {
          if (Array.isArray(parentAnswer)) {
            return !parentAnswer.includes(clause.answerCoding.code);
          }
          return parentAnswer !== clause.answerCoding.code;
        }
        return parentAnswer !== clause.answerString;
      }
      case '>':
        return Number(parentAnswer) > (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '<':
        return Number(parentAnswer) < (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '>=':
        return Number(parentAnswer) >= (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '<=':
        return Number(parentAnswer) <= (clause.answerInteger ?? clause.answerDecimal ?? 0);
      default:
        return true;
    }
  });

  if (behavior === 'any') {
    return results.some(Boolean);
  }
  return results.every(Boolean);
}

/**
 * Returns a flattened list of currently active (enabled) questions for the Typeform stepper
 */
export function getActiveQuestions(
  questionnaire: Questionnaire,
  answers: Record<string, any>
): QuestionnaireItem[] {
  const result: QuestionnaireItem[] = [];

  function traverse(items: QuestionnaireItem[]) {
    for (const item of items) {
      if (item.type === 'group') {
        if (item.item) {
          traverse(item.item);
        }
      } else {
        if (isItemEnabled(item, answers)) {
          result.push(item);
        }
      }
    }
  }

  traverse(questionnaire.item);
  return result;
}

/**
 * Builds a compliant FHIR R4 QuestionnaireResponse resource from current answers
 */
export function buildQuestionnaireResponse(
  questionnaire: Questionnaire,
  answers: Record<string, any>,
  status: 'in-progress' | 'completed' = 'completed'
): QuestionnaireResponse {
  const responseItems: QuestionnaireResponseItem[] = [];

  function processItem(item: QuestionnaireItem): QuestionnaireResponseItem | null {
    if (!isItemEnabled(item, answers)) {
      return null;
    }

    const value = answers[item.linkId];
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const responseAnswers: QuestionnaireResponseAnswer[] = [];

    if (item.type === 'boolean') {
      responseAnswers.push({ valueBoolean: Boolean(value) });
    } else if (item.type === 'integer') {
      responseAnswers.push({ valueInteger: parseInt(value, 10) || 0 });
    } else if (item.type === 'decimal') {
      responseAnswers.push({ valueDecimal: parseFloat(value) || 0 });
    } else if (item.type === 'date' || item.type === 'dateTime') {
      responseAnswers.push({ valueDate: String(value) });
    } else if (item.type === 'choice') {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          const opt = item.answerOption?.find((o) => o.valueCoding?.code === v || o.valueString === v);
          responseAnswers.push({
            valueCoding: {
              code: String(v),
              display: opt?.valueCoding?.display || String(v),
              system: opt?.valueCoding?.system || 'http://snomed.info/sct',
            },
          });
        });
      } else {
        const opt = item.answerOption?.find((o) => o.valueCoding?.code === value || o.valueString === value);
        responseAnswers.push({
          valueCoding: {
            code: String(value),
            display: opt?.valueCoding?.display || String(value),
            system: opt?.valueCoding?.system || 'http://snomed.info/sct',
          },
        });
      }
    } else {
      // string, text, url
      responseAnswers.push({ valueString: String(value) });
    }

    return {
      linkId: item.linkId,
      text: item.text,
      answer: responseAnswers,
    };
  }

  for (const item of questionnaire.item) {
    const res = processItem(item);
    if (res) {
      responseItems.push(res);
    }
  }

  return {
    resourceType: 'QuestionnaireResponse',
    id: `qr-${questionnaire.id}-${Date.now()}`,
    questionnaire: questionnaire.url || `Questionnaire/${questionnaire.id}`,
    status,
    authored: new Date().toISOString(),
    subject: {
      reference: `Patient/${answers['anamnese/identificacao/nome_completo'] ? encodeURIComponent(answers['anamnese/identificacao/nome_completo']) : 'anonymous'}`,
      display: answers['anamnese/identificacao/nome_completo'] || 'Paciente Anônimo',
    },
    author: {
      reference: 'Practitioner/dra-clinica',
      display: 'AnamneseFlow Assistente Clínico',
    },
    item: responseItems,
  };
}
