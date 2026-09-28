# Passo 2 — Requisitos e critérios de aceitação

> **Opção 2 — Simulador de precificação de um SaaS.** Base: `problema.md` e enunciado (p.2–3, p.5, p.8–10).
> **Status:** rascunho gerado com IA. A equipe revisa antes do Passo 3.
> Os códigos entre colchetes (ex.: [O2.1]) indicam armadilhas de cálculo do enunciado, explicadas na tabela do fim deste arquivo.

## Convenções

| Item | Convenção |
|---|---|
| Moeda | Real (R$), exibido com 2 casas decimais |
| Periodicidade | Mensal para custos, preço, clientes e resultado [C3] |
| Taxa | Digitada em % da receita; convertida em fração no cálculo [C2] |
| Origem dos dados | Fictícios, identificados na tela como **simulação** [C8] |
| Arredondamento | Só na exibição; cálculo interno sem arredondar; comparação com tolerância de R$ 0,01 [C9] |

## Requisitos funcionais obrigatórios

Formato dos critérios: **Dado** (entrada) · **Quando** (ação) · **Então** (resultado observável).

| Nº | Requisito | Critério de aceitação | Armadilha |
|---|---|---|---|
| RF01 | Formulário de entradas | Dado a tela aberta, quando o usuário vê o formulário, então aparecem os 6 campos com unidade (R$/mês, R$/cliente/mês, clientes, % da receita, texto) e o aviso "dados fictícios — simulação" | [C8] [O2.6] |
| RF02 | Carregar exemplo | Quando clica em "Carregar exemplo do enunciado", então os campos recebem 3.000 / 10 / 50 / 100 / 10% e os resultados aparecem | — |
| RF03 | Campo obrigatório vazio | Dado o custo fixo vazio, quando calcula, então aparece "Informe o custo fixo mensal." ao lado do campo e **nenhum resultado** é exibido | [I1] |
| RF04 | Valor inválido | Dado "abc", número negativo, clientes = 10,5 ou taxa = 120%, então aparece mensagem ao lado do campo e nenhum resultado é exibido | [I1] |
| RF05 | Número no formato brasileiro | Dado "3.000" no custo fixo, então o valor lido é 3000; "1.000,50" → 1000,50; "10,5" → 10,5 | [I2] |
| RF06 | Receita, tributos, custos e resultado | Dado o exemplo, então receita = 5.000,00; tributos = 500,00 (sobre a **receita**); custo total = 4.000,00; resultado = 500,00 | [O2.7] |
| RF07 | Margem | Dado o exemplo, então margem = 10,00% (resultado ÷ **receita**). Dado receita = 0, então a margem mostra "não se aplica (sem receita)" | [O2.3] [O2.8] |
| RF08 | Contribuição por cliente | Dado o exemplo, então contribuição = 35,00 = 50 × (1 − 10%) − 10 | [O2.1] |
| RF09 | Clientes de equilíbrio | Dado o exemplo, então equilíbrio = **86** clientes (menor inteiro ≥ 85,71). Conferência: com 85 clientes o resultado é −25,00 e com 86 é +10,00 | [O2.2] [O2.9] |
| RF10 | Sem equilíbrio | Dado preço 10, variável 10, taxa 10% e custo fixo 3.000 (contribuição −1,00), então aparece "Não há equilíbrio aumentando clientes: cada cliente reduz o resultado." e nenhum número de clientes | [O2.4] |
| RF11 | Pelo menos dois preços | Dado os preços 50 e 60 com o restante do exemplo, então a tabela mostra lado a lado: resultado 500,00 e 1.400,00; margem 10,00% e 23,33%; equilíbrio 86 e 69 | — |
| RF12 | Gráfico | Então o gráfico mostra o resultado do mês (R$, eixo vertical) por quantidade de clientes (eixo horizontal) para cada preço, com a linha do zero, o ponto de equilíbrio marcado e uma descrição em texto | — |
| RF13 | Três cenários | Então a tela mostra os cenários pessimista, base e otimista, com as premissas alteradas destacadas e os indicadores de cada um | — |
| RF14 | Sensibilidade | Então a tela mostra o preço que zera o resultado para a quantidade informada, variando só essa entrada. Dado o exemplo: R$ 44,44 | [A14] |
| RF15 | Interpretação | Então um texto gerado por regras explícitas cita os valores calculados, indica o preço favorecido, o critério e a condição que mudaria a conclusão, sem frases de certeza sobre o futuro | [A13] |
| RF16 | Exportação | Quando clica em "Exportar CSV" ou "Exportar JSON", então o arquivo contém **entradas, premissas e saídas**, com valores sem arredondamento de cálculo | [A12] [C9] |
| RF17 | Identificação e conceitos | Então a tela mostra o nome do grupo, os integrantes e uma explicação curta de cada indicador | — |

