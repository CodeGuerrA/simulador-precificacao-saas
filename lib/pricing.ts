/**
 * Núcleo de cálculo da Opção 2 (enunciado p.2; modelo_calculos.md).
 * Funções puras: recebem números já validados e não dependem da tela.
 */

export type PricingInput = {
  /** Custo fixo, em R$ por mês. */
  fixedCost: number;
  /** Custo variável, em R$ por cliente por mês. */
  variableCostPerCustomer: number;
  /** Preço, em R$ por cliente por mês. */
  price: number;
  /** Quantidade de clientes no mês (inteiro ≥ 0). */
  customers: number;
  /** Taxa hipotética de tributos como fração da receita (10% = 0,10). */
  taxRate: number;
};

export type BreakEven =
  | { kind: "customers"; customers: number }
  /** Contribuição por cliente ≤ 0 com custo fixo > 0: aumentar clientes não leva ao equilíbrio. */
  | { kind: "none" };

export type PricingResult = {
  revenue: number;
  taxes: number;
  variableCost: number;
  /** Custo fixo + custo variável total (os tributos ficam em linha própria). */
  totalCost: number;
  operatingResult: number;
  /** Resultado ÷ receita × 100; null quando não há receita. */
  marginPercent: number | null;
  unitContribution: number;
  breakEven: BreakEven;
  /** Preço que zera o resultado com a quantidade informada; null quando não existe. */
  breakEvenPrice: number | null;
};

/**
 * Casas decimais usadas para absorver o erro de representação binária antes de
 * arredondar para cima. Sem isso, 9,80 ÷ 0,98 vira 10,000000000000002 e o
 * equilíbrio sai 11 em vez de 10 (armadilha O2.9 em requisitos.md).
 */
const CEIL_PRECISION_DIGITS = 9;

export function ceilSafely(value: number): number {
  return Math.ceil(Number(value.toFixed(CEIL_PRECISION_DIGITS)));
}

export function unitContribution(input: PricingInput): number {
  return input.price * (1 - input.taxRate) - input.variableCostPerCustomer;
}

export function breakEvenCustomers(fixedCost: number, contribution: number): BreakEven {
  if (fixedCost <= 0) {
    // Premissa da equipe (o enunciado não cobre): sem custo fixo, o equilíbrio é 0 cliente.
    return { kind: "customers", customers: 0 };
  }
  if (contribution <= 0) {
    return { kind: "none" };
  }
  return { kind: "customers", customers: ceilSafely(fixedCost / contribution) };
}

export function breakEvenPrice(input: PricingInput): number | null {
  if (input.customers <= 0 || input.taxRate >= 1) {
    return null;
  }
  return (
    (input.fixedCost + input.variableCostPerCustomer * input.customers) /
    (input.customers * (1 - input.taxRate))
  );
}

export function calculatePricing(input: PricingInput): PricingResult {
  const revenue = input.price * input.customers;
  const taxes = revenue * input.taxRate;
  const variableCost = input.variableCostPerCustomer * input.customers;
  const operatingResult = revenue - input.fixedCost - variableCost - taxes;
  const contribution = unitContribution(input);

  return {
    revenue,
    taxes,
    variableCost,
    totalCost: input.fixedCost + variableCost,
    operatingResult,
    marginPercent: revenue > 0 ? (100 * operatingResult) / revenue : null,
    unitContribution: contribution,
    breakEven: breakEvenCustomers(input.fixedCost, contribution),
    breakEvenPrice: breakEvenPrice(input),
  };
}
