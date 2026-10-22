import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AVAILABLE_QUESTIONNAIRES, HOSPITAL_ADMISSION_QUESTIONNAIRE as hospital, OUTPATIENT_QUESTIONNAIRE as outpatient } from '../src/data/questionnaires';
import { hasAnswer, validateAnswer } from '../src/utils/answers';
import { buildClinicalSections, formatAnswer, generateClinicalSummary } from '../src/utils/clinicalSummary';
import { buildQuestionnaireResponse, getActiveQuestions, isItemEnabled } from '../src/utils/fhirValidator';
import { convertFhirToOpenEHRFlat } from '../src/utils/openehrConverter';
import type { Questionnaire, QuestionnaireItem } from '../src/types/fhir';

test('todos os modelos permitem deixar todos os itens em branco', () => {
  for (const model of AVAILABLE_QUESTIONNAIRES) {
    for (const item of getActiveQuestions(model, {})) {
      assert.equal(item.required, false);
      assert.equal(validateAnswer(item, ''), null);
    }
    assert.deepEqual(buildQuestionnaireResponse(model, {}).item, []);
  }
});

test('roteiro ampliado tem mais de 122 itens e subitens independentes com IDs estáveis', () => {
  assert.ok(hospital.item.length > 122);
  assert.ok(hospital.item.filter(i => i.parentLinkId).length > 100);
  assert.equal(new Set(hospital.item.map(i => i.linkId)).size, hospital.item.length);
  for (const item of hospital.item) {
    assert.ok(item.example);
    assert.ok(item.helpText);
    if (item.parentLinkId) assert.ok(hospital.item.some(parent => parent.linkId === item.parentLinkId));
  }
  assert.equal(getActiveQuestions(hospital, {}).length, hospital.item.length);
});

test('branco, espaços e lista vazia não contam; zero e falso são respostas', () => {
  for (const empty of [undefined, null, '', '   ', [], [' '], NaN]) assert.equal(hasAnswer(empty), false);
  for (const value of [false, 0, '0', 'Resposta', ['a']]) assert.equal(hasAnswer(value), true);
});

test('prontuário vazio não inventa negativas, sexo, exames normais ou urgência', () => {
  const text = generateClinicalSummary({});
  assert.match(text, /Nenhuma informação clínica registrada/);
  assert.doesNotMatch(text, /Nega|Masculino|Feminino|Glasgow: 15|Murmúrio vesicular|URGENTE|EMERGÊNCIA/);
});

test('campos em branco são explícitos somente quando solicitados', () => {
  const text = generateClinicalSummary({}, outpatient, { includeEmpty: true });
  assert.match(text, /Nome do paciente: Não informado/);
  assert.doesNotMatch(generateClinicalSummary({}, outpatient), /Nome do paciente:/);
});

test('prontuário inclui ROS antes omitida, subitens sem pai preenchido e quebras de linha', () => {
  const text = generateClinicalSummary({
    'anamnese/ros/audicao': 'Zumbido esquerdo há três dias.',
    'anamnese/hda/dor_tipo': 'Queimação',
    'anamnese/conduta/seguimento': 'Retorno em sete dias.\nLocal: unidade de origem.',
  });
  assert.match(text, /Zumbido esquerdo há três dias\./);
  assert.match(text, /Dor: qualidade da sensação: Queimação/);
  assert.match(text, /Retorno em sete dias\.\nLocal: unidade de origem\./);
});

test('códigos viram rótulos e números mantêm unidade sem perder zero', () => {
  const text = generateClinicalSummary({
    'anamnese/identificacao/sexo_biologico': 'other',
    'anamnese/antecedentes/doencas_cronicas': ['has', 'dm'],
    'anamnese/hda/dor_intensidade': 0,
    'anamnese/exame_fisico/temperatura': 36.5,
  });
  assert.match(text, /Intersexo \/ Outro/);
  assert.match(text, /Hipertensão Arterial Sistêmica/);
  assert.match(text, /Diabetes Mellitus/);
  assert.match(text, /0 \/ 10/);
  assert.match(text, /36,5 °C/);
});

test('modelo selecionado limita o prontuário e a contagem a seus itens', () => {
  const answers = { 'anamnese/identificacao/nome_completo': 'Paciente de teste', 'anamnese/ros/audicao': 'Resposta de outro modelo' };
  assert.doesNotMatch(generateClinicalSummary(answers, outpatient), /Resposta de outro modelo/);
  assert.equal(buildClinicalSections(answers, outpatient).reduce((n, s) => n + s.answered, 0), 1);
});

