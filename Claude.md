# .anamform — Documentação Técnica e Clínica

**Versão:** 2.0.0  
**Padrões:** HL7 FHIR R4 · openEHR EHRbase (CISTEC) · Typeform Design System (Echo)  
**Semiologia Médica:** Porto (8ª ed.), Bates (12ª ed.), Rocco (2ª ed.)  

---

## 1. Visão Geral e Propósito

O **.anamform** é uma aplicação web médica *mobile-first* projetada para transformar a coleta de anamnese clínica e exame físico em uma experiência conversacional fluida, sem atrito, com foco estrito em **uma pergunta por vez** (paradigma Typeform).

Ao mesmo tempo em que oferece uma interface limpa, rápida e acessível para o paciente e para o médico examinador, o sistema garante conformidade rigorosa com os mais elevados padrões globais de interoperabilidade em saúde:
- **HL7 FHIR R4 (`Questionnaire` e `QuestionnaireResponse`)**: Estrutura universal de perguntas e respostas em saúde digital.
- **openEHR / EHRbase**: Utilização da convenção CISTEC Web Template que traduz `linkId` do FHIR em caminhos planos (*FLAT paths*), permitindo a ingestão direta de composições no EHRbase (`openEHR-EHR-COMPOSITION.encounter.v1`).
- **Resumo Clínico para PEP**: Geração automática de notas de admissão hospitalar e prontuário ambulatorial formatadas segundo as normas do CFM e boas práticas assistenciais.

---

## 2. Arquitetura de Interface (Mobile-First)

Atendendo às diretrizes de ergonomia médica hospitalar e uso em tablets e smartphones à beira do leito (*point of care*):

### 2.1 Barra Superior Minimalista (Distraction-Free)
- Logo discreto com indicador semântico `FHIR R4`.
- Indicador da seção semiológica em andamento.
- Porcentagem de progresso em tempo real.
- **Zero poluição visual**: botões de teste, design e seletores de modelos foram movidos para a aba de Ajustes.

### 2.2 Barra de Navegação Inferior (*Mobile Bottom Bar*)
Fixada na base da tela para acesso ergonômico com os polegares:
1. **Coleta**: O formulário interativo Typeform, com transições suaves (`motion/react`), microinterações, atalhos de teclado e ditado por voz.
2. **Índice (144 Itens)**: Gaveta lateral deslizante que agrupa todas as 29 seções semiológicas, permitindo ao médico checar o status de preenchimento e saltar diretamente para qualquer item.
3. **Prontuário (PEP)**: Visualização da nota clínica completa estruturada, com banners de alerta de segurança do paciente (Alergias graves destacadas em vermelho, Dor severa EVA $\ge 7$) e botões de cópia e impressão.
4. **Ajustes**: Painel centralizado que consolida:
   - Carregamento de caso clínico de exemplo com 1 clique (Dr. Marcos Aurélio - Síndrome Coronariana Aguda).
   - Seletor de modelos de questionário (Hospitalar Completo, Ambulatorial Rápido, Protocolo de Dor Torácica).
   - Customizador de design (fontes, cores, tamanho Sm/Md/Lg e alinhamento).
   - Console de interoperabilidade com visualizador de JSON (FHIR QuestionnaireResponse, openEHR FLAT, EHRbase e Bahmni) e simulador de transmissão HTTP 201.
   - Limpeza e reinício de rascunhos.

---

## 3. Roteiro Semiológico Exaustivo (144 Itens)

O questionário hospitalar expandido foi estruturado em **4 Grandes Partes e 29 Seções**, cobrindo 144 itens fundamentados nos manuais de **Porto, Bates e Rocco**:

### PARTE I — ANAMNESE (HISTÓRIA CLÍNICA) [Itens 1 a 35]
- **1. Identificação e Dados Demográficos (1 a 10):**
  1. Nome completo (obrigatório)
  2. Data de nascimento / Idade (com cálculo automático)
  3. Sexo biológico (Feminino / Masculino / Intersexo)
  4. Estado civil
  5. Profissão / Ocupação habitual (LER/DORT, pneumoconioses)
  6. Naturalidade e Procedência (endemias regionais)
  7. Escolaridade
  8. Religião e Crenças (dietas, hemotransfusões)
  9. Filhos / Gestas e Paridade (G_P_A_)
  10. Contato de emergência / Acompanhante no leito
