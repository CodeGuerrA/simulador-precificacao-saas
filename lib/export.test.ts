import { describe, expect, it } from "vitest";
import { buildSimulationExport, toCsv, toJson, EXPORT_ASSUMPTIONS } from "./export";
import { calculatePricing, type PricingInput } from "./pricing";

const input: PricingInput = { fixedCost: 3000, variableCostPerCustomer: 10, price: 50, customers: 100, taxRate: 0.1 };

function pdfExampleExport() {
  const comparisonInput = { ...input, price: 60 };
  return buildSimulationExport({
    input,
    result: calculatePricing(input),
    perceivedBenefit: "Tarefas da equipe em um só lugar",
    comparison: { price: 60, result: calculatePricing(comparisonInput) },
    generatedAt: new Date("2026-09-28T12:00:00Z"),
  });
}

describe("exportação (RF16): entradas, premissas e saídas", () => {
  it("JSON traz as três partes e a taxa nas duas formas", () => {
    const data = JSON.parse(toJson(pdfExampleExport()));
    expect(data.inputs).toMatchObject({ fixedCost: 3000, taxRate: 0.1, taxRatePercent: 10, comparisonPrice: 60 });
    expect(data.assumptions).toEqual([...EXPORT_ASSUMPTIONS]);
    expect(data.outputs.informedPrice.result.operatingResult).toBeCloseTo(500, 6);
    expect(data.outputs.comparisonPrice.result.operatingResult).toBeCloseTo(1400, 6);
  });

  it("valores saem sem arredondamento de cálculo (C9)", () => {
    const data = JSON.parse(toJson(pdfExampleExport()));
    expect(data.outputs.informedPrice.result.breakEvenPrice).toBeCloseTo(44.4444444, 6);
  });

  it("CSV usa ponto e vírgula, vírgula decimal e traz as três seções", () => {
    const csv = toCsv(pdfExampleExport());
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Seção;Campo;Valor;Unidade");
    expect(csv).toContain("Entradas;Custo fixo;3000;R$ por mês");
    expect(csv).toContain("Premissas;Premissa;");
    expect(csv).toContain("Saídas (preço informado);Resultado do mês;500;R$ por mês");
    expect(csv).toMatch(/Saídas \(preço informado\);Preço que zera o resultado;44,444/);
    expect(csv).toContain("Saídas (segundo preço);Clientes de equilíbrio;69;clientes");
  });

  it("sem equilíbrio, o CSV explica em vez de mostrar número", () => {
    const noBreakEven = { ...input, price: 10 };
    const csv = toCsv(
      buildSimulationExport({
        input: noBreakEven,
        result: calculatePricing(noBreakEven),
        perceivedBenefit: "",
        comparison: null,
        generatedAt: new Date("2026-09-28T12:00:00Z"),
      }),
    );
    expect(csv).toContain("Clientes de equilíbrio;;sem equilíbrio por aumento de clientes");
  });
});
