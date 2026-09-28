import type { Interpretation } from "./interpretation";
import type { PricingInput, PricingResult } from "./pricing";
import type { ScenarioResult } from "./scenarios";
import type { SensitivityLimit } from "./sensitivity";

/**
 * Exportação exigida pelo enunciado (p.8): entradas, premissas e saídas, em CSV ou JSON.
 * Os números saem sem arredondamento de cálculo (C9).
 */

export const EXPORT_ASSUMPTIONS = [
  "Valores mensais, em reais (R$).",
  "Taxa de tributos hipotética, aplicada sobre a receita; não é alíquota legal.",
  "O resultado é o saldo operacional do modelo didático, não o lucro contábil.",
  "Equilíbrio: menor quantidade inteira de clientes com resultado maior ou igual a zero.",
  "Com custo fixo zero, o equilíbrio é 0 cliente (premissa da equipe).",
  "Cenários: só a quantidade de clientes varia (−30%, informado, +30%).",
  "Sensibilidade: uma entrada por vez, com as outras como informadas.",
  "Dados fictícios: simulação.",
] as const;

export type PriceScenarioExport = {
  price: number;
  result: PricingResult;
};

export type SimulationExport = {
  simulation: string;
  generatedAt: string;
  inputs: PricingInput & { taxRatePercent: number; perceivedBenefit: string; comparisonPrice: number | null };
  assumptions: readonly string[];
  outputs: {
    informedPrice: PriceScenarioExport;
    comparisonPrice: PriceScenarioExport | null;
    scenarios: ScenarioResult[];
    sensitivity: SensitivityLimit[];
  };
  interpretation: Interpretation;
};

export function buildSimulationExport(params: {
  input: PricingInput;
  result: PricingResult;
  perceivedBenefit: string;
  comparison: PriceScenarioExport | null;
  scenarios: ScenarioResult[];
  sensitivity: SensitivityLimit[];
  interpretation: Interpretation;
  generatedAt: Date;
}): SimulationExport {
  const { input, result, perceivedBenefit, comparison, scenarios, sensitivity, interpretation, generatedAt } = params;
  return {
    simulation: "Simulador de precificação SaaS (dados fictícios)",
    generatedAt: generatedAt.toISOString(),
    inputs: {
      ...input,
      taxRatePercent: input.taxRate * 100,
      perceivedBenefit,
      comparisonPrice: comparison?.price ?? null,
    },
    assumptions: EXPORT_ASSUMPTIONS,
    outputs: {
      informedPrice: { price: input.price, result },
      comparisonPrice: comparison,
      scenarios,
      sensitivity,
    },
    interpretation,
  };
}

export function toJson(data: SimulationExport): string {
  return JSON.stringify(data, null, 2);
}

const CSV_SEPARATOR = ";";

/** Número no padrão do Excel em português: vírgula decimal, sem separador de milhar. */
function csvNumber(value: number | null): string {
  return value === null ? "" : String(value).replace(".", ",");
}

function csvText(value: string): string {
  return /[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function resultRows(section: string, scenario: PriceScenarioExport): string[][] {
  const { result } = scenario;
  return [
    [section, "Preço", csvNumber(scenario.price), "R$ por cliente por mês"],
    [section, "Receita", csvNumber(result.revenue), "R$ por mês"],
    [section, "Tributos", csvNumber(result.taxes), "R$ por mês"],
    [section, "Custo variável total", csvNumber(result.variableCost), "R$ por mês"],
    [section, "Custo total (fixo + variável)", csvNumber(result.totalCost), "R$ por mês"],
    [section, "Resultado do mês", csvNumber(result.operatingResult), "R$ por mês"],
    [section, "Margem", csvNumber(result.marginPercent), "% da receita (vazio: sem receita)"],
    [section, "Contribuição por cliente", csvNumber(result.unitContribution), "R$ por cliente por mês"],
    [
      section,
      "Clientes de equilíbrio",
      result.breakEven.kind === "customers" ? csvNumber(result.breakEven.customers) : "",
      result.breakEven.kind === "customers" ? "clientes" : "sem equilíbrio por aumento de clientes",
    ],
    [section, "Preço que zera o resultado", csvNumber(result.breakEvenPrice), "R$ por cliente por mês (vazio: não existe)"],
  ];
}

export function toCsv(data: SimulationExport): string {
  const { inputs } = data;
  const rows: string[][] = [
    ["Seção", "Campo", "Valor", "Unidade"],
    ["Entradas", "Custo fixo", csvNumber(inputs.fixedCost), "R$ por mês"],
    ["Entradas", "Custo variável por cliente", csvNumber(inputs.variableCostPerCustomer), "R$ por cliente por mês"],
    ["Entradas", "Preço mensal", csvNumber(inputs.price), "R$ por cliente por mês"],
    ["Entradas", "Clientes", csvNumber(inputs.customers), "clientes no mês"],
    ["Entradas", "Taxa hipotética de tributos", csvNumber(inputs.taxRatePercent), "% da receita"],
    ["Entradas", "Segundo preço para comparar", csvNumber(inputs.comparisonPrice), "R$ por cliente por mês"],
    ["Entradas", "Benefício percebido", inputs.perceivedBenefit, "texto"],
    ...data.assumptions.map((assumption) => ["Premissas", "Premissa", assumption, ""]),
    ...resultRows("Saídas (preço informado)", data.outputs.informedPrice),
    ...(data.outputs.comparisonPrice ? resultRows("Saídas (segundo preço)", data.outputs.comparisonPrice) : []),
    ...data.outputs.scenarios.flatMap((scenario) => [
      ["Cenários", `${scenario.label}: clientes`, csvNumber(scenario.customers), "clientes no mês"],
      ["Cenários", `${scenario.label}: resultado ao preço informado`, csvNumber(scenario.informed.operatingResult), "R$ por mês"],
      ...(scenario.comparison
        ? [["Cenários", `${scenario.label}: resultado ao segundo preço`, csvNumber(scenario.comparison.operatingResult), "R$ por mês"]]
        : []),
    ]),
    ...data.outputs.sensitivity.map((item) => [
      "Sensibilidade",
      `${item.label}: limite que zera o resultado (${item.direction === "min" ? "mínimo" : "máximo"})`,
      csvNumber(item.limit),
      item.key === "taxRate" ? "fração da receita" : item.key === "customers" ? "clientes" : "R$",
    ]),
    ["Interpretação", "Critério", data.interpretation.criterion, ""],
    ...data.interpretation.statements.map((statement) => ["Interpretação", "Conclusão", statement, ""]),
    ...data.interpretation.caveats.map((caveat) => ["Interpretação", "Ressalva", caveat, ""]),
    ["Geração", "Gerado em", data.generatedAt, "ISO 8601"],
  ];
  return rows.map((row) => row.map(csvText).join(CSV_SEPARATOR)).join("\n");
}
