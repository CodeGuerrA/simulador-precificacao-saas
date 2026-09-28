# Passo 3 — Modelo de cálculos

> **Opção 2 — Simulador de precificação de um SaaS.** Base: enunciado p.2–3, p.5 e p.10; Aula 4.
> **Status:** modelo gerado com IA. **Falta a solução independente da equipe (seção 8)**: sem ela, não se avança para o código.

## 1. Variáveis

Tipo: **F** = fornecido pelo usuário · **E** = estimado (premissa da simulação) · **C** = calculado.

| Nome no enunciado | Identificador no código | Unidade | Tipo | Validação |
|---|---|---|---|---|
| custo_fixo | `fixedCost` | R$ por mês | F/E | número ≥ 0 |
| custo_variavel | `variableCostPerCustomer` | R$ por cliente por mês | F/E | número ≥ 0 |
| preco | `price` | R$ por cliente por mês | F | número ≥ 0 |
| clientes | `customers` | clientes no mês | F/E | inteiro ≥ 0 |
| taxa | `taxRate` | fração da receita (na tela: %) | E | 0% ≤ taxa ≤ 100% |
| benefício percebido | `perceivedBenefit` | texto | F | não entra no cálculo |
| receita | `revenue` | R$ por mês | C | — |
| tributos | `taxes` | R$ por mês | C | — |
| custo total | `totalCost` | R$ por mês | C | — |
| resultado | `operatingResult` | R$ por mês | C | — |
| margem_percentual | `marginPercent` | % | C | só com receita > 0 |
| contribuicao_unitaria | `unitContribution` | R$ por cliente por mês | C | — |
| clientes_equilibrio | `breakEvenCustomers` | clientes | C | só com contribuição > 0 |
| preço que zera o resultado | `breakEvenPrice` | R$ por cliente por mês | C | só com clientes > 0 e taxa < 100% |

> Exceção registrada: os nomes dos arquivos de documentação (`requisitos.md`, `modelo_calculos.md`, `registro_ia.md`) seguem a sugestão do enunciado. O código usa identificadores em inglês; esta tabela faz a ponte.

## 2. Fórmulas (enunciado, p.2)

1. receita = preço × clientes
2. tributos = receita × taxa → o tributo incide sobre a **receita**, não sobre o lucro [O2.7]
3. custo total = custo fixo + custo variável × clientes
4. resultado = receita − custo fixo − custo variável × clientes − tributos
5. margem (%) = 100 × resultado ÷ **receita**, só se receita > 0 [O2.3] [O2.8]
6. contribuição por cliente = preço × (1 − taxa) − custo variável [O2.1]
7. clientes de equilíbrio = **teto**(custo fixo ÷ contribuição), só se contribuição > 0 [O2.2]

**Sensibilidade (RF14), derivada da fórmula 4 com resultado = 0:**

preço que zera = (custo fixo + custo variável × clientes) ÷ (clientes × (1 − taxa)), válido com clientes > 0 e taxa < 100%.

## 3. Convenções

| Item | Convenção |
|---|---|
| Sinais | Custos e tributos são positivos e subtraídos. Resultado negativo = saldo operacional negativo no mês |
| Periodicidade | Tudo mensal [C3] |
| Taxa | Digitada em %, usada como fração: 10% → 0,10 [C2] |
| Mês zero | **Não se aplica.** O modelo representa um mês típico, sem investimento inicial nem série no tempo |
| Arredondamento | Só na exibição (R$ com 2 casas; margem com 2 casas) [C9] |
| Comparação em testes | Tolerância de R$ 0,01 (p.10) |

## 4. Limites de validade

- O resultado é um **saldo operacional didático**, não lucro contábil (p.3) [O2.5].
- O equilíbrio é **operacional do mês**; não é recuperação de investimento (p.5) [C7].
- A taxa é **hipotética e editável**. Os 15% a 25% dos slides não são regra tributária universal (p.5) [C1].
- O modelo é linear: sem cancelamentos, sem custo de aquisição de cliente, sem sazonalidade e com um único plano.

## 5. Caso resolvido passo a passo (dados do enunciado, p.3)

