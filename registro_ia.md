# Registro das interações com a IA

> Exigência do enunciado (p.10 e p.12): pelo menos **5 interações relevantes**, com pelo menos **uma sugestão revisada, corrigida ou rejeitada** e a justificativa.
> Regra da equipe: registrar **somente interações reais**. A coluna "Decisão humana" é preenchida por quem revisou. Print pode complementar, mas não substitui a explicação.

**Agente usado:** agente de IA de programação · **Projeto:** Opção 2 — Simulador de precificação SaaS

---

## 1. Passos 1 a 3 — problema, requisitos e modelo de cálculos

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Gerar a delimitação do problema, os requisitos e o modelo de cálculos, cobrindo as armadilhas de cálculo do enunciado |
| Prompt utilizado | "execute o plano da tarefa com base o pdf […]" |
| Arquivos alterados | `problema.md`, `requisitos.md`, `modelo_calculos.md`, `registro_ia.md` (criados) |
| Sugestão da IA | Modelo com tributo sobre a receita, margem sobre a receita e equilíbrio com arredondamento para cima protegido contra erro de ponto flutuante |
| Verificação realizada | A IA testou `Math.ceil` direto em 284.944 casos (errou em 87.306) e a correção (0 erro). Verificação humana: em 29/09/2026, Carlos refez o caso do enunciado na calculadora (seção 8 do `modelo_calculos.md`), com as fórmulas passadas uma de cada vez e sem ver os resultados antes. Os seis valores coincidiram com a seção 5, a p.3 e a aplicação |
| Decisão humana | **Aceita** (29/09/2026): o modelo de cálculos fica como está, conferido na calculadora sem divergências |

## 2. Escolha da tecnologia ← sugestão rejeitada pela equipe

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Definir a tecnologia do app |
| Prompt utilizado | Resposta à pergunta da IA sobre tecnologia: "React + Vite"; depois: "faca em next.js mas simples" |
| Arquivos alterados | `requisitos.md` (RNF01 e RNF02) |
| Sugestão da IA | HTML/CSS/JS puro, abrindo o `index.html` sem instalar nada |
| Verificação realizada | A equipe comparou com o enunciado (p.5: pode usar outra tecnologia que já domine, desde que rode localmente com dependências documentadas) |
| Decisão humana | **Rejeitada.** A equipe escolheu Next.js na forma mais simples (uma página, sem API nem banco) |

## 3. Passo 5 — núcleo de cálculo e testes

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Implementar as funções de cálculo, leitura de números e validação, com testes |
| Prompt utilizado | "execute o plano da tarefa com base o pdf […]" |
| Arquivos alterados | `lib/pricing.ts`, `lib/parse.ts`, `lib/validation.ts` e os testes `lib/*.test.ts` |
| Sugestão da IA | Funções puras sem dependência da tela; leitura do formato brasileiro; taxa convertida de % para fração num único lugar; equilíbrio com arredondamento protegido |
| Verificação realizada | 44 testes passando (`npm test`), lint e TypeScript sem erros. Teste de mutação: com `Math.ceil` direto, 2 testes falharam; com imposto sobre o lucro, 6 falharam. Revisão humana (p.7): em 29/09/2026, Yuri Dourado e Guilherme Rubatto, que não orientaram o agente, revisaram `calculatePricing` e confirmaram as entradas (custo fixo, custo variável por cliente, preço, clientes e taxa como fração) e as saídas (receita, tributos, custos, resultado, margem, contribuição, equilíbrio e preço que zera o resultado). A confirmação foi dada no grupo da equipe |
| Decisão humana | **Aceita** (29/09/2026): a função fica como está, revisada por Yuri Dourado e Guilherme Rubatto |

## 4. Passo 6 — interface ← sugestão alterada pela equipe

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Construir a interface com formulário, conta armada, comparação de preços, gráfico e exportação |
| Prompt utilizado | "execute o plano da tarefa com base o pdf […]"; depois: "nao gosto dos modal ter a cor de fundo do sistema, preciso que melhore isso dai" e "busque referencias e melhore elas com as skills de designe" |
| Arquivos alterados | `app/`, `components/`, `lib/format.ts`, `lib/ledger.ts`, `lib/verdict.ts`, `lib/export.ts`, `lib/chart.ts` e testes |
| Sugestão da IA (antes) | Painel da conta branco sobre fundo quase branco |
| Verificação realizada | Carlos reprovou a cor do painel. A IA pesquisou novas referências (Wise, Stripe, Remote) e trocou para azul caneta. Conferido em prints no computador e no celular (vazio, exemplo, erro, sem equilíbrio), 71 testes, detector de padrões de IA sem achados, console sem erros e Lighthouse com acessibilidade 100 |
| Decisão humana | **Alterada:** painel em azul caneta com marca-texto amarelo |

