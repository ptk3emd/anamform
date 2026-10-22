import type { Questionnaire, QuestionnaireItem } from '../types/fhir';

// Suggestions are editable documentation aids. Nothing is selected or inferred.
const suggestions: Record<string, string[]> = {
  nome_completo: ['Identificação ainda não confirmada'],
  profissao: ['Aposentado(a)', 'Estudante', 'Trabalho doméstico', 'Trabalho informal'],
  naturalidade_procedencia: ['Reside no município de atendimento', 'Procedente de outro município'],
  religiao_crencas: ['Sem restrições de cuidado relatadas', 'Prefere não informar'],
  filhos_paridade: ['Sem filhos', 'História obstétrica não informada'],
  contato_emergencia: ['Sem acompanhante no momento', 'Contato ainda não informado'],
  queixa_principal: ['Dor', 'Falta de ar', 'Febre', 'Retorno para acompanhamento'],
  caracterizacao_dor: ['Em aperto', 'Em queimação', 'Em pontada', 'Em cólica', 'Pulsátil'],
  relato_cronologico: ['Início súbito', 'Início gradual', 'Evolução progressiva', 'Episódios recorrentes'],
  impacto_funcional: ['Limita o trabalho', 'Interrompe o sono', 'Limita o autocuidado', 'Sem limitação relatada'],
  cirurgias_internacoes: ['Nega cirurgias prévias', 'Nega internações prévias', 'Histórico não conhecido'],
  alergias: ['Nega alergias conhecidas', 'História de alergia não esclarecida'],
  historico_psiquiatrico: ['Em acompanhamento', 'Tratamento anterior', 'Nega diagnóstico prévio'],
  vacinacao: ['Caderneta apresentada', 'Sem caderneta disponível', 'Situação vacinal desconhecida'],
  ginecologico_obstetrico: ['Ciclos regulares', 'Ciclos irregulares', 'Menopausa relatada', 'Não avaliado'],
  medicamentos_continuos: ['Nega uso contínuo', 'Lista de medicamentos não disponível'],
  fitoterapicos_suplementos: ['Nega uso', 'Usa suplementos', 'Usa fitoterápicos'],
  transfusoes: ['Nega transfusões prévias', 'Transfusão prévia relatada', 'Não sabe informar'],
  doencas_primeiro_grau: ['História cardiovascular', 'História de diabetes', 'História de neoplasia', 'História familiar desconhecida'],
  morte_subita: ['Nega história familiar conhecida', 'História familiar desconhecida'],
  tabagismo_completo: ['Nunca fumou', 'Tabagismo atual', 'Ex-tabagista', 'Exposição passiva'],
  alimentacao: ['Refeições regulares', 'Restrição alimentar', 'Redução da ingestão', 'Dificuldade de acesso a alimentos'],
  sono: ['Sono reparador', 'Dificuldade para iniciar o sono', 'Despertares noturnos', 'Roncos relatados'],
  saude_mental_estresse: ['Estresse ocupacional', 'Estresse familiar', 'Rede de apoio presente', 'Rede de apoio limitada'],
  drogas_ilicitas: ['Nega uso', 'Uso atual relatado', 'Uso prévio relatado', 'Prefere não informar'],
  constitucionais_febre: ['Febre aferida', 'Sensação febril não aferida', 'Calafrios', 'Nega febre'],
  constitucionais_peso: ['Perda involuntária', 'Perda intencional', 'Ganho de peso', 'Peso estável referido'],
  constitucionais_fadiga: ['Aos esforços', 'Em repouso', 'Intermitente', 'Nega fadiga'],
  pele_lesoes: ['Máculas', 'Pápulas', 'Placas', 'Vesículas', 'Nega lesões'],
  pele_prurido_cor: ['Prurido localizado', 'Prurido generalizado', 'Mudança de coloração', 'Nega alterações'],
  pele_unhas_cabelos: ['Queda de cabelos', 'Unhas frágeis', 'Alteração de cor', 'Sem alterações relatadas'],
  visao: ['Visão embaçada', 'Visão dupla', 'Dor ocular', 'Nega alteração visual'],
  audicao: ['Hipoacusia', 'Zumbido', 'Otalgia', 'Nega alteração auditiva'],
  orofaringe: ['Odinofagia', 'Rouquidão', 'Lesões orais', 'Nega queixas'],
  nariz_seios_face: ['Obstrução nasal', 'Rinorreia', 'Epistaxe', 'Dor facial'],
  cv_dor_toracica: ['Aos esforços', 'Em repouso', 'Relacionada à respiração', 'Nega dor torácica'],
  cv_palpitacoes: ['Batimentos acelerados', 'Batimentos irregulares', 'Episódios intermitentes', 'Nega palpitações'],
  cv_dispneia_esforcos: ['Aos grandes esforços', 'Aos esforços habituais', 'Aos pequenos esforços', 'Em repouso', 'Nega dispneia'],
  cv_edema_mmii: ['Unilateral', 'Bilateral', 'Piora ao final do dia', 'Nega edema'],
  cv_sincope: ['Perda de consciência relatada', 'Pré-síncope', 'Nega síncope'],
  cv_claudicacao: ['Dor ao caminhar', 'Alívio ao repouso', 'Nega claudicação'],
  resp_tosse: ['Seca', 'Produtiva', 'Predominantemente noturna', 'Nega tosse'],
  resp_expectoracao: ['Mucoide', 'Purulenta', 'Com estrias de sangue', 'Sem expectoração'],
  resp_chiado: ['Intermitente', 'Noturno', 'Associado ao esforço', 'Nega chiado'],
  resp_dor_pleuritica: ['Piora à inspiração', 'Piora com a tosse', 'Nega dor pleurítica'],
  resp_tuberculose_rastreio: ['Contato conhecido relatado', 'Tratamento prévio relatado', 'Nega contato conhecido'],
  tgi_disfagia: ['Para sólidos', 'Para líquidos', 'Para sólidos e líquidos', 'Nega disfagia'],
  tgi_nauseas_vomitos: ['Náuseas', 'Vômitos alimentares', 'Vômitos biliosos', 'Sangue no vômito', 'Nega náuseas e vômitos'],
  tgi_dor_abdominal: ['Epigástrio', 'Hipocôndrio direito', 'Fossa ilíaca direita', 'Difusa', 'Nega dor abdominal'],
  tgi_habito_intestinal: ['Diarreia', 'Constipação', 'Alternância', 'Sangue nas fezes', 'Sem mudança relatada'],
  tgi_ictericia_coluria: ['Pele amarelada', 'Urina escura', 'Fezes claras', 'Nega alterações'],
  gu_disuria: ['Disúria', 'Urgência', 'Polaciúria', 'Nega sintomas urinários'],
  gu_hematuria_proteinuria: ['Urina avermelhada', 'Coágulos', 'Urina espumosa', 'Nega alterações'],
  gu_nocturia: ['Uma vez por noite', 'Duas vezes por noite', 'Três ou mais vezes por noite', 'Nega noctúria'],
  gu_corrimento: ['Corrimento relatado', 'Prurido associado', 'Lesão genital', 'Nega queixas'],
  gu_disfuncao_sexual: ['Dor na relação', 'Redução da libido', 'Disfunção erétil', 'Prefere não informar'],
  msk_artralgia: ['Monoarticular', 'Poliarticular', 'Rigidez matinal', 'Edema articular', 'Nega artralgia'],
  msk_mialgia: ['Localizada', 'Difusa', 'Associada ao esforço', 'Nega mialgia'],
  msk_dor_axial: ['Cervicalgia', 'Dorsalgia', 'Lombalgia', 'Nega dor axial'],
  msk_limitacao_avd: ['Independente', 'Ajuda parcial', 'Dependência para autocuidado'],
  neuro_cefaleia: ['Unilateral', 'Bilateral', 'Pulsátil', 'Em pressão', 'Nega cefaleia'],
  neuro_tontura_vertigem: ['Sensação rotatória', 'Sensação de desmaio', 'Desequilíbrio', 'Nega tontura'],
  neuro_parestesias: ['Formigamento', 'Dormência', 'Queimação', 'Nega parestesias'],
  neuro_convulsoes: ['Evento presenciado', 'Evento não presenciado', 'Crises prévias relatadas', 'Nega crises prévias'],
  neuro_marcha_tremor: ['Tremor em repouso', 'Tremor de ação', 'Instabilidade ao caminhar', 'Nega alterações'],
  hemato_sangramentos: ['Equimoses espontâneas', 'Epistaxe', 'Gengivorragia', 'Nega sangramentos'],
  hemato_adenomegalias: ['Cervical', 'Axilar', 'Inguinal', 'Nega aumento de gânglios'],
  hemato_palidez: ['Palidez referida', 'Anemia prévia relatada', 'Nega alteração'],
  endocrino_4ps: ['Poliúria', 'Polidipsia', 'Polifagia', 'Perda de peso', 'Nega esses sintomas'],
  endocrino_tireoide: ['Intolerância ao frio', 'Intolerância ao calor', 'Tremor', 'Nega queixas'],
  endocrino_libido_ciclo: ['Ciclo irregular', 'Amenorreia', 'Redução da libido', 'Não avaliado'],
  imuno_atopia: ['Rinite', 'Asma relatada', 'Eczema', 'Nega atopia'],
  imuno_alergia_farmacos: ['Reação relatada', 'Reação ainda não esclarecida', 'Nega alergia conhecida'],
  imuno_infeccoes_repeticao: ['Respiratórias', 'Urinárias', 'Cutâneas', 'Nega infecções de repetição'],
  psiquiatrico_humor: ['Humor deprimido', 'Anedonia', 'Irritabilidade', 'Sem queixas relatadas'],
  psiquiatrico_ansiedade: ['Preocupação persistente', 'Crises de ansiedade', 'Sintomas físicos associados', 'Nega ansiedade'],
  psiquiatrico_ideacao_suicida: ['Nega ideação no momento da entrevista', 'Relata ideação', 'Não foi possível avaliar'],
  facies: ['Atípica', 'Expressão de dor', 'Assimetria observada'],
  atitude_postura: ['Ativa', 'Passiva', 'Preferência por cabeceira elevada', 'Posição antálgica'],
  pressao_arterial: ['Aferida em membro superior direito', 'Aferida em membro superior esquerdo'],
  fc_pulso: ['Ritmo regular', 'Ritmo irregular', 'Pulsos simétricos', 'Pulsos assimétricos'],
  fr_ritmo_respiratorio: ['Ritmo regular', 'Ritmo irregular', 'Uso de musculatura acessória'],
  antropometria: ['Medidas aferidas', 'Medidas referidas', 'Aferição não realizada'],
  pele_coloracao: ['Corado', 'Hipocorado', 'Ictérico', 'Cianótico'],
  pele_umidade_turgor: ['Turgor preservado', 'Turgor reduzido', 'Pele seca', 'Sudorese'],
  pele_lesoes_elementares: ['Mácula', 'Pápula', 'Placa', 'Vesícula', 'Úlcera'],
  cabeca_forma: ['Simétrico', 'Assimetria', 'Abaulamento', 'Lesão palpável'],
  olhos_pupilas: ['Isocóricas', 'Anisocóricas', 'Fotorreagentes', 'Resposta reduzida à luz'],
  orofaringe_mucosa: ['Mucosa úmida', 'Mucosa seca', 'Exsudato', 'Lesões orais'],
  pescoco_turgencia_traqueia: ['Traqueia central', 'Desvio traqueal', 'Turgência jugular observada', 'Tireoide aumentada'],
  carotidas_linfonodos_cervicais: ['Sopro carotídeo', 'Linfonodos palpáveis', 'Sem linfonodos palpáveis nas cadeias examinadas'],
  torax_inspecao_dinamica: ['Expansão simétrica', 'Expansão assimétrica', 'Tiragem', 'Uso de musculatura acessória'],
  torax_palpacao_ftv: ['FTV preservado', 'FTV aumentado', 'FTV reduzido', 'Expansibilidade reduzida'],
  torax_percussao: ['Som claro pulmonar', 'Macicez', 'Submacicez', 'Hipersonoridade'],
  pulmao_ausculta_ruidos: ['Murmúrio vesicular presente', 'Murmúrio vesicular reduzido', 'Estertores', 'Sibilos', 'Roncos'],
  pulmao_ausculta_voz: ['Ressonância simétrica', 'Broncofonia', 'Egofonia', 'Pectorilóquia'],
  cv_inspecao_precordio: ['Sem abaulamento observado', 'Impulsão visível', 'Abaulamento'],
  cv_palpacao_ictus: ['Ictus palpável', 'Ictus não palpável', 'Frêmito palpável'],
  cv_percussao_macicez: ['Não realizada', 'Área de macicez delimitada'],
  cv_ausculta_bulhas: ['Ritmo regular', 'Ritmo irregular', 'Sopro', 'B3 audível', 'B4 audível'],
  cv_manobras_especiais: ['Decúbito lateral esquerdo', 'Inspiração profunda', 'Não realizadas'],
  abdome_inspecao: ['Plano', 'Globoso', 'Escavado', 'Cicatriz', 'Hérnia visível'],
  abdome_ausculta: ['Ruídos presentes', 'Ruídos aumentados', 'Ruídos reduzidos', 'Ruídos não auscultados'],
  abdome_percussao: ['Timpanismo', 'Macicez', 'Macicez móvel'],
  abdome_palpacao: ['Flácido', 'Dor à palpação', 'Defesa', 'Massa palpável'],
  abdome_manobras_especiais: ['Murphy negativo', 'Murphy positivo', 'Não realizadas'],
  gu_linfonodos_inguinais: ['Linfonodos palpáveis', 'Hérnia palpável', 'Não examinado'],
  gu_inspecao_genitais: ['Exame consentido', 'Exame não realizado', 'Lesão observada'],
  gu_toque_retal: ['Não realizado', 'Exame consentido', 'Dor ao exame', 'Sangue na luva'],
  msk_coluna_vertebral: ['Mobilidade preservada', 'Mobilidade reduzida', 'Dor à palpação', 'Deformidade'],
  msk_articulacoes_perifericas: ['Derrame', 'Calor', 'Dor', 'Crepitação'],
  msk_amplitude_movimento: ['Amplitude preservada', 'Limitação ativa', 'Limitação passiva', 'Dor ao movimento'],
  neuro_nervos_cranianos: ['Sem alteração nos pares examinados', 'Assimetria facial', 'Alteração da motilidade ocular'],
  neuro_coordenacao_romberg: ['Coordenação preservada', 'Dismetria', 'Romberg positivo', 'Romberg negativo'],
  neuro_reflexos_profundos: ['Simétricos', 'Assimétricos', 'Diminuídos', 'Exaltados'],
  neuro_sensibilidade: ['Preservada nas áreas testadas', 'Hipoestesia', 'Hiperestesia', 'Assimetria'],
  neuro_marcha: ['Sem alteração observada', 'Atáxica', 'Espástica', 'Não testada'],
  neuro_sinais_meningeos: ['Rigidez de nuca presente', 'Rigidez de nuca ausente', 'Não pesquisados'],
  hipoteses_principais: ['Hipótese em investigação', 'Diagnóstico prévio em acompanhamento'],
  diagnosticos_secundarios: ['Comorbidade estável', 'Comorbidade descompensada', 'Em investigação'],
  exames_complementares: ['Solicitado', 'Resultado pendente', 'Resultado revisado'],
  prescricao_inicial: ['Reconciliação medicamentosa realizada', 'Prescrição registrada separadamente'],
  plano_cuidados: ['Orientações discutidas com o paciente', 'Orientações discutidas com o acompanhante'],
  encaminhamentos: ['Encaminhamento solicitado', 'Agendamento pendente', 'Seguimento na atenção primária'],
};

