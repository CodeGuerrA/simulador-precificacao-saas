# Registro das interações com a IA

> Exigência do enunciado (p.10 e p.12): pelo menos **5 interações relevantes**, com pelo menos **uma sugestão revisada, corrigida ou rejeitada** e a justificativa.
> Regra da equipe: registrar **somente interações reais**. A coluna "Decisão humana" é preenchida por quem revisou. Print pode complementar, mas não substitui a explicação.

**Agente usado:** agente de IA de programação · **Projeto:** Opção 2 — Simulador de precificação SaaS

---

## 1. Escolha da opção

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Escolher a opção com menor risco de erro de cálculo |
| Prompt utilizado | "quais das opcoes e a melhor pra fazer?" |
| Arquivos alterados | — |
| Sugestão da IA | Opção 2: menos entradas, sem série no tempo, gabarito completo e nenhuma ambiguidade do PDF afeta essa opção |
| Verificação realizada | Critérios de avaliação conferidos no PDF (p.10–11): nenhum pontua dificuldade |
| Decisão humana | **Aceita:** Opção 2 |

## 2. Passos 1 a 3 — problema, requisitos e modelo de cálculos

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Gerar a delimitação do problema, os requisitos e o modelo de cálculos, cobrindo as armadilhas de cálculo do enunciado |
| Prompt utilizado | "execute o plano da tarefa com base o pdf […]" |
| Arquivos alterados | `problema.md`, `requisitos.md`, `modelo_calculos.md`, `registro_ia.md` (criados) |
| Sugestão da IA | Modelo com tributo sobre a receita, margem sobre a receita e equilíbrio com arredondamento para cima protegido contra erro de ponto flutuante |
| Verificação realizada | A IA testou `Math.ceil` direto em 284.944 casos (errou em 87.306) e a correção (0 erro). Verificação humana: **pendente — seção 8 do `modelo_calculos.md`** |
| Decisão humana | **Pendente** |

## 3. Escolha da tecnologia ← sugestão rejeitada pela equipe

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Definir a tecnologia do app |
| Prompt utilizado | Resposta à pergunta da IA sobre tecnologia: "React + Vite"; depois: "faca em next.js mas simples" |
| Arquivos alterados | `PRODUCT.md`, `requisitos.md` (RNF01 e RNF02) |
| Sugestão da IA | HTML/CSS/JS puro, abrindo o `index.html` sem instalar nada |
| Verificação realizada | A equipe comparou com o enunciado (p.5: pode usar outra tecnologia que já domine, desde que rode localmente com dependências documentadas) |
| Decisão humana | **Rejeitada.** A equipe escolheu Next.js na forma mais simples (uma página, sem API nem banco) |

---

## Modelo para as próximas interações

| Campo | Registro |
|---|---|
| Data | |
| Integrante | |
| Objetivo | |
| Prompt utilizado | |
| Arquivos alterados | |
| Sugestão da IA | |
| Verificação realizada | |
| Decisão humana | Aceita / Alterada / Rejeitada — justificativa |
