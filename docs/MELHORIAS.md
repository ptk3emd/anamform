# Revisão do formulário e do prontuário — 21/10/2026

O roteiro hospitalar presente no código tinha 144 perguntas, embora a solicitação mencionasse 122. A versão ampliada contém **252 itens: 144 principais e 108 subitens**, distribuídos nas 29 seções existentes. Os identificadores anteriores foram preservados para manter os rascunhos compatíveis. O modelo cardiológico passou a 20 itens; o ambulatorial permanece com 7 para conservar seu propósito de coleta breve.

## Implementado

- Nenhum campo obrigatório em nenhum dos três modelos. É possível pular, limpar respostas e encerrar a coleta em qualquer pergunta. Valores numéricos e datas, quando preenchidos, recebem validação de formato/faixa.
- Todos os itens têm orientação e exemplo. Campos narrativos oferecem sugestões editáveis; exemplos nunca são inseridos automaticamente. Subitens permanecem acessíveis mesmo quando a pergunta principal está em branco.
- Caracterização detalhada de dor, evolução, alergias, medicamentos, antecedentes, hábitos, sintomas por sistema, exame físico, hipóteses e seguimento. Os subitens têm IDs estáveis, numeração subordinada e vínculo com o item principal.
- Novo documento de leitura com CSS próprio em `src/styles/clinical-record.css`: tipografia de texto, largura de leitura, hierarquia de títulos, espaçamento, subitens, navegação por seção, edição da resposta e layouts para telas estreitas. Regras A4 de impressão preservam os títulos e removem controles.
- Texto para PEP, cópia com confirmação somente após sucesso, download em UTF-8 e impressão/PDF pelo navegador. A opção “Mostrar não preenchidos” também controla o conteúdo copiado/baixado.
- Gerador orientado pelo questionário selecionado, cobrindo todas as seções. Campos vazios não viram negativas ou achados normais; códigos de opções aparecem com seus rótulos, datas são legíveis, zero e falso são preservados.
- Removida a classificação automática de urgência sem protocolo implementado. Saturação não presume uso de ar ambiente. O relato de alergias é apresentado sem interpretar texto livre como diagnóstico ou grau de gravidade.
- Busca sem distinção de acentos por itens, subitens, grupos e opções; indicação de campos em branco sem tratá-los como obrigações; progresso calculado por respostas, não por páginas visitadas.
- Foco contido nos diálogos, retorno de foco, atalhos que respeitam botões e diálogos, interrupção real do ditado e prevenção de sobrescrita do texto digitado durante a gravação.
- Aviso quando o navegador não consegue salvar; recuperação defensiva de rascunhos inválidos; carregamento separado das telas de ajustes e prontuário.
- Exportação FHIR preserva tipos, grupos, múltiplas respostas e condições. Números inválidos não viram zero, códigos locais não ganham sistema SNOMED presumido, e não é inventado um profissional autor ou identificador do paciente.
- A simulação de EHRbase é identificada como demonstração local e não anuncia uma gravação real. Removida a opção de fundo escuro enquanto os componentes utilizam texto fixo escuro.

## Validação

`npm test` cobre campos opcionais, integridade do catálogo, subitens independentes, conteúdo do prontuário, ausência de inferências, zero/falso, códigos, datas, condições e exportação. Há também renderização real dos componentes com React no servidor para verificar estados vazios, escape de HTML, opções de navegação e escala de dor.

`npm run lint` verifica TypeScript; `npm run build` gera a versão de produção. O detector estático de design é executado sobre as interfaces alteradas.

A sessão não disponibilizou navegador para automação (inventário de navegadores vazio). Portanto, a revisão visual em desktop/mobile e a conferência física das páginas impressas permanecem sem execução; os testes de renderização não substituem essa conferência.

O detector de design apontou a fonte já adotada pelo produto e tons adicionais fora do catálogo antigo. Lora e Plus Jakarta Sans foram mantidas para preservar a identidade existente. Os tons do documento são intencionais e locais ao CSS: tinta ameixa, texto secundário opaco para contraste, divisórias neutras, verde para ações e bege para o relato de alergias, sem classificação automática de gravidade. O aviso sobre borda inferior e cantos arredondados da área de texto foi corrigido.

## Melhorias que exigem trabalho adicional

1. **Validação clínica editorial:** revisão dos roteiros e do caso demonstrativo por profissional responsável, especialmente textos legados, escalas e terminologias. Exemplos são recursos de documentação, não recomendações terapêuticas.
2. **Integração real:** configurar servidor, autenticação, templates openEHR e mapeamentos de terminologia. Os payloads demonstrativos não equivalem a composições validadas por um servidor EHRbase; a aplicação não realiza transmissão real.
3. **Ciclo de vida do prontuário:** identificação profissional, data efetiva do atendimento, assinatura, revisão, histórico de alterações e armazenamento com controle de acesso. A data mostrada atualmente identifica a geração do documento.
4. **Persistência:** rascunhos continuam no armazenamento local do navegador, sem sincronização entre dispositivos. Um produto assistencial requer armazenamento e acesso adequados ao contexto de uso.
5. **Instrumentos completos:** os rótulos legados que mencionam Glasgow, AUDIT/CAGE ou MRC não implementam automaticamente instrumentos validados nem cálculo de risco. Uma futura versão pode implementar cada escala com seus componentes e regras específicos.
6. **Validação em dispositivos:** conferir teclado móvel, leitor de tela, fontes, impressão de prontuários longos, reconhecimento de voz e contraste de todas as cores personalizadas.

## Referências consultadas

Para estruturar início, localização, duração, fatores associados e impacto, foi consultado [The Medical Interview — Clinical Methods](https://www.ncbi.nlm.nih.gov/books/NBK349/). A distinção entre tipos de resposta e grupos segue a [definição de QuestionnaireResponse no FHIR R4](https://hl7.org/fhir/R4/questionnaireresponse-definitions.html). Isso não representa certificação clínica ou validação de conformidade de toda a aplicação.