- **2. Queixa Principal e HDA (11 a 15):**
  11. Queixa Principal (palavras do paciente)
  12. Duração dos sintomas (Hiperagudo <6h, Agudo 6-24h, Subagudo 2-7d, Crônico >2sem)
  13. Caracterização semiológica da dor (Localização, tipo, intensidade EVA 0-10, fatores desencadeantes/alívio, sintomas associados)
  14. Relato cronológico detalhado da HDA (com suporte a microfone para ditado por voz)
  15. Impacto funcional nas atividades de vida diária (AVDs), trabalho e sono
- **3. Antecedentes Pessoais (AP) (16 a 25):**
  16. Doenças crônicas diagnosticadas (HAS, DM, dislipidemia, asma/DPOC, DRC, neoplasias)
  17. Eventos cardiovasculares prévios (IAM, AVC, AIT, revascularização)
  18. Cirurgias e internações prévias
  19. Alergias a medicamentos, alimentos ou contato (**Alerta crítico de segurança**)
  20. Histórico psiquiátrico
  21. Histórico vacinal
  22. Histórico gineco-obstétrico
  23. Medicamentos em uso contínuo (nome, dose, horários e adesão)
  24. Fitoterápicos e suplementos (interações)
  25. Histórico transfusional
- **4. Antecedentes Familiares (AF) (26 a 28):**
  26. Doenças em familiares de 1º grau (cardiovasculares, metabólicas, neoplásicas)
  27. Consanguinidade dos pais (doenças recessivas)
  28. Histórico de morte súbita precoce na família
- **5. Hábitos e Estilo de Vida (29 a 35):**
  29. Tabagismo e Carga Tabágica calculada em anos-maço: `(cigarros/dia ÷ 20) × anos`
  30. Etilismo (rastreio CAGE/AUDIT)
  31. Atividade física regular
  32. Padrão alimentar e restrições
  33. Padrão do sono e rastreio de SAOS / roncos
  34. Saúde mental e nível de estresse ocupacional
  35. Uso de substâncias psicoativas / drogas recreacionais

### PARTE II — REVISÃO POR SISTEMAS (ROS) [Itens 36 a 88]
- **6. Sintomas Constitucionais:** Febre, perda de peso involuntária (kg), astenia/fadiga, alteração do apetite.
- **7. Pele e Anexos:** Lesões elementares (Porto), prurido, alterações de fâneros.
- **8. Cabeça e Pescoço:** Acuidade visual, audição/zumbidos/vertigem, orofaringe/disfagia, rinologia.
- **9. Sistema Cardiovascular:** Precordialgia com esforço, palpitações, dispneia de esforço, ortopneia, edema MMII com sinal de Cacifo (Porto), síncope, claudicação intermitente.
- **10. Sistema Respiratório:** Tosse, expectoração/hemoptise, sibilância, dor pleurítica, rastreio de tuberculose.
- **11. Sistema Gastrointestinal:** Disfagia alta/baixa, náuseas/vômitos/hematêmese, dor abdominal, hábito intestinal, icterícia/colúria/acolia.
- **12. Sistema Geniturinário:** Disúria/polaciúria, hematúria/proteinúria, noctúria, corrimentos, disfunção sexual.
- **13. Sistema Musculoesquelético:** Artralgias/artrites com rigidez matinal, mialgias, dores axiais, limitação funcional.
- **14. Sistema Neurológico:** Cefaleia e sinais de alarme, tonturas, parestesias em dermátomos, convulsões, marcha e tremores.
- **15. Sistema Hematolinfopoiético:** Diátese hemorrágica (petéquias, gengivorragia), adenomegalias periféricas, palidez.
- **16. Sistema Endócrino:** Sintomas cardinais do DM (4Ps), disfunção tireoidiana, alterações hormonais.
- **17. Sistema Imunológico:** Atopia (rinite, asma, eczema), reações imunomediadas, infecções de repetição.
- **18. Sistema Psiquiátrico:** Humor e anedonia, ansiedade, rastreio ativo de ideação suicida.