## Requisitos não funcionais

| Nº | Requisito |
|---|---|
| RNF01 | Next.js na forma mais simples: uma página, cálculo no navegador, sem API, banco, login ou serviço externo [A15]. Instalação e execução documentadas no README (`npm install` e `npm run dev`) |
| RNF02 | Cálculos em funções puras separadas da tela, com testes automatizados executados por um comando documentado no README |
| RNF03 | Rótulos em português, moeda em R$, taxa com periodicidade explícita ("% da receita, mensal") |
| RNF04 | Acessibilidade: rótulos ligados aos campos, foco visível, erro anunciado e não só por cor, contraste adequado, uso por teclado |
| RNF05 | Funciona em computador e celular |

## Extensões opcionais (fora do produto mínimo)

- Comparar mais de dois preços.
- Salvar os últimos dados digitados no navegador.

## Plano de verificação (mínimo do PDF: 5 verificações, 3 automatizadas)

| Nº | Tipo exigido (p.9) | Caso | Esperado | Automatizado |
|---|---|---|---|---|
| V1 | Normal | Exemplo do enunciado | 5.000 / 500 / 500 / 10% / 86 | Sim |
| V2 | Limite | 85 × 86 clientes; taxa 0% | −25 × +10; equilíbrio 75 | Sim |
| V3 | Entrada inválida | Campo vazio, "abc", negativo | Erro, sem resultado | Sim (leitura) + manual (tela) |
| V4 | Cenário desfavorável | Preço 10, variável 10, taxa 10% | Sem equilíbrio | Sim |
| V5 | Alteração de premissa | Preço 60 | 1.400 / 23,33% / 69 | Sim |
| V6 | Caso que não pode quebrar | 0 clientes (receita zero) | Resultado −3.000; margem não se aplica | Sim |

## Armadilhas → requisito → verificação

| Armadilha | Requisito | Verificação |
|---|---|---|
| O2.1 Contribuição sem tributo (daria 75) | RF08, RF09 | V1 |
| O2.2 Truncar em vez de teto (daria 85) | RF09 | V1, V2 |
| O2.3 Margem sem receita | RF07 | V6 |
| O2.4 Contribuição ≤ 0 | RF10 | V4 |
| O2.5 Resultado ≠ lucro contábil | RF15 (texto) | Revisão manual |
| O2.6 Benefício percebido em texto | RF01 | Revisão manual |
| O2.7 Tributo sobre o lucro (daria 900) | RF06 | V1 |
| O2.8 Margem sobre custos (daria 11,11%) | RF07 | V1 |
| O2.9 Arredondar para cima direto sobre o resultado decimal (erra 1 cliente em 30% dos casos exatos) | RF09 | V2 + teste de limite exato |
| C1 Alíquota "real" inventada | RF01 (aviso de hipótese) | Revisão manual |
| C2 Taxa sem virar fração (daria −49.000) | RF06 | V1 |
| C9 Arredondar no meio do cálculo | RF16 | V1 |
| I1 Campo vazio vira 0 | RF03 | V3 |
| I2 "1.000,50" vira 1 | RF05 | V3 |