## 5. Passo 7 — cenários, sensibilidade e interpretação

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Comparar três cenários, variar uma entrada por vez e explicar a decisão com regras explícitas |
| Prompt utilizado | "so precisa funcionar e atender oq o professor quer […]" |
| Arquivos alterados | `lib/scenarios.ts`, `lib/sensitivity.ts`, `lib/interpretation.ts`, componentes das três seções, `lib/export.ts` e testes |
| Sugestão da IA | Cenários variando só os clientes (−30%, informado, +30%); limite de cada entrada que zera o resultado; interpretação com critério, preço favorecido e condição de virada (a R$ 60 são necessários ao menos 80 clientes para igualar R$ 50 com 100) |
| Verificação realizada | 108 testes, entre eles um que proíbe palavras de certeza na interpretação. Valores conferidos contra a fórmula: cenários −550 / 500 / 1.550 (R$ 50) e 80 / 1.400 / 2.720 (R$ 60). Em 29/09/2026, Carlos avaliou manter ou trocar a variação de ±30% |
| Decisão humana | **Aceita** (29/09/2026): a equipe mantém os cenários variando só a quantidade de clientes em −30%, informado e +30%. Assim cada cenário mostra o efeito de uma coisa só, a perda ou o ganho de clientes |

## 6. Formatação dos valores ao digitar ← pedido da equipe

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Mostrar a pontuação brasileira enquanto se digita |
| Prompt utilizado | "arrume para quando eu digitar exemplo custo digito 10000 ele coloca a pontuacao correto para mim" |
| Arquivos alterados | `lib/inputMask.ts`, `components/Field.tsx`, `components/Simulator.tsx` e testes |
| Sugestão da IA (antes) | Campo aceitava "10000" sem pontuação e só o cálculo interpretava o formato |
| Verificação realizada | Testado no navegador: 10000 digitado tecla a tecla aparece como 10.000 e vira 10.000,00 ao sair. A máscara de centavos (10000 → 100,00) foi descartada por confundir quem digita em reais |
| Decisão humana | **Alterada:** campos formatam enquanto se digita |

## 7. Passo 8 — revisão e preparação da entrega

| Campo | Registro |
|---|---|
| Data | 28/09/2026 |
| Integrante | Carlos |
| Objetivo | Reunir as entregas pedidas no enunciado (p.10) |
| Prompt utilizado | "quais sao as entregas? para o professor?" |
| Arquivos alterados | `README.md`, `evidencias_testes.md`, `relatorio_decisao.md` e `dados/exportacao-exemplo.json` e `.csv` |
| Sugestão da IA | README com instalação, execução, testes, indicadores, limitações e exemplo de uso; evidências com os valores lidos na tela; rascunho do relatório defendendo R$ 60,00 |
| Verificação realizada | As 9 verificações foram feitas na aplicação rodando, e os arquivos exportados saíram dos próprios botões. Em 29/09/2026, o relatório foi revisado: a redação foi reescrita sem mudar números nem conclusões, e a versão em PDF, com 2 páginas, foi enviada aos integrantes |
| Decisão humana | **Aceita** (29/09/2026): a equipe mantém a defesa de R$ 60,00, com o risco de o preço maior afastar clientes e a condição de virada em 80 clientes |

## 8. Rodapé da interface ← sugestão alterada pela equipe

| Campo | Registro |
|---|---|
| Data | 29/09/2026 |
| Integrante | Carlos |
| Objetivo | Deixar na interface só as informações que o enunciado pede |
| Prompt utilizado | "oh de onde vem as contas foi pedido dele ter no sistema?"; depois: "deixe soq o pediu" |
| Arquivos alterados | `app/page.tsx`, `app/page.module.css` |
| Sugestão da IA (antes) | Rodapé "De onde vêm as contas" com quatro itens: fórmulas, conferência, dados e grupo |
| Verificação realizada | A equipe conferiu no enunciado: a identificação do grupo (p.9) e a origem dos dados (p.5) são pedidas; as linhas de fórmulas e de conferência, não. As fórmulas continuam visíveis na conta do mês, linha a linha. 112 testes, TypeScript e lint sem erros; rodapé conferido no computador e no celular |
| Decisão humana | **Alterada:** rodapé "Grupo e dados" só com os dois itens pedidos |

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