### PARTE III — EXAME FÍSICO COMPLETO (IPPA) [Itens 89 a 137]
- **19. Ectoscopia e Sinais Vitais:** Estado geral (BEG/REG/PEG), Escala de Coma de Glasgow (3-15), fácies, atitude/postura (ortopneica, Bates/Rocco), Pressão Arterial bilateral, FC e características de pulso (Porto), FR e padrão respiratório (Cantani, Kussmaul, Biot, Cheyne-Stokes — Rocco), Temperatura axilar, Saturação de O2 e Antropometria (IMC e CA).
- **20. Pele e Anexos:** Coloração, turgor e hidratação, lesões elementares (Porto), fâneros, Tempo de Enchimento Capilar (TEC < 2s — Bates).
- **21. Cabeça e Pescoço:** Crânio, pupilas fotorreagentes, mucosa oral e dentição, tireoide, turgência jugular a 45°, ausculta de carótidas e cadeias ganglionares cervicais (Porto).
- **22. Tórax e Sistema Respiratório (IPPA — Rocco):** Inspeção estática (tórax chato, tonel, cifótico, pectus excavatum/carinatum), inspeção dinâmica (tiragens), palpação de Frêmito Toracovocal (FTV) e manobras de Rualt e Lásegue, percussão digito-digital (som claro pulmonar, macicez), ausculta pulmonar e ressonância vocal (broncofonia, egofonia, pectorilóquia).
- **23. Sistema Cardiovascular (Bates):** Inspeção do precórdio, palpação do ictus cordis (espaço intercostal, polpas digitais, mobilidade), percussão de macicez cardíaca, ausculta em 2 tempos com bulhas B1/B2, pesquisa de B3/B4 e sopros, manobras especiais (decúbito lateral esquerdo e manobra de Rivero-Carvallo).
- **24. Abdômen (Sequência Semiotécnica I-A-P-P — Rocco/Bates):** 
  1. *Inspeção*: forma, cicatrizes, circulação colateral, hérnias;
  2. *Ausculta* (antes de palpar/percutir): Ruídos Hidroaéreos (RHA) e sopros arteriais em aorta abdominal;
  3. *Percussão*: timpanismo difuso, hepatimetria (cm), espaço de Traube, sinal de Piparote para ascite;
  4. *Palpação superficial e profunda*: tensão de parede, dor, visceromegalias (fígado e baço);
  5. *Manobras especiais*: Murphy (colecistite), Blumberg (peritonite), Giordano (pielonefrite), McBurney, Rovsing e Psoas (apendicite aguda).
- **25. Geniturinário e Inguinal:** Linfonodos inguinais, genitais externos e toque retal se indicado.
- **26. Musculoesquelético:** Coluna vertebral, articulações periféricas (sinovite/derrame), força muscular pela Escala MRC (Grau 0 a 5) e amplitude de movimento.
- **27. Neurológico:** Pares cranianos I a XII, coordenação apendicular (teste dedo-nariz, diadococinesia, Romberg), reflexos miotáticos profundos (++ / 4+), reflexo cutâneo-plantar (sinal de Babinski), sensibilidade e padrão da marcha (Bates), sinais de irritação meníngea (Rigidez de nuca, Brudzinski, Kernig).

### PARTE IV — SÍNTESE E CONDUTA [Itens 138 a 144]
- **28. Hipóteses Diagnósticas:** Diagnósticos principais com codificação CID-10 e diagnósticos secundários.
- **29. Conduta e Plano Terapêutico:** Exames complementares solicitados, prescrição inicial hospitalar (drogas, doses, vias e horários), orientações assistenciais, critérios de internação (UTI, UCO, Enfermaria) ou alta, e encaminhamentos para procedimentos (ex: cateterismo/CATE).

---

## 4. Padrões de Dados e Interoperabilidade

### 4.1 HL7 FHIR R4
A aplicação utiliza os recursos oficiais:
- **`Questionnaire`**: Define a árvore de perguntas com `linkId`, `type`, `required`, `answerOption` e lógica condicional `enableWhen`.
- **`QuestionnaireResponse`**: Armazena as respostas coletadas com campos tipados (`valueString`, `valueInteger`, `valueDecimal`, `valueBoolean`, `valueDate`, `valueCoding`) e referência ao paciente sujeito (`subject: Patient/...`).

### 4.2 openEHR CISTEC FLAT paths
Para máxima interoperabilidade com o **EHRbase**, cada `linkId` FHIR é nomeado segundo o padrão plano CISTEC:
- Exemplo: `anamnese/hda/queixa_principal` $\rightarrow$ `anamnese_geral/hda/queixa_principal:0/narrative`
- Exemplo: `anamnese/habitos/tabagismo` $\rightarrow$ `anamnese_geral/habitos/tabagismo:0/code`
- Exemplo: `anamnese/exame_fisico/temperatura` $\rightarrow$ `anamnese_geral/exame_fisico/temperatura:0/magnitude`

