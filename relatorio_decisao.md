# Relatório de decisão — preço mensal do serviço por assinatura

Faculdade SENAI FATESG, Curso Superior de Engenharia de Software. Disciplina: Engenharia Econômica. Atividade: Opção 2, simulador de precificação SaaS.

Integrantes: Carlos Garcia, Yuri Dourado e Guilherme Rubatto.

## 1. Problema

Uma pequena empresa de software vai lançar um serviço por assinatura mensal e precisa escolher quanto cobrar. O preço tem de cobrir o custo fixo, o custo de cada cliente e os tributos. Também não pode depender de uma quantidade de clientes que a empresa dificilmente vai alcançar.

## 2. Cenário analisado

Os dados são fictícios e vêm do teste de referência da Opção 2 do enunciado.

| Premissa | Valor |
|---|---|
| Custo fixo | R$ 3.000,00 por mês |
| Custo variável | R$ 10,00 por cliente por mês |
| Clientes previstos | 100 por mês |
| Taxa hipotética de tributos | 10% da receita |
| Preços comparados | R$ 50,00 e R$ 60,00 |

## 3. Indicadores

| Indicador | R$ 50,00 | R$ 60,00 |
|---|---|---|
| Receita | R$ 5.000,00 | R$ 6.000,00 |
| Tributos | R$ 500,00 | R$ 600,00 |
| Resultado do mês | R$ 500,00 | R$ 1.400,00 |
| Margem | 10,00% | 23,33% |
| Contribuição por cliente | R$ 35,00 | R$ 44,00 |
| Clientes de equilíbrio | 86 | 69 |

Também simulamos três cenários, mudando só a quantidade de clientes.

| Cenário | Clientes | Resultado a R$ 50,00 | Resultado a R$ 60,00 |
|---|---|---|---|
| Pessimista (−30%) | 70 | −R$ 550,00 | R$ 80,00 |
| Base | 100 | R$ 500,00 | R$ 1.400,00 |
| Otimista (+30%) | 130 | R$ 1.550,00 | R$ 2.720,00 |

Na análise de sensibilidade, a premissa com menor folga a R$ 50,00 é o próprio preço. Uma queda de 11,11%, para R$ 44,44, já zera o resultado. A R$ 60,00, o preço pode cair 25,93% antes de zerar o resultado, e a quantidade de clientes pode cair 31%, até o equilíbrio em 69.

## 4. Alternativa defendida

A equipe defende o **preço de R$ 60,00**. O critério é o mesmo declarado na aplicação: maior resultado do mês com a quantidade de clientes prevista.

Com as premissas da simulação, R$ 60,00 dá resultado maior nos três cenários e precisa de 17 clientes a menos para chegar ao equilíbrio (69 contra 86). No cenário pessimista, R$ 60,00 ainda fica positivo, com R$ 80,00, enquanto R$ 50,00 fica em −R$ 550,00.

## 5. Principal risco

A comparação parte da premissa de que os dois preços teriam a **mesma quantidade de clientes**. Na prática, um preço mais alto pode afastar parte deles, e o modelo não mede essa reação.

## 6. Condição que mudaria a decisão

- A R$ 60,00 são necessários **pelo menos 80 clientes** para igualar o resultado de R$ 50,00 com 100 clientes. Se o preço maior afastar **mais de 20 clientes**, R$ 50,00 passa a ser a melhor escolha.
- Se a quantidade real de clientes ficar abaixo de 69, nenhum dos dois preços cobre os custos, e a decisão passa a ser rever custos ou o próprio lançamento.

Com outra taxa de tributos ou outros custos, os números mudam. A conclusão vale para as premissas deste relatório, e a aplicação permite refazer a conta com os dados reais da empresa.
