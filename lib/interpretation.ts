import { formatCurrency, formatInteger, formatPercent, formatTaxRate } from "./format";
import { ceilSafely, calculatePricing, type PricingInput, type PricingResult } from "./pricing";
import type { ScenarioResult } from "./scenarios";
import { mostSensitive, type SensitivityLimit } from "./sensitivity";

/**
 * Interpretação do Passo 7 (enunciado p.8): frases geradas por regras explícitas, com os valores
 * calculados, o critério usado e as condições que mudariam a conclusão. Sem previsão de futuro.
 */

export type Interpretation = {
  criterion: string;
  statements: string[];
  caveats: string[];
};

const CRITERION = "Critério: maior resultado do mês com a quantidade de clientes informada. Empate: menor número de clientes para o equilíbrio.";

function clients(count: number): string {
  return `${formatInteger(count)} ${count === 1 ? "cliente" : "clientes"}`;
}

function breakEvenText(result: PricingResult): string {
  return result.breakEven.kind === "customers"
    ? `equilíbrio a partir de ${clients(result.breakEven.customers)}`
    : "sem equilíbrio por aumento de clientes";
}

/** Quantos clientes o preço maior precisa manter para igualar o resultado do preço menor. */
function customersToMatch(input: PricingInput, higherPrice: number, lowerResult: number): number | null {
  const contribution = calculatePricing({ ...input, price: higherPrice }).unitContribution;
  if (contribution <= 0) return null;
  return ceilSafely((lowerResult + input.fixedCost) / contribution);
}

function favoredPrice(input: PricingInput, result: PricingResult, comparison: { price: number; result: PricingResult }) {
  const difference = comparison.result.operatingResult - result.operatingResult;
  if (Math.abs(difference) >= 0.005) {
    return difference > 0 ? comparison.price : input.price;
  }
  const breakEvenOf = (item: PricingResult) => (item.breakEven.kind === "customers" ? item.breakEven.customers : Infinity);
  return breakEvenOf(comparison.result) < breakEvenOf(result) ? comparison.price : input.price;
}

export function buildInterpretation(params: {
  input: PricingInput;
  result: PricingResult;
  comparison: { price: number; result: PricingResult } | null;
  scenarios: ScenarioResult[];
  sensitivity: SensitivityLimit[];
}): Interpretation {
  const { input, result, comparison, scenarios, sensitivity } = params;
  const statements: string[] = [];

  statements.push(
    `Com ${clients(input.customers)} a ${formatCurrency(input.price)}, o resultado do mês é ${formatCurrency(result.operatingResult)} (${breakEvenText(result)}).`,
  );

  if (comparison) {
    statements.push(
      `Com os mesmos clientes a ${formatCurrency(comparison.price)}, o resultado é ${formatCurrency(comparison.result.operatingResult)} (${breakEvenText(comparison.result)}).`,
    );

    const favored = favoredPrice(input, result, comparison);
    const bothNegative = result.operatingResult < 0 && comparison.result.operatingResult < 0;
    statements.push(
      bothNegative
        ? `Com os clientes informados, nenhum dos dois preços cobre os custos. Pelo critério, ${formatCurrency(favored)} é o que perde menos, mas a simulação não recomenda nenhum dos dois nessas premissas.`
        : `Pelo critério, o preço favorecido é ${formatCurrency(favored)}.`,
    );

    const higher = comparison.price >= input.price ? { price: comparison.price } : { price: input.price };
    const lower = higher.price === comparison.price ? { price: input.price, result } : { price: comparison.price, result: comparison.result };
    // A condição de virada só faz sentido com clientes informados e quando o preço menor tem resultado a igualar.
    if (higher.price !== lower.price && input.customers > 0 && !bothNegative) {
      const needed = customersToMatch(input, higher.price, lower.result.operatingResult);
      if (needed === null) {
        statements.push(`A ${formatCurrency(higher.price)}, a contribuição por cliente não é positiva, então o preço maior não empata com o menor.`);
      } else if (needed <= 0) {
        statements.push(
          `A ${formatCurrency(lower.price)}, cada cliente reduz o resultado; com qualquer quantidade de clientes, ${formatCurrency(higher.price)} fica à frente.`,
        );
      } else if (needed <= input.customers) {
        statements.push(
          `A conclusão muda se o preço maior afastar clientes: a ${formatCurrency(higher.price)} são necessários pelo menos ${clients(needed)} para igualar o resultado de ${formatCurrency(lower.price)} com ${clients(input.customers)}. Uma perda de mais de ${clients(input.customers - needed)} favorece o preço menor.`,
        );
      } else {
        statements.push(
          `Para o preço de ${formatCurrency(higher.price)} igualar o resultado de ${formatCurrency(lower.price)} com ${clients(input.customers)}, seriam necessários ${clients(needed)}, mais do que os informados.`,
        );
      }
    }
  }

  const pessimistic = scenarios.find((scenario) => scenario.id === "pessimistic");
  const optimistic = scenarios.find((scenario) => scenario.id === "optimistic");
  if (pessimistic && optimistic) {
    statements.push(
      `Nos cenários, com ${clients(pessimistic.customers)} o resultado a ${formatCurrency(input.price)} seria ${formatCurrency(pessimistic.informed.operatingResult)}; com ${clients(optimistic.customers)}, seria ${formatCurrency(optimistic.informed.operatingResult)}.`,
    );
  }

  const sensitive = mostSensitive(sensitivity);
  if (sensitive && sensitive.changePercent !== null) {
    const move = sensitive.changePercent < 0 ? "uma queda" : "um aumento";
    statements.push(
      `Mantendo o resto como informado, a premissa com menor folga é ${sensitive.label.toLowerCase()}: ${move} de ${formatPercent(Math.abs(sensitive.changePercent))} zera o resultado.`,
    );
  }

  return {
    criterion: CRITERION,
    statements,
    caveats: [
      "O resultado é o saldo operacional do modelo didático, não o lucro contábil.",
      `A taxa de tributos de ${formatTaxRate(input.taxRate)} é hipotética, não uma alíquota legal.`,
      "O modelo não considera cancelamentos, custo de aquisição de clientes nem mudanças de preço ao longo do tempo.",
      "Os números descrevem as premissas informadas; outras premissas levam a outras conclusões.",
    ],
  };
}