type Detail = [key: string, title: string, example: string, options?: string[], type?: 'integer' | 'decimal' | 'date', unit?: string];
// Subitems retain stable IDs and remain independently optional, even if the parent is blank.
const details: Record<string, Detail[]> = {
  nome_completo: [
    ['nome_social', 'Nome social e forma de tratamento', 'Prefere ser chamada de Ana.', ['Utiliza nome civil', 'Prefere nome social']],
    ['fonte_historia', 'Fonte da história e confiabilidade', 'Informações fornecidas pela paciente, sem dificuldade de comunicação.', ['Paciente', 'Familiar', 'Cuidador', 'Documento prévio']],
    ['comunicacao', 'Necessidades de comunicação', 'Utiliza aparelho auditivo; prefere orientações por escrito.', ['Sem adaptação solicitada', 'Intérprete', 'Recurso auditivo', 'Comunicação escrita']],
  ],
  contato_emergencia: [
    ['rede_apoio', 'Rede de apoio e moradia', 'Mora com a irmã, que auxilia no transporte às consultas.', ['Mora sozinho(a)', 'Mora com familiares', 'Cuidador disponível', 'Apoio limitado']],
    ['autonomia', 'Autonomia para decisões e cuidados', 'Participa das decisões; solicita apoio do acompanhante para as orientações.', ['Independente', 'Necessita apoio parcial', 'Necessita apoio integral']],
  ],
  caracterizacao_dor: [
    ['dor_localizacao', 'Dor: localização precisa e lateralidade', 'Dor em região lombar direita, localizada pelo paciente.', ['Retroesternal', 'Epigástrica', 'Lombar', 'Cefálica', 'Difusa']],
    ['dor_inicio', 'Dor: início e circunstância', 'Iniciou gradualmente após carregar peso, há dois dias.', ['Súbito', 'Gradual', 'Após esforço', 'Em repouso']],
    ['dor_tipo', 'Dor: qualidade da sensação', 'Queimação contínua na região epigástrica.', ['Aperto', 'Queimação', 'Pontada', 'Cólica', 'Pulsátil', 'Choque']],
    ['dor_intensidade', 'Dor: intensidade de 0 a 10', 'Paciente atribui intensidade 6 de 10.', undefined, 'integer', '/ 10'],
    ['dor_irradiacao', 'Dor: irradiação', 'Irradia da lombar para a face posterior da coxa direita.', ['Sem irradiação', 'Membro superior', 'Dorso', 'Mandíbula', 'Membro inferior']],
    ['dor_frequencia', 'Dor: duração dos episódios e frequência', 'Episódios de 15 minutos, três vezes ao dia.', ['Contínua', 'Intermitente', 'Diária', 'Noturna']],
    ['dor_agravantes', 'Dor: fatores de piora', 'Piora ao flexionar o tronco e levantar peso.', ['Esforço', 'Movimento', 'Inspiração', 'Alimentação', 'Posição']],
    ['dor_alivio', 'Dor: fatores de alívio', 'Melhora parcial ao repousar; sem uso de medicamentos.', ['Repouso', 'Mudança de posição', 'Medicação utilizada', 'Sem alívio relatado']],
    ['dor_associados', 'Dor: manifestações associadas', 'Náusea durante os episódios; nega vômitos quando perguntado.', ['Náusea', 'Sudorese', 'Dispneia', 'Febre', 'Sem sintomas associados relatados']],
  ],
  relato_cronologico: [
    ['evolucao', 'Evolução desde o início', 'Sintoma inicialmente intermitente, tornou-se diário na última semana.', ['Melhora', 'Estável', 'Piora progressiva', 'Oscilante']],
    ['episodios_previos', 'Episódios semelhantes anteriores', 'Episódio semelhante há seis meses, com duração de dois dias.', ['Primeiro episódio', 'Recorrente', 'Não sabe informar']],
    ['tratamentos_previos', 'Medidas já utilizadas e resposta', 'Aplicou compressa morna ontem, com alívio parcial por uma hora.', ['Sem tentativa de tratamento', 'Alívio parcial', 'Sem resposta', 'Efeito indesejado']],
    ['percepcao_paciente', 'Preocupações e expectativas do paciente', 'Preocupa-se com a persistência da dor e deseja voltar ao trabalho.', ['Esclarecer sintomas', 'Controlar sintomas', 'Rever tratamento', 'Retomar atividades']],
  ],
  doencas_cronicas: [
    ['diagnostico_tempo', 'Diagnósticos: data e forma de confirmação', 'Hipertensão diagnosticada em consulta há oito anos.', ['Diagnóstico documentado', 'Diagnóstico referido', 'Data desconhecida']],
    ['controle_complicacoes', 'Controle, acompanhamento e complicações', 'Acompanhamento semestral; refere medidas domiciliares disponíveis para revisão.', ['Acompanhamento regular', 'Acompanhamento interrompido', 'Complicação prévia relatada']],
  ],
  cirurgias_internacoes: [
    ['cirurgia_detalhes', 'Procedimento, motivo e data', 'Colecistectomia por cálculos em 2020, segundo relato.', ['Cirurgia eletiva', 'Cirurgia de urgência', 'Internação clínica']],
    ['complicacoes_procedimentos', 'Complicações cirúrgicas ou anestésicas', 'Relata náusea após anestesia; demais intercorrências desconhecidas.', ['Nega complicações conhecidas', 'Reação anestésica relatada', 'Infecção pós-operatória relatada']],
  ],
  alergias: [
    ['alergia_agente', 'Alergia: agente suspeito ou confirmado', 'Amoxicilina, segundo relato do paciente; documentação não disponível.', ['Medicamento', 'Alimento', 'Látex', 'Outro agente']],
    ['alergia_reacao', 'Alergia: manifestação e gravidade relatada', 'Urticária e edema labial após uso do medicamento.', ['Urticária', 'Edema', 'Dificuldade respiratória', 'Reação cutânea', 'Reação desconhecida']],
    ['alergia_tempo', 'Alergia: intervalo, data e atendimento recebido', 'Reação cerca de uma hora após a dose em 2022; atendido em pronto-socorro.', ['Reação imediata relatada', 'Reação tardia relatada', 'Intervalo desconhecido']],
    ['alergia_confirmacao', 'Alergia: fonte e confirmação', 'Registro de alergista apresentado; agente identificado no documento.', ['Somente relato', 'Registro médico apresentado', 'Investigação em andamento']],
  ],
  medicamentos_continuos: [
    ['medicamento_regime', 'Medicamento: nome, dose, via e frequência', 'Medicamento referido: losartana, 50 mg, via oral, uma vez ao dia. Exemplo de registro, não de prescrição.', ['Receita apresentada', 'Embalagens apresentadas', 'Informação verbal']],
    ['medicamento_adesao', 'Adesão e dificuldades de uso', 'Refere esquecer duas doses por semana por mudança de rotina.', ['Uso conforme relato da prescrição', 'Esquecimento', 'Dificuldade de acesso', 'Interrompido por conta própria']],
    ['medicamento_ultima_dose', 'Última dose, automedicação e efeitos percebidos', 'Última dose às 8h; nega automedicação quando perguntado.', ['Última dose conhecida', 'Horário desconhecido', 'Automedicação relatada', 'Efeito indesejado relatado']],
  ],
  vacinacao: [
    ['vacina_registro', 'Vacinas: doses, datas e fonte', 'Caderneta consultada; registrar vacina, dose e data de cada aplicação.', ['Confirmado em caderneta', 'Relato do paciente', 'Dados indisponíveis']],
  ],
  ginecologico_obstetrico: [
    ['dum', 'Data da última menstruação, quando aplicável', 'Primeiro dia da última menstruação: 10/09/2026.', undefined, 'date'],
    ['ciclo', 'Ciclo: intervalo, duração e fluxo', 'Ciclos a cada 28 dias, cinco dias de sangramento, fluxo moderado.', ['Regular', 'Irregular', 'Amenorreia', 'Menopausa relatada']],
    ['gestacao_possibilidade', 'Gestação: possibilidade e informação disponível', 'Paciente relata possibilidade de gestação; nenhum teste apresentado.', ['Possibilidade relatada', 'Gestação confirmada por documento', 'Nega possibilidade', 'Não avaliado']],
    ['obstetrico_detalhes', 'Gestações, partos, perdas e intercorrências', 'Duas gestações, dois partos vaginais; nega intercorrências quando perguntado.', ['Parto vaginal', 'Cesárea', 'Perda gestacional relatada', 'Sem gestação prévia']],
    ['contracepcao', 'Contracepção e planejamento reprodutivo', 'Refere uso de preservativo; deseja discutir planejamento reprodutivo.', ['Preservativo', 'Método hormonal', 'DIU', 'Sem método', 'Prefere não informar']],
  ],
  doencas_primeiro_grau: [
    ['familiar_parentesco', 'Familiar, doença e idade de início', 'Pai com diabetes diagnosticado aos 55 anos.', ['Pai', 'Mãe', 'Irmão ou irmã', 'Filho ou filha']],
    ['familiar_obitos', 'Óbitos familiares: idade e causa conhecida', 'Mãe faleceu aos 80 anos; causa não conhecida pelo paciente.', ['Causa documentada', 'Causa referida', 'Causa desconhecida']],
  ],
  tabagismo_completo: [
    ['tabaco_produto', 'Tabaco: produto e forma de uso', 'Refere uso de cigarro industrializado desde os 20 anos.', ['Cigarro', 'Cigarro eletrônico', 'Charuto', 'Cachimbo', 'Narguilé']],
    ['tabaco_cigarros_dia', 'Tabaco: cigarros por dia', 'Consumo médio referido de 10 cigarros por dia.', undefined, 'integer', 'cigarros/dia'],
    ['tabaco_anos', 'Tabaco: anos de uso', 'Fumou durante 12 anos; descrever interrupções se houver.', undefined, 'decimal', 'anos'],
    ['tabaco_cessacao', 'Tabaco: interrupções e data de cessação', 'Parou em 2021, sem recaídas relatadas.', ['Uso atual', 'Cessação mantida', 'Recaída relatada', 'Tentativa de cessação']],
  ],
  etilismo_audit: [
    ['alcool_quantidade', 'Álcool: bebida, volume e frequência', 'Relata duas latas de cerveja de 350 mL aos sábados.', ['Cerveja', 'Vinho', 'Destilado', 'Não consome']],
    ['alcool_repercussao', 'Álcool: repercussões e último consumo', 'Último consumo há uma semana; refere impacto no sono após beber.', ['Sem repercussão relatada', 'Impacto no trabalho', 'Impacto familiar', 'Uso anterior']],
  ],
  atividade_fisica: [
    ['atividade_dose', 'Atividade: modalidade, duração e frequência', 'Caminha 30 minutos, três dias por semana.', ['Caminhada', 'Musculação', 'Atividade doméstica', 'Sem atividade regular']],
  ],
  sono: [
    ['sono_duracao', 'Sono: horários e duração', 'Deita às 23h, acorda às 6h, com dois despertares.', ['Horário regular', 'Horário variável', 'Trabalho em turnos']],
    ['sono_respiracao', 'Sono: roncos, pausas e sonolência diurna', 'Acompanhante relata roncos; paciente refere sonolência à tarde.', ['Roncos', 'Pausas presenciadas', 'Sonolência diurna', 'Nega esses sintomas']],
  ],
  constitucionais_febre: [
    ['febre_medida', 'Febre: maior temperatura, método e horário', 'Temperatura axilar de 38,2 °C ontem às 20h, aferida em casa.', ['Aferição axilar', 'Aferição oral', 'Aferição timpânica', 'Sem aferição']],
    ['febre_padrao', 'Febre: duração, padrão e sintomas associados', 'Picos vespertinos há três dias, com calafrios.', ['Intermitente', 'Persistente', 'Vespertina', 'Com calafrios']],
  ],
  constitucionais_peso: [
    ['peso_variacao', 'Peso: valor anterior, atual e intervalo', 'Peso referido passou de 70 para 66 kg em três meses, sem dieta.', ['Variação aferida', 'Variação referida', 'Intervalo desconhecido']],
  ],
  pele_lesoes: [
    ['lesao_distribuicao', 'Lesão: localização, distribuição e evolução', 'Placas pruriginosas em ambos os antebraços há duas semanas.', ['Localizada', 'Disseminada', 'Simétrica', 'Assimétrica']],
    ['lesao_morfologia', 'Lesão: cor, tamanho, superfície e bordas', 'Placa eritematosa de 2 cm, bordas delimitadas e superfície descamativa.', ['Eritematosa', 'Hiperpigmentada', 'Descamativa', 'Ulcerada']],
  ],
  visao: [
    ['visao_lateralidade', 'Visão: lado, início e sintomas associados', 'Embaçamento no olho esquerdo há três dias, sem dor relatada.', ['Olho direito', 'Olho esquerdo', 'Bilateral', 'Início súbito', 'Início gradual']],
  ],
  audicao: [
    ['audicao_detalhes', 'Audição: lado, exposição e evolução', 'Zumbido bilateral intermitente após exposição ocupacional a ruído.', ['Direita', 'Esquerda', 'Bilateral', 'Exposição a ruído']],
  ],
  cv_palpitacoes: [
    ['palpitacoes_episodios', 'Palpitações: duração, gatilhos e sintomas associados', 'Episódios de cinco minutos após café, sem perda de consciência relatada.', ['Início súbito', 'Início gradual', 'Com esforço', 'Em repouso']],
  ],
  cv_dispneia_esforcos: [
    ['dispneia_limiar', 'Dispneia: esforço que desencadeia o sintoma', 'Precisa parar após caminhar um quarteirão em terreno plano.', ['Ao subir escadas', 'Ao caminhar no plano', 'Ao vestir-se', 'Em repouso']],
    ['dispneia_decubito', 'Dispneia: decúbito e episódios noturnos', 'Dorme com três travesseiros e relata despertar por falta de ar.', ['Ortopneia', 'Dispneia paroxística noturna', 'Nega piora ao deitar']],
  ],
  cv_edema_mmii: [
    ['edema_caracteristicas', 'Edema: lado, extensão, horário e dor', 'Edema bilateral até os tornozelos, indolor, pior ao entardecer.', ['Unilateral', 'Bilateral', 'Doloroso', 'Indolor']],
  ],
  cv_sincope: [
    ['sincope_contexto', 'Síncope: contexto, pródromos e recuperação', 'Perda breve de consciência após ficar em pé, precedida de náusea; recuperação completa relatada.', ['Durante esforço', 'Após levantar', 'Com pródromos', 'Sem pródromos relatados']],
  ],
  resp_tosse: [
    ['tosse_duracao', 'Tosse: início, frequência e fatores associados', 'Tosse seca há cinco dias, pior à noite e ao deitar.', ['Diurna', 'Noturna', 'Após alimentação', 'Com esforço']],
  ],
  resp_expectoracao: [
    ['escarro_caracteristicas', 'Escarro: quantidade, cor, odor e sangue', 'Pequena quantidade de escarro amarelado pela manhã, sem sangue relatado.', ['Pequena quantidade', 'Grande quantidade', 'Odor forte', 'Estrias de sangue']],
  ],
  tgi_disfagia: [
    ['disfagia_progressao', 'Disfagia: consistência, localização e progressão', 'Dificuldade progressiva para sólidos há um mês, percebida retroesternalmente.', ['Orofaríngea referida', 'Retrosternal referida', 'Progressiva', 'Intermitente']],
  ],
  tgi_nauseas_vomitos: [
    ['vomito_frequencia', 'Vômitos: episódios, conteúdo e tolerância oral', 'Três episódios alimentares hoje; consegue ingerir pequenos volumes de água.', ['Alimentar', 'Bilioso', 'Com sangue', 'Mantém líquidos', 'Não tolera líquidos']],
  ],
  tgi_habito_intestinal: [
    ['fezes_padrao', 'Fezes: frequência, consistência e aspecto', 'Quatro evacuações líquidas por dia há dois dias, sem sangue referido.', ['Endurecidas', 'Formadas', 'Pastosas', 'Líquidas', 'Com muco', 'Com sangue']],
  ],
  gu_disuria: [
    ['urinario_padrao', 'Micção: início, frequência, volume e dor', 'Ardor ao final da micção há dois dias, com aumento da frequência.', ['Ardor inicial', 'Ardor terminal', 'Urgência', 'Redução do volume referido']],
  ],
  gu_corrimento: [
    ['corrimento_caracteristicas', 'Corrimento: aspecto, odor e sintomas associados', 'Corrimento esbranquiçado há uma semana, associado a prurido.', ['Claro', 'Esbranquiçado', 'Amarelado', 'Com odor', 'Com prurido']],
  ],
  msk_artralgia: [
    ['articular_distribuicao', 'Articulações: distribuição e simetria', 'Dor em punhos e articulações das mãos, bilateralmente.', ['Uma articulação', 'Poucas articulações', 'Múltiplas articulações', 'Simétrica', 'Assimétrica']],
    ['rigidez_duracao', 'Articulações: rigidez e relação com atividade', 'Rigidez de cerca de 40 minutos ao acordar, com melhora após movimentar-se.', ['Matinal', 'Após repouso', 'Piora com movimento', 'Melhora com movimento']],
  ],
  neuro_cefaleia: [
    ['cefaleia_temporal', 'Cefaleia: início, tempo até o pico e evolução', 'Início gradual ao longo de duas horas, semelhante a episódios anteriores.', ['Súbita', 'Gradual', 'Primeiro episódio', 'Padrão habitual', 'Mudança de padrão']],
    ['cefaleia_associados', 'Cefaleia: manifestações associadas', 'Fotofobia e náusea durante o episódio, sem vômitos relatados.', ['Fotofobia', 'Fonofobia', 'Náusea', 'Febre', 'Alteração visual', 'Déficit focal relatado']],
  ],
  neuro_parestesias: [
    ['sensitivo_distribuicao', 'Parestesias: território, lado e duração', 'Formigamento nos três primeiros dedos da mão direita, intermitente há um mês.', ['Unilateral', 'Bilateral', 'Distal', 'Em faixa', 'Intermitente', 'Contínua']],
  ],
  neuro_convulsoes: [
    ['crise_descricao', 'Evento: descrição da testemunha e recuperação', 'Testemunha refere movimentos dos membros por um minuto, seguidos de sonolência.', ['Movimentos focais', 'Movimentos bilaterais', 'Confusão após evento', 'Descrição indisponível']],
  ],
  psiquiatrico_humor: [
    ['humor_duracao', 'Humor: duração, repercussão e contexto', 'Tristeza diária há três semanas, com redução de interesse no trabalho.', ['Humor persistente', 'Humor oscilante', 'Impacto funcional', 'Evento estressor']],
  ],
  psiquiatrico_ideacao_suicida: [
    ['risco_entrevista', 'Avaliação de segurança: relato, contexto e suporte', 'Registrar as palavras do paciente, temporalidade, presença ou ausência de plano quando investigada e suporte disponível.', ['Avaliado na entrevista', 'Avaliação incompleta', 'Não foi possível avaliar']],
    ['risco_conduta', 'Avaliação de segurança: conduta adotada pelo profissional', 'Registrar quem avaliou, medidas adotadas, contatos assistenciais e seguimento definido.', ['Avaliação presencial registrada', 'Suporte acionado', 'Seguimento documentado']],
  ],
  estado_geral: [
    ['orientacao', 'Consciência, orientação e interação', 'Alerta, orientado em pessoa e local, responde às perguntas.', ['Alerta', 'Sonolento', 'Orientado', 'Desorientado', 'Interação limitada']],
  ],
  glasgow: [
    ['glasgow_componentes', 'Glasgow: componentes e limitações do exame', 'Abertura ocular 4, resposta verbal 5, resposta motora 6; sem fator limitante identificado.', ['Componentes testáveis', 'Intubação', 'Sedação', 'Barreira de comunicação']],
  ],
  pressao_arterial: [
    ['pa_contexto', 'Pressão: posição, membro, manguito e repetição', 'Sentado, braço direito, manguito adequado à circunferência; segunda medida após repouso.', ['Sentado', 'Deitado', 'Em pé', 'Braço direito', 'Braço esquerdo']],
  ],
  fc_pulso: [
    ['fc_medida', 'Frequência cardíaca aferida', 'Frequência cardíaca de 78 batimentos por minuto.', undefined, 'integer', 'bpm'],
  ],
  fr_ritmo_respiratorio: [
    ['fr_medida', 'Frequência respiratória aferida', 'Frequência respiratória de 18 incursões por minuto.', undefined, 'integer', 'irpm'],
  ],
  temperatura: [
    ['temperatura_local', 'Temperatura: local e horário da aferição', 'Axilar, às 14h30, durante a consulta.', ['Axilar', 'Oral', 'Timpânica', 'Retal', 'Temporal']],
  ],
  spo2: [
    ['oxigenio_contexto', 'Oximetria: suporte de oxigênio e condições', 'SpO₂ aferida em ar ambiente, em repouso, com sinal estável.', ['Ar ambiente', 'Cateter nasal', 'Máscara', 'Ventilação mecânica', 'Sinal instável']],
    ['oxigenio_fluxo', 'Oxigênio: fluxo ou fração inspirada registrada', 'Em cateter nasal com fluxo registrado de 2 L/min.', ['Fluxo em L/min', 'FiO₂ em %', 'Não informado']],
  ],
  antropometria: [
    ['peso_kg', 'Peso aferido', 'Peso medido de 72,5 kg.', undefined, 'decimal', 'kg'],
    ['altura_cm', 'Altura aferida', 'Altura medida de 168 cm.', undefined, 'decimal', 'cm'],
    ['cintura_cm', 'Circunferência da cintura', 'Circunferência medida de 88 cm; descrever técnica se necessário.', undefined, 'decimal', 'cm'],
  ],
  pele_lesoes_elementares: [
    ['lesao_exame', 'Lesão examinada: dimensões, bordas, base e secreção', 'Úlcera de 1 × 2 cm no maléolo medial direito, com pequena secreção serosa.', ['Bordas regulares', 'Bordas irregulares', 'Base limpa', 'Exsudato', 'Necrose']],
  ],
  carotidas_linfonodos_cervicais: [
    ['linfonodo_exame', 'Linfonodo: cadeia, tamanho, consistência e mobilidade', 'Linfonodo cervical posterior esquerdo de 1 cm, móvel, fibroelástico, indolor.', ['Móvel', 'Aderido', 'Doloroso', 'Indolor', 'Fibroelástico', 'Endurecido']],
  ],
  pulmao_ausculta_ruidos: [
    ['pulmao_topografia', 'Ausculta pulmonar: topografia e simetria', 'Estertores finos em base direita, ao final da inspiração.', ['Ápices', 'Bases', 'Direita', 'Esquerda', 'Bilateral', 'Difusa']],
    ['pulmao_fase', 'Ruídos: fase respiratória e resposta à tosse', 'Roncos expiratórios que se modificam após a tosse.', ['Inspiratório', 'Expiratório', 'Bifásico', 'Modifica após tosse']],
  ],
  cv_ausculta_bulhas: [
    ['sopro_foco', 'Sopro: foco, tempo e irradiação', 'Sopro sistólico em foco mitral com irradiação para axila.', ['Aórtico', 'Pulmonar', 'Tricúspide', 'Mitral', 'Sistólico', 'Diastólico']],
    ['sopro_intensidade', 'Sopro: intensidade, timbre e manobras', 'Sopro 2/6, suave; registrar variação observada nas manobras realizadas.', ['Grau 1/6', 'Grau 2/6', 'Grau 3/6', 'Grau 4/6', 'Grau 5/6', 'Grau 6/6']],
  ],
  abdome_palpacao: [
    ['abdome_dor_local', 'Palpação abdominal: localização e defesa', 'Dor superficial em epigástrio, sem defesa nos locais examinados.', ['Epigástrio', 'Hipocôndrio direito', 'Fossa ilíaca direita', 'Difusa', 'Defesa localizada']],
    ['abdome_massa', 'Massa abdominal: localização, tamanho e características', 'Massa palpável em flanco esquerdo, cerca de 3 cm, móvel e indolor.', ['Móvel', 'Fixa', 'Dolorosa', 'Indolor', 'Pulsátil']],
  ],
  abdome_manobras_especiais: [
    ['abdome_manobra_resultado', 'Manobras: nome, lado e resultado observado', 'Giordano doloroso à direita; demais manobras não realizadas.', ['Positivo', 'Negativo', 'Inconclusivo', 'Não realizado']],
  ],
  gu_inspecao_genitais: [
    ['exame_intimo_contexto', 'Exame íntimo: indicação, consentimento e acompanhante', 'Indicação explicada, consentimento verbal registrado e acompanhante presente conforme preferência.', ['Consentimento registrado', 'Exame recusado', 'Exame adiado', 'Acompanhante presente']],
  ],
  msk_forca_muscular_mrc: [
    ['forca_distribuicao', 'Força: grupo muscular, lado e graduação', 'Extensão do joelho 5/5 à direita e 4/5 à esquerda.', ['Direita', 'Esquerda', 'Bilateral', 'Proximal', 'Distal', 'Limitada por dor']],
  ],
  neuro_nervos_cranianos: [
    ['pares_testados', 'Pares cranianos: quais foram examinados e achados', 'Pares III, IV e VI: motilidade ocular conjugada, sem diplopia durante o teste.', ['II', 'III, IV e VI', 'V', 'VII', 'VIII', 'IX e X', 'XI', 'XII']],
  ],
  neuro_reflexos_profundos: [
    ['reflexos_graduacao', 'Reflexos: local, lado e graduação', 'Reflexos patelares 2+/4 bilateralmente.', ['Bicipital', 'Tricipital', 'Patelar', 'Aquileu', 'Cutâneo-plantar']],
  ],
  hipoteses_principais: [
    ['problemas_ativos', 'Lista de problemas ativos e prioridades', 'Dor lombar há dois dias com limitação funcional; demais problemas descritos separadamente.', ['Problema agudo', 'Problema crônico', 'Problema em investigação']],
    ['hipotese_fundamentacao', 'Elementos que sustentam ou limitam a hipótese', 'Registrar achados pertinentes, dados ausentes e exames disponíveis que motivaram a avaliação.', ['História clínica', 'Exame físico', 'Exame complementar', 'Informação ainda insuficiente']],
    ['diagnosticos_diferenciais', 'Hipóteses diferenciais consideradas', 'Registrar alternativas consideradas e os dados utilizados na comparação.', ['Considerada', 'Em investigação', 'Menos provável na avaliação']],
  ],
  exames_complementares: [
    ['exame_justificativa', 'Exame: indicação e pergunta clínica', 'Registrar o exame solicitado, a indicação e a dúvida que pretende esclarecer.', ['Solicitado nesta consulta', 'Exame prévio revisado', 'Aguardando resultado']],
    ['exame_resultados', 'Resultados: data, valores e referência do laboratório', 'Resultado de 20/10/2026; transcrever valor, unidade e intervalo fornecido pelo laboratório.', ['Laudo apresentado', 'Resultado verbal', 'Laudo não disponível']],
  ],
  prescricao_inicial: [
    ['prescricao_detalhes', 'Prescrição: duração, orientações e revisão', 'Registrar a prescrição definida pelo profissional, duração planejada e instruções fornecidas.', ['Prescrição revisada', 'Orientações fornecidas', 'Duração registrada']],
  ],
  plano_cuidados: [
    ['orientacoes_retorno', 'Orientações de retorno e compreensão', 'Registrar as orientações individualizadas, os motivos para reavaliação e a compreensão demonstrada.', ['Orientação verbal', 'Orientação escrita', 'Compreensão verificada']],
    ['seguimento', 'Seguimento: prazo, local e responsável', 'Retorno combinado em sete dias na unidade de origem; responsável pelo seguimento registrado.', ['Retorno agendado', 'Aguardando agendamento', 'Seguimento compartilhado']],
    ['decisao_compartilhada', 'Preferências e decisões compartilhadas', 'Alternativas discutidas; paciente concorda com o plano e informa suas preferências.', ['Paciente participou', 'Acompanhante participou', 'Preferências registradas']],
  ],
  encaminhamentos: [
    ['encaminhamento_motivo', 'Encaminhamento: destino, motivo e prioridade definida', 'Registrar especialidade, dúvida clínica e prioridade estabelecida pelo profissional.', ['Rotina', 'Prioritário conforme avaliação', 'Urgência conforme avaliação']],
  ],
};