O conversor embutido (`src/utils/openehrConverter.ts`) gera a carga canônica pronta para a API REST do EHRbase:
```http
POST /ehr/{ehr_id}/composition
Content-Type: application/json

{
  "_type": "COMPOSITION",
  "archetype_node_id": "openEHR-EHR-COMPOSITION.encounter.v1",
  "name": { "_type": "DV_TEXT", "value": "Anamnese Médica Admissional" },
  "flatData": { ... }
}
```

---

## 5. Design Tokens (`DESIGN.md` Echo Variant)

| Token | Valor | Descrição |
|---|---|---|
| `brand_primary` | `#2A222B` | Preto-ameixa profundo clássico do Typeform |
| `brand_secondary` | `#FFFFFF` | Superfície e cartões brancos puros |
| `accent` | `#198754` | Verde clínico suave para barras de progresso e sucesso |
| `bg_canvas` | `#F6F4EF` | Fundo quente de papel acolhedor |
| `border_focus` | `#006BFF` | Azul cobalto de foco de acessibilidade |
| `font_display` | `Lora, Georgia, serif` | Títulos expressivos das perguntas médicas |
| `font_interface` | `Plus Jakarta Sans, Inter, sans-serif` | Tipografia límpida para respostas e opções |

---

## 6. Estrutura do Código-Fonte

```
/
├── index.html                   # Entry point com fontes Lora e Plus Jakarta Sans
├── DESIGN.md                    # Especificação formal de tokens e diretrizes
├── Claude.md                    # Documentação técnica e semiológica completa
├── metadata.json                # Metadados e permissões da aplicação
├── src/
│   ├── types/
│   │   ├── fhir.ts              # Interfaces TypeScript HL7 FHIR R4
│   │   ├── openehr.ts           # Interfaces openEHR FLAT e EHRbase
│   │   └── theme.ts             # Configurações de tema e exibição
│   ├── data/
│   │   └── questionnaires.ts    # 144 itens semiológicos e casos clínicos de exemplo
│   ├── utils/
│   │   ├── fhirValidator.ts     # Avaliação de enableWhen e construtor FHIR
│   │   ├── openehrConverter.ts  # Tradutor CISTEC FHIR -> openEHR FLAT
│   │   └── clinicalSummary.ts   # Formatador da evolução clínica para PEP
│   ├── components/
│   │   ├── Header.tsx           # Barra superior minimalista sem poluição
│   │   ├── MobileBottomNav.tsx  # Navegação inferior mobile-first (4 abas)
│   │   ├── WelcomeScreen.tsx    # Tela de abertura Typeform
│   │   ├── CompletionScreen.tsx # Tela de encerramento e síntese
│   │   ├── TypeformQuestionCard.tsx # Bloco de pergunta com atalhos e voz
│   │   ├── TypeformNavigation.tsx # Chevrons flutuantes e progresso
│   │   ├── SectionJumpModal.tsx # Gaveta lateral com os 144 itens organizados
│   │   ├── ClinicalSummaryView.tsx # Visualizador de prontuário com alertas
│   │   └── SettingsTab.tsx      # Central consolidada de ajustes e interoperabilidade
│   ├── App.tsx                  # Orquestrador de estado e fluxo
│   ├── main.tsx                 # Ponto de montagem React 19
│   └── index.css                # Tailwind CSS v4 e estilizações base
```

---

## 7. Instruções de Teste e Validação

1. **Testar com Caso Clínico Real (1 clique):**
   - Na barra de navegação inferior, toque em **Ajustes**.
   - Clique em **"Carregar Caso Exemplo"**.
   - O caso clínico de emergência cardiológica de *Dr. Marcos Aurélio* é carregado com os 144 itens preenchidos.
2. **Navegar pelo Questionário (Typeform):**
   - Na aba **Coleta**, avance utilizando `Enter ↵`, setas `↑` / `↓` ou as teclas de atalho `[A]`, `[B]`, etc.
   - Teste o botão de **Microfone** para ditar relatos em campos de texto.
3. **Explorar o Índice Completo:**
   - Na barra inferior, toque em **Índice**. Visualize o progresso em todas as 29 seções semiológicas e clique em qualquer item para saltar diretamente.
4. **Visualizar e Copiar Prontuário (PEP):**
   - Toque em **Prontuário** na barra inferior para visualizar a nota completa estruturada, os alertas de alergia medicamentosa em vermelho e os botões de **Copiar para Prontuário** ou **Imprimir**.
5. **Inspecionar FHIR R4 & openEHR EHRbase:**
   - Na aba **Ajustes**, selecione a sub-aba **Interoperabilidade** para visualizar os payloads gerados em tempo real e testar o botão **"Transmitir ao EHRbase"**.