test('data é apresentada em português e booleano falso mantém significado', () => {
  assert.equal(formatAnswer({ linkId: 'date', type: 'date', text: 'Data' }, '1980-06-15'), '15/06/1980');
  assert.equal(formatAnswer({ linkId: 'b', type: 'boolean', text: 'Resposta' }, false), 'Não');
});

test('validação numérica não obriga preenchimento e rejeita valor fora da escala', () => {
  const pain = hospital.item.find(i => i.linkId === 'anamnese/hda/dor_intensidade')!;
  assert.equal(validateAnswer(pain, ''), null);
  assert.equal(validateAnswer(pain, 0), null);
  assert.equal(validateAnswer(pain, 10), null);
  assert.ok(validateAnswer(pain, 11));
  assert.ok(validateAnswer(pain, 2.5));
  assert.ok(validateAnswer(pain, 'abc'));
});

test('data de nascimento inválida ou futura é rejeitada sem exigir data', () => {
  const date = hospital.item.find(i => i.type === 'date')!;
  assert.equal(validateAnswer(date, ''), null);
  assert.equal(validateAnswer(date, '1980-06-15'), null);
  assert.ok(validateAnswer(date, '2025-02-30'));
  assert.ok(validateAnswer(date, '2999-01-01'));
});

test('FHIR preserva zero, texto, booleano falso e não inventa autor ou sujeito', () => {
  const questionnaire: Questionnaire = { ...outpatient, item: [
    { linkId: 'bool', type: 'boolean', text: 'Booleano' },
    { linkId: 'num', type: 'integer', text: 'Número' },
    { linkId: 'choice', type: 'choice', text: 'Opção', answerOption: [{ valueString: 'Texto' }] },
  ] };
  const response = buildQuestionnaireResponse(questionnaire, { bool: false, num: 0, choice: 'Texto' });
  assert.deepEqual(response.item.map(i => i.answer), [[{ valueBoolean: false }], [{ valueInteger: 0 }], [{ valueString: 'Texto' }]]);
  assert.equal(response.subject, undefined);
  assert.equal(response.author, undefined);
});

test('códigos locais não recebem uma terminologia SNOMED inventada', () => {
  const response = buildQuestionnaireResponse(hospital, { 'anamnese/antecedentes/doencas_cronicas': ['has', 'dm'] });
  assert.equal(response.item[0].answer?.length, 2);
  assert.equal(response.item[0].answer?.[0].valueCoding?.code, 'has');
  assert.equal(response.item[0].answer?.[0].valueCoding?.system, undefined);
});

test('números inválidos não são exportados como zero e subitens chegam ao FLAT', () => {
  const response = buildQuestionnaireResponse(hospital, { 'anamnese/exame_fisico/spo2': 'abc', 'anamnese/hda/dor_intensidade': 0 });
  assert.equal(response.item.length, 1);
  const flat = convertFhirToOpenEHRFlat(response);
  assert.equal(flat['anamnese_geral/hda/dor_intensidade:0/magnitude'], 0);
});

test('condições não confundem respostas ausentes com falso ou zero', () => {
  const item: QuestionnaireItem = { linkId: 'child', type: 'text', text: 'Filho', enableWhen: [{ question: 'parent', operator: '=', answerBoolean: false }] };
  assert.equal(isItemEnabled(item, {}), false);
  assert.equal(isItemEnabled(item, { parent: false }), true);
  item.enableWhen = [{ question: 'parent', operator: 'exists', answerBoolean: true }];
  assert.equal(isItemEnabled(item, { parent: [] }), false);
  assert.equal(isItemEnabled(item, { parent: 0 }), true);
});

test('grupos desabilitados não vazam filhos; grupos preenchidos mantêm a hierarquia', () => {
  const questionnaire: Questionnaire = { ...outpatient, item: [{ linkId: 'group', type: 'group', text: 'Grupo', enableWhen: [{ question: 'show', operator: '=', answerBoolean: true }], item: [{ linkId: 'child', type: 'text', text: 'Filho' }] }] };
  assert.equal(getActiveQuestions(questionnaire, { child: 'Resposta' }).length, 0);
  assert.equal(buildQuestionnaireResponse(questionnaire, { child: 'Resposta' }).item.length, 0);
  assert.equal(buildQuestionnaireResponse(questionnaire, { show: true, child: 'Resposta' }).item[0].item?.[0].answer?.[0].valueString, 'Resposta');
});

test('data e hora são mantidas em valueDateTime', () => {
  const questionnaire: Questionnaire = { ...outpatient, item: [{ linkId: 'time', type: 'dateTime', text: 'Horário' }] };
  assert.deepEqual(buildQuestionnaireResponse(questionnaire, { time: '2026-10-21T10:00:00-03:00' }).item[0].answer, [{ valueDateTime: '2026-10-21T10:00:00-03:00' }]);
});
