import { formatCurrency, formatDecimal, formatInteger, formatPercent, formatTaxRate } from "./format";
import type { PricingInput, PricingResult } from "./pricing";

export type LedgerKey =
  | "revenue"
  | "fixedCost"
  | "variableCost"
  | "taxes"
  | "operatingResult"
  | "margin"
  | "unitContribution"
  | "breakEven";

export type LedgerOperator = "" | "−" | "=";

export type LedgerLine = {
  key: LedgerKey;
  operator: LedgerOperator;
  label: string;
  definition: string;
  /** Fórmula escrita com os nomes dos campos, para ligar a conta às entradas. */
  formula: string;
  /** Texto exibido; null antes do primeiro cálculo. */
  display: string | null;
  /** Memória de cálculo com os números do usuário; null antes do primeiro cálculo. */
  work: string | null;
  /** Valor bruto usado para detectar mudança. */
  raw: number | null;
};

export const LEDGER_DEFINITIONS: Record<LedgerKey, { label: string; definition: string; formula: string }> = {
  revenue: {
    label: "Receita",
    definition: "Quanto a empresa recebe no mês: o preço mensal de cada cliente vezes a quantidade de clientes.",
    formula: "preço mensal × clientes no mês",
  },
  fixedCost: {
    label: "Custo fixo",
    definition: "Gasto do mês que não muda com a quantidade de clientes, como equipe e ferramentas.",
    formula: "custo fixo mensal, como informado",
  },
  variableCost: {
    label: "Custo variável total",
    definition: "Gasto que cresce com cada cliente, como infraestrutura e suporte, somado para todos os clientes do mês.",
    formula: "custo variável por cliente × clientes no mês",
  },
  taxes: {
    label: "Tributos",
    definition: "Valor em reais pago de tributos no mês: a receita vezes a taxa de tributos. A taxa é hipotética, não é alíquota legal.",
    formula: "receita × taxa de tributos",
  },
  operatingResult: {
    label: "Resultado do mês",
    definition: "Receita menos custo fixo, custo variável total e tributos. É o saldo operacional do modelo, não o lucro contábil.",
    formula: "receita − custo fixo − custo variável total − tributos",
  },
  margin: {
    label: "Margem",
    definition: "Resultado do mês dividido pela receita, em porcentagem. Só existe quando há receita.",
    formula: "resultado do mês ÷ receita × 100",
  },
  unitContribution: {
    label: "Contribuição por cliente",
    definition: "Quanto cada cliente deixa para cobrir o custo fixo depois dos tributos e do custo variável dele.",
    formula: "preço mensal × (1 − taxa de tributos) − custo variável por cliente",
  },
  breakEven: {
    label: "Clientes de equilíbrio",
    definition: "Menor quantidade inteira de clientes com resultado maior ou igual a zero.",
    formula: "custo fixo mensal ÷ contribuição por cliente, arredondado para cima",
  },
};

function clients(count: number): string {
  return `${formatInteger(count)} ${count === 1 ? "cliente" : "clientes"}`;
}

function line(key: LedgerKey, operator: LedgerOperator, display: string | null, work: string | null, raw: number | null): LedgerLine {
  return { key, operator, ...LEDGER_DEFINITIONS[key], display, work, raw };
}

/** Linhas da conta armada (receita até resultado) seguidas dos indicadores derivados. */
export function buildLedger(input: PricingInput | null, result: PricingResult | null): LedgerLine[] {
  if (!input || !result) {
    return (Object.keys(LEDGER_DEFINITIONS) as LedgerKey[]).map((key) =>
      line(key, key === "fixedCost" || key === "variableCost" || key === "taxes" ? "−" : key === "operatingResult" ? "=" : "", null, null, null),
    );
  }

  const breakEven = result.breakEven;
  let breakEvenDisplay: string;
  let breakEvenWork: string;
  if (breakEven.kind === "none") {
    breakEvenDisplay = "Sem equilíbrio";
    breakEvenWork = `Contribuição de ${formatCurrency(result.unitContribution)} por cliente: cada cliente a mais reduz o resultado.`;
  } else if (input.fixedCost <= 0) {
    breakEvenDisplay = clients(breakEven.customers);
    breakEvenWork = "Sem custo fixo, não há o que cobrir (premissa da equipe).";
  } else {
    breakEvenDisplay = clients(breakEven.customers);
    breakEvenWork = `${formatCurrency(input.fixedCost)} ÷ ${formatCurrency(result.unitContribution)} = ${formatDecimal(
      input.fixedCost / result.unitContribution,
    )}, arredondado para cima`;
  }

  return [
    line("revenue", "", formatCurrency(result.revenue), `${formatCurrency(input.price)} × ${clients(input.customers)}`, result.revenue),
    line("fixedCost", "−", formatCurrency(input.fixedCost), "Valor informado", input.fixedCost),
    line(
      "variableCost",
      "−",
      formatCurrency(result.variableCost),
      `${formatCurrency(input.variableCostPerCustomer)} × ${clients(input.customers)}`,
      result.variableCost,
    ),
    line("taxes", "−", formatCurrency(result.taxes), `${formatCurrency(result.revenue)} × ${formatTaxRate(input.taxRate)}`, result.taxes),
    line(
      "operatingResult",
      "=",
      formatCurrency(result.operatingResult),
      `${formatCurrency(result.revenue)} − ${formatCurrency(input.fixedCost)} − ${formatCurrency(result.variableCost)} − ${formatCurrency(result.taxes)}`,
      result.operatingResult,
    ),
    line(
      "margin",
      "",
      result.marginPercent === null ? "Não se aplica" : formatPercent(result.marginPercent),
      result.marginPercent === null
        ? "Sem receita, não há margem."
        : `${formatCurrency(result.operatingResult)} ÷ ${formatCurrency(result.revenue)} × 100`,
      result.marginPercent,
    ),
    line(
      "unitContribution",
      "",
      formatCurrency(result.unitContribution),
      `${formatCurrency(input.price)} × (1 − ${formatTaxRate(input.taxRate)}) − ${formatCurrency(input.variableCostPerCustomer)}`,
      result.unitContribution,
    ),
    line("breakEven", "", breakEvenDisplay, breakEvenWork, breakEven.kind === "none" ? null : breakEven.customers),
  ];
}

/** Linhas cujo valor mudou entre dois cálculos; alimenta a passada de marca-texto. */
export function changedLedgerKeys(previous: LedgerLine[] | null, next: LedgerLine[]): Set<LedgerKey> {
  const changed = new Set<LedgerKey>();
  if (!previous) return changed;
  for (const current of next) {
    const before = previous.find((candidate) => candidate.key === current.key);
    if (!before || before.display !== current.display) {
      changed.add(current.key);
    }
  }
  return changed;
}
