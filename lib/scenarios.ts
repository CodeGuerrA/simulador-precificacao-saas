import { calculatePricing, type PricingInput, type PricingResult } from "./pricing";

/**
 * Três cenários do Passo 7 (enunciado p.8). Premissa da equipe: só a quantidade de clientes varia,
 * por ser a entrada mais incerta de um serviço que ainda vai ser lançado. Para mudar os percentuais,
 * altere apenas esta lista.
 */
export const SCENARIOS = [
  { id: "pessimistic", label: "Pessimista", customersChangePercent: -30 },
  { id: "base", label: "Base", customersChangePercent: 0 },
  { id: "optimistic", label: "Otimista", customersChangePercent: 30 },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]["id"];

export type ScenarioResult = {
  id: ScenarioId;
  label: string;
  customersChangePercent: number;
  customers: number;
  informed: PricingResult;
  comparison: PricingResult | null;
};

export function buildScenarios(input: PricingInput, comparisonPrice: number | null): ScenarioResult[] {
  return SCENARIOS.map((scenario) => {
    const customers = Math.round(input.customers * (1 + scenario.customersChangePercent / 100));
    const scenarioInput = { ...input, customers };
    return {
      ...scenario,
      customers,
      informed: calculatePricing(scenarioInput),
      comparison: comparisonPrice === null ? null : calculatePricing({ ...scenarioInput, price: comparisonPrice }),
    };
  });
}
