# Passo 1 — Delimitação da decisão

> **Opção escolhida:** 2 — Simulador de precificação de um SaaS
> **Status:** rascunho gerado com IA. A equipe deve revisar antes do Passo 2.

## Usuário

Responsável por produto (ou líder técnico) de uma pequena empresa de software que vai lançar um serviço por assinatura mensal.

## Decisão

Qual **preço mensal** e qual **quantidade de clientes** sustentam o serviço: o resultado do mês cobre os custos e os tributos? A partir de quantos clientes o resultado deixa de ser negativo?

## Entradas disponíveis

| Campo | Unidade | Origem |
|---|---|---|
| Custo fixo mensal | R$ por mês | Estimativa da equipe (simulação) |
| Custo variável por cliente | R$ por cliente por mês | Estimativa da equipe (infraestrutura, suporte) |
| Preço mensal | R$ por cliente por mês | Alternativa a testar |
| Quantidade de clientes | clientes no mês | Previsão da equipe |
| Taxa hipotética de tributos | % da receita do mês | Hipótese editável; **não é alíquota legal** |
| Benefício percebido pelo cliente | texto | Descrição qualitativa (Aula 4, valor percebido) |

## Saída que ajuda a decidir

- Receita, tributos, custo total, resultado do mês e margem.
- Contribuição por cliente e quantidade mínima de clientes para o equilíbrio.
- Comparação de pelo menos dois preços, gráfico do resultado por quantidade de clientes e três cenários.
- Interpretação: qual preço é favorecido, por qual critério e em que condição a conclusão muda.

## Caso fictício de teste (dados do enunciado, p.3)

Custo fixo R$ 3.000, variável R$ 10, preço R$ 50, taxa hipotética de 10% e 100 clientes.
Esperado: receita R$ 5.000, tributos R$ 500, resultado R$ 500, margem 10% e equilíbrio a partir de **86 clientes**.

Segundo preço **proposto** para comparação (a equipe confirma ou troca): R$ 60 → resultado R$ 1.400, margem 23,33% e equilíbrio a partir de 69 clientes.

## Produto mínimo viável

Uma tela com formulário, botão "carregar exemplo", resultados de dois preços lado a lado, gráfico, três cenários, interpretação e exportação CSV/JSON.

**Fora do escopo:** cancelamento de clientes (churn), custo de aquisição, sazonalidade, vários planos, investimento inicial e valor do dinheiro no tempo.

## Informações faltantes (a equipe decide)

1. Qual é o segundo preço e quais premissas variam nos cenários pessimista, base e otimista.
2. Texto da base declarada da taxa hipotética (sugestão: "estimativa didática; não representa regime tributário real").
3. Se o benefício percebido é obrigatório para calcular. Sugestão: não bloqueia o cálculo, apenas aparece um aviso.
4. Premissa fora do PDF: com custo fixo zero, o equilíbrio é 0 cliente.

## Limites do modelo (o enunciado exige declarar)

- O resultado é um **saldo operacional didático**, não lucro contábil (p.3).
- O **equilíbrio operacional do mês não é recuperação do investimento** (p.5).
- Tudo está na mesma periodicidade: **mensal**. Não há desconto no tempo.
