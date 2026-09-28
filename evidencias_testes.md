# Evidências de testes

> Exigência do enunciado (p.9 e p.10): pelo menos cinco verificações (caso normal, limite, entrada inválida, cenário desfavorável e alteração de premissa), pelo menos três testes automatizados, e cada teste com entrada, resultado esperado, resultado obtido e situação.
> **Data da execução:** 28/09/2026. Resultados obtidos na tela da aplicação (`npm run dev`) e na suíte automatizada (`npm test`).

## 1. Verificações na aplicação

Base de todos os casos, salvo o que a coluna "Entrada" muda: custo fixo R$ 3.000,00; custo variável R$ 10,00; preço R$ 50,00; 100 clientes; taxa hipotética de 10%.

| Nº | Tipo (p.9) | Entrada | Resultado esperado | Resultado obtido na tela | Situação |
|---|---|---|---|---|---|
| V1 | Caso normal | Exemplo do enunciado | Receita 5.000; tributos 500; resultado 500; margem 10%; equilíbrio 86 (p.3 e p.9) | Receita R$ 5.000,00; tributos R$ 500,00; resultado R$ 500,00; margem 10,00%; contribuição R$ 35,00; equilíbrio 86 clientes | Aprovado |
| V2a | Limite | 85 clientes | Resultado ainda negativo | Resultado −R$ 25,00; veredito "o equilíbrio exige 86 clientes" | Aprovado |
| V2b | Limite | 86 clientes | Primeiro resultado ≥ 0 | Resultado R$ 10,00; veredito positivo | Aprovado |
| V2c | Limite | Taxa 0% | Contribuição 40; equilíbrio exato em 75 | Contribuição R$ 40,00; equilíbrio 75 clientes; margem 20,00% | Aprovado |
| V3a | Entrada inválida | Custo fixo vazio | Mensagem ao lado do campo e nenhum resultado | "Informe o custo fixo mensal."; conta sem valores | Aprovado |
| V3b | Entrada inválida | Taxa 120% | Mensagem ao lado do campo e nenhum resultado | "A taxa deve estar entre 0% e 100%."; conta sem valores | Aprovado |
| V4 | Cenário desfavorável | Preço R$ 10,00 | Contribuição negativa; sem equilíbrio | Contribuição −R$ 1,00; resultado −R$ 3.100,00; "Sem equilíbrio"; veredito "aumentar clientes não resolve" | Aprovado |
| V5 | Alteração de premissa | Preço R$ 60,00 | Resultado 1.400; margem 23,33%; equilíbrio 69 | Resultado R$ 1.400,00; margem 23,33%; equilíbrio 69 clientes | Aprovado |
| V6 | Caso que não pode quebrar (p.10) | 0 clientes | Resultado −3.000; margem não se aplica | Resultado −R$ 3.000,00; margem "Não se aplica" | Aprovado |

## 2. Testes automatizados

Comando:

```bash
npm test
```

Resultado em 28/09/2026: **12 arquivos, 108 testes aprovados.**

| Arquivo | O que verifica |
|---|---|
| `lib/pricing.test.ts` | Gabarito do enunciado, limites, sem equilíbrio, receita zero e precisão do arredondamento para cima (mais de 280 mil casos de equilíbrio exato) |
| `lib/parse.test.ts` | Leitura do formato brasileiro ("3.000", "1.000,50") e campo vazio que não vira zero |
| `lib/validation.test.ts` | Mensagens de erro de cada campo e conversão da taxa de % para fração |
| `lib/inputMask.test.ts` | Pontuação ao digitar (10000 → 10.000 → 10.000,00) e posição do cursor |
| `lib/ledger.test.ts` | Conta armada com a memória de cálculo e linhas que mudaram |
| `lib/verdict.test.ts` | Frase de veredito em cada situação |
| `lib/scenarios.test.ts` | Cenários −30%, base e +30% para os dois preços |
| `lib/sensitivity.test.ts` | Limite de cada premissa que zera o resultado |
| `lib/interpretation.test.ts` | Critério, preço favorecido, condição que muda a conclusão e ausência de frases de certeza |
| `lib/export.test.ts` | CSV e JSON com entradas, premissas e saídas, sem arredondar |
| `lib/format.test.ts` e `lib/chart.test.ts` | Formatação em pt-BR e escala do gráfico |

**Os testes pegam o erro?** Em 28/09/2026, dois erros foram reintroduzidos de propósito no cálculo:

| Erro reintroduzido | Testes que falharam |
|---|---|
| Arredondar o equilíbrio com `Math.ceil` direto | 2 |
| Calcular o tributo sobre o lucro em vez da receita | 6 |

Depois, o código original foi restaurado.

## 3. Arquivo exportado pela aplicação

Gerado pelos botões "Exportar CSV" e "Exportar JSON", com o exemplo do enunciado e segundo preço de R$ 60,00:

- `dados/exportacao-exemplo.json`
- `dados/exportacao-exemplo.csv`

Os dois trazem entradas, premissas, saídas dos dois preços, cenários, sensibilidade e interpretação, com valores sem arredondamento de cálculo.

## 4. Conferência independente da equipe

A solução à mão do caso do enunciado fica na seção 8 do `modelo_calculos.md` (situação: **pendente**).
