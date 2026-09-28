import { describe, expect, it } from "vitest";
import { buildSimulationExport, toCsv, toJson, EXPORT_ASSUMPTIONS } from "./export";
import { buildInterpretation } from "./interpretation";
import { calculatePricing, type PricingInput } from "./pricing";
import { buildScenarios } from "./scenarios";
import { buildSensitivity } from "./sensitivity";

const pdfExample: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };

function exportFor(input: PricingInput, comparisonPrice: number | null) {
  const result = calculatePricing(input);
  const comparison = comparisonPrice === null ? null : { price: comparisonPrice, result: calculatePricing({ ...input, price: comparisonPrice }) };
  const scenarios = buildScenarios(input, comparisonPrice);
  const sensitivity = buildSensitivity(input);
  return buildSimulationExport({
    input,
    result,
    perceivedBenefit: "Tarefas da equipe em um só lugar",
    comparison,
    scenarios,
    sensitivity,
    interpretation: buildInterpretation({ input, result, comparison, scenarios, sensitivity }),
    generatedAt: new Date("2026-09-28T12:00:00Z"),
  });
}

describe("exportação (RF16): entradas, premissas e saídas", () => {
  it("JSON traz entradas, premissas, saídas, cenários, sensibilidade e interpretação", () => {
    const data = JSON.parse(toJson(exportFor(pdfExample, 60)));
    expect(data.inputs).toMatchObject({ fixedCost: 3000, taxRate: 0.1, taxRatePercent: 10, comparisonPrice: 60 });
    expect(data.assumptions).toEqual([...EXPORT_ASSUMPTIONS]);
    expect(data.outputs.informedPrice.result.operatingResult).toBeCloseTo(500, 6);
    expect(data.outputs.comparisonPrice.result.operatingResult).toBeCloseTo(1400, 6);
    expect(data.outputs.scenarios.map((scenario: { customers: number }) => scenario.customers)).toEqual([70, 100, 130]);
    expect(data.outputs.sensitivity).toHaveLength(5);
    expect(data.interpretation.statements.length).toBeGreaterThan(0);
  });

  it("valores saem sem arredondamento de cálculo (C9)", () => {
    const data = JSON.parse(toJson(exportFor(pdfExample, 60)));
    expect(data.outputs.informedPrice.result.breakEvenPrice).toBeCloseTo(44.4444444, 6);
  });

  it("CSV usa ponto e vírgula, vírgula decimal e traz todas as seções", () => {
    const csv = toCsv(exportFor(pdfExample, 60));
    expect(csv.split("\n")[0]).toBe("Seção;Campo;Valor;Unidade");
    expect(csv).toContain("Entradas;Custo fixo;3000;R$ por mês");
    expect(csv).toContain("Premissas;Premissa;");
    expect(csv).toContain("Saídas (preço informado);Resultado do mês;500;R$ por mês");
    expect(csv).toMatch(/Saídas \(preço informado\);Preço que zera o resultado;44,444/);
    expect(csv).toContain("Saídas (segundo preço);Clientes de equilíbrio;69;clientes");
    expect(csv).toContain("Cenários;Pessimista: resultado ao preço informado;-550;R$ por mês");
    expect(csv).toContain("Sensibilidade;Clientes no mês: limite que zera o resultado (mínimo);86;clientes");
    expect(csv).toContain("Interpretação;Critério;");
  });

  it("sem equilíbrio, o CSV explica em vez de mostrar número", () => {
    const csv = toCsv(exportFor({ ...pdfExample, price: 10 }, null));
    expect(csv).toContain("Clientes de equilíbrio;;sem equilíbrio por aumento de clientes");
  });
});
