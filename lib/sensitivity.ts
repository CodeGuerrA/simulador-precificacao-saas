import { calculatePricing, type PricingInput } from "./pricing";

/**
 * Sensibilidade do Passo 7 (enunciado p.8): uma entrada por vez, mantendo as outras como informadas,
 * até o valor que zera o resultado do mês. Responde "qual premissa mais influencia o resultado?".
 */

export type SensitivityKey = "price" | "customers" | "fixedCost" | "variableCostPerCustomer" | "taxRate";

export type SensitivityLimit = {
  key: SensitivityKey;
  label: string;
  current: number;
  /** Valor da entrada que zera o resultado; null quando não existe. */
  limit: number | null;
  /** "min": resultado ≥ 0 enquanto a entrada ficar acima do limite; "max": enquanto ficar abaixo. */
  direction: "min" | "max";
  /** Variação percentual do valor atual até o limite; null quando não existe limite ou o valor atual é zero. */
  changePercent: number | null;
};

function change(current: number, limit: number | null): number | null {
  if (limit === null || current === 0) return null;
  return (100 * (limit - current)) / current;
}

export function buildSensitivity(input: PricingInput): SensitivityLimit[] {
  const { fixedCost, variableCostPerCustomer, price, customers, taxRate } = input;
  const result = calculatePricing(input);
  const revenue = price * customers;

  const limits: Omit<SensitivityLimit, "changePercent">[] = [
    { key: "price", label: "Preço mensal", current: price, limit: result.breakEvenPrice, direction: "min" },
    {
      key: "customers",
      label: "Clientes no mês",
      current: customers,
      limit: result.breakEven.kind === "customers" ? result.breakEven.customers : null,
      direction: "min",
    },
    {
      key: "fixedCost",
      label: "Custo fixo mensal",
      current: fixedCost,
      limit: customers * result.unitContribution,
      direction: "max",
    },
    {
      key: "variableCostPerCustomer",
      label: "Custo variável por cliente",
      current: variableCostPerCustomer,
      limit: customers > 0 ? price * (1 - taxRate) - fixedCost / customers : null,
      direction: "max",
    },
    {
      key: "taxRate",
      label: "Tributos sobre a receita",
      current: taxRate,
      limit: revenue > 0 ? 1 - (fixedCost + variableCostPerCustomer * customers) / revenue : null,
      direction: "max",
    },
  ];

  return limits.map((item) => ({ ...item, changePercent: change(item.current, item.limit) }));
}

/** Entrada com a menor folga até zerar o resultado: a premissa que mais influencia a decisão. */
export function mostSensitive(limits: SensitivityLimit[]): SensitivityLimit | null {
  const candidates = limits.filter((item) => item.changePercent !== null);
  if (candidates.length === 0) return null;
  return candidates.reduce((best, item) => (Math.abs(item.changePercent!) < Math.abs(best.changePercent!) ? item : best));
}
