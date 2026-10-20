/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * openEHR / EHRbase CISTEC FLAT Composition Converter
 * Translates FHIR QuestionnaireResponse linkIds into openEHR FLAT format
 * Archetype: openEHR-EHR-COMPOSITION.encounter.v1
 */

import { QuestionnaireResponse } from '../types/fhir';
import { EhrbaseCompositionPayload, OpenEHRFlatComposition } from '../types/openehr';

/**
 * Converts a FHIR QuestionnaireResponse into an openEHR FLAT Composition
 * using CISTEC Web Template path mappings.
 */
export function convertFhirToOpenEHRFlat(qr: QuestionnaireResponse): OpenEHRFlatComposition {
  const flat: OpenEHRFlatComposition = {};

  // Standard openEHR Encounter Context
  flat['anamnese_geral/context/start_time'] = qr.authored || new Date().toISOString();
  flat['anamnese_geral/context/setting|code'] = '238';
  flat['anamnese_geral/context/setting|value'] = 'hospital care';
  flat['anamnese_geral/context/setting|terminology'] = 'openehr';
  flat['anamnese_geral/composer|name'] = qr.author?.display || '.anamform Interop';

  if (!qr.item) {
    return flat;
  }

  for (const item of qr.item) {
    const rawAnswer = item.answer?.[0];
    if (!rawAnswer) continue;

    // Direct CISTEC Flat path translation based on linkId prefix
    const path = item.linkId.replace(/^anamnese\//, 'anamnese_geral/');

    if (rawAnswer.valueString !== undefined) {
      flat[`${path}:0/narrative`] = rawAnswer.valueString;
    } else if (rawAnswer.valueBoolean !== undefined) {
      flat[`${path}:0/value`] = rawAnswer.valueBoolean;
    } else if (rawAnswer.valueInteger !== undefined) {
      flat[`${path}:0/magnitude`] = rawAnswer.valueInteger;
    } else if (rawAnswer.valueDecimal !== undefined) {
      flat[`${path}:0/magnitude`] = rawAnswer.valueDecimal;
    } else if (rawAnswer.valueDate !== undefined) {
      flat[`${path}:0/date_value`] = rawAnswer.valueDate;
    } else if (rawAnswer.valueCoding) {
      flat[`${path}:0/code`] = rawAnswer.valueCoding.code;
      flat[`${path}:0/value`] = rawAnswer.valueCoding.display;
      flat[`${path}:0/terminology`] = rawAnswer.valueCoding.system || 'local';
    }

    // Additional multi-select items
    if (item.answer && item.answer.length > 1) {
      item.answer.forEach((ans, idx) => {
        if (ans.valueCoding) {
          flat[`${path}:${idx}/code`] = ans.valueCoding.code;
          flat[`${path}:${idx}/value`] = ans.valueCoding.display;
        }
      });
    }
  }

  return flat;
}

/**
 * Builds a complete EHRbase Canonical Composition JSON structure
 */
export function buildEhrbasePayload(qr: QuestionnaireResponse): EhrbaseCompositionPayload {
  const flatData = convertFhirToOpenEHRFlat(qr);

  return {
    _type: 'COMPOSITION',
    archetype_node_id: 'openEHR-EHR-COMPOSITION.encounter.v1',
    name: {
      _type: 'DV_TEXT',
      value: 'Anamnese Médica Admissional',
    },
    context: {
      start_time: {
        _type: 'DV_DATE_TIME',
        value: qr.authored,
      },
      setting: {
        _type: 'DV_CODED_TEXT',
        value: 'Hospital Encounter',
        defining_code: {
          terminology_id: { value: 'openehr' },
          code_string: '238',
        },
      },
    },
    flatData,
  };
}

/**
 * Builds Bahmni / OpenMRS compatible REST payload
 */
export function buildBahmniObsPayload(qr: QuestionnaireResponse) {
  const observations: Array<{
    concept: string;
    value: string | number | boolean;
    obsDatetime: string;
  }> = [];

  qr.item?.forEach((item) => {
    const ans = item.answer?.[0];
    if (ans) {
      const val = ans.valueString ?? ans.valueBoolean ?? ans.valueInteger ?? ans.valueDecimal ?? ans.valueCoding?.display ?? '';
      observations.push({
        concept: item.linkId,
        value: val,
        obsDatetime: qr.authored,
      });
    }
  });

  return {
    patient: qr.subject?.reference,
    encounterType: 'ADMISSION_ANAMNESIS',
    encounterDatetime: qr.authored,
    obs: observations,
  };
}