const numericBounds: Record<string, [number, number]> = {
  dor_intensidade: [0, 10], spo2: [0, 100], temperatura: [20, 50],
  fc_medida: [0, 350], fr_medida: [0, 150], peso_kg: [0.1, 700],
  altura_cm: [20, 280], cintura_cm: [10, 400], tabaco_cigarros_dia: [0, 200], tabaco_anos: [0, 120],
};

export function prepareQuestionnaire(source: Questionnaire, expand = false): Questionnaire {
  const item = source.item.flatMap((original): QuestionnaireItem[] => {
    const key = original.linkId.split('/').at(-1)!;
    const isExam = original.linkId.includes('/exame_fisico/');
    const options = original.answerOption?.map(option => option.valueCoding?.display || option.valueString || '').filter(Boolean);
    const defaultHelp = isExam
      ? 'Registre a técnica, o local, o lado e os achados efetivamente examinados. Se não realizou o exame, deixe em branco ou informe isso.'
      : original.linkId.includes('/ros/')
        ? 'Caracterize início, duração, frequência, localização, fatores associados e impacto. Registre negativas apenas quando investigadas.'
        : 'Registre o que foi informado ou observado, incluindo a fonte e a data quando relevantes. Este item é opcional.';
    const base: QuestionnaireItem = {
      ...original,
      required: false,
      repeats: original.multiselect || original.repeats || undefined,
      helpText: original.helpText || defaultHelp,
      example: original.example || original.placeholder?.replace(/^ex:\s*/i, '') || (options?.length ? `Selecione a opção correspondente ao relato, por exemplo: “${options[0]}”.` : original.type === 'date' ? 'Data informada: 15/06/1980.' : 'Descreva o achado, sua localização e o contexto em que foi observado.'),
      suggestions: ['string', 'text'].includes(original.type) ? suggestions[key] || ['Não avaliado', 'Não foi possível obter a informação'] : undefined,
      exclusiveOptions: original.answerOption?.filter(o => /^(nega|nenhum|sem |não sabe|não informado)/i.test(o.valueCoding?.display || o.valueString || '')).map(o => o.valueCoding?.code || o.valueString || ''),
      ...(numericBounds[key] ? { minValue: numericBounds[key][0], maxValue: numericBounds[key][1] } : {}),
    };
    const children = expand ? (details[key] || []).map(([id, title, example, options, type, unit], index): QuestionnaireItem => ({
      linkId: `${original.linkId.slice(0, original.linkId.lastIndexOf('/'))}/${id}`,
      parentLinkId: original.linkId,
      parentText: original.text.replace(/:$/, ''),
      prefix: `${original.prefix || ''}.${index + 1}`,
      category: original.category,
      text: title,
      type: type || 'text',
      required: false,
      example,
      placeholder: type ? undefined : 'Descreva ou use uma das sugestões abaixo…',
      helpText: type ? `Informe ${unit ? `o valor em ${unit}` : 'a data'} ou deixe em branco.` : 'Use as opções como ponto de partida e complemente os detalhes relevantes para este atendimento.',
      suggestions: options,
      unit,
      ...(numericBounds[id] ? { minValue: numericBounds[id][0], maxValue: numericBounds[id][1] } : {}),
    })) : [];
    return [base, ...children];
  });
  return { ...source, version: '3.0.0', date: '2026-10-21', item,
    description: `${item.length} itens opcionais${expand ? ', com subitens para caracterização clínica' : ''}. Preencha apenas o que for pertinente ao atendimento.` };
}