| Passo | Cálculo | Valor | Tipo |
|---|---|---|---|
| Custo fixo | — | R$ 3.000,00 | F |
| Custo variável | — | R$ 10,00 por cliente | F |
| Preço | — | R$ 50,00 por cliente | F |
| Clientes | — | 100 | F |
| Taxa | 10% → 0,10 | 0,10 | E |
| Receita | 50 × 100 | R$ 5.000,00 | C |
| Tributos | 5.000 × 0,10 | R$ 500,00 | C |
| Custo total | 3.000 + 10 × 100 | R$ 4.000,00 | C |
| Resultado | 5.000 − 3.000 − 1.000 − 500 | **R$ 500,00** | C |
| Margem | 100 × 500 ÷ 5.000 | **10,00%** | C |
| Contribuição por cliente | 50 × 0,90 − 10 | R$ 35,00 | C |
| Equilíbrio | teto(3.000 ÷ 35) = teto(85,714…) | **86 clientes** | C |
| Conferência do equilíbrio | com 85: 4.250 − 3.000 − 850 − 425 | −R$ 25,00 (ainda negativo) | C |
| Conferência do equilíbrio | com 86: 4.300 − 3.000 − 860 − 430 | +R$ 10,00 (primeiro ≥ 0) | C |
| Preço que zera (100 clientes) | (3.000 + 1.000) ÷ (100 × 0,90) | R$ 44,44 | C |

Todos os valores em negrito conferem com o gabarito do enunciado (p.3 e p.9).

## 6. Casos-limite definidos

| Situação | Comportamento | Origem |
|---|---|---|
| Receita = 0 (0 clientes ou preço 0) | Resultado = −custo fixo; margem "não se aplica" | p.2 e p.10 |
| Taxa = 0% | Contribuição = preço − variável. No exemplo: equilíbrio 75 | p.10 |
| Taxa = 100% | Contribuição = −variável ≤ 0 → sem equilíbrio; preço que zera não existe | Derivado da p.2 |
| Contribuição ≤ 0 com custo fixo > 0 | Mensagem "não há equilíbrio aumentando clientes" | p.2 |
| Custo fixo = 0 | Equilíbrio = 0 cliente | **Premissa da equipe** (o PDF não cobre) |
| Clientes = 0 | Preço que zera não existe | Derivado |
| Campo vazio, texto, negativo, clientes fracionários, taxa > 100% | Mensagem ao lado do campo; nenhum resultado | p.6 e p.10 |

## 7. Precisão numérica (armadilha comprovada)

Números decimais no computador (em JavaScript e em Python) não representam 0,9 ou 0,1 de forma exata. Por isso, `Math.ceil(custoFixo / contribuicao)` pode somar **1 cliente a mais** quando a divisão deveria dar um número exato: em 284.944 casos de equilíbrio exato, isso aconteceu em 87.306 [O2.9].

**Regra adotada:** equilíbrio = `Math.ceil(round(custoFixo / contribuicao, 9 casas))`. Resultado executado: 0 erro em 569.888 casos, e o gabarito continua 86.

Erros comprovados contra o gabarito:

| Erro | Resultado errado | Gabarito |
|---|---|---|
| Contribuição sem descontar o tributo | 75 clientes | 86 |
| Truncar (`int`) em vez de arredondar para cima | 85 clientes | 86 |
| Tributo sobre o lucro | resultado 900 | 500 |
| Margem sobre os custos | 11,11% | 10% |
| Taxa 10 usada sem virar 0,10 | resultado −49.000 | 500 |

## 8. Solução independente da equipe (obrigatória — p.7 e p.10)

> **Preencher à mão, na calculadora ou numa planilha própria, sem consultar a IA nem a seção 5.** Depois, comparar com o código.

| Indicador | Valor obtido pela equipe | Confere com a seção 5? |
|---|---|---|
| Receita | | |
| Tributos | | |
| Resultado | | |
| Margem | | |
| Contribuição por cliente | | |
| Clientes de equilíbrio | | |

- Resolvido por: ______________________ Data: ___/___/2026
- Ferramenta usada: ( ) à mão ( ) calculadora ( ) planilha
- Divergências encontradas e causa: ______________________
