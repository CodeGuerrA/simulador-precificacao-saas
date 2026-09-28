# Relatório de decisão — preço mensal do serviço por assinatura

> **Rascunho gerado com apoio de IA a partir dos números da aplicação.** A equipe revisa, ajusta e assume a decisão antes da entrega.
> Grupo: Carlos Garcia, Yuri Dourado e Guilherme Rubatto. Engenharia Econômica, Faculdade SENAI FATESG.

## 1. Problema

Uma pequena empresa de software vai lançar um serviço por assinatura mensal e precisa escolher o preço. O preço precisa cobrir o custo fixo, o custo de cada cliente e os tributos, e o resultado do mês não pode depender de uma quantidade de clientes difícil de alcançar.

## 2. Cenário analisado

Dados fictícios de simulação, do teste de referência do enunciado (Opção 2):

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

Três cenários, variando só a quantidade de clientes:

| Cenário | Clientes | Resultado a R$ 50,00 | Resultado a R$ 60,00 |
|---|---|---|---|
| Pessimista (−30%) | 70 | −R$ 550,00 | R$ 80,00 |
| Base | 100 | R$ 500,00 | R$ 1.400,00 |
| Otimista (+30%) | 130 | R$ 1.550,00 | R$ 2.720,00 |

Sensibilidade a R$ 50,00: a premissa com menor folga é o próprio preço. Uma queda de 11,11% (para R$ 44,44) zera o resultado. A R$ 60,00, a folga do preço sobe para 25,93%, e a dos clientes para 31% (equilíbrio em 69).

## 4. Alternativa defendida

**Preço de R$ 60,00**, pelo critério declarado na aplicação: maior resultado do mês com a quantidade de clientes prevista.

Nas premissas da simulação, R$ 60,00 tem resultado maior nos três cenários, precisa de 17 clientes a menos para o equilíbrio (69 contra 86) e continua positivo no cenário pessimista, em que R$ 50,00 fica negativo.

## 5. Principal risco

A comparação supõe a **mesma quantidade de clientes nos dois preços**. Um preço mais alto pode afastar clientes, e o modelo não mede essa reação.

## 6. Condição que mudaria a decisão

- A R$ 60,00 são necessários **pelo menos 80 clientes** para igualar o resultado de R$ 50,00 com 100 clientes. Se o preço maior afastar **mais de 20 clientes**, R$ 50,00 passa a ser a melhor escolha.
- Se a quantidade real de clientes ficar abaixo de 69, nenhum dos dois preços cobre os custos, e a decisão passa a ser rever custos ou o próprio lançamento.

Outra taxa de tributos ou outros custos levam a outros números. A conclusão vale para as premissas acima, e a aplicação permite refazer a conta com os dados reais da empresa.
