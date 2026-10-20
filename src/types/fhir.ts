/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FHIR R4 Questionnaire & QuestionnaireResponse Types
 * Standard compliance: https://hl7.org/fhir/R4/questionnaire.html
 */

export type FHIRItemType =
  | 'group'
  | 'display'
  | 'boolean'
  | 'decimal'
  | 'integer'
  | 'date'
  | 'dateTime'
  | 'time'
  | 'string'
  | 'text'
  | 'url'
  | 'choice'
  | 'open-choice'
  | 'attachment'
  | 'reference'
  | 'quantity';

export type EnableWhenOperator =
  | 'exists'
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<=';

export interface QuestionnaireEnableWhen {
  question: string; // linkId of the referenced question
  operator: EnableWhenOperator;
  answerBoolean?: boolean;
  answerDecimal?: number;
  answerInteger?: number;
  answerDate?: string;
  answerDateTime?: string;
  answerTime?: string;
  answerString?: string;
  answerCoding?: {
    system?: string;
    code: string;
    display?: string;
  };
}

export interface QuestionnaireAnswerOption {
  valueCoding?: {
    system?: string;
    code: string;
    display: string;
  };
  valueString?: string;
  valueInteger?: number;
  initialSelected?: boolean;
}

export interface FHIRExtension {
  url: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
}

export interface QuestionnaireItem {
  linkId: string;
  text: string;
  type: FHIRItemType;
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  prefix?: string; // e.g. "1.1", "QP"
  enableWhen?: QuestionnaireEnableWhen[];
  enableBehavior?: 'all' | 'any';
  answerOption?: QuestionnaireAnswerOption[];
  initial?: Array<{
    valueBoolean?: boolean;
    valueDecimal?: number;
    valueInteger?: number;
    valueDate?: string;
    valueString?: string;
    valueCoding?: { system?: string; code: string; display: string };
  }>;
  item?: QuestionnaireItem[];
  extension?: FHIRExtension[];
  
  // Custom metadata for medical UI enhancements
  category?: string;
  placeholder?: string;
  unit?: string;
  helpText?: string;
  multiselect?: boolean;
}

export interface Questionnaire {
  resourceType: 'Questionnaire';
  id: string;
  url?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  title: string;
  description?: string;
  version?: string;
  date?: string;
  publisher?: string;
  subjectType?: string[];
  purpose?: string;
  item: QuestionnaireItem[];
}

export interface QuestionnaireResponseAnswer {
  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueCoding?: {
    system?: string;
    code: string;
    display: string;
  };
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponseItem {
  linkId: string;
  text?: string;
  answer?: QuestionnaireResponseAnswer[];
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponse {
  resourceType: 'QuestionnaireResponse';
  id: string;
  questionnaire: string;
  status: 'in-progress' | 'completed' | 'amended' | 'stopped';
  authored: string;
  subject?: {
    reference: string;
    display?: string;
  };
  author?: {
    reference: string;
    display?: string;
  };
  source?: {
    reference: string;
    display?: string;
  };
  item: QuestionnaireResponseItem[];
}
