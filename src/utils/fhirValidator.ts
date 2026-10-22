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
import { hasAnswer, validateAnswer } from './answers';

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
        const hasValue = hasAnswer(parentAnswer);
        return clause.answerBoolean === false ? !hasValue : hasValue;
      }
      case '=': {
        if (!hasAnswer(parentAnswer)) return false;
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
        if (!hasAnswer(parentAnswer)) return false;
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
        return hasAnswer(parentAnswer) && Number(parentAnswer) > (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '<':
        return hasAnswer(parentAnswer) && Number(parentAnswer) < (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '>=':
        return hasAnswer(parentAnswer) && Number(parentAnswer) >= (clause.answerInteger ?? clause.answerDecimal ?? 0);
      case '<=':
        return hasAnswer(parentAnswer) && Number(parentAnswer) <= (clause.answerInteger ?? clause.answerDecimal ?? 0);
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
      if (!isItemEnabled(item, answers)) continue;
      if (item.type === 'group') {
        if (item.item) {
          traverse(item.item);
        }
      } else if (item.type !== 'display') {
        result.push(item);
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
    if (item.type === 'display') return null;
    if (item.type === 'group') {
      const children = (item.item || []).map(processItem).filter((child): child is QuestionnaireResponseItem => child !== null);
      return children.length ? { linkId: item.linkId, text: item.text, item: children } : null;
    }

    const value = answers[item.linkId];
    if (!hasAnswer(value) || validateAnswer(item, value)) {
      return null;
    }

    const responseAnswers: QuestionnaireResponseAnswer[] = [];

    if (item.type === 'boolean') {
      responseAnswers.push({ valueBoolean: Boolean(value) });
    } else if (item.type === 'integer') {
      responseAnswers.push({ valueInteger: Number(value) });
    } else if (item.type === 'decimal') {
      responseAnswers.push({ valueDecimal: Number(value) });
    } else if (item.type === 'date') {
      responseAnswers.push({ valueDate: String(value) });
    } else if (item.type === 'dateTime') {
      responseAnswers.push({ valueDateTime: String(value) });
    } else if (item.type === 'time') {
      responseAnswers.push({ valueTime: String(value) });
    } else if (item.type === 'choice' || item.type === 'open-choice') {
      for (const selected of Array.isArray(value) ? value.filter(hasAnswer) : [value]) {
        const opt = item.answerOption?.find(o => o.valueCoding?.code === selected || o.valueString === selected || o.valueInteger === selected);
        if (opt?.valueCoding) responseAnswers.push({ valueCoding: { ...opt.valueCoding } });
        else if (opt?.valueInteger !== undefined) responseAnswers.push({ valueInteger: opt.valueInteger });
        else if (opt?.valueString !== undefined || item.type === 'open-choice') responseAnswers.push({ valueString: String(selected) });
        else responseAnswers.push({ valueCoding: { code: String(selected), display: String(selected) } });
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
    ...(hasAnswer(answers['anamnese/identificacao/nome_completo']) ? { subject: { display: String(answers['anamnese/identificacao/nome_completo']) } } : {}),
    item: responseItems,
  };
}
