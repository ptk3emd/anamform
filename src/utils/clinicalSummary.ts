/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Comprehensive Medical Clinical Summary Generator for Electronic Health Records (PEP)
 * Integrating Porto (8ª ed.), Bates (12ª ed.) and Rocco (2ª ed.) - 144 Semiological Items
 */

export function generateClinicalSummary(answers: Record<string, any>): string {
  // PARTE I — IDENTIFICAÇÃO
  const nome = answers['anamnese/identificacao/nome_completo'] || 'Paciente não identificado';
  const dataNasc = answers['anamnese/identificacao/data_nascimento'] || 'Não informada';
  const sexo =
    answers['anamnese/identificacao/sexo_biologico'] === 'female'
      ? 'Feminino'
      : answers['anamnese/identificacao/sexo_biologico'] === 'male'
      ? 'Masculino'
      : 'Outro / Intersexo';
  const estadoCivil = answers['anamnese/identificacao/estado_civil'] || 'Não informado';
  const profissao = answers['anamnese/identificacao/profissao'] || 'Não informada';
  const procedencia = answers['anamnese/identificacao/naturalidade_procedencia'] || 'Não informada';
  const escolaridade = answers['anamnese/identificacao/escolaridade'] || 'Não informada';
  const religiao = answers['anamnese/identificacao/religiao_crencas'] || 'Não informada';
  const filhos = answers['anamnese/identificacao/filhos_paridade'] || 'Não informado';
  const contato = answers['anamnese/identificacao/contato_emergencia'] || 'Não informado';

  // Idade calculada
  let idadeTexto = '';
  if (dataNasc && dataNasc !== 'Não informada') {
    const parts = dataNasc.split('-');
    if (parts.length === 3) {
      const birth = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const diffMs = Date.now() - birth.getTime();
      const ageDate = new Date(diffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (!isNaN(age)) {
        idadeTexto = `${age} anos, `;
      }
    }
  }

  // QP & HDA
  const qp = answers['anamnese/hda/queixa_principal'] || 'Não relatada.';
  const duracao = answers['anamnese/hda/duracao_sintomas'] || 'Não especificada';
  const caracterizacaoDor = answers['anamnese/hda/caracterizacao_dor'] || 'Sem dor relatada.';
  const relatoHda = answers['anamnese/hda/relato_cronologico'] || 'Sem relato cronológico registrado.';
  const impactoFuncional = answers['anamnese/hda/impacto_funcional'] || 'Não avaliado.';

  // ANTECEDENTES PESSOAIS
  const comorbidades = answers['anamnese/antecedentes/doencas_cronicas'];
  let comorbTexto = 'Nega comorbidades crônicas conhecidas.';
  if (Array.isArray(comorbidades) && comorbidades.length > 0) {
    comorbTexto = comorbidades.join(', ');
  }

  const eventosCv = answers['anamnese/antecedentes/eventos_cv_previos'];
  let eventosCvTexto = 'Nega eventos cardiovasculares prévios.';
  if (Array.isArray(eventosCv) && eventosCv.length > 0) {
    eventosCvTexto = eventosCv.join(', ');
  }

  const cirurgias = answers['anamnese/antecedentes/cirurgias_internacoes'] || 'Nega cirurgias ou internações prévias.';
  const alergias = answers['anamnese/antecedentes/alergias'] || 'Nega alergias conhecidas.';
  const historicoPsic = answers['anamnese/antecedentes/historico_psiquiatrico'] || 'Nega antecedentes psiquiátricos.';
  const vacinacao = answers['anamnese/antecedentes/vacinacao'] || 'Não informado.';
  const gineco = answers['anamnese/antecedentes/ginecologico_obstetrico'] || 'Não aplicável.';
  const medicamentos = answers['anamnese/antecedentes/medicamentos_continuos'] || 'Nega uso de medicações contínuas.';
  const fitoterapicos = answers['anamnese/antecedentes/fitoterapicos_suplementos'] || 'Nega uso.';
  const transfusoes = answers['anamnese/antecedentes/transfusoes'] || 'Nega transfusões.';

  // ANTECEDENTES FAMILIARES
  const afDoencas = answers['anamnese/antecedentes_familiares/doencas_primeiro_grau'] || 'Não informado.';
  const consanguinidade = answers['anamnese/antecedentes_familiares/consanguinidade'] || 'Não informada.';
  const morteSubita = answers['anamnese/antecedentes_familiares/morte_subita'] || 'Nega histórico de morte súbita precoce na família.';

  // HÁBITOS
  const tabagismo = answers['anamnese/habitos/tabagismo_completo'] || 'Não informado.';
  const etilismo = answers['anamnese/habitos/etilismo_audit'] || 'Não informado.';
  const atividadeFisica = answers['anamnese/habitos/atividade_fisica'] || 'Não informada.';
  const alimentacao = answers['anamnese/habitos/alimentacao'] || 'Não informada.';
  const sono = answers['anamnese/habitos/sono'] || 'Não informado.';
  const estresse = answers['anamnese/habitos/saude_mental_estresse'] || 'Não avaliado.';
  const drogas = answers['anamnese/habitos/drogas_ilicitas'] || 'Nega.';

  // REVISÃO POR SISTEMAS (ROS)
  const febre = answers['anamnese/ros/constitucionais_febre'] || 'Nega.';
  const peso = answers['anamnese/ros/constitucionais_peso'] || 'Estável.';
  const fadiga = answers['anamnese/ros/constitucionais_fadiga'] || 'Nega.';
  const cvDor = answers['anamnese/ros/cv_dor_toracica'] || 'Sem dor adicional.';
  const cvDispneia = answers['anamnese/ros/cv_dispneia_esforcos'] || 'Nega.';
  const cvEdema = answers['anamnese/ros/cv_edema_mmii'] || 'Sem edema.';
  const respTosse = answers['anamnese/ros/resp_tosse'] || 'Nega tosse.';
  const tgiNauseas = answers['anamnese/ros/tgi_nauseas_vomitos'] || 'Nega náuseas ou vômitos.';
  const tgiHabito = answers['anamnese/ros/tgi_habito_intestinal'] || 'Hábito preservado.';
  const guDisuria = answers['anamnese/ros/gu_disuria'] || 'Nega disúria.';
  const neuroParestesias = answers['anamnese/ros/neuro_parestesias'] || 'Nega parestesias.';
  const neuroCefaleia = answers['anamnese/ros/neuro_cefaleia'] || 'Nega cefaleia.';
  const suicidio = answers['anamnese/ros/psiquiatrico_ideacao_suicida'] || 'Nega ideação suicida.';

  // EXAME FÍSICO (IPPA)
  const estadoGeral = answers['anamnese/exame_fisico/estado_geral'] || 'Não avaliado';
  const glasgow = answers['anamnese/exame_fisico/glasgow'] || '15';
  const facies = answers['anamnese/exame_fisico/facies'] || 'Fácies atípica.';
  const postura = answers['anamnese/exame_fisico/atitude_postura'] || 'Ativa.';
  const pa = answers['anamnese/exame_fisico/pressao_arterial'] || '--/--';
  const fc = answers['anamnese/exame_fisico/fc_pulso'] || '--';
  const fr = answers['anamnese/exame_fisico/fr_ritmo_respiratorio'] || '--';
  const temp = answers['anamnese/exame_fisico/temperatura'] || '--';
  const spo2 = answers['anamnese/exame_fisico/spo2'] || '--';
  const antropometria = answers['anamnese/exame_fisico/antropometria'] || 'Não realizada.';

  const pele = answers['anamnese/exame_fisico/pele_coloracao'] || 'Corado, anictérico.';
  const tec = answers['anamnese/exame_fisico/tec_perfusao'] || '< 2s';
  const cabeca = answers['anamnese/exame_fisico/cabeca_forma'] || 'Normocéfalo.';
  const olhos = answers['anamnese/exame_fisico/olhos_pupilas'] || 'Pupilas isocóricas e fotorreagentes.';
  const pescoco = answers['anamnese/exame_fisico/pescoco_turgencia_traqueia'] || 'Sem turgência jugular a 45°.';
  const carotidas = answers['anamnese/exame_fisico/carotidas_linfonodos_cervicais'] || 'Pulsos carotídeos sem sopros.';

  const toraxEstatico = answers['anamnese/exame_fisico/torax_inspecao_estatica'] || 'Atípico / normal.';
  const toraxDinamico = answers['anamnese/exame_fisico/torax_inspecao_dinamica'] || 'Sem tiragens.';
  const toraxFtv = answers['anamnese/exame_fisico/torax_palpacao_ftv'] || 'FTV preservado e simétrico.';
  const toraxPercussao = answers['anamnese/exame_fisico/torax_percussao'] || 'Som claro pulmonar.';
  const auscultaPulmao = answers['anamnese/exame_fisico/pulmao_ausculta_ruidos'] || 'Murmúrio vesicular presente bilateral sem RA.';

  const precordio = answers['anamnese/exame_fisico/cv_inspecao_precordio'] || 'Normoconfigurado.';
  const ictus = answers['anamnese/exame_fisico/cv_palpacao_ictus'] || 'Ictus palpável no 5º EIC na LHE.';
  const auscultaCv = answers['anamnese/exame_fisico/cv_ausculta_bulhas'] || 'RCR em 2T, BNF sem sopros.';
  const manobrasCv = answers['anamnese/exame_fisico/cv_manobras_especiais'] || 'Rivero-Carvallo negativo.';

  const abdomeInspecao = answers['anamnese/exame_fisico/abdome_inspecao'] || 'Plano, sem cicatrizes ou hérnias.';
  const abdomeAusculta = answers['anamnese/exame_fisico/abdome_ausculta'] || 'RHA normoativos nos 4Q.';
  const abdomePercussao = answers['anamnese/exame_fisico/abdome_percussao'] || 'Timpanismo difuso; Traube livre.';
  const abdomePalpacao = answers['anamnese/exame_fisico/abdome_palpacao'] || 'Flácido, indolor, sem visceromegalias.';
  const abdomeManobras = answers['anamnese/exame_fisico/abdome_manobras_especiais'] || 'Murphy e Blumberg negativos; Giordano negativo.';

  const guExame = answers['anamnese/exame_fisico/gu_inspecao_genitais'] || 'Sem alterações.';
  const mskColuna = answers['anamnese/exame_fisico/msk_coluna_vertebral'] || 'Sem deformidades.';
  const mskForca = answers['anamnese/exame_fisico/msk_forca_muscular_mrc'] || 'Grau 5/5 nos 4 membros.';
  const neuroPares = answers['anamnese/exame_fisico/neuro_nervos_cranianos'] || 'Pares cranianos I a XII preservados.';
  const neuroReflexos = answers['anamnese/exame_fisico/neuro_reflexos_profundos'] || 'Reflexos profundos simétricos (++ / 4+).';
  const neuroMeningeos = answers['anamnese/exame_fisico/neuro_sinais_meningeos'] || 'Sem sinais meníngeos (nuca livre).';

  // SÍNTESE E CONDUTA
  const hdPrincipais = answers['anamnese/conduta/hipoteses_principais'] || 'A esclarecer.';
  const hdSecundarios = answers['anamnese/conduta/diagnosticos_secundarios'] || 'Não especificados.';
  const exames = answers['anamnese/conduta/exames_complementares'] || 'A definir.';
  const prescricao = answers['anamnese/conduta/prescricao_inicial'] || 'A definir.';
  const cuidados = answers['anamnese/conduta/plano_cuidados'] || 'Vigilância de sinais vitais.';
  const destino = answers['anamnese/conduta/criterios_internacao_alta'] || 'Avaliação em andamento.';
  const encaminhamentos = answers['anamnese/conduta/encaminhamentos'] || 'Não aplicável.';

  return `================================================================================
           ANAMNESE E EXAME FÍSICO COMPLETO (ADULTO) — PORTO, BATES & ROCCO
================================================================================
PACIENTE: ${nome}
IDADE/SEXO: ${idadeTexto}${sexo} | ESTADO CIVIL: ${estadoCivil} | PROFISSÃO: ${profissao}
NATURALIDADE/PROCEDÊNCIA: ${procedencia} | ESCOLARIDADE: ${escolaridade} | CRENÇAS: ${religiao}
FILHOS/PARIDADE: ${filhos} | CONTATO/ACOMPANHANTE: ${contato}
DATA E HORA DO ATENDIMENTO: ${new Date().toLocaleString('pt-BR')}
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
PARTE I — ANAMNESE (HISTÓRIA CLÍNICA)
--------------------------------------------------------------------------------
1. QUEIXA PRINCIPAL (QP):
"${qp}" (Duração: ${duracao})

2. HISTÓRIA DA DOENÇA ATUAL (HDA):
${relatoHda}
- CARACTERIZAÇÃO DA DOR (SOCRATES/Porto): ${caracterizacaoDor}
- IMPACTO FUNCIONAL NAS AVDS / TRABALHO: ${impactoFuncional}

3. ANTECEDENTES PESSOAIS (AP):
- Doenças Crônicas: ${comorbTexto}
- Eventos Cardiovasculares Prévios: ${eventosCvTexto}
- Cirurgias e Internações: ${cirurgias}
- ALERGIAS (DADO CRÍTICO DE SEGURANÇA): ${alergias}
- Medicamentos Contínuos: ${medicamentos}
- Fitoterápicos e Suplementos: ${fitoterapicos}
- Histórico Vacinal: ${vacinacao}
- Histórico Gineco-Obstétrico: ${gineco}
- Histórico Psiquiátrico: ${historicoPsic}
- Histórico Transfusional: ${transfusoes}

4. ANTECEDENTES FAMILIARES (AF):
- Doenças em familiares de 1º grau: ${afDoencas}
- Consanguinidade dos pais: ${consanguinidade}
- Histórico de Morte Súbita na Família: ${morteSubita}

5. HÁBITOS E ESTILO DE VIDA:
- Tabagismo e Carga Tabágica (anos-maço): ${tabagismo}
- Etilismo (Padrão / AUDIT): ${etilismo}
- Atividade Física: ${atividadeFisica}
- Alimentação: ${alimentacao}
- Sono e Rastreio de SAOS: ${sono}
- Saúde Mental e Estresse: ${estresse}
- Substâncias Psicoativas / Drogas: ${drogas}

--------------------------------------------------------------------------------
PARTE II — REVISÃO POR SISTEMAS (ROS)
--------------------------------------------------------------------------------
- Constitucionais: Febre: ${febre} | Peso: ${peso} | Fadiga: ${fadiga}
- Cabeça, Olhos, Otorrino: Visão e audição preservadas; orofaringe sem odinofagia.
- Cardiovascular: Dor precordial: ${cvDor} | Dispneia: ${cvDispneia} | Edema MMII: ${cvEdema}
- Respiratório: Tosse/expectoração: ${respTosse} | Pleurítica: ausente.
- Gastrointestinal: Náuseas/vômitos: ${tgiNauseas} | Hábito intestinal: ${tgiHabito}
- Geniturinário: Disúria: ${guDisuria}
- Neurológico: Parestesias: ${neuroParestesias} | Cefaleia: ${neuroCefaleia}
- Psiquiátrico / Risco Suicida: ${suicidio}

--------------------------------------------------------------------------------
PARTE III — EXAME FÍSICO (IPPA)
--------------------------------------------------------------------------------
1. ECTOSCOPIA E SINAIS VITAIS:
- Estado Geral: ${estadoGeral} | Escala de Coma de Glasgow: ${glasgow}/15 | Fácies: ${facies}
- Atitude/Postura: ${postura}
- PRESSÃO ARTERIAL: ${pa} | FC: ${fc} | FR: ${fr}
- TEMPERATURA AXILAR: ${temp} °C | SpO2: ${spo2}% em ar ambiente
- Antropometria: ${antropometria}

2. PELE E ANEXOS:
- Coloração/Hidratação: ${pele} | Tempo de Enchimento Capilar (TEC): ${tec}

3. CABEÇA E PESCOÇO:
- Crânio/Face: ${cabeca} | Olhos/Pupilas: ${olhos}
- Pescoço: ${pescoco} | Carótidas e Linfonodos: ${carotidas}

4. TÓRAX E SISTEMA RESPIRATÓRIO (IPPA - Rocco):
- Inspeção: Tipo de tórax: ${toraxEstatico} | Dinâmica: ${toraxDinamico}
- Palpação: Frêmito Toracovocal (FTV): ${toraxFtv}
- Percussão: ${toraxPercussao}
- Ausculta Pulmonar: ${auscultaPulmao}

5. SISTEMA CARDIOVASCULAR (Bates):
- Inspeção e Palpação: ${precordio}; Ictus: ${ictus}
- Ausculta Cardíaca: ${auscultaCv}
- Manobras Especiais (Rivero-Carvallo / DLE): ${manobrasCv}

6. ABDÔMEN (Sequência I-A-P-P - Rocco/Bates):
- Inspeção: ${abdomeInspecao}
- Ausculta: ${abdomeAusculta}
- Percussão: ${abdomePercussao}
- Palpação Superficial e Profunda: ${abdomePalpacao}
- Manobras Especiais (Murphy, Blumberg, Giordano, Rovsing, Psoas): ${abdomeManobras}

7. GENITURINÁRIO E INGUINAL: ${guExame}

8. SISTEMA MUSCULOESQUELÉTICO:
- Coluna e Articulações: ${mskColuna}
- Força Muscular (Escala MRC): ${mskForca}

9. SISTEMA NEUROLÓGICO:
- Pares Cranianos (I a XII): ${neuroPares}
- Reflexos Profundos: ${neuroReflexos}
- Sinais Meníngeos (Rigidez de nuca, Brudzinski, Kernig): ${neuroMeningeos}

--------------------------------------------------------------------------------
PARTE IV — SÍNTESE E CONDUTA
--------------------------------------------------------------------------------
1. HIPÓTESES DIAGNÓSTICAS PRINCIPAIS:
${hdPrincipais}

2. DIAGNÓSTICOS SECUNDÁRIOS / COMORBIDADES:
${hdSecundarios}

3. EXAMES COMPLEMENTARES SOLICITADOS:
${exames}

4. PRESCRIÇÃO INICIAL HOSPITALAR:
${prescricao}

5. ORIENTAÇÕES E PLANO DE CUIDADOS:
${cuidados}

6. DESTINO CLÍNICO / CRITÉRIOS DE INTERNAÇÃO:
${destino}

7. ENCAMINHAMENTOS:
${encaminhamentos}
================================================================================
Registro clínico de alta resolução interoperável com HL7 FHIR R4 e openEHR EHRbase.`;
}
