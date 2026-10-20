---
spec: "design.md/v1alpha"
name: "Typeform Design System (Echo variant)"
version: "1.0.0"
theme: "light"

colors:
  # Paleta de Marca e Semântica Básica
  brand_primary: "#2a222b"   # O icônico preto-ameixa profundo do Typeform
  brand_secondary: "#ffffff" # Superfícies e fundos limpos
  accent: "#198754"          # Verde suave para indicadores de progresso e sucesso
  
  # Superfícies e Bordas
  bg_canvas: "#ffffff"
  bg_surface: "#f9f9f9"
  border_default: "rgba(42, 34, 43, 0.15)"
  border_focus: "#2a222b"
  
  # Estados Interativos
  interactive_hover: "rgba(42, 34, 43, 0.04)"
  interactive_active: "rgba(42, 34, 43, 0.08)"
  
  # Texto e Contraste
  text_primary: "#2a222b"
  text_secondary: "rgba(42, 34, 43, 0.66)"
  text_muted: "rgba(42, 34, 43, 0.45)"

typography:
  # Combinação de Serifada Elegante (Perguntas) e Sans-Serif Limpa (Interface/Respostas)
  font_display: "Tobias, Georgia, serif"
  font_interface: "Geist, Inter, system-ui, sans-serif"
  
  scales:
    h1: { size: "32px", weight: "400", line_height: "40px", family: "font_display" }
    h2: { size: "24px", weight: "400", line_height: "32px", family: "font_display" }
    body_large: { size: "20px", weight: "400", line_height: "28px", family: "font_interface" }
    body_main: { size: "16px", weight: "400", line_height: "24px", family: "font_interface" }
    caption: { size: "12px", weight: "500", line_height: "16px", family: "font_interface" }

spacing:
  base: 8
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]

shape:
  radius_sm: "4px"
  radius_md: "8px" # Padrão para caixas de seleção, blocos de resposta e inputs
  radius_lg: "16px"
---

# Racional do Design & Experiência Conversacional

O Typeform não se comporta como um formulário web tradicional estático. A experiência de interface deve mimetizar uma **conversação humana fluida**. Apenas uma pergunta principal deve ser o foco visual do usuário por vez. 

## 1. Princípios Visuais Fundamentais

*   **Foco e Espaço em Branco:** Use margens amplas (`spacing[6]` ou `spacing[7]`) para isolar blocos de perguntas. Reduza distrações de layout ao mínimo absoluto.
*   **Tipografia como Elemento Central:** O contraste entre títulos serifados elegantes (`font_display`) e respostas limpas e legíveis (`font_interface`) dita a hierarquia visual.
*   **Acessibilidade Nativa:** Todos os blocos interativos e textos principais devem manter contraste WCAG AA rígido contra o fundo branco (`bg_canvas`).

## 2. Padrões de Componentes

### Blocos de Pergunta (Question Block)
*   Devem conter o número da pergunta ou uma letra indicadora em formato `caption` com opacidade reduzida (`text_muted`).
*   O título da pergunta utiliza `scales.h1` ou `scales.h2`.

### Campos de Entrada e Opções (Inputs & Choice Blocks)
*   **Inputs de Texto:** Apenas uma linha inferior ou uma caixa minimalista sem sombras agressivas. Ao focar (`:focus`), a borda transiciona suavemente para `border_focus`.
*   **Múltipla Escolha (Card de Opção):**
    *   Fundo inicial `bg_surface` com borda sutil `border_default`.
    *   Cantos arredondados definidos por `shape.radius_md`.
    *   **Estado Selecionado:** Altera o fundo para `brand_primary`, o texto interno para `brand_secondary` e adiciona um efeito de destaque numérico opcional (ex: Teclas de atalho "A", "B", "C").

### Botões e Navegação
*   **Botão Primário (CTA):** Sólido em `brand_primary`, cantos ligeiramente arredondados (`shape.radius_sm` ou `radius_md`). Texto interno contrastante em `brand_secondary`.
*   **Barra de Progresso:** Um indicador extremamente fino (máximo `4px` de altura) fixado no topo ou na base da tela, preenchido progressivamente usando a cor `accent`.

## 3. Comportamentos e Restrições OBRIGATÓRIAS para a IA

*   **NÃO gere layouts multi-colunas densos:** Evite agrupar 3 ou 4 perguntas na mesma linha. Os elementos devem fluir verticalmente em uma coluna limpa e centralizada.
*   **NÃO use gradientes espalhafatosos ou sombras complexas:** O Typeform preza pelo minimalismo plano (*flat design*). A profundidade é alcançada pelo contraste de cores e uso inteligente de espaços vazios.
*   **Ação por Clique Simples:** Campos de múltipla escolha devem, preferencialmente, disparar a transição automática para a próxima etapa sem exigir que o usuário clique em "Avançar", a menos que seja uma seleção múltipla.
