/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * openEHR & EHRbase FLAT Composition Types
 * Based on CISTEC Web Template to FHIR Questionnaire conversion patterns
 */

export interface OpenEHRFlatComposition {
  [path: string]: string | number | boolean | null;
}

export interface EhrbaseCompositionPayload {
  _type: 'COMPOSITION';
  archetype_node_id: string; // e.g., 'openEHR-EHR-COMPOSITION.encounter.v1'
  name: {
    _type: 'DV_TEXT';
    value: string;
  };
  uid?: {
    _type: 'OBJECT_VERSION_ID';
    value: string;
  };
  context: {
    start_time: {
      _type: 'DV_DATE_TIME';
      value: string;
    };
    setting: {
      _type: 'DV_CODED_TEXT';
      value: string;
      defining_code: {
        terminology_id: { value: 'openehr' };
        code_string: string;
      };
    };
  };
  content?: Record<string, unknown>[];
  flatData?: OpenEHRFlatComposition;
}

export interface InteropExportBundle {
  fhirQuestionnaireResponse: unknown;
  openEHRFlatComposition: OpenEHRFlatComposition;
  openEHREhrbasePayload: EhrbaseCompositionPayload;
  openMrsPayload: unknown;
  bahmniObservationList: Array<{
    concept: string;
    value: string | number | boolean;
    obsDatetime: string;
  }>;
}
